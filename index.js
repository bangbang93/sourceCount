
'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var meow = require('meow');
var debug = require('debug')('sc');
var Table = require('cli-table');

var cli = meow({
  help: [
    'usage',
    'sc <path>',
    '--all -a: output directory with 0 line code',
    '--ignore -i: ignore path, default has [".git", "node_modules"]',
    '--exp -e: custom RegExp to filter file, default is /\\.js$/i',
    '--max-depth -m: display max depth',
    '--help -h: show this'
  ]
}, {
  alias: {
    all: 'a',
    ignore: 'i',
    exp: 'e',
    maxDepth: 'm',
    help: 'h'
  }
});

if (cli.flags['maxDepth'] === 0){
  var maxDepth = 0;
} else {
  maxDepth = cli.flags['maxDepth'] || Number.MAX_VALUE;
}

if (cli.flags['incNpm']){
  var ignore = ['.git'];
} else {
  ignore = ['node_modules', '.git'];
}

if (cli.flags['ignore']){
  if (!Array.isArray(cli.flags['ignore'])){
    cli.flags['ignore'] = [cli.flags['ignore']];
  }
  cli.flags['ignore'].forEach(function (e) {
    ignore.push(e);
  });
}

if (cli.flags['exp']){
  var fileExp = new RegExp(cli.flags['exp']);
} else {
  fileExp = /\.js$/;
}

var showAll = !!cli.flags['all'];

var table = new Table({
  head: ['path', 'line']
});

debug('%j', cli);


var p = cli.input[0] || '.';
p = path.resolve(process.cwd(), p);


var readFile = async.queue(function (task, cb) {
  fs.readFile(task.path, 'utf-8', function (err, data) {
    if (err) {
      cb(err);
    } else {
      var line = data.split('\n').length;
      //print(task.path, line);
      cb(null, line);
    }
  });
}, 100);

var readDir = async.queue(function (task, cb) {
  fs.readdir(task.path, function (err, files) {
    if (err) {
      return cb(err);
    }
    files = files.filter(function (e) {
      return ignore.indexOf(path.relative(p, path.join(task.path, e))) === -1
    });
    async.map(files, function (e, cb) {
      fs.stat(path.join(task.path, e), function (err, stat) {
        if (err){
          return cb(err);
        }
        stat.path = e;
        cb(null, stat);
      });
    }, function (err, stats) {
      if (err){
        return cb(err);
      }
      async.reduce(stats, 0, function (line, e, cb) {
        if (e.isDirectory()) {
          readDir.push({
            path: path.join(task.path, e.path),
            depth: task.depth + 1
          }, function (err, dirLine) {
            if (task.depth < maxDepth){
              print(path.join(task.path, e.path) + '\\', dirLine);
            }
            cb(null, dirLine + line);
          });
        } else if (e.isFile()) {
          if (fileExp.test(e.path)) {
            readFile.push({
              path: path.join(task.path, e.path)
            }, function (err, fileLine) {
              if (task.depth < maxDepth){
                print(path.join(task.path, e.path), fileLine);
              }
              cb(null, line + fileLine);
            });
          } else {
            cb(null, line);
          }
        } else {
          cb(null, line);
        }
      }, cb);
    });
  });
}, 10);

readDir.push({
  path: p,
  depth: 0
}, function (err, line) {
  if (err){
    throw (err);
  }
  print(p + '\\', line);
  console.log(table.toString());
});

function print(path, line){
  if (showAll || line != 0){
    table.push([path, line]);
  }
}
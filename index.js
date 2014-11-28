/**
 * Created by bangbang93 on 14-11-25.
 */
var fs = require('fs');
var path = require('path');

var p = process.argv[2];
p = path.join(__dirname, p);

var fileExp = /\.js$/;
var line = 0;

var main = function (p){
    fs.readdir(p,function (err, files){
        if (err){
            throw(err);
        } else {
            files.forEach(function (e){
                fs.stat(path.join(p, e), function(err, stat){
                    if (stat.isDirectory()){
                        if (e != 'node_modules') {
                            main(path.join(p,e));
                        }
                    } else if (stat.isFile()){
                        if (fileExp.test(e)){
                            fs.readFile(path.join(p,e), 'utf-8', function (err, data){
                                if (err){
                                    throw(err);
                                } else {
                                    line += data.split('\n').length;
                                }
                            });
                        }
                    }
                })
            })
        }
    });
};

main(p);

process.on('exit', function (){
    console.log(line);
});
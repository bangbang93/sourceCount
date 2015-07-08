[中文文档](https://blog.bangbang93.com/2015/07/08/%E4%B8%80%E4%B8%AA%E7%AE%80%E5%8D%95%E7%9A%84%E4%BB%A3%E7%A0%81%E8%A1%8C%E6%95%B0%E7%BB%9F%E8%AE%A1%E5%B7%A5%E5%85%B7.moe)

Installation
======
```
npm install source-count -g
```

Usage
=======
```
jscount
```
in current directory

---------------

```
jscount ../foo
```
count ../foo

----------------

```
jscount -m 0
```
only display total,do not display detail

----------------

```
jscount -i libs
```
ignore libs directory

----------------

```
jscount -i libs -i public/libs
```
ignore libs and public/libs dirs

----------------

```
jscount -e "\.php$"
```
count php file:)

Arguments
=========
``` --all ``` ``` -a ```
in default won't display directories that didn't has code at all,use this arg to show them up

``` --ignore ``` ``` -i ```
ignore path, can be directory name or file name ,input relative path from cwd

``` --exp ``` ``` -e ```
custom file name RegExp,only name can match this will be count

```--max-depth``` ``` -m```
display max depth, deep than this will be count but won't be display

```---help``` ```-h```
help
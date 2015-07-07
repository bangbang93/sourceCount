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
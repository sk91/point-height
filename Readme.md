Point Height
=============


Scientific computing tool.



Given a csv data file containig x,y,z points coordinates and a radius, compute for each point number of other points in radius, height-sum, average height, and deviation.


Install
========

````bash
npm install -g sk91/point-height
````


Usage
=====

Process ``input.csv``, output to ``output.csv``. Use 5 as the radius (`-r 5`) and display how match it took in the end (`-t`)

````bash

point-height -f input.csv -o output.csv -r 5 -t

````


```bash
Options:
  --file, -f    Imput csv file to load     [required]
  --out, -o     Output filepath.           [default: "std stream"]
  --radius, -r  Radius to use              [default: 5]
  --time, -t    Print run time at the end  [default: false]

```

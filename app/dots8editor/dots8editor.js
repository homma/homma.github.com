/***

Copyright (c) 2014 Daisuke Homma

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.

***/

/* config.js */

////// Parameters that can be changed by user

var config = {};

//// dot

config.dot = {};

// size of each dot
config.dot.width = 3;

//// colors

config.color = {};

config.color.on = 'black';
config.color.off = 'silver';

//// cell

config.cell = {};

//// canvas

config.canvas = {};

// horizontal and vertical number of cells
config.canvas.horizontalCells = 80;
config.canvas.verticalCells = 24;

config.canvas.id = "dots8canvas"


/* parameters.js */

////// Calculated Parameters (non changeable by user)

//// dot

config.cell.width = config.dot.width * 4;
config.cell.height = config.dot.width * 9;

//// canvas

config.canvas.width = config.canvas.horizontalCells * config.cell.width;
config.canvas.height = config.canvas.verticalCells * config.cell.height;

//// execution modes

config.mode = {};

// update while display = none
// become faster on chrome
// become slower on safari

if(window.chrome) {

  config.mode.offlineUpdate = true;

} else {

  config.mode.offlineUpdate = false;

}

// use document.createDocumentFragment
// it seems not useful

config.mode.useFragment = false;

// use element cache and cloneNode()
// it seems not useful

config.mode.useElementCache = false;


/* data.js */

//// global data

var data = {};

// circle element template for cloneNode

if(config.mode.useElementCache) {

  data.circleTemplate = false;

}

// data store for cell

data.cells = [];

// character code of dot zero

data.dotZero = parseInt("2800", 16);


/* transport.js */

//// import / export

function dataImport() {

  // to be implemented

}

function convertCellToChar(cell) {

  // character code
  var n = 0;

  // cell format
  //
  // 0 1
  // 2 3
  // 4 5
  // 6 7
  //
  // binary format
  //
  // 76531420
  //

  var arr = [7, 6, 5, 3, 1, 4, 2, 0];

  arr.forEach(function(i) {

    n = n << 1;

    if(cell[i].on) {

      n += 1;

    } else {

      n += 0;

    }

  });

  // add offset
  n += data.dotZero;

  // convert to a string
  var ret = String.fromCharCode(n);

  return ret;

}

function dataExport() {

  var str = "";

  for(var i = 0; i < data.cells.length; i++) {

    if(i == config.canvas.horizontalCells) {

      str += "\n";

    }

    str += convertCellToChar(data.cells[i]);

  }

  console.log(str);

}


/* event.js */

// keyboad event handler
function keyHandler(e) {

  // export
  if(e.keyCode == "E".charCodeAt(0)) {

    dataExport();

  }

}

// clicked on a dot

function clicked(dot) {

  if(dot.on) {

    dot.dot.setAttribute("fill", config.color.off );
    dot.on = false;

  } else {

    dot.dot.setAttribute("fill", config.color.on );
    dot.on = true;

  }

}


/* init.js */

function createCanvas(id) {

  canvas = document.getElementById(id);

  // set size
  canvas.style.width = config.canvas.width;
  canvas.style.height = config.canvas.height;

  createCells(canvas);

}

function createElement(canvas, tagName) {

  var ns = 'http://www.w3.org/2000/svg';
  var el = document.createElementNS(ns, tagName);
  canvas.appendChild(el);

  return el;

}

function createCircle(canvas, x, y, r) {

  var el;

  if(config.mode.useElementCache) {

    if(data.circleTemplate) {

      el = data.circleTemplate.cloneNode(false);

    } else {

      el = createElement(canvas, 'circle');
      data.circleTemplate = el;

      canvas.appendChild(el);

    }

  } else {

    el = createElement(canvas, 'circle');

  }

  el.setAttribute("cx", x);
  el.setAttribute("cy", y);
  el.setAttribute("r", r);

  return el;

}

function createSquare(canvas, x, y, w) {

  var el = createElement(canvas, 'rect');

  el.setAttribute("x", x);
  el.setAttribute("y", y);
  el.setAttribute("width", w);
  el.setAttribute("height", w);

  return el;

}

function createDot(x, y) {

  var r      = config.dot.width / 2;
  var rect_w = config.dot.width * 2;

  // position of dot
  var cx = x + config.dot.width;
  var cy = y + config.dot.width;

  // create dot
  var circle = createCircle(canvas, cx, cy, r);
  circle.setAttribute("fill", config.color.off);

  // create rect (for hit test)
  var rect = createSquare(canvas, x, y, rect_w);
  rect.setAttribute("opacity", 0.0);

  var dot = { dot: circle, rect: rect, on: false };

  // add event
  rect.onclick = function(e) { clicked(dot) };

  return dot;

}

function createCell(canvas, x, y) {

  // calculate positions of dots
  var positions = [];

  var rect_w = config.dot.width * 2;
  for(var i = 0; i < 4; i++) {

    positions.push({ x: x         , y: y + i * rect_w})
    positions.push({ x: x + rect_w, y: y + i * rect_w})

  }  

  // create dots and record them
  var cell = [];

  for(var i = 0; i < positions.length; i++) {

    // position of up left corner of hit rect
    var x = positions[i].x;
    var y = positions[i].y;

    // create and record
    cell.push( createDot(x, y) );

  }

  data.cells.push(cell);

}

function createCells(canvas) {

  if(config.mode.offlineUpdate) {
    var display = canvas.style.display;
    canvas.style.display = "none";
  }

  if(config.mode.useFragment) {
    var fragment = document.createDocumentFragment();
  }

  var width = config.canvas.horizontalCells;
  var height = config.canvas.verticalCells;

  for(var i = 0; i < height; i++) {

    var y = i * config.cell.height;

    for(var j = 0; j < width; j++) {

      var x = j * config.cell.width;

      if(config.mode.useFragment) {
        createCell(fragment, x, y);
      } else {
        createCell(canvas, x, y);
      }

    }

  }

  if(config.mode.useFragment) {
    canvas.appendChild(fragment);
  }

  if(config.mode.offlineUpdate) {
    setTimeout( function(){ canvas.style.display = display; }, 0 )
  }

}


/* main.js */

function main() {

  createCanvas(config.canvas.id);

  document.onkeydown = keyHandler;

}

window.onload = main;


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

////// Parameters that can be changed by users

//// the container of all the global variables
var d8 = {};

//// configurations
d8.config = {};

//// dot

d8.config.dot = {};

// size of each dot
d8.config.dot.width = 3;

//// colors

d8.config.color = {};

// darkgray, gray, gainsboro, silver, lightgray, ghostwhite, whitesmoke
d8.config.color.on = 'black';
d8.config.color.off = 'lightgray';
d8.config.color.guide = 'silver';

//// cell

d8.config.cell = {};

//// canvas

d8.config.canvas = {};

// horizontal and vertical number of cells
d8.config.canvas.horizontalCells = 80;
d8.config.canvas.verticalCells = 24;

d8.config.canvas.cursor = "default";

d8.config.canvas.id = "dots8canvas"

//// drawing guide

d8.config.guide = {};

d8.config.guide.use = true;

// how many dots are there until next guids
d8.config.guide.interval = 4;


/* parameters.js */

////// Fixed Calculated Parameters (non changeable by users)

//// cell

d8.config.cell.width = d8.config.dot.width * 4;
d8.config.cell.height = d8.config.dot.width * 9;

d8.config.cell.horizontalDots = 4;
d8.config.cell.verticalDots = 2;

//// canvas

d8.config.canvas.width = d8.config.canvas.horizontalCells * d8.config.cell.width;
d8.config.canvas.height = d8.config.canvas.verticalCells * d8.config.cell.height;

//// guids

d8.config.guide.intervalCells = Math.floor( d8.config.guide.interval / d8.config.cell.verticalDots );

//// execution modes

d8.config.mode = {};

// update while display = none
// become faster on chrome
// become slower on safari

if(window.chrome) {

  d8.config.mode.offlineUpdate = true;

} else {

  d8.config.mode.offlineUpdate = false;

}

// use document.createDocumentFragment
// it seems not useful

d8.config.mode.useFragment = false;

// use element cache and cloneNode()
// it seems not useful

d8.config.mode.useElementCache = false;


/* data.js */

//// global data that is altered from everywhere in the program

d8.data = {};

// circle element template for cloneNode

if(d8.config.mode.useElementCache) {

  d8.data.circleTemplate = false;

}

// data store for cell

d8.data.cells = [];

// character code of dot zero

d8.data.dotZero = parseInt("2800", 16);
d8.data.dotFull = parseInt("28ff", 16);


/* transport.js */

//// import / export

//// Importer

function convertCharToBitPattern(ch) {

  // bit pattern
  var pattern = [];

  var code = ch.charCodeAt(0);

  // remove offset
  code -= d8.data.dotZero;

  // binary format
  //
  // 76543210
  //
  // bit pattern
  //
  // 0 3
  // 1 4
  // 2 5
  // 6 7
  //

  var arr = [0, 3, 1, 4, 2, 5, 6, 7];

  arr.forEach(function(i) {

    var shift = 1 << i;
    var bit = code & shift;

    if(bit == 0) {

      pattern.push(false);

    } else {

      pattern.push(true);

    }

  });

  return pattern;

}

function input() {

  return window.prompt("data to be imported:");

}

function updateCell(cell, dots) {

  for(var i = 0; i < 8; i++) {

    var dot = cell.dots[i];
    var on = dots[i];
    dot.change(on);

  }

}

function dataImport() {

  var str = input();

  var importedCells = [];

  for(var i = 0; i < str.length; i++) {

    var code = str.charCodeAt[i];

    // remove new line charactors
    // this is necessary
    if( str[i] == "\n") {
      continue;
    }

    // remove non dot charactors
    if( (code < d8.config.dotZero) || (d8.config.dotFull < code) ) {
      continue;
    }

    importedCells.push( convertCharToBitPattern(str[i]) );

  }

  // change dot attributes
  for(var i = 0; i < d8.data.cells.length; i++) {

    var cell = d8.data.cells[i];
    var dots = importedCells[i];
    updateCell(cell, dots);

  }

}

//// Exporter

function output(str) {

  window.prompt("resulting string: ", str);

}

function dataExport() {

  var str = "";

  for(var i = 0; i < d8.data.cells.length; i++) {

    if(i == d8.config.canvas.horizontalCells) {

      str += "\n";

    }

    str += d8.data.cells[i].toString();

  }

  output(str);

}


/* event.js */

// keyboad event handler
function keyHandler(e) {

  var charE = "E".charCodeAt(0);
  var charI = "I".charCodeAt(0);

  // export
  if(e.keyCode == charE) {

    dataExport();

  }

  // import
  if(e.keyCode == charI) {

    dataImport();

  }

}

/*
// clicked on a dot

function clicked(dot) {

  if(dot.on) {

    dot.dot.setAttribute("fill", d8.config.color.off );
    dot.on = false;

  } else {

    dot.dot.setAttribute("fill", d8.config.color.on );
    dot.on = true;

  }

}
*/

/* init.js */

function createCanvas(id) {

  canvas = document.getElementById(id);

  // set size
  canvas.style.width = d8.config.canvas.width;
  canvas.style.height = d8.config.canvas.height;

  // set cursor
  canvas.style.cursor = d8.config.canvas.cursor;

  createCells(canvas);

  if(d8.config.guide.use) {
    setGuide();
  }

}

function createElement(canvas, tagName) {

  var ns = 'http://www.w3.org/2000/svg';
  var el = document.createElementNS(ns, tagName);
  canvas.appendChild(el);

  return el;

}

function createCircle(canvas, x, y, r) {

  var el;

  if(d8.config.mode.useElementCache) {

    if(d8.data.circleTemplate) {

      el = d8.data.circleTemplate.cloneNode(false);

    } else {

      el = createElement(canvas, 'circle');
      d8.data.circleTemplate = el;

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

function dot(x, y) {

  var r      = d8.config.dot.width / 2;
  var rect_w = d8.config.dot.width * 2;

  // position of dot
  var cx = x + d8.config.dot.width;
  var cy = y + d8.config.dot.width;

  // create dot
  this.circle = createCircle(canvas, cx, cy, r);

  // create rect (for hit test)
  this.rect = createSquare(canvas, x, y, rect_w);

  this.on = false;

  // set color to disabled color
  this.disable();

  // this is not a guide point
  this.guide = false;

  // set rect transparent
  this.rect.setAttribute("opacity", 0.0);

  // add event
  var self = this;
  this.rect.onclick = function() { self.switch(); };

}

dot.prototype.color = function(color) {

  this.circle.setAttribute("fill", color);

}

dot.prototype.enable = function() {

  this.on = true;

  this.color(d8.config.color.on);

}

dot.prototype.disable = function() {

  this.on = false;

  if(d8.config.guide.use && this.guide) {

    this.color(d8.config.color.guide);

  } else {

    this.color(d8.config.color.off);

  }

}

dot.prototype.setGuide = function() {

  this.guide = true;

  if(this.on) {
    this.enable();
  } else {
    this.disable();
  }

}

dot.prototype.change = function(flag) {

  if(flag) {
    this.enable();
  } else {
    this.disable();
  }

}

dot.prototype.switch = function() {

  if(this.on) {
    this.disable()
  } else {
    this.enable()
  }

}

function cell(canvas, x, y) {

  // calculate positions of dots
  var positions = [];

  var rect_w = d8.config.dot.width * 2;
  for(var i = 0; i < 4; i++) {

    positions.push({ x: x         , y: y + i * rect_w})
    positions.push({ x: x + rect_w, y: y + i * rect_w})

  }  

  // create dots and record them
  this.dots = [];

  for(var i = 0; i < positions.length; i++) {

    // position of up left corner of hit rect
    var x = positions[i].x;
    var y = positions[i].y;

    // create and record
    this.dots.push( new dot(x, y) );

  }

}

cell.prototype.setGuide = function() {

  this.dots[0].setGuide();
  this.dots[2].setGuide();
  this.dots[4].setGuide();
  this.dots[6].setGuide();

}

cell.prototype.toString = function() {

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

  for(var i = 0; i < arr.length; i++) {

    if(n != 0) {
      n = n << 1;
    }

    var p = arr[i];
    if(this.dots[p].on) {

      n += 1;

    } else {

      n += 0;

    }

  }

  // add offset
  n += d8.data.dotZero;

  // convert to a string
  var ret = String.fromCharCode(n);

  return ret;

}

function createCells(canvas) {

  if(d8.config.mode.offlineUpdate) {
    var display = canvas.style.display;
    canvas.style.display = "none";
  }

  if(d8.config.mode.useFragment) {
    var fragment = document.createDocumentFragment();
  }

  var width = d8.config.canvas.horizontalCells;
  var height = d8.config.canvas.verticalCells;

  for(var i = 0; i < height; i++) {

    var y = i * d8.config.cell.height;

    for(var j = 0; j < width; j++) {

      var x = j * d8.config.cell.width;

      if(d8.config.mode.useFragment) {
        var c = new cell(fragment, x, y);
      } else {
        var c = new cell(canvas, x, y);
      }

      d8.data.cells.push(c);

    }

  }

  if(d8.config.mode.useFragment) {
    canvas.appendChild(fragment);
  }

  if(d8.config.mode.offlineUpdate) {
    setTimeout( function(){ canvas.style.display = display; }, 0 )
  }

}

function setGuide() {

  var ival = d8.config.guide.intervalCells;
  var cells = d8.data.cells;

  for(var i = 0; i < cells.length; i += ival) {

    cells[i].setGuide();

  }

}



/* main.js */

function main() {

  createCanvas(d8.config.canvas.id);

  document.onkeydown = keyHandler;

}

window.onload = main;


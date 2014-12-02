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

config.canvas.id = "svg20141130"

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


//// Calculated Parameters (non changeable by user)

// dot

config.cell.width = config.dot.width * 4;
config.cell.height = config.dot.width * 9;

// canvas

config.canvas.width = config.canvas.horizontalCells * config.cell.width;
config.canvas.height = config.canvas.verticalCells * config.cell.height;


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

if(config.mode.useElementCache) {

  var circleTemplate = false;

}

function createCircle(canvas, x, y, r) {

  var el;

  if(config.mode.useElementCache) {
    if(circleTemplate) {

      el = circleTemplate.cloneNode(false);

    } else {

      el = createElement(canvas, 'circle');
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

function clicked(circle) {

  color = circle.getAttribute("fill");

  if(color == config.color.off ) {
    circle.setAttribute("fill", config.color.on );
  } else {
    circle.setAttribute("fill", config.color.off );
  }

}

function createCell(canvas, x, y) {

  var r      = config.dot.width / 2;
  var rect_w = config.dot.width * 2;

  var positions = [];

  for(var i = 0; i < 4; i++) {

    positions.push({ x: x         , y: y + i * rect_w})
    positions.push({ x: x + rect_w, y: y + i * rect_w})

  }  

  var w = config.dot.width * 2;
  for(var i = 0; i < positions.length; i++) {

    // position of rectangle
    var x = positions[i].x;
    var y = positions[i].y;

    // position of dot
    var cx = x + config.dot.width;
    var cy = y + config.dot.width;

    var circle = createCircle(canvas, cx, cy, r);
    circle.setAttribute("fill", config.color.off);

    var rect = createSquare(canvas, x, y, rect_w);
    rect.setAttribute("opacity", 0.0);

    (function(target){
      rect.onclick = function(e) { clicked(target); };
    })(circle);

  }

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

window.onload = function() { createCanvas(config.canvas.id); }


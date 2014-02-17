new function() { // Block

//// utility

var getPosition = function(id) {

  var el = document.getElementById(id);
  var rect = el.getBoundingClientRect();

  return rect;

}

//// operations to canvas

var createLine = function() {

  var ns = 'http://www.w3.org/2000/svg';
  var el = document.createElementNS(ns, "path");

  el.style.fill = "none";
  el.style.stroke = "black";
  el.style.strokeWidth = "1";
//  el.id = id;

  console.log("createLine", el);

  return el;

}

var addLineToCanvas = function(canvas, line) {

  canvas.appendChild(line);

  console.log("addLineToCanvas", line);

}

//// line editing

var setInitialPosition = function(line, x, y) {

  var seg = line.createSVGPathSegMovetoAbs(x, y);
  line.pathSegList.appendItem(seg);

}

var addLineSeg = function(line, x, y) {

  var seg = line.createSVGPathSegLinetoAbs(x, y);
  line.pathSegList.appendItem(seg);

  console.log("addLineSeg", x, y);

}

var closeLine = function(line) {

  var seg = line.createSVGPathSegClosePath();
  line.pathSegList.appendItem(seg);

  console.log("closeLine");

}

//// event

var event = {};

event.NOOP = 0;
event.DRAWING = 1;
event.status = event.NOOP;

var click = function(e) {

  var cx = e.clientX;
  var cy = e.clientY;
  var x = cx - event.dx;
  var y = cy - event.dy;

  switch(event.status) {

    case event.NOOP: {

      event.status = event.DRAWING;
      event.el = createLine();
      setInitialPosition(event.el, x, y);
      addLineToCanvas(event.canvas, event.el);
      break;

    }

    case event.DRAWING: {

      addLineSeg(event.el, x, y);
      break;

    }

  }

}

var dblclick = function(e) {

  var cx = e.clientX;
  var cy = e.clientY;
  var x = cx - event.dx;
  var y = cy - event.dy;

  switch(event.status) {

    case event.NOOP: {

      break;

    }

    case event.DRAWING: {

      event.status = event.NOOP;
      closeLine(event.el);

    }

  }

}

//// test

var test = function() {

  console.log("test start");

/*
  var id = "canvas";
  var canvas = document.getElementById(id);
  var rect = canvas.getBoundingClientRect();
  console.log(rect);
*/

  console.log("test done");

}

//// main

var main = function() {

//  test();

  var id = "canvas";
  var canvas = document.getElementById(id);
  var position = getPosition(id);

  event.canvas = canvas;
  event.dx = position.left;
  event.dy = position.top;

  canvas.onclick = click;
  canvas.ondblclick = dblclick;

}

main();

} // Block

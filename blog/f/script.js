
var adjust_iframe = function(id) {

  var iframe = document.getElementById(id);
  var child = iframe.contentWindow.document.documentElement;
  var childHeight = child.scrollHeight;
  var adjustment = 10;

  var height = childHeight + adjustment;

//  if(height < 150) { height = 150; }

  iframe.style.height = height + "px";

}

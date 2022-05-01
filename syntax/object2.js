// array, object
var f = function () {
  console.log(1 + 1);
  console.log(1 + 2);
};

// console.log(f); // [Function: f]
// f(); // 2\n3

var a = [f];
a[0](); // 2\n3

var o = {
  func: f,
};
o.func(); // 2\n3

/*********
/ Some string functions to add to prototype
**********/

String.prototype.capitalize = function(str) {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.toUnderscore = function() {
  var str = this.replace(/[A-Z]/g, function(s) {
    return "_" + s.toLowerCase();
  });
  while (str.charAt(0) === '_') {
    str = str.slice(1);
  }
  return str;
};

String.prototype.toCamel = function() {
  return this.toLowerCase().replace(/_(.)/g, function(match, group) {
    return group.toUpperCase();
  });
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var Point = module.exports = function(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
};


Point.prototype.distance = function(point){
	var dx = point.x - this.x;
	var dy = point.y - this.y;
	return Math.sqrt(dx * dx  + dy * dy);
};

Point.prototype.inRadius = function(point, radius){
	return this.distance(point) <= radius;
};

var Point = require('./point');


var PointsList = module.exports = function(list, order){
	this.list = list || [];
	if(order){
		this.ordered = list.slice().sort(comparator)
		this._order = order;
	}

	
};

PointsList.prototype.add = function(point){
	this.list.push(point);
};

PointsList.prototype.get = function(index){
	return this.list[index];
};

PointsList.prototype.inRadiusOf = function(point, radius){
	var in_radius = [];
	this.list.forEach(function(list_point){
		if(point.inRadius(list_point, radius)){
			in_radius.push(list_point);
		}
	}.bind(this));

	return new PointsList(in_radius);
};

PointsList.prototype.count = function(){
	return this.list.length;
};

PointsList.prototype.forEach = function(callback){
	this.list.forEach(callback);
};


PointsList.prototype.sumOfHeights = function(){
	return this.list.reduce(function(prev, point){
		return prev + point.z;
	}, 0);
};

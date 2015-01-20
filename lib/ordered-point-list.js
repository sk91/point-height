var PointList = require('./point-list');
var util = require('util');

var OrderedPointList = module.exports = function(list, order){
	PointList.call(this, list);
	this._order = order || 'x';
	this._ordered = this.list.slice().sort(this._comparator.bind(this))
};

util.inherits(OrderedPointList, PointList);

OrderedPointList.prototype._comparator = function(a , b){
	return a[this._order] - b[this._order]
};


OrderedPointList.prototype.add = function(point){
	PointList.prototype.add.call(this, point);
	var index = this.findLastLower(point[this._order]);
	this._ordered.splice(index+1 ,0, point);
}


OrderedPointList.prototype.inRadiusOf = function(point, radius){
	var start = this.findLastLower(point[this._order] - radius);
	var end = this.findFirstGreater(point[this._order] + radius);
	var range = this._ordered.slice(start + 1,end);
	
	var in_radius;

	if(this._order === 'x'){
		in_radius =  new OrderedPointList(range, 'y');
	}else{
		in_radius =  new PointList(range);
	}

	return in_radius.inRadiusOf(point, radius);
};


OrderedPointList.prototype.findLastLower = function(val, start){
	var mid, mid_val;
	var arr = this._ordered;
	var order = this._order;
	var start = 0;
	var end = arr.length - 1;
	
	
	while(start <= end){
		mid = Math.floor( (start + end) / 2 );
		mid_val = arr[mid][order];
		if(mid_val === val){
			if(mid === 0 || arr[mid - 1][order] < val){
				return mid-1;
			}
		}
		if(mid_val < val){
			start = mid + 1;
		}else{
			end = mid - 1;
		}
	}
	return end;
}

OrderedPointList.prototype.findFirstGreater = function(val){
	var mid, mid_val;
	var arr = this._ordered;
	var order = this._order;
	var start = 0;
	var end = arr.length - 1;
	
	while(start <= end){
		mid = Math.floor( (start + end) / 2 );
		mid_val = arr[mid][order];

		if(mid_val === val){
			if(mid === arr.length-1 || arr[mid + 1][order] > val){
				return mid + 1;
			}
		}

		if(mid_val <= val){
			start = mid + 1;
		}else{
			end = mid - 1;
		}
	}
	return end;
}





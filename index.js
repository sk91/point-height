var csv = require('ya-csv');
var csv_writer = require("csv-write-stream");
var fs = require('fs');
var OrderedPointsList = require('./lib/ordered-point-list');
var Point = require('./lib/point');

exports.process = process_records;

var RADIUS = exports.RADIUS = 5;

function process_records(input_file, output_path, radius){

	var reader = csv.createCsvFileReader(input_file, {
		'separator': ',',
		'quote': '"',
		'escape': '"',
		'comment': ''
	});

	radius = radius || RADIUS;

	var points = new OrderedPointsList();


	reader.addListener('data', function(point){
		point = point.map(parseFloat)
		points.add(new Point(point[0], point[1], point[2]));
	});

	reader.addListener('end', function(){
		process_list(points, radius, output_path)
	});
	
}

function process_list(points, radius, output){
	var writer = csv_writer({sendHeaders: true, headers:['x', 'y', 'z' , 'count', 'sum', 'average', 'deviation']});
	if(output === 'std stream'){
		writer.pipe(process.stdout);	
	}else{
		writer.pipe(fs.createWriteStream(output,{flags: 'w'}));
	}
	var rs = new require('stream').Readable({ objectMode: true });
	rs.index = 0;
	rs._read = function(){
		if(this.index >= points.count())
			return rs.push(null);
		var point = points.get(this.index++);
		var record = create_record(point, points, radius);
		rs.push(record);
	};

	rs.pipe(writer);
}

function create_record(point, points,radius){
	var in_radius =  points.inRadiusOf(point, radius);
	var count = in_radius.count();
	var sum_of_heights = in_radius.sumOfHeights();
	var avg = sum_of_heights / count;
	var deviation = point.z - avg;

	return {
		x: point.x, 
		y: point.y,
		z: point.z,
		count: count, 
		sum: sum_of_heights, 
		average: avg,
		deviation: deviation
	};
}



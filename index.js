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
		'comment': '#'
	});

	radius = radius || RADIUS;

	var points = new OrderedPointsList();
	var stream;
	if(output_path === 'std stream'){
		stream = process.stdout;
	}else{
		stream = fs.createWriteStream(output_path,{flags: 'w'});
	}

	reader.addListener('data', function(point){
		point = point.map(parseFloat)
		points.add(new Point(point[0], point[1], point[2]));
	});

	reader.addListener('end', function(){
		process_list(points, radius, stream)
	});
	
}

function process_list(points, radius, output_stream){
	var writer = csv.createCsvStreamWriter(output_stream);
	writer.writeRecord(["x", "y", "z", "count", "sum", "average", "deviation"]);
	points.forEach(function (point) {
		setImmediate(function(){
			var record = create_record(point, points, radius);
			writer.writeRecord(record);
		});
	});
	
}

function create_record(point, points,radius){
	var in_radius =  points.inRadiusOf(point, radius);
	var count = in_radius.count();
	var sum_of_heights = in_radius.sumOfHeights();
	var avg = sum_of_heights / count;
	var deviation = point.z - avg;

	return [
		point.x, 
		point.y,
		point.z,
		count, 
		sum_of_heights, 
		avg,
		deviation
	]
}



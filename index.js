var csv = require('ya-csv');
var fs = require('fs');
var PointsList = require('./lib/point-list');
var Point = require('./lib/point');

exports.process = process_records;

var RADIUS = exports.RADIUS = 5;

function process_records(input_file, output_path, radius){
	console.log(input_file);
	var reader = csv.createCsvFileReader(input_file, {
		'separator': ',',
		'quote': '"',
		'escape': '"',
		'comment': ''
	});

	radius = radius || RADIUS;

	var points = new PointsList();

	var write_stream  = process.stdout;
	if(output_path !== 'std stream'){
		write_stream =  fs.createWriteStream(output_path);
	}


	reader.addListener('data', function(point){
		point = point.map(parseFloat)
		points.add(new Point(point[0], point[1], point[2]));
	});

	reader.addListener('end', function(){
		process_list(points, write_stream, radius)
	});
	
}

function process_list(points, write_stream, radius){

	var writer = new csv.createCsvStreamWriter(write_stream);
	writer.writeRecord(['x', 'y', 'z' , 'count', 'sum of heights', 'average', 'deviation']);
	points.forEach(function(point){
		var record = create_record(point, points, radius);
		writer.writeRecord(record);
	});
}


function create_record(point, points,radius){
	var in_radius =  points.inRadiusOf(point, radius);
	var count = in_radius.count();
	var sum_of_heights = in_radius.sumOfHeights();
	var avg = sum_of_heights / count;
	var deviation = point.z - avg;

	return [point.x, point.y, point.z, count, sum_of_heights, avg ,  deviation];
}



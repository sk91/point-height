var csv = require('ya-csv');
var fs = require('fs');
var util = require('util');
var ProgressBar = require('progress');
var spinner = require('simple-spinner');

var OrderedPointsList = require('./lib/ordered-point-list');
var Point = require('./lib/point');

exports.process = process_records;

var RADIUS = exports.RADIUS = 5;
var TIMER_NAME = 'Total time';
var LOAD_TIMER_NAME = 'Loading time';
var COMPUTE_TIMER_NAME = 'Compute time'
var time = 0;

function process_records(input_file, output_path, radius, count_time) {
	var points, writer, stream;
	var ui = count_time && output_path !== 'std stream';

	if (count_time) {
		console.time(TIMER_NAME);
		console.time(LOAD_TIMER_NAME);
	}

	if (ui) {
		spinner.start(100);
		util.print(' Loading');
	}

	var reader = csv.createCsvFileReader(input_file, {
		'separator': ',',
		'quote': '"',
		'escape': '"',
		'comment': '#'
	});

	radius = radius || RADIUS;

	points = new OrderedPointsList();

	if (output_path === 'std stream') {
		stream = process.stdout;
	} else {
		stream = fs.createWriteStream(output_path, {
			flags: 'w'
		});
	}
	writer = csv.createCsvStreamWriter(stream);

	reader.addListener('data', function(point) {
		setImmediate(function() {
			point = point.map(parseFloat);
			points.add(new Point(point[0], point[1], point[2]));
		});
	});

	reader.addListener('end', function() {

		setImmediate(function() {
			var bar;

			ui && spinner.stop();

			if (count_time) {
				console.timeEnd(LOAD_TIMER_NAME);
				console.time(COMPUTE_TIMER_NAME);
			}

			if (ui) {
				bar = new ProgressBar('Computing: :percent [:bar] 100% Time::elapseds ', {
					total: points.count()
				});
				writer.addListener('progress', function() {
					bar.tick();
				});
			}
			process_list(points, radius, writer);
		});

	});

	writer.addListener('end', function() {
		count_time && console.timeEnd(COMPUTE_TIMER_NAME);
		count_time && console.timeEnd(TIMER_NAME);
	});



}

function process_list(points, radius, writer) {
	writer.writeRecord(["x", "y", "z", "count", "sum", "average", "deviation"]);
	points.forEach(function(point, index) {
		setImmediate(function() {
			var record = create_record(point, points, radius);
			writer.writeRecord(record);
			writer.emit('progress');
		});
	});
	setImmediate(function() {
		writer.emit('end');
	});

}

function create_record(point, points, radius) {
	var in_radius = points.inRadiusOf(point, radius);
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
	];
}

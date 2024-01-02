const fs = require('fs');

function insertToFile(req, data) {
	fs.writeFile('database.txt', data, 'utf-8', err => {
		if (err) {
			console.log('err : ', err);
		} else {
			console.log('file saved !');
		}
	});
}

function fileAppend(req, data) {
	fs.readFile('database.txt', 'utf-8', function (err, dataFile) {
		if (err) {
			console.log('file not found');
		} else {
			let writeData = JSON.parse(dataFile);
			writeData.data.push(JSON.parse(data));
			return insertToFile(req, JSON.stringify(writeData));
		}
	});
}

function showFile(req, data) {
	return fs.readFile('database.txt', 'utf-8', function (err, dataFile) {
		if (err) {
			return 'file not found !';
		}
		return dataFile;
	});
}

exports.fileAppend = fileAppend;
exports.showFile = showFile;
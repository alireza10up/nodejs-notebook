const fs = require('fs');

function insertToFile(data) {
	return new Promise((resolve, reject) => {
		fs.writeFile('database.txt', data, 'utf-8', (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(true);
			}
		});
	});
}

function readOrParseData(filename) {
	return new Promise((resolve, reject) => {
		fs.readFile(filename, 'utf-8', (err, data) => {
			if (err) {
				if (err.code === 'ENOENT') {
					resolve('');
				} else {
					reject(err);
				}
			} else {
				try {
					resolve(JSON.parse(data));
				} catch (parseErr) {
					reject(parseErr);
				}
			}
		});
	});
}


function fileAppend(data) {
	return readOrParseData('database.txt')
		.then((rdata) => {
			const jsonData = rdata || {};
			jsonData.data.push(JSON.parse(data));
			const stringData = JSON.stringify(jsonData);
			return this.insertToFile(stringData);
		})
		.catch(err => {
			console.error('Error appending to file:', err);
			return false;
		});
}

function showFile() {
	return readOrParseData('database.txt')
		.then((data) => {
			if (!data) {
				return 'empty file';
			}
			return data.data;
		})
		.catch(err => {
			console.error('Error reading file:', err);
			return 'file not found';
		});
}


exports.fileAppend = fileAppend;
exports.showFile = showFile;
exports.insertToFile = insertToFile;
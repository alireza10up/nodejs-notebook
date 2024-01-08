const fs = require('fs');
const http = require('http');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const Route = require('./router');
const insertToFile = require('./inserttofile');
const port = 8585;
const server = http.createServer(rh);
server.listen(port);

/* server run notify */

console.log('server run on :', `http://localhost:${port}`);

Route.post('sign_up', (req, data) => {
	// validation
	dataJson = JSON.parse(data);
	if (dataJson.name === undefined || dataJson.email === undefined || dataJson.pass === undefined) {
		return 'Data Not Valid';
	} else {
		// insert file
		insertToFile.fileAppend(req, data);
	}
});

Route.post('sign_in', (req, res, data) => {
	// validation
	dataJson = JSON.parse(data);
	if (dataJson.name === undefined || dataJson.email === undefined || dataJson.pass === undefined) {
		console.log('Data Not Valid');

		write(res, 'Data Not Valid', 'text');
	} else {
		fs.readFile('database.txt', 'utf-8', function (err, dataFile) {
			if (err) {
				console.log('Data Not Valid');
				write(res, 'file not found !', 'text');
			} else {
				dataFile = JSON.parse(dataFile);

				let found = false;

				dataFile.data.forEach(item => {
					if (item.email == dataJson.email && item.pass == dataJson.pass) {
						found = item;
					}
				});

				if (found) {
					console.log('user found !');
					token = jwt.sign(found, 'arv');
					console.log(token);
					res.writeHead(200, {
						'Set-Cookie': token, 'Content-Type': 'text/plain',
					});
					write(res, 'user found !', 'text');
				} else {
					console.log('user not found !');
					write(res, 'user not found !', 'text');
				}
			}
		});
	}
});

Route.get('cookie', (req, res, data) => {
	console.log(req.headers.cookie);
	decodeData = jwt.verify(req.headers.cookie, 'arv');

	dataJson = decodeData;
	console.log(dataJson);
	if (dataJson.name === undefined || dataJson.email === undefined || dataJson.pass === undefined) {
		console.log('Data Not Valid');

		write(res, 'Data Not Valid', 'text');
	} else {
		fs.readFile('database.txt', 'utf-8', function (err, dataFile) {
			if (err) {
				console.log('Data Not Valid');
				write(res, 'file not found !', 'text');
			} else {
				dataFile = JSON.parse(dataFile);

				let found = false;

				dataFile.data.forEach(item => {
					if (item.email == dataJson.email && item.pass == dataJson.pass) {
						found = item;
					}
				});

				if (found) {
					console.log('user found !');
					token = jwt.sign(found, 'arv');
					console.log(token);
					res.writeHead(200, {
						'Set-Cookie': token, 'Content-Type': 'text/plain',
					});
					write(res, 'user found !', 'text');
				} else {
					console.log('user not found !');
					write(res, 'user not found !', 'text');
				}
			}
		});
	}
});

console.log('route available : ', Route.routes);

const headers = {
	text: {'Content-Type': 'text/plain'}, html: {"Content-Type": "text/html"},
};

function rh(req, res) {
	const url = req.url;
	const fp = url.split('/')[1];
	const method = req.method;
	let result;

	let data = '';
	req.on('data', chunk => {
		data += chunk ?? '';
	}).on('end', () => {
		try {
			result = Route.execute(fp, method);
			if (result instanceof Function) {
				res.writeHead(200, headers.text);
				let remoteDataPromise = result(req, res, data);
				// console.log(remoteDataPromise);
				// res.write(remoteDataPromise.data !== undefined ? remoteDataPromise : remoteDataPromise.data);
				// res.end();
			} else {
				res.write(result);
			}
		} catch (err) {
			console.log('Err : ', err);
		}
	});
}

function write(res, data, status) {
	// res.writeHead(200, headers.text);
	res.write(data);
	res.end();
}
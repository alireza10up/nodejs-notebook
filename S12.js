/* packages */

const http = require('http');
const jwt = require('jsonwebtoken');
const Route = require('./router');
const insertToFile = require('./inserttofile');

/* Run Server */

const port = 8585;
const server = http.createServer(rh);
server.listen(port);

console.log('server run on :', `http://localhost:${port}`);

/* variables */

const saltSecurity = "=//Abs:sldfjnavioierrfeawrj:256";

const headers = {
	text: {'Content-Type': 'text/plain'}, html: {"Content-Type": "text/html"},
};

/* register routes */

Route.post('sign_up', async (req, res, data) => {
	// Validate JSON data
	const dataJson = await Promise.resolve(JSON.parse(data));
	if (!dataJson.name || !dataJson.email || !dataJson.pass) {
		console.log('Data Not Valid');
		return 'Data Not Valid';
	}

	// Append data to file
	const result = await insertToFile.fileAppend(data);

	// check result
	if (result) {
		return 'User registered successfully';
	} else {
		return 'Error registering user';
	}
});

Route.post('sign_in', async (req, res, data) => {
	// Validate JSON data
	const dataJson = await Promise.resolve(JSON.parse(data));
	if (dataJson.name === undefined || dataJson.email === undefined || dataJson.pass === undefined) {
		console.log('Data Not Valid');
		return 'Data Not Valid';
	}

	try {
		const users = await insertToFile.showFile();
		console.log(users);
		users.then((data) => {
			console.log(data);
		});
		for (let user of users) {
			console.log(user);
		}

		if (users) {
			const token = await jwt.sign(user, saltSecurity);
			res.writeHead(200, {'Set-Cookie': token, 'Content-Type': 'text/plain'});
			res.write('user found !');
		} else {
			res.write('user not found !');
		}
	} catch (error) {
		console.error('Error processing request:', error);
		return 'Error processing request';
	}
});

Route.get('cookie', async (req, res) => {
	const token = req.headers.cookie;

	try {
		const userData = await jwt.verify(token, saltSecurity);
		console.log(userData);

		if (userData) {
			res.write('User is logged in');
		} else {
			res.write('User is not logged in');
		}
	} catch (error) {
		console.error('Error validating token:', error);
		res.write('Invalid token');
	}
});

console.log('route available : ', Route.routes);

function rh(req, res) {
	const url = req.url;
	const fp = url.split('/')[1];
	const method = req.method;
	let result;

	let data = '';
	req.on('data', chunk => {
		data += chunk ?? '';
	});
	req.on('end', () => {
		try {
			result = Route.execute(fp, method);
			if (result instanceof Function) {
				res.writeHead(200, headers.text);
				result = result(req, res, data);
				result.then((data) => {
					res.write(data.data !== undefined ? data.data : data);
					res.end();
				}).catch((e) => {
					console.log(e);
					res.end();
				});
			} else {
				res.write(result);
				res.end();
			}
		} catch (err) {
			console.log('Err : ', err);
			res.end();
		}
	});
}

function write(res, data, status) {
	res.writeHead(200, headers.text);
	res.write(data);
	res.end();
}
/* packages */

const fs = require('fs');
const http = require('http');
const Router = require('./core/router');
const Database = require("./core/database");

/* Run Server */

const port = 8585;
const server = http.createServer(rh);
server.listen(port);

/* Variables */

const saltSecurity = "=//Abs:sldfjnavioierrfeawrj:256";

const headers = {
	text: {'Content-Type': 'text/plain'}, html: {"Content-Type": "text/html"},
};

const types = {
	text: 'text/plain', html: 'text/html'
}

/* Register Routes */

Router.get('login', async (req, res, data) => {
	const database = new Database('users');

	// add item
	database.addItem({
		name: 'John Doe',
		email: 'johndoe@example.com',
		password: '123456',
		time: Date.now()
	});
	database.addItem({
		name: 'John Doe',
		email: 'johnsdafe@example.com',
		password: '123456',
		time: Date.now()
	});
	database.addItem({
		name: 'John Doe',
		email: 'johse@example.com',
		password: '123456',
		time: Date.now()
	});


	console.log(database.getItem('johndoe@example.com'));

	// check if item exists
	const exists = database.itemExists('johndoe@example.com');

	// remove item
	// database.removeItem('johndoe@example.com');

	// edit item
	database.editItem('johndoe@example.com', {
		name: 'Jane Doe',
		family: 'ahmad'
	});

	// count items
	const count = database.countItems();

	return count + " " + exists;
});

Router.post('login', async (req, res, data) => {
	return 1;
});

Router.get('register', async (req, res, data) => {
	return 1;
});

Router.post('register', async (req, res, data) => {
	return 1;
});


console.log('route available : ', Router.routes);

/* Request Handler */

function rh(req, res) {
	const url = req.url;
	const fp = url.split('/')[1];
	const method = req.method;

	let data = '';
	req.on('data', chunk => {
		data += chunk ?? '';
	});
	req.on('end', () => {
		try {
			let result = Router.execute(fp, method);
			if (result instanceof Function) {
				// call controller func
				result = result(req, res, data);
				// handle request
				result.then((data) => {
					// set header default
					if (!res.hasHeader('Content-Type')) {
						res.writeHead(200, {'Content-Type': types.text});
					}
					res.write(data);
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
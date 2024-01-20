const fs = require('fs');
const http = require('http');
const Router = require('./core/router');
const Database = require("./core/database");
const Auth = require("./core/auth");
const Validator = require('./core/validation');
const Utilities = require('./core/utilities');

const port = 8585;
const server = http.createServer(rh);
server.listen(port);

const headers = {
	text: {'Content-Type': 'text/plain'},
	html: {'Content-Type': 'text/html'},
	json: {'Content-Type': 'application/json'},
};

const types = {
	text: 'text/plain', html: 'text/html', json: 'application/json',
};

Router.get('login', async (req, res, data) => {
	// Load Template
	res.setHeader('Content-Type', headers.html);
	return Utilities.template('login');
});

Router.post('login', async (req, res, data) => {
	// Validation and login logic here
});

Router.get('register', async (req, res, data) => {
	// Load Template
	res.setHeader('Content-Type', headers.html);
	return Utilities.template('register');
});

Router.post('register', async (req, res, data) => {
	// Load Database And Sync With Auth Service
	const database = new Database('users');
	Auth.users = database.database;

	try {
		// Get Data
		data = JSON.parse(data);

		// Validation
		const validationRules = {
			email: {
				required: true, type: 'string', isEmail: /^\w+@\w+\.\w+$/,
			}, name: {
				required: true, type: 'string',
			}, pass: {
				required: true, type: 'string', minLength: 8,
			},
		};

		data = Validator.validate(data, validationRules);

		// Check User Exits
		if (Auth.userExits(data.email)) {
			return JSON.stringify({status: false, message: 'User already exists'});
		}

		// Register User In Database
		database.addItem({
			name: data.name, email: data.email, pass: data.pass, time: Date.now()
		});

		// Create token And Set In To Cookie
		const token = await Auth.generateToken(data.email);

		res.setHeader('Set-Cookie', token);

		// Response
		return JSON.stringify({status: true, message: 'User registered successfully'});
	} catch (error) {
		return JSON.stringify({status: false, message: error.message});
	}
});

Router.get('list', async (req, res, data) => {
	// Load Template
	res.setHeader('Content-Type', headers.html);
	return Utilities.template('list');
});

Router.post('add_note', async (req, res, data) => {
	return 'notes';
});

Router.get('notes', async (req, res, data) => {
	return 'notes';
});

console.log('Routes available:', Router.routes);

function rh(req, res) {
	const url = req.url;
	const fp = url.split('/')[1];
	const method = req.method;

	if (fp === 'assets') {
		let data = Utilities.assets(url);
		res.write(data);
		res.end();
	} else {
		let data = '';
		req.on('data', chunk => {
			data += chunk ?? '';
		});

		req.on('end', () => {
			try {
				let result = Router.execute(fp, method);
				if (result instanceof Function) {
					result = result(req, res, data);

					result.then((data) => {
						if (!res.hasHeader('Content-Type')) {
							res.setHeader('Content-Type', types.json);
						}
						res.write(data instanceof Object ? JSON.stringify(data) : data);
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
}
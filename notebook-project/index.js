const fs = require('fs');
const http = require('http');
const Router = require('./core/router');
const Database = require("./core/database");
const Auth = require("./core/auth");
const Validator = require('./core/validation');

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
	const database = new Database('users');
	database.addItem({
		name: 'John Doe', email: 'johndoe@example.com', password: '123456', time: Date.now()
	});
});

Router.post('login', async (req, res, data) => {
	// Validation and login logic here
});

Router.get('register', async (req, res, data) => {
	// Placeholder for future logic
	return 'Registration form goes here';
});

Router.post('register', async (req, res, data) => {
	const database = new Database('users');
	Auth.users = database.database;

	try {
		data = JSON.parse(data);
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

		const token = await Auth.generateToken(data.email);

		res.setHeader('Set-Cookie', token);
		return JSON.stringify({status: true, message: 'User registered successfully'});
	} catch (error) {
		return JSON.stringify({status: false, message: error.message});
	}
});

console.log('Routes available:', Router.routes);

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
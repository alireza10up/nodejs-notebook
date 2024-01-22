const http = require('http');
const Router = require('./core/router');
const Database = require("./core/database");
const Auth = require("./core/auth");
const Validator = require('./core/validation');
const Utilities = require('./core/utilities');

const port = 8585;
const server = http.createServer(rh);
server.listen(port);

console.log('Server is running on port:'+port);

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
			}, pass: {
				required: true, type: 'string', minLength: 8,
			},
		};

		data = Validator.validate(data, validationRules);

		// Check User Data
		if (Auth.math(data)) {
			// Create token And Set In To Cookie
			const token = await Auth.generateToken(data.email);

			res.setHeader('Set-Cookie', token);

			// Response
			return JSON.stringify({status: true, message: 'You have successfully logged in'});
		} else {
			res.statusCode = 403;
			return JSON.stringify({
				status: false, message: 'The information entered is incorrect or the user does not exist'
			});
		}
	} catch (error) {
		res.statusCode = 400;
		return JSON.stringify({status: false, message: error.message});
	}
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
			res.statusCode = 403;
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
		res.statusCode = 201;
		return JSON.stringify({status: true, message: 'User registered successfully'});
	} catch (error) {
		res.statusCode = 400;
		return JSON.stringify({status: false, message: error.message});
	}
});

Router.get('list', async (req, res, data) => {
	// Load Template
	res.setHeader('Content-Type', headers.html);
	return Utilities.template('list');
});

Router.get('', async (req, res, data) => {
	// Load Template
	res.setHeader('Content-Type', headers.html);
	return Utilities.template('list');
});

Router.get('notes', async (req, res, data) => {
	// Load Note Database
	const noteDatabase = new Database('notes');
	// Load Database And Sync With Auth Service
	const database = new Database('users');
	Auth.users = database.database;

	// Check User Can
	const token = req.headers.cookie ?? '';
	if (!Auth.can(token)) {
		res.statusCode = 403;
		return JSON.stringify({status: false, message: 'Your Session Not Valid Please Again Login !'});
	}

	// Get User Login
	const user = Auth.getCurrentUser(token);

	// Return All Notes
	return JSON.stringify({
		status: true,
		message: 'done !',
		data: [noteDatabase.getItem(user.email)],
		count: noteDatabase.countItems(user.email)
	});
});

Router.post('add_note', async (req, res, data) => {
	// Load Note Database
	const noteDatabase = new Database('notes');
	// Load Database And Sync With Auth Service
	const database = new Database('users');
	Auth.users = database.database;

	// Check User Can
	const token = req.headers.cookie ?? '';
	if (!Auth.can(token)) {
		res.statusCode = 403;
		return JSON.stringify({status: false, message: 'Your Session Not Valid Please Again Login !'});
	}

	// Get User Login
	const user = Auth.getCurrentUser(token);

	try {
		// Get Data
		data = JSON.parse(data);

		// Validation
		const validationRules = {
			title: {
				required: true, type: 'string',
			}, content: {
				required: true, type: 'string',
			}
		};

		data = Validator.validate(data, validationRules);

		// Add Note In Database
		noteDatabase.putItem({
			id: "id"+Math.random().toString(16).slice(2),
			email: user.email,
			title: data.title,
			content: data.content,
			time: Date.now()
		});

		// Response
		res.statusCode = 201;
		return JSON.stringify({status: true, message: 'Note Create successfully'});
	} catch (error) {
		res.statusCode = 400;
		return JSON.stringify({status: false, message: error.message});
	}
});

Router.post('remove_note', async (req, res, data) => {
	// Load Note Database
	const noteDatabase = new Database('notes');
	// Load Database And Sync With Auth Service
	const database = new Database('users');
	Auth.users = database.database;

	// Check User Can
	const token = req.headers.cookie ?? '';
	if (!Auth.can(token)) {
		res.statusCode = 403;
		return JSON.stringify({status: false, message: 'Your Session Not Valid Please Again Login !'});
	}

	// Get User Login
	const user = Auth.getCurrentUser(token);

	try {
		// Get Data
		data = JSON.parse(data);

		// Validation
		const validationRules = {
			id: {
				required: true, type: 'string',
			}
		};

		data = Validator.validate(data, validationRules);

		// Remove Note
		noteDatabase.removeSubItem(user.email, data.id);

		// Response
		res.statusCode = 200;
		return JSON.stringify({status: true, message: 'Note Deleted successfully'});
	} catch (error) {
		res.statusCode = 400;
		return JSON.stringify({status: false, message: error.message});
	}
});

Router.post('edit_note', async (req, res, data) => {
	return 'Not Implemented';
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
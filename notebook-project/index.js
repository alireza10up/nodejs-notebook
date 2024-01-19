/*
* routes (login , register , lists)
* request handler (validation)
*/

/* packages */

const fs = require('fs');
const http = require('http');
const router = require('./core/router');

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

router.get('login', async (req, res, data) => {
	return 'get login';
});

router.post('login', async (req, res, data) => {
	return 1;
});

router.get('register', async (req, res, data) => {
	return 1;
});

router.post('register', async (req, res, data) => {
	return 1;
});


console.log('route available : ', router.routes);

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
			let result = router.execute(fp, method);
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
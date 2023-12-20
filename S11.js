const fs = require('fs');
const http = require('http');
const axios = require('axios');
const insertToFile = require('./inserttofile');
const port = 8585;
const server = http.createServer(rh);
server.listen(port);

/* routing */

class Route {
	static routes = [];

	static execute(route, method) {
		const matchedRoute = this.routes.find((recordedRoute) => {
			return (
				recordedRoute["route"] == route && recordedRoute["method"].toLowerCase() == method.toLowerCase()
			);
		});
		return (
			matchedRoute
		) ? matchedRoute["callback"] : "route not found";
	}

	static get(route, callback) {
		this.routes.push({
			"route": route, "method": "GET", "callback": callback
		});
	}

	static post(route, callback) {
		this.routes.push({
			"route": route, "method": "POST", "callback": callback
		});
	}
}

Route.get("file", insertToFile.showFile);
Route.post("file", insertToFile.fileAppend);

Route.get("route", function (req, res) {
	return 'i run in get'
});
Route.post("route", (req, res) => 'i run in post');

Route.post("call", call);

console.log(Route.routes);

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
	}).on('end', async () => {
		try {
			result = Route.execute(fp, method);
			if (result instanceof Function) {
				res.writeHead(200, headers.text);
				const remoteDataPromise = await result(req, data);
				res.write(remoteDataPromise.data ? remoteDataPromise.data : remoteDataPromise);
				res.end();
			} else {
				res.write(result);
			}
		} catch (err) {
			console.log('Err : ', err);
		}
		res.end();
	});
}

async function call(req, data) {
	return await axios.post('http://localhost:8586/call', data)
}
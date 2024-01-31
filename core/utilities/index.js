const fs = require("fs");

class Utilities {
	static assets(path) {
		path = __dirname+'\\..\\..\\resource\\templates\\'+path;
		return fs.readFileSync(path, (err, data) => {
			if (err) {
				return Utilities.error();
			}
			return data;
		});
	}

	static template(filename) {
		let path = __dirname+'\\..\\..\\resource\\templates\\'+filename+'.html';
		return fs.readFileSync(path, 'utf-8', (err, data) => {
			if (err) {
				return Utilities.error();
			}
			return data;
		});
	}

	static page404() {
		let path = __dirname+'\\..\\..\\resource\\templates\\404.html';
		return fs.readFileSync(path, (err, data) => {
			if (err) {
				return Utilities.error();
			}
			return data;
		});
	}

	static error() {
		let path = __dirname+'\\..\\..\\resource\\templates\\error.html';
		return fs.readFileSync(path, (err, data) => {
			if (err) {
				return 'Error Serve !';
			}
			return data;
		});
	}
}

module.exports = Utilities;
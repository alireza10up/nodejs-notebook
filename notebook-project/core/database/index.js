const fs = require('fs');

class Database {
	bucket;
	database;

	constructor(bucket) {
		this.bucket = bucket;
		this.loadDatabase();
	}

	loadDatabase() {
		const path = `./${this.bucket}.json`;
		const data = fs.readFileSync(path, 'utf-8');
		this.database = JSON.parse(data);
	}

	itemExists(key) {
		const data = this.database;
		if (data) {
			return key in data;
		}
		return false;
	}

	addItem(item) {
		let data = this.database;
		if (data) {
			data[item.email] = item;
		} else {
			data = {[item.email]: item};
		}
		fs.writeFileSync(`./${this.bucket}.json`, JSON.stringify(data, null, 2), 'utf-8');
	}

	getItem(key) {
		const data = this.database;

		if (data && key in data) {
			return data[key];
		}

		return null;
	}

	removeItem(key) {
		const data = this.database;
		if (data && key in data) {
			delete data[key];
			fs.writeFileSync(`./${this.bucket}.json`, JSON.stringify(data, null, 2), 'utf-8');
		}
	}

	editItem(key, item) {
		const data = this.database;
		if (data && key in data) {
			data[key] = item;
			fs.writeFileSync(`./${this.bucket}.json`, JSON.stringify(data, null, 2), 'utf-8');
		}
	}

	countItems() {
		const data = this.database;
		if (data) {
			return Object.keys(data).length;
		}
		return 0;
	}
}

module.exports = Database;
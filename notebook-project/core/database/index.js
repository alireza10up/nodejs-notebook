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
		try {
			this.database = JSON.parse(data);
		} catch (e) {
			this.database = {};
		}
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

	putItem(item) {
		let data = this.database;
		if (data) {
			if (data[item.email]) {
				data[item.email].push(item);
			} else {
				data[item.email] = [item];
			}
		} else {
			data = {[item.email]: [item]};
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

	removeSubItem(key, id) {
		const data = this.database;
		if (data && key in data) {
			const items = data[key];
			const updatedItems = [];

			for (const item of items) {
				if (item.id !== id) {
					updatedItems.push(item);
				}
			}

			if (updatedItems.length > 0) {
				data[key] = updatedItems;
			} else {
				delete data[key];
			}

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

	countItems(isSub = false) {
		const data = this.database;
		if (data) {
			if (!isSub) {
				return Object.keys(data).length ?? 0;
			} else {
				return data[isSub]?.length ?? 0;
			}
		}
		return 0;
	}
}

module.exports = Database;
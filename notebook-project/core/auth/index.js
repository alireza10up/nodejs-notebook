const jwt = require('jsonwebtoken');

class Auth {
	static secret = '=//Abs:sldfjnavioierrfeawrj:256';
	static users = {};

	static register(email, password) {
		if (this.userExits(email)) {
			throw new Error('User already exists');
		}

		const token = this.generateToken(email);
		this.users[email] = {
			token, password,
		};

		return token;
	}

	static login(email, password) {
		const user = this.users[email];

		if (!user || user.password !== password) {
			throw new Error('Invalid credentials');
		}

		return user.token;
	}

	static can(token) {
		const user = this.users[this.decodeToken(token)];

		if (!user) {
			return false;
		}

		return true;
	}

	static userExits(email) {
		return email in this.users;
	}

	static generateToken(email) {
		return jwt.sign({email}, this.secret, {expiresIn: '1h'});
	}

	static decodeToken(token) {
		return jwt.decode(token, this.secret);
	}
}

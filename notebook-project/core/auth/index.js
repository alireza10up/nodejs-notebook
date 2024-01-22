const jwt = require('jsonwebtoken');

class Auth {
	static secret = '=//Abs:sldfjnavioierrfeawrj:256';
	static users = {};

	static math(data) {
		let userFound = this.users[data.email];
		if (userFound) {
			return userFound.pass === data.pass;
		}
		return false;
	}

	static can(token) {
		let decodedToken = this.decodeToken(token);
		if (decodedToken) {
			const user = this.users[decodedToken.email];

			if (!user) {
				return false;
			}

			return true;
		} else {
			return false;
		}
	}

	static getCurrentUser(token) {
		const user = this.users[this.decodeToken(token).email];

		if (!user) {
			return false;
		}

		return user;
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

module.exports = Auth;
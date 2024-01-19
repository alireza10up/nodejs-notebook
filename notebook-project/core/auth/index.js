const jwt = require('jsonwebtoken');

class Auth {
	static secret = '=//Abs:sldfjnavioierrfeawrj:256';
	static users = {};

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

module.exports = Auth;
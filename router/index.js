class Route {
	static routes = [];

	static execute(route, method) {
		const matchedRoute = this.routes.find((recordedRoute) => {
			return (
				recordedRoute["route"] === route && recordedRoute["method"].toLowerCase() === method.toLowerCase()
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

module.exports = Route;
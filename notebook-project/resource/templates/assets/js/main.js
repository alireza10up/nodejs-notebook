/* lib */

function login() {
	// Get Email And Password From Form
	const email = document.getElementById('input-email').value;
	const pass = document.getElementById('input-password').value;

	// Create Data Object
	const data = {
		email, pass
	};

	// Make A POST Request To The /login Route
	fetch('/login', {
		method: 'POST', body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((data) => {
			// Check Response
			if (data.status) {
				// Redirect To Main Page
				Swal.fire({
					icon: "success", title: data.message, text: 'you soon redirect ...'
				});
				setTimeout(() => {
					window.location.href = '/list';

				}, 5000);
			} else {
				// Show Error Message
				Swal.fire({
					icon: "error", title: data.message,
				});
			}
		});
}

function register() {
	// Get Form Data
	const name = document.getElementById('input-name').value;
	const email = document.getElementById('input-email').value;
	const pass = document.getElementById('input-password').value;

	// Create Data Object
	const data = {
		name, email, pass
	};

	// Make A POST Request To The /register Route
	fetch('/register', {
		method: 'POST', body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((data) => {
			// Check Response
			if (data.status) {
				// Redirect To Main Page
				Swal.fire({
					icon: "success", title: data.message, text: 'you soon redirect ...'
				});
				setTimeout(() => {
					window.location.href = '/list';

				}, 5000);
			} else {
				// Show Error Message
				Swal.fire({
					icon: "error", title: data.message,
				});
			}
		});
}

function add_note() {

}

function remove_note() {

}

function get_notes() {

}
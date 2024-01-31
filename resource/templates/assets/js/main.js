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
				}, 3000);
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
				}, 3000);
			} else {
				// Show Error Message
				Swal.fire({
					icon: "error", title: data.message,
				});
			}
		});
}

function add_note() {
	// Get Form Data
	let title = document.getElementById('input-title');
	let content = document.getElementById('input-content');

	let titleValue = title.value;
	let contentValue = content.value;

	// Create Data Object
	const data = {
		title: titleValue, content: contentValue
	};

	// Make A POST Request To The /register Route
	fetch('/add_note', {
		method: 'POST', body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((data) => {
			// Check Response
			if (data.status) {
				// Show Success Message
				Swal.fire({
					icon: "success", title: data.message
				});
				// Clear Inputs
				title.value = "";
				content.value = "";
				// Reload Notes
				get_notes();
			} else {
				// Show Error Message
				Swal.fire({
					icon: "error", title: data.message,
				});
			}
		});
}

function remove_note(note_id) {
	// Create Data Object
	const data = {
		id: note_id
	};

	// Make A POST Request To The /notes Route
	fetch('/remove_note', {
		method: 'POST', body: JSON.stringify(data)
	})
		.then((response) => response.json())
		.then((data) => {
			// Check Response
			if (data.status) {
				// Show Success Message
				Swal.fire({
					icon: "success", title: data.message
				});
				// Reload Notes
				get_notes();
			} else {
				// Show Error Message
				Swal.fire({
					icon: "error", title: data.message,
				});
			}
		});
}

function get_notes() {
	// Make A POST Request To The /notes Route
	fetch('/notes', {
		method: 'GET'
	})
		.then((response) => response.json())
		.then((data) => {
			// Check Response
			if (data.status) {
				// Show Data
				if (data?.data?.length) {
					note_handle(data.data);
				} else {
					note_handle({});
					document.getElementById('nothing').classList.toggle('hidden');
					document.getElementById('count-note').innerHTML = 0;
				}
				// update meta
				show_meta(data);
			} else {
				// Show Error Message
				Swal.fire({
					icon: "error", title: data.message,
				});
			}
		});
}

function note_handle(notes) {
	// Item
	let notes_wrapper = document.getElementById('notes_wrapper');
	notes_wrapper.innerHTML = '';
	if (notes.length) {
		// hidden nothing
		document.getElementById('nothing').classList.add('hidden');
		// Reverse
		notes = notes.reverse();
		// Handle
		notes.forEach((note) => {
			notes_wrapper.innerHTML += `<li class="notes-item">
			<div class="content">
				<h3 class="notes-title">${note.title}</h3>
				<p class="notes-content">${note.content}</p>
			</div>
			<div class="actions">
				<button data-noteid="${note.id}" class="button button-delete">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
					     class="bi bi-trash" viewBox="0 0 16 16">
						<path
							d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
						<path
							d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
					</svg>
				</button>
				<button class="button button-edit">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
					     class="bi bi-pen" viewBox="0 0 16 16">
						<path
							d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
					</svg>
				</button>
			</div>
		</li>`;
		});
		// Add Event Delete
		const delete_btns = document.querySelectorAll('.button-delete');

		delete_btns.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				remove_note(btn.dataset.noteid);
			});
		});
	}
}

function delete_cookies() {
	document.cookie = 'clear';
	window.location.reload();
}

function show_meta(data) {
	document.getElementById('count-note').innerHTML = data.count;
	document.getElementById('time-register').innerHTML = new Date(data.user_data.time).toDateString();
	document.getElementById('user-name').innerHTML = data.user_data.name;
}
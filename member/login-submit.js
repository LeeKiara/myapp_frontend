
(() => {
	const btnLogin = document.querySelector("form button");

	btnLogin.addEventListener("click", async (e) => {

		e.preventDefault();

		const form = document.forms[0];

		const username = form.querySelector("input[name='username']").value;
		const password = form.querySelector("input[name='password']").value;

		console.log("apiUrl");
		console.log(`${apiUrl()}`);

		// http://localhost:8080/api/auth/signin
		const response = await fetch(`${apiUrl()}/auth/signin`, {
			// HTTP Method
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password,
			}),
		});
	}
	)

})();

function isLocalhost() {
  return ["localhost", "127.0.0.1"].includes(location.hostname);
}

function apiUrl() {
  return `${isLocalhost() ? "http" : "https"}://${
    isLocalhost() ? `${location.hostname}:8080/api` : `${location.hostname}/api`
  }`;
}
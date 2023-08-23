// 회원 가입
(() => {
	const btnSignup = document.querySelector("form button");

	btnSignup.addEventListener("click", async (e) => {
		e.preventDefault();

		const form = document.forms[0];
		const username = form.querySelector("input[name='username']").value;
		const password = form.querySelector("input[name='password']").value;
		const password2 = form.querySelector("input[name='password2']").value;
		const mname = form.querySelector("input[name='mname']").value;
		const email = form.querySelector("input[name='email']").value;

		console.log("----debug---");
		console.log("username:" + username);
		console.log("password:" + password);
		console.log("mname:" + mname);
		console.log("email:" + email);

		// 입력값 검증
		if (username === "") {
			alert("아이디를 입력하세요.");
			return;
		}

		if (password === "") {
			alert("비밀번호를 입력하세요.");
			return;
		}

		if (password != password2) {
			alert("비밀번호와 비밀번호 확인값이 일치하지 않습니다.");
			return;
		}

		if (email === "") {
			alert("이메일을 입력하세요.");
			return;
		}

		// 서버에 Http 요청 (회원가입)
		const response = await fetch("http://localhost:8080/auth/signup", {
			// HTTP Method
			method: "POST",
			// 보낼 데이터 형식은 json
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password,
				mname,
				email,
			}),
		});

		// 서버에서 response 받기
		const result = await response.json();

		// const { data } = result;

		console.log("----debug---");
		console.log("result" + result);
		console.log("response.status:" + response.status);

		if ([201].includes(response.status)) {
			alert("회원가입이 완료되었습니다.");
			window.location.href = "http://localhost:5500/"
		}
	});
})();

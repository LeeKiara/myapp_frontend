// 로그인
(() => {
	// URL의 쿼리 문자열을 가져오기
	const queryString = window.location.search;

	// 쿼리 문자열을 파싱하여 폼 데이터 객체로 변환
	const formData = {};
	const params = new URLSearchParams(queryString);
	for (const [key, value] of params) {
		formData[key] = value;
	}

	// 로그인 후 이동할 페이지를 requestParameter로 받음
	let nextPage = formData.next;

	if (typeof nextPage === "undefined") {
		nextPage = "/project/project-list.html";
	}

	alert(nextPage);

	const form = document.getElementById("loginForm");

	form.addEventListener("submit", async function (event) {
		event.preventDefault(); // 기본 폼 제출 동작 막기

		const formData = new FormData(form);

		// 입력값 검증
		formData.forEach((value, key) => {
			console.log(`${key}: ${value}`);

			if (key === "username" && value === "") {
				alert("아이디를 입력하세요.");
				return false;
			}

			if (key === "password" && value === "") {
				alert("비밀번호를 입력하세요.");
				return false;
			}
		});

		try {
			const response = await fetch("http://localhost:8080/auth/signin", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				// 서버 응답 처리
				alert("로그인 성공!");
				const redirectTo = "http://localhost:5500/";
				window.location.href = nextPage; // 로그인 후 이동되는 페이지
			} else {
				if ([401].includes(response.status)) {
					alert("아이디 또는 비밀번호가 맞지 않습니다.");
					return;
				}
			}
		} catch (error) {
			alert("오류 발생:", error);
		}
	});
})();

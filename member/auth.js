// 인증토큰이 있으면 프로젝트 현황 페이지로, 없으면 로그인페이지로 이동
(() => {
	const token = getCookie("token");

	if (!token) {
		// 인증토큰이 없으면, 메인페이지로 이동
		alert("로그인이 필요합니다.");
		window.location.href = "/index.html";
		// window.location.href = "/member/login.html";
	}

	// getUserInfo();

})();

// 쿠키값 조회
function getCookie(name) {
	let matches = document.cookie.match(
		new RegExp(
			"(?:^|; )" +
				name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
				"=([^;]*)"
		)
	);
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

// 쿠키값 삭제
function removeCookie(name) {
	document.cookie =
		name +
		"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";
}

// 사용자 정보 조회
async function getUserInfo() {
	
	let url = `http://localhost:8080/project/userinfo`;

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${getCookie("token")}`,
		},
	});

	const result = await response.json();

	// alert(result.username);
	
}


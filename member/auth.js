// 인증토큰이 있으면 프로젝트 현황 페이지로, 없으면 로그인페이지로 이동
(() => {
	const token = getCookie("token");

	if (!token) {
		// 인증토큰이 없으면, 메인페이지로 이동
		// window.location.href = "/index.html";
		// window.location.href = "/member/login.html";
	} else {
		// 인증토큰이 있으면
		if (window.location.href === "http://localhost:5500/") {
			// 메인페이지로 이동
			window.location.href = "/project/project-list.html";
		}
	}
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

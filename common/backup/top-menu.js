(() => {
	const topbar = document.createElement("header");

	topbar.innerHTML = /*html */ `
	<div class="top-left-layer"></div>
	<div class="top-center-layer">
		<div class="home">iPMS</div>
		<div class="gnb-menu">
			<div id="gnb-menu-new-project">프로젝트 등록</div>
			<div id="gnb-menu-my-project">내 프로젝트</div>
			<div id="gnb-menu-task">업무 현황</div>
			<div id="gnb-menu-tmember">참여자</div>
		</div>
		<div class="login-logout">
			<div id='username' class="font-color-emphasis"></div>
			<div><button id='login'>로그인</button></div>
			<div><button id='logout'>logout</button></div>
		</div>
	</div>
	<div class="top-right-layer"></div>
`;
	document.body.prepend(topbar);

	// 홈 이동
	const btnHome = document.querySelector(".home");

	btnHome.addEventListener("click", (e) => {
		window.location.href = "/";
	});

	// 프로젝트 생성 버튼 클릭 이벤트
	const btnNewProject = document.querySelector("#gnb-menu-new-project");

	btnNewProject.addEventListener("click", (e) => {
		window.location.href = "/project/project-create.html";
	});

	// 내 프로젝트
	const btnMyProject = document.querySelector("#gnb-menu-my-project");

	btnMyProject.addEventListener("click", (e) => {
		window.location.href = "/project/project-main.html?search=myproject";
	});
})();

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

// 로그인 사용자 정보
async function getUserInfo() {
	let url = `http://localhost:8080/member/getUserInfo`;

	// 서버에 데이터를 전송 : fetch(url, options)
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${getCookie("token")}`,
		},
	});

	const result = await response.json();

	console.log("getUserInfo");
	console.log(result);
	console.log(result.username);

	document.getElementById("username").innerHTML = result.username;
}

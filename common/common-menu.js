(() => {
	// Top-menu 생성
	createTopMenu();

	// Left-menu 생성
	// createLeftMenu();

	// 로그인 버튼
	const btnLogin = document.getElementById("login");
	// 로그아웃 버튼
	const btnLogout = document.getElementById("logout");

	// client에 저장된 token값 유무에 따라 로그인, 로그아웃 버튼 처리
	displayBtnLogout(btnLogin, btnLogout);

	// 로그인 클릭 이벤트
	btnLogin.addEventListener("click", (e) => {
		e.preventDefault();

		window.location.href = "/member/login.html";
	});

	// 로그아웃 클릭 이벤트
	btnLogout.addEventListener("click", (e) => {
		e.preventDefault();

		removeCookie("token");

		window.location.href = "/index.html";
	});

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

	// 작업 현황
	const btnTask = document.querySelector("#gnb-menu-task");

	btnTask.addEventListener("click", (e) => {
		window.location.href = "/task/task-list.html";
	});

	// 팀원 현황
	const btnTmember = document.querySelector("#gnb-menu-tmember");

	btnTmember.addEventListener("click", (e) => {
		window.location.href = "/team/tmember-list.html";
	});
})();

// Top-menu 생성
function createTopMenu() {
	const params = new URLSearchParams(window.location.search);
	let pid = params.get("pid");

	const topbar = document.createElement("header");

	topbar.innerHTML = /*html */ `
	<div class="top-left-layer"></div>
	<div class="top-center-layer">
		<div class="home"> <img src="/image/home-button.png" style="width:50px">	</div>
		<div class="gnb-menu">
			<div id="gnb-menu-new-project">프로젝트 등록</div>
			<div id="gnb-menu-my-project">내 프로젝트</div>
			<div id="gnb-menu-tmember">팀원 현황</div>
			<div id="gnb-menu-task">작업 현황</div>
			
		</div>
		<div class="login-logout">
			<div id='username' class="font-color-emphasis"></div>
			<div><button id='login' class="common-button-circle">로그인</button></div>
			<div><button id='logout'class="common-button-circle">logout</button></div>
		</div>
	</div>
	<div class="top-right-layer"></div>
`;
	document.body.prepend(topbar);
}

// client에 저장된 token값 유무에 따라 로그인, 로그아웃 버튼 처리
function displayBtnLogout(btnLogin, btnLogout, username) {
	// token 정보 읽어오기
	let myToken = getCookie("token");

	if (typeof myToken === "undefined") {
		// 토큰이 없으면 로그인 버튼만 보이기
		btnLogin.style.display = "";
		btnLogout.style.display = "none";
	} else {
		// 토큰이 있으면 로그아웃 버튼만 보이기
		btnLogin.style.display = "none";
		btnLogout.style.display = "";
	}
}

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
// function removeCookie(name) {
// 	document.cookie =
// 		name +
// 		"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";
// }

// 쿠키값 삭제
function removeCookie(name) {
	const domainName = ["localhost", "127.0.0.1"].includes(location.hostname)
			? "localhost"
			: "dmel5zuvyohd2.cloudfront.net";		

	document.cookie =
		name +
		"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain="+domainName+";";			
}

// 날짜 포맷 (yyyy-MM-dd)
function dateFormat(date) {
	let resultDateFormat =
		date.getFullYear() +
		"-" +
		(date.getMonth() + 1 < 10
			? "0" + (date.getMonth() + 1)
			: date.getMonth() + 1) +
		"-" +
		(date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
	return resultDateFormat;
}

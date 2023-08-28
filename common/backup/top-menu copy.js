(() => {
	
  // Top-menu 생성
	createTopMenu();

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

	getUserInfo();
	
})();

// Top-menu 생성
function createTopMenu() {

	const params = new URLSearchParams(window.location.search);
	let pid = params.get("pid");

	const topbar = document.createElement("header");

	topbar.innerHTML = /*html */ `
	<div>i-PMS</div>
	<div>
		<nav>
			<ul>
				<li> <a href="/project/project-main.html">PROJECT</a></li>
				<li id="top-menu-tmember"><a href="/team/tmember-list.html?pid=${pid}">TEAM</a></li>
				<li id="top-menu-task"><a href="/task/task-list.html?pid=${pid}">TASK</a></li>
			</ul>
		</nav>	
	</div>
	<div class="login-logout">
		<div id='username' class="font-color-emphasis"></div>
		<div><button id='login'>로그인</button></div>
		<div><button id='logout'>logout</button></div>
	</div>
`;
	document.body.prepend(topbar);
}

// client에 저장된 token값 유무에 따라 로그인, 로그아웃 버튼 처리
function displayBtnLogout(btnLogin, btnLogout, username) {
	
	// token 정보 읽어오기
	let myToken = getCookie("token");

	if (typeof myToken === "undefined") { 	// 토큰이 없으면 로그인 버튼만 보이기
		btnLogin.style.display = "";
		btnLogout.style.display = 'none';		

	} else {	// 토큰이 있으면 로그아웃 버튼만 보이기
		btnLogin.style.display = 'none';
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
      Authorization: `Bearer ${getCookie(
        "token"
      )}`,
    },
  });

	const result = await response.json();

	console.log("getUserInfo");
	console.log(result);
	console.log(result.username);

 	document.getElementById("username").innerHTML = result.username;

}
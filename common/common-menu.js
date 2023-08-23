(() => {
	
  // Top-menu 생성
	createTopMenu();

	// Left-menu 생성
	createLeftMenu();

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

	// 프로젝트 생성 버튼 클릭 이벤트
	const btnNewProject = document.querySelector("aside button");

	btnNewProject.addEventListener("click", (e) => {
		window.location.href = "/project/project-create.html";
	});

	// URL 파라메터 정보
	const params = new URLSearchParams(window.location.search);
	let pid = params.get("pid");
	
	// alert(window.location.search);
	// alert(`pid=${pid}`);	

	if(pid) {
		// 프로젝트 Team Member 현황 페이지 링크
		const leftMenuTm = document.querySelector("aside ul > li:nth-of-type(3)");

		leftMenuTm.addEventListener("click", (e) => {
			window.location.href = `/team/tmember-list.html?pid=${pid}`;
		});

		// 프로젝트 Task 현황 페이지 링크
		const leftMenuTask = document.querySelector("aside ul > li:nth-of-type(4)");

		leftMenuTask.addEventListener("click", (e) => {
			window.location.href = `/task/task-list.html?pid=${pid}`;
		});

	} else {
		document.querySelector("#top-menu-tmember").innerHTML = "";
		document.querySelector("#top-menu-task").innerHTML = "";
		document.querySelector("#left-menu-tmember").innerHTML = "";
		document.querySelector("#left-menu-task").innerHTML = "";
	}

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

// Left-menu 생성
function createLeftMenu() {
	const leftbar = document.createElement("aside");

	leftbar.innerHTML = /*html */ `
				<div><button>+새 프로젝트</button></div>
				<div>
					<ul>
						<li> <a href="/project/project-main.html">전체 프로젝트</a></li>
						<li> <a href="/project/project-main.html?search=myproject">내 프로젝트</a></li>
						<li id="left-menu-tmember">Team Member 현황</li>
						<li id="left-menu-task">TASK 현황</li>
					</ul>
				</div>
`;

	const main = document.querySelector("main");

	// main 영역에  좌측 공통 메뉴 삽입
	main.prepend(leftbar);

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
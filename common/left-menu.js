(() => {
	const leftbar = document.createElement("aside");

	leftbar.innerHTML = /*html */ `
				<div><button>+새 프로젝트</button></div>
				<div>
					<ul>
						<li> <a href="/project/project-main.html">공개 프로젝트</a></li>
						<li> <a href="/project/project-main.html?search=myproject">내 프로젝트</a></li>
						<li>Team Member 현황</li>
						<li>TASK 현황</li>
					</ul>
				</div>
`;

	const main = document.querySelector("main");

	// main 영역에  좌측 공통 메뉴 삽입
	main.prepend(leftbar);

	// 프로젝트 생성 버튼 클릭 이벤트
	const btnNewProject = leftbar.querySelector("aside button");

	btnNewProject.addEventListener("click", (e) => {
		window.location.href = "/project/project-create.html";
	});

	// 프로젝트 Team Member 현황 페이지 링크
	const leftMenuTm = leftbar.querySelector("aside ul > li:nth-of-type(3)");

	leftMenuTm.addEventListener("click", (e) => {
		const inputPid = document.querySelector("input[name='pid']");
		window.location.href = `/team/tmember-list.html?pid=${inputPid.value}`;
	});

	// 프로젝트 Task 현황 페이지 링크
	const leftMenuTask = leftbar.querySelector("aside ul > li:nth-of-type(4)");

	leftMenuTask.addEventListener("click", (e) => {
		const inputPid = document.querySelector("input[name='pid']");
		window.location.href = `/task/task-list.html?pid=${inputPid.value}`;
	});
})();

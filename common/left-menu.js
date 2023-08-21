(() => {
	const leftbar = document.createElement("aside");

	leftbar.innerHTML = /*html */ `
				<div><button>+새 프로젝트</button></div>
				<div>
					<ul>
						<li> <a href="/project/project-main.html">프로젝트 현황</a></li>
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

	btnNewProject.addEventListener("click",(e)=>{
		window.location.href = "/project/project-create.html";
	});

	// 프로젝트 Team Member 현황 페이지 링크
	const leftMenuTm = leftbar.querySelector("aside ul > li:nth-of-type(2)");

	leftMenuTm.addEventListener("click",(e)=>{
		
		const inputPid = document.querySelector("input[name='pid']");
		window.location.href = `/team/tmember-list.html?pid=${inputPid.value}`;

	});

		// 프로젝트 Task 현황 페이지 링크
		const leftMenuTask = leftbar.querySelector("aside ul > li:nth-of-type(3)");
		
		leftMenuTask.addEventListener("click",(e)=>{			
			const inputPid = document.querySelector("input[name='pid']");
			window.location.href = `/task/task-list.html?pid=${inputPid.value}`;
	
		});
	
})();

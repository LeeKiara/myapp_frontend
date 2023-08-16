(() => {
	const leftbar = document.createElement("aside");

	leftbar.innerHTML = /*html */ `
				<div><button>+새 프로젝트</button></div>
				<div>
					<ul>
						<li> <a href="/project/project-list.html">프로젝트 현황</a></li>
						<li>참여자 현황</li>
						<li>TASK 현황</li>
					</ul>
				</div>
`;

	const main = document.querySelector("main");

	main.prepend(leftbar);

	const btnNewProject = leftbar.querySelector("button");
	btnNewProject.addEventListener("click",(e)=>{
		window.location.href = "/project/project-create.html";
	});
})();

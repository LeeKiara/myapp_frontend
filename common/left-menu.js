(() => {
	const leftbar = document.createElement("aside");

	leftbar.innerHTML = /*html */ `
				<div><button>+새 프로젝트</button></div>
				<div>
					<ul>
						<li>프로젝트 현황</li>
						<li>참여자 현황</li>
						<li>TASK 현황</li>
					</ul>
				</div>
`;

	const main = document.querySelector("main");

	main.prepend(leftbar);
})();

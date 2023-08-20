(() => {
	const leftbar = document.createElement("nav");
	// topbar.style.position = "fixed";
	// topbar.style.width = "100vh";
	// topbar.style.marginTop = "40px";

	leftbar.innerHTML = /*html */ `
  <ul>
    <li>프로젝트 현황</li>
    <li>참여자 현황</li>
    <li>TASK 현황</li>
  </ul>
`;
	document.querySelector("main").prepend(leftbar);
})();

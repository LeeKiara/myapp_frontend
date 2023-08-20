(() => {
	const topbar = document.createElement("header");
	// topbar.style.position = "fixed";
	// topbar.style.width = "100vh";
	// topbar.style.marginTop = "40px";

	topbar.innerHTML = /*html */ `
	<div>i-PMS</div>
	<div>
		<nav>
			<ul>
				<li>PROJECT</li>
				<li>TEAM</li>
				<li>TASK</li>
			</ul>
		</nav>	
	</div>
	<div>My Profile</div>
	<div><button  id='logout'>logout</button></div>
`;
	document.body.prepend(topbar);

	// 로그아웃
	const btnLogout = document.getElementById("logout");
	btnLogout.addEventListener("click", (e) => {
		e.preventDefault();

		removeCookie("token");
		alert("로그아웃 완료!");

		window.location.href = "/index.html";
	});
})();

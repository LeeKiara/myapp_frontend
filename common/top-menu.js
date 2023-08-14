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
`;
	document.body.prepend(topbar);
})();

(() => {
	const topbar = document.createElement("header");
	// topbar.style.position = "fixed";
	// topbar.style.width = "100vh";
	// topbar.style.marginTop = "40px";

	topbar.innerHTML = /*html */ `
  <div class="top-menu">
  <ul>
    <li>PROJECT</li>
    <li>TEAM</li>
    <li>TASK</li>
  </ul>
</div>
`;
	document.body.prepend(topbar);
})();

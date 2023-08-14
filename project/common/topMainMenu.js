(() => {
	const topMainBar = document.createElement("section");

	topMainBar.innerHTML = /*html */ `
  <nav>
  <ul>
    <li>PROJECT</li>
    <li>TEAM</li>
    <li>TASK</li>
  </ul>
  <div></div>
</nav>
`;

	const main = document.querySelector("article");
	main.prepend(topMainBar);
})();

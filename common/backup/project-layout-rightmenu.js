(() => {
	const leftbar = document.querySelector("aside");

	leftbar.innerHTML = /*html */ `
	<div class="right-box">
	<div>프로젝트 관리자</div>
	<div>
		<div><img src="/image/profile.png" width="40px" /></div>
		<div class="profile-username">유저명</div>
	</div>
</div>
`;
	// document.querySelector("main").prepend(leftbar);
})();

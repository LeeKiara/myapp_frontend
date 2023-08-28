(() => {
	const topbar = document.createElement("header");

	topbar.innerHTML = /*html */ `
  <div>iPMS</div>
  <div class="gnb-menu">
    <div>프로젝트 등록</div>
    <div>내 프로젝트</div>
    <div>업무 현황</div>
    <div>참여자</div>
  </div>
  <div>profile</div>
`;
	document.body.prepend(topbar);
})();

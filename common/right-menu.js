(() => {
	const leftbar = document.querySelector("aside");

	leftbar.innerHTML = /*html */ `
	<div class="right-box">
	<div class="right-box-userinfo">
		<div><img src="/image/profile.png" width="40px" /></div>
		<div class="profile-username">유저명</div>
	</div>
</div>
`;
	// document.querySelector("main").prepend(leftbar);

	getUserInfo();

	// setUserInfoTitle(username);
})();

// 로그인 사용자 정보
async function getUserInfo() {
	let url = `http://localhost:8080/member/getUserInfo`;

	// 서버에 데이터를 전송 : fetch(url, options)
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${getCookie("token")}`,
		},
	});

	const result = await response.json();

	console.log("getUserInfo");
	console.log(result);
	console.log(result.username);

	document.querySelector(".profile-username").innerHTML = result.username;

	// project main 화면의 타이틀
	if (document.querySelector(".top-content .project-main h1") != null) {
		const currentHours = new Date().getHours();
		let period = "";

		if (currentHours >= 0 && currentHours < 12) {
			period = "<font color='blue'>오전</font>";
		} else {
			period = "<font color='red'>오후</font>";
		}

		// console.log(period);

		document.querySelector(".top-content .project-main h1").innerHTML =
			/*html*/
			`${result.username}님 즐거운 ${period}입니다.😊`;
	}
}

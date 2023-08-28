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

	getUserInfo();
})();

// 로그인 사용자 정보
async function getUserInfo() {
	let url = `http://localhost:8080/member/getUserInfo`;

	// 서버에 데이터를 전송 : fetch(url, options) 
	const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getCookie(
        "token"
      )}`,
    },
  });

	const result = await response.json();

	console.log("getUserInfo");
	console.log(result);
	console.log(result.username);

 	document.querySelector(".profile-username").innerHTML = result.username;

}
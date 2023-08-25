// 웹 페이지 로딩이 완료되면, 페이징으로 데이터 조회 및 화면 display
(() => {
	window.addEventListener("DOMContentLoaded", async () => {

		// request parameter 정보를 가져온다. (URL QueryString)
		const params = new URLSearchParams(window.location.search);

		// 프로젝트 전체 조회(리스트)
		const result = await getProjectList();	

    console.log("*** 2.서버통신 :: 프로젝트 전체 조회(리스트) ***");
    console.log(result);
	});
})();

// 서버통신 :: 프로젝트 전체 조회(리스트) 
async function getProjectList() {
  let url = `http://localhost:8080/project/list-all`;

	// 서버에 데이터를 전송 : fetch(url, options)
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${getCookie("token")}`,
		},
	});

	// 401: 미인증, 403: 미인가(허가없는)
	//  if ([401, 403].includes(response.status)) {
	//   // 로그인 페이지로 튕김
	//   alert("인증처리가 되지 않았습니다.");
	//   window.location.href = "/member/login.html";
	// }

	const result = await response.json();
  const arrayResult = Array.from(result);

  return arrayResult;
}


// 서버통신 :: 내가 참여한 프로젝트 조회(리스트) 
async function getJoinProjects() {
	
	let url = `http://localhost:8080/project/join`;

	// 서버에 데이터를 전송 : fetch(url, options)
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${getCookie("token")}`,
		},
	});

	// 401: 미인증, 403: 미인가(허가없는)
	//  if ([401, 403].includes(response.status)) {
	//   // 로그인 페이지로 튕김
	//   alert("인증처리가 되지 않았습니다.");
	//   window.location.href = "/member/login.html";
	// }

	const result = await response.json();
	console.log("*** debuging data");
	console.log(result);

	const tbody = document.querySelector("tbody");

	// 목록 초기화
	tbody.innerHTML = "";
	// 배열 반복을 해서 tr만든다음에 tbody 가장 마지막 자식에 추가
	for (let item of result) {
		let createdTr = createRow(item);

		// tbody에 tr 추가
		tbody.append(createdTr);

		// Table tr 요소의 클릭 이벤트 핸들러 추가하기
		// createTrEvent(createdTr);
	}
}
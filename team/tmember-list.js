// 웹 페이지 로딩이 완료되면, 팀 멤버 리스트 조회 및 화면 display
(() => {
	window.addEventListener("DOMContentLoaded", () => {

    // // URL의 쿼리 문자열을 가져옵니다.
		// const queryString = window.location.search;

    // // console.log("queryString");
    // // console.log(queryString);

		// // 쿼리 문자열을 파싱하여 폼 데이터 객체로 변환합니다.
		// const formData = {};
		// const params = new URLSearchParams(queryString);
		// for (const [key, value] of params) {      
		// 	formData[key] = value;
		// }

    const params = new URLSearchParams(window.location.search);
    pid = params.get("pid");

    // 프로젝트 정보 조회
		getProject(pid);

    // 팀 멤버 리스트 조회
		getList(pid);

    // project id form 값에 넣어주기
    const form = document.querySelector("form");
    form.querySelector("input[name='pid']").value = pid; 

	});
})();

// 팀원등록 버튼 클릭 : 프로젝트 팀원 등록 페이지 이동
(()=>{
  
  const btnTeamMember = document.querySelector(".button-layer button");

  // 버튼 클릭 이벤트 핸들러
  btnTeamMember.addEventListener("click", async (e) => {
      
		e.preventDefault();

    const form = document.forms[0];

    const pid = form.querySelector("input[name='pid']").value;

    // 프로젝트 팀원 등록 페이지로 이동
		const actionUrl = `http://localhost:5500/team/tmember-create.html?pid=${pid}`;
		window.location.href = actionUrl;

  });

})();

// 데이터 조회(프로젝트 정보)
async function getProject(pid) {
	// alert(pid);

	let url = `http://localhost:8080/project/${pid}`;

	// http 통신을 통해서 데이터 조회 후 응답값 받음
	//  - await 키워드는 async 함수에서만 사용 가능
  const response = await fetch(url, { 
		headers: {
			Authorization: `Bearer ${getCookie("token")}`,
		},
	});
	const result = await response.json();

	console.log("--- debuging getProject result");
	console.log(result);

  // 프로젝트 제목 넣어주기
  document.querySelector("input[name='title']").value = result.data.title;
  
}

// 데이터 조회(팀 멤버 리스트)
async function getList(pid) {

  console.log("pid : "+pid);

  let url = `http://localhost:8080/project/member/list?pid=${pid}`;

  const response = await fetch(url);

  // 401: 미인증, 403: 미인가(허가없는)
  // if ([401, 403].includes(response.status)) {
  //   // 로그인 페이지로 튕김
  //   alert("인증처리가 되지 않았습니다.");
  //   window.location.href = "/login.html";
  // }

  // 결과가 배열
  const result = await response.json();
  console.log(result);

  const tbody = document.querySelector("tbody");

  // 목록 초기화
  tbody.innerHTML = "";
  // 배열 반복을 해서 tr만든다음에 tbody 가장 마지막 자식에 추가
  for (let item of result) {
    let createdTr = createRow(
      item.mid,
      item.username,
      item.email,
    );

    // tbody에 tr 추가
    tbody.append(createdTr);

    // Table tr 요소의 클릭 이벤트 핸들러 추가하기
    createTrEvent(createdTr);

  }

}

// 팀원 정보 테이블 template
function createRow(mid, name, email) {
  // 1. 요소 생성
  const tr = document.createElement("tr");

  // 2. 요소의 속성 설정
  tr.dataset.mid = mid;
  tr.innerHTML = /*html*/ `
  <td>${name}</td>
  <td>${email}</td>  
  `;
  return tr;
}

// Table tr 요소의 클릭 이벤트 핸들러 추가하기
function createTrEvent(createdTr) {

	createdTr.addEventListener("click", (e) => {
		// 기본 제출 동작을 막음.
		e.preventDefault();

		let mid = createdTr.getAttribute("data-mid");

    let pid = document.querySelector("input[name='pid']").value;

    // alert(pid +","+mid);

		// 멤버 수정 페이지로 이동
		const actionUrl = `http://localhost:5500/team/tmember-modify.html?pid=${pid}&mid=${mid}`;
		window.location.href = actionUrl;

	});
}


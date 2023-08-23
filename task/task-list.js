// 웹 페이지 로딩이 완료되면, 팀원정보 데이터 조회 및 화면 display
(() => {
	window.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    pid = params.get("pid");

    // project id form 값에 넣어주기
    const form = document.querySelector("form");
    form.querySelector("input[name='pid']").value = pid; 

    // 프로젝트 정보 조회
		getProject(pid);

    // 프로젝트에 해당하는 Task 정보 조회(list)
		getList(pid);

    // 데이터 조회(팀 멤버 리스트)
    getTeamList(pid);

    
	});
})();

// Task 등록 버튼 클릭 : Task 등록 페이지 이동
(()=>{
  
  const btnTeamMember = document.querySelector(".button-layer button");

  // 버튼 클릭 이벤트 핸들러
  btnTeamMember.addEventListener("click", async (e) => {
      
		e.preventDefault();

    const form = document.forms[0];

    const pid = form.querySelector("input[name='pid']").value;

    // 프로젝트 팀원 등록 페이지로 이동
		const actionUrl = `http://localhost:5500/task/task-create.html?pid=${pid}`;
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
  document.querySelector(".div-desc").innerHTML = "- 프로젝트명 : " + result.data.title;
  
}

// 프로젝트에 해당하는 Task 정보 조회(list) : GET /project/tasks?pid=1
async function getList(pid) {

  console.log("pid : "+pid);

  let url = `http://localhost:8080/project/tasks?pid=${pid}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

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


    let createdTr = createRow(item);

    // tbody에 tr 추가
    tbody.append(createdTr);

    // Table tr 요소의 클릭 이벤트 핸들러 추가하기
    createTrEvent(createdTr);

  }
}

// 데이터 조회(팀 멤버 리스트)
async function getTeamList(pid) {

  console.log("getTeamList pid : "+pid);

  let url = `http://localhost:8080/project/member/list?pid=${pid}`;
  const response = await fetch(url, { 
		headers: {
			Authorization: `Bearer ${getCookie("token")}`,
		},
	});
  
  // 401: 미인증, 403: 미인가(허가없는)
  // if ([401, 403].includes(response.status)) {
  //   // 로그인 페이지로 튕김
  //   alert("인증처리가 되지 않았습니다.");
  //   window.location.href = "/login.html";
  // }

  // 결과가 배열
  const result = await response.json();
  console.log("getTeamList result:");
  console.log(result);

  const divTeamInfo = document.querySelector("#divTeamInfo");

  // 목록 초기화
  divTeamInfo.innerHTML = "";
  let createdTr = "";
  // 배열 반복을 해서 tr만든다음에 tbody 가장 마지막 자식에 추가
  for (let item of result) {
    createdTr = "[NO:"+item.mid+"] "+item.username +" , "+ createdTr;
    // createdTr = item.username;
    console.log(createdTr);
  }
  if(createdTr.length > 0) {
    divTeamInfo.innerHTML = createdTr.slice(0, createdTr.length-3);
    console.log(divTeamInfo.innerHTML);  
  }

}

// Task 정보 테이블 template
function createRow(item) {
  // 1. 요소 생성
  const tr = document.createElement("tr");

  // 시작일,종료일 YYYY-MM-DD 형식으로 변환
  const startDateFormat = dateFormat(new Date(item.startDate)); 
  const endDateFormat = dateFormat(new Date(item.endDate)); 

  // 2. 요소의 속성 설정
  tr.dataset.tid = item.tid;
  tr.innerHTML = /*html*/ `
  <td>${item.title}</td>
  <td>${item.description}</td>  
  <td>${startDateFormat}</td>  
  <td>${endDateFormat}</td>  
  <td>${item.mid}</td>  
  `;
  return tr;
}

// 날짜 포맷 (yyyy-MM-dd)
function dateFormat(date) {
	let resultDateFormat = date.getFullYear() +
		'-' + ((date.getMonth() + 1) < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) +
		'-' + ((date.getDate()) < 9 ? "0" + (date.getDate()) : (date.getDate()));
	return resultDateFormat;
}

// Table tr 요소의 클릭 이벤트 핸들러 추가하기
function createTrEvent(createdTr) {

	createdTr.addEventListener("click", (e) => {
		// 기본 제출 동작을 막음.
		e.preventDefault();

		let tid = createdTr.getAttribute("data-tid");

    let pid = document.querySelector("input[name='pid']").value;

		// 멤버 수정 페이지로 이동
		const actionUrl = `http://localhost:5500/task/task-modify.html?pid=${pid}&tid=${tid}`;
    // alert(actionUrl);

		window.location.href = actionUrl;

	});
}
// 웹 페이지 로딩이 완료되면, 팀원정보 데이터 조회 및 화면 display
(() => {
	window.addEventListener("DOMContentLoaded", () => {

    // URL의 쿼리 문자열을 가져옵니다.
		const queryString = window.location.search;

    // console.log("queryString");
    // console.log(queryString);

		// 쿼리 문자열을 파싱하여 폼 데이터 객체로 변환합니다.
		const formData = {};
		const params = new URLSearchParams(queryString);
		for (const [key, value] of params) {      
			formData[key] = value;
		}

		getList(formData.pid);
	});
})();

// 프로젝트에 해당하는 Task 정보 조회(list)
async function getList(pid) {

  console.log("pid : "+pid);

  let url = `http://localhost:8080/project/tasks/${pid}`;

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
    tbody.append(
      createRow(item)
    );
  }

}

// Task 정보 테이블 template
function createRow(item) {
  // 1. 요소 생성
  const tr = document.createElement("tr");

  // 2. 요소의 속성 설정
  tr.dataset.mid = item.tid;
  tr.innerHTML = /*html*/ `
  <td>${item.title}</td>
  <td>${item.description}</td>  
  <td>${item.startDate}</td>  
  <td>${item.endDate}</td>  
  <td>${item.status}</td>  
  `;
  return tr;
}


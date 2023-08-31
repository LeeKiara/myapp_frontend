(() => {
	const divLeftBox = document.querySelector(".left-box-modify");

	divLeftBox.innerHTML = /*html */ `
	<div class="project-desc">
    <h2>* Project 정보</h2>
    <div class="select-box">
      <select id="projectSelect"></select>
    </div>
  </div>
  `;

  const params = new URLSearchParams(window.location.search);
  pid = params.get("pid");

  // project id form 값에 넣어주기
  // const form = document.querySelector("form");
  // form.querySelector("input[name='pid']").value = pid;

  // 프로젝트 정보 select box에 넣어주기
  putProjectsInSelect(pid);

  const nextpage = window.location.pathname;
  console.log(nextpage);

  // select option 요소의 클릭 이벤트 핸들러 추가하기
  addEventProjectsInSelect(nextpage);

})();

// 프로젝트 정보 리스트 조회하여 select 요소에 값 넣어주기
async function putProjectsInSelect(pid) {

	//-- 서버 호출 1 : 상태값이 진행중
	let url = `http://localhost:8080/project/list-status?status=1`;

	// http 통신을 통해서 데이터 조회 후 응답값 받음
	//  - await 키워드는 async 함수에서만 사용 가능
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${getCookie("token")}`,
		},
	});
	const resultStatus1 = await response.json();

	console.log("--- debuging setProjectList resultStatus1");
	console.log(resultStatus1);

	const arrResultStatus1 = Array.from(resultStatus1);

	//-- 서버 호출 2 : 상태값이 완료
	let url2 = `http://localhost:8080/project/list-status?status=2`;

	// http 통신을 통해서 데이터 조회 후 응답값 받음
	//  - await 키워드는 async 함수에서만 사용 가능
	const response2 = await fetch(url2, {
		headers: {
			Authorization: `Bearer ${getCookie("token")}`,
		},
	});
	const resultStatus2 = await response2.json();
	const arrResultStatus2 = Array.from(resultStatus2);

	console.log("--- debuging setProjectList resultStatus2");
	console.log(resultStatus2);

	//-- 서버 호출 3 : 상태값이 지연
	let url3 = `http://localhost:8080/project/list-status?status=3`;

	// http 통신을 통해서 데이터 조회 후 응답값 받음
	//  - await 키워드는 async 함수에서만 사용 가능
	const response3 = await fetch(url3, {
		headers: {
			Authorization: `Bearer ${getCookie("token")}`,
		},
	});
	const resultStatus3 = await response3.json();
	const arrResultStatus3 = Array.from(resultStatus3);

	console.log("--- debuging setProjectList resultStatus3");
	console.log(resultStatus3);


	//--- HTML 요소 생성 ----------------------------------------------
	// select 요소
	const selectElement = document.querySelector(".select-box select");

	// 초기화
	selectElement.innerHTML = "";

	// select 첫번째 option 추가
	const createElement = document.createElement("option");
	createElement.value = "";
	createElement.innerHTML = `프로젝트를 선택하세요.`;
	selectElement.append(createElement);

	// 상태값 3개에 대한 결과를 select 리스트에 추가
	const statusArray = [1, 2, 3];	// 진행중, 완료, 지연

	for(let statusItem of statusArray) {
		console.log("statusItem");
		console.log(statusItem);

		let data = Array.from(arrResultStatus1);
		// optgroup 요소 생성
		const optgroup = document.createElement("optgroup");

		switch (statusItem) {
			case 1:
				// 2. 요소의 속성 설정
				optgroup.label = `[진행중]`;
				optgroup.className = "highlight";
				selectElement.append(optgroup);
				break;
			case 2:
				optgroup.label = `[완료]`;
				selectElement.append(optgroup);
				optgroup.className = "highlight blue";
				data = Array.from(arrResultStatus2);
				break;		
			case 3:
				optgroup.label = `[지연]`;
				selectElement.append(optgroup);			
				optgroup.className = "highlight red";	
				data = Array.from(arrResultStatus3);
				break;		
			default:
				// data = Array.from(arrResultStatus1);
		}

		// 배열 반복을 해서 option 만든 다음에 optgroup 아래 추가
		// 상태값이 진행중
		for (let item of data) {
			// 요소 생성
			const createElement = document.createElement("option");

			// 2. 요소의 속성 설정
			createElement.value = `${item.pid}`;
			createElement.innerHTML = `${item.title}`;
			createElement.className = "normal";

			// optgroup 아래 추가
			optgroup.append(createElement);
		}
	}

	// 외부 파라메터로 pid가 넘어올 경우, 해당 pid로 select box 선택하기
	if (pid != null) {
		selectElement.value = pid; // 해당 value를 가진 옵션을 선택하도록 설정
	}

	// select option 요소의 클릭 이벤트 핸들러 추가하기
	// createOptionEvent();

	// if(pid > 0) {
	//   getTeamMeberList(pid);
	//   document.querySelector("form[name='team-members']").querySelector("input[name='pid']").value = pid;
	// }
}

// select option 요소의 클릭 이벤트 핸들러 추가하기
function addEventProjectsInSelect(nextpage) {
	// 프로젝트 정보 select box
	const selectElement = document.querySelector(".select-box select");

	selectElement.addEventListener("change", () => {
		let selectPid = 0;

		if (selectElement.value === "") {
			alert("옵션을 선택해주세요."); // 사용자에게 메시지 표시
			selectElement.selectedIndex = -1; // 선택 취소
		} else {
			selectPid = selectElement.value;
			// alert(" select option 요소의 클릭 이벤트 >"+selectPid);
			// window.location.href = "/task/task-list2.html?pid=" + selectPid;
			window.location.href = `${nextpage}?pid=${selectPid}`;
			return;
		}

	});
}
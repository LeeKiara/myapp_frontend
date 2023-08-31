// 웹 페이지 로딩이 완료되면, 팀원정보 데이터 조회 및 화면 display
(() => {
	window.addEventListener("DOMContentLoaded", () => {
		const params = new URLSearchParams(window.location.search);
		pid = params.get("pid");

		// project id form 값에 넣어주기
		const form = document.querySelector("form");
		form.querySelector("input[name='pid']").value = pid;

		// 등록/삭제 버튼 초기화(권한이 있을경우에만 보여주기)
		const buttonLayerDiv = document.querySelector(".button-layer");
		buttonLayerDiv.style.display = "none";

		// 프로젝트 정보 select box에 넣어주기
		setProjectList(pid);

		// select option 요소의 클릭 이벤트 핸들러 추가하기
		addEventForProjects();

		// 프로젝트에 해당하는 Task 정보 조회(list)
		if (pid != null && pid > 0) {

		  // 프로젝트 권한 조회
			getProjectRole(pid);

			// 작업 리스트 조회
			getTaskList(pid);

			// 데이터 조회(팀 멤버 리스트)
			getTeamList(pid);
		}
	});
})();

// 프로젝트 정보 리스트 조회하여 select 요소에 값 넣어주기
async function setProjectList(pid) {

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

// Task 등록 버튼 클릭 : Task 등록 페이지 이동
(() => {
	const btnTeamMember = document.querySelector(".button-layer button");

	// 버튼 클릭 이벤트 핸들러
	btnTeamMember.addEventListener("click", async (e) => {
		e.preventDefault();

		const form = document.forms[0];

		const pid = form.querySelector("input[name='pid']").value;

		if (pid != null && pid > 0) {
			// 프로젝트 팀원 등록 페이지로 이동
			const actionUrl = `http://localhost:5500/task/task-create.html?pid=${pid}`;
			window.location.href = actionUrl;
		} else {
			alert("프로젝트를 선택하세요.");
			return;
		}
	});
})();

// Task 삭제 버튼 클릭 :
(() => {
	const btnDeleteTasks = document.querySelector(
		".button-layer button:nth-of-type(2)"
	);

	if (btnDeleteTasks === null) {
		alert("삭제 대상이 없습니다.");
		return;
	}

	// 버튼 클릭 이벤트 핸들러
	btnDeleteTasks.addEventListener("click", async (e) => {
		if (!confirm("삭제 하시겠습니까?")) {
			return;
		}

		e.preventDefault();

		const checkboxes = document.querySelectorAll(
			"input[type=checkbox]:checked"
		);
		const valuesToSend = [];

		checkboxes.forEach((checkbox) => {
			valuesToSend.push(checkbox.value);
			// alert(checkbox.value);
		});

		let url = `http://localhost:8080/project/task/remove`;

		// http 통신을 통해서 데이터 조회 후 응답값 받음
		//  - await 키워드는 async 함수에서만 사용 가능
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(valuesToSend),
		});
		// alert(response.status);

		if ([200].includes(response.status)) {
			alert("삭제되었습니다.");
			window.location.reload();
		} else {
			alert("삭제처리가 실패되었습니다. 시스템 담당자에게 문의하세요.");
		}
		// const result = await response.json();
	});
})();

// select option 요소의 클릭 이벤트 핸들러 추가하기
function addEventForProjects() {
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
			window.location.href = "/task/task-list.html?pid=" + selectPid;
			return;
		}

		// alert("this..");

		// if(selectPid > 0) {
		//   getTeamMeberList(selectPid);
		// }
	});
}
// 데이터 조회(프로젝트 권한 정보)
async function getProjectRole(pid) {
	// alert(pid);

	let url = `http://localhost:8080/project/${pid}/role`;

	// http 통신을 통해서 데이터 조회 후 응답값 받음
	//  - await 키워드는 async 함수에서만 사용 가능
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${getCookie("token")}`,
		},
	});
	const result = await response.json();

	console.log("--- debuging getProjectRole result");
	console.log(result);

	// Task 등록/수정 권한 체크
	// 해당 유저가 팀 멤버에 등록되어 있을 경우에만, 수정/삭제할 수 있도록 버튼처리 함
	const buttonLayerDiv = document.querySelector(".button-layer");
	if (result["role-task"] != "R") {
		buttonLayerDiv.style.display = "";
	} else {
		buttonLayerDiv.style.display = "none";
	}

	// 프로젝트 제목 넣어주기
	// document.querySelector(".div-desc").innerHTML =
	// 	"- 프로젝트명 : " + result.data.title;
}

// 프로젝트에 해당하는 Task 정보 조회(list) : GET /project/tasks?pid=1
async function getTaskList(pid) {
	console.log("pid : " + pid);

	if (pid === null || (pid != null && pid < 1)) {
		return;
	}

	let url = `http://localhost:8080/project/tasks-member?pid=${pid}`;

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
	console.log("getTaskList result>>>>>>>>");
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
		//createTrEvent(createdTr);
	}

	// Table tr요소, checkbok 요소 이벤트 핸들러 추가하기
	createTableBody();
}

// 데이터 조회(팀 멤버 리스트)
async function getTeamList(pid) {
	console.log("getTeamList pid : " + pid);

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
		const subdiv = document.createElement("div");

		subdiv.innerHTML = /*html*/ `
		<div><img src="/image/profile.png" width="40px" /></div>
		<div>${item.mname}</div>
    `;

		divTeamInfo.prepend(subdiv);
	}
}

// Task 정보 테이블 template
function createRow(item) {
	// 1. 요소 생성
	const tr = document.createElement("tr");

	// 시작일,종료일 YYYY-MM-DD 형식으로 변환
	const startDateFormat = dateFormat(new Date(item.startDate));
	const endDateFormat = dateFormat(new Date(item.endDate));

	let statusName = "";
	if(item.status === "1") {
		statusName = "진행중";
	} else if (item.status === "2") {
		statusName = "완료";
	} else if (item.status === "3") {
		statusName = "지연";
	}
	// 2. 요소의 속성 설정
	tr.dataset.tid = item.tid;
	tr.innerHTML = /*html*/ `
  <td><input type="checkbox" value="${item.tid}"></td>
  <td>${item.title}</td>
  <!--<td>${item.description}</td>--> 
  <td>${startDateFormat}</td>  
  <td>${endDateFormat}</td>  
  <td>${item.mname}</td>  
  <td>${statusName}</td>  
  `;
	return tr;
}

// Table tr요소, checkbok 요소 이벤트 핸들러 추가하기
function createTableBody() {
	const tableBody = document.querySelector("tbody");

	tableBody.addEventListener("click", (event) => {
		const clickedElement = event.target;
		const trElement = clickedElement.closest("td");
		const tid = trElement.getAttribute("data-tid");
		const pid = document.querySelector("input[name='pid']").value;

		if (
			clickedElement.tagName === "INPUT" &&
			clickedElement.type === "checkbox"
		) {
			// alert(`Checkbox with value ${tid} clicked.`);
			// 여기에 체크박스 클릭 이벤트에 대한 처리 코드를 추가하면 됩니다.
		} else {
			// alert(`Non Checkbox with value ${tid} clicked.`);

			// 멤버 수정 페이지로 이동
			const actionUrl = `http://localhost:5500/task/task-modify.html?pid=${pid}&tid=${tid}`;
			// alert(actionUrl);

			window.location.href = actionUrl;
		}
	});
}

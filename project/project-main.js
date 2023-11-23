let currentPage = 0; // 현재 페이지 번호
let isLastPage = false; // 마지막 페이지 인지 여부
const PAGE_SIZE = 6; // 고정된 페이지 사이즈
let currentQuery = ""; // 현재 검색 키워드

// 웹 페이지 로딩이 완료되면, 페이징으로 데이터 조회 및 화면 display
(() => {
	window.addEventListener("DOMContentLoaded", () => {
		// request parameter 정보를 가져온다. (URL QueryString)
		const params = new URLSearchParams(window.location.search);

		// url에 myproject 파라메터를 넘겨주면 내 프로젝트 내용 display
		if (params.get("search")) {
			// 내가 생성한 프로젝트 조회
			getPagedList(0, "myproject");

			// 내가 참여한 프로젝트 조회
			getJoinProjects();
		} else {
			// 전체 프로젝트 조회
			getPagedList(0);
		}
	});
})();

// 이전/다음 페이징
(() => {
	const buttons = document.forms[0].querySelectorAll("button");
	const btnPrev = buttons[0];
	const btnNext = buttons[1];

	// const btnPrev = document.getElementById("btnPrev");
	// const btnNext = document.getElementById("btnNext");

	// 이전 버튼
	btnPrev.addEventListener("click", (e) => {
		e.preventDefault();

		// alert("이전 페이지 조회 currentPage>"+currentPage);

		currentPage > 0 && getPagedList(currentPage - 1, "");
	});

	// 다음 버튼
	btnNext.addEventListener("click", (e) => {
		e.preventDefault();

		// alert("다음 페이지 조회 currentPage>"+currentPage);

		// 페이징 처리(현재페이지, 검색어)
		getPagedList(currentPage + 1, "");
	});
})();

// 전체 프로젝트 조회
async function getPagedList(page, query) {
	let url = `${apiUrl()}/project/paging?page=${page}&size=${PAGE_SIZE}`;

	// 검색 조건이 있으면...
	if (query) {
		url = `${apiUrl()}/project/paging/myproject?page=${page}&size=${PAGE_SIZE}`;
	}

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
	// console.log(result);

	// 응답값 객체를 배열로 전환
	const data = Array.from(result.content);

	// console.log("--- debuging data");
	// console.log(data);

	// 화면 dispaly
	const divContent = document.getElementById("card-layout");
	divContent.innerHTML = ""; // div clear

	// 요소 속성 설정하기
	data
		.sort((a, b) => a.pid - b.pid)
		.forEach((item) => {
			// console.log("--- debuging item");
			// console.log(item);

			// 프로젝트 정보 card layout tag 생성
			const template = cardTemplate(item);
			// console.log("--- debuging template");
			// console.log(template);

			divContent.insertAdjacentHTML("afterbegin", template);

			// 프로젝트 클릭 이벤트 핸들러 추가하기
			createDivEvent(divContent);
		});

	currentPage = result.number; // 현재 페이지 설정
	isLastPage = result.last; // 마지막 페이지 여부

	// 이전/다음 버튼 활성화 여부 처리
	setBtnActive();

	// 검색 조건이 있으면...
	if (query) {
		document.querySelector("form h1").innerHTML = "내 프로젝트";
	}
}

// 데이터 조회(내가 참여한 프로젝트)
async function getJoinProjects() {
	let url = `${apiUrl()}/project/join`;

	// 서버에 데이터를 전송 : fetch(url, options)
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${getCookie("token")}`,
		},
	});

	const result = await response.json();
	console.log("*** getJoinProjects data");
	console.log(result);

	// 응답값 객체를 배열로 전환 (Sort 기능을 사용하기 위함)
	const data = Array.from(result);

	const targetbody = document.querySelector("tbody");

	// 목록 초기화
	targetbody.innerHTML = "";

	if (result.length > 0) {
		// 배열 반복을 해서 tr만든다음에 tbody 가장 마지막 자식에 추가
		data
			.sort((a, b) => b.pid - a.pid)
			.forEach((item) => {
				let createdEle = createRow(item);

				// targetbody에 tr 요소 추가
				targetbody.append(createdEle);
			});

		// 내가 참여한 프로젝트 Table tr요소 이벤트 핸들러 추가하기
		createTableBody();
	} else {
		const tr = document.createElement("tr");

		tr.innerHTML = /*html*/ `
		<td colspan="3">** 아직 참여중인 프로젝트가 없습니다.</td>
  	`;

		targetbody.append(tr);
	}

	// 내가 참여한 프로젝트 조회 layer 보이기
	const secondLeftBox = document.querySelector("#left-box-second");
	secondLeftBox.hidden = false;
}

// 프로젝트 정보 card layout tag 생성
function cardTemplate(item) {
	let projectDesc = item.description;

	if (projectDesc.length > 20) {
		projectDesc = projectDesc.slice(0, 17) + "...";
	}

	const template = /*html*/ `
  <div id="card-layout-item" class="item">    
      <ul data-no='${item.pid}' >
        <li>      
        ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ""}
        </li>
        <li>${item.title}</li>
        <li>${projectDesc}</li>        
      </ul>
  </div>
  `;

	return template;
}

// 프로젝트 클릭 이벤트 핸들러 추가하기
function createDivEvent(divContent) {
	const divItem = divContent.querySelector("div");
	// document.getElementById("card-layout-item");

	divItem.addEventListener("click", (e) => {
		const divItemDataNo = divItem.querySelector("ul").getAttribute("data-no");
		// alert(divItemDataNo);

		// 기본 제출 동작을 막음.
		e.preventDefault();

		// 이전 페이지에서 폼 데이터를 가져오거나 생성합니다.
		const formData = {
			pid: divItemDataNo,
		};

		// 폼 데이터를 쿼리 문자열로 변환합니다.
		const queryStr = new URLSearchParams(formData).toString();

		// 프로젝트 수정 페이지로 이동
		const actionUrl = `/project/project-modify.html?${queryStr}`;
		window.location.href = actionUrl;
		// const newWindow = window.open(actionUrl, "_blank");
	});
}

// 이전/다음 버튼 활성화 여부 처리
function setBtnActive() {
	const buttons = document.forms[0].querySelectorAll("button");
	const btnPrev = buttons[0];
	const btnNext = buttons[1];

	console.log("--- debuging currentPage, isLastPage");
	console.log(currentPage + "," + isLastPage);

	// 첫번째 페이지이면 이전 버튼 비활성화
	if (currentPage === 0) {
		btnPrev.disbled = true;
	} else {
		btnPrev.disbled = false;
	}

	// 마지막 페이지이면 다음 버튼 비활성화
	if (isLastPage) {
		btnNext.disbled = true;
	} else {
		btnNext.disbled = false;
	}
}

// 내가 참여한 프로젝트 정보 template
function createRow(item) {
	// 1. 요소 생성
	const tr = document.createElement("tr");

	let statusName = "";
	let stausColor = "status-color-1";
	let stausTitleColor = "rgb(194, 135, 9);";

	if (item.status === "1") {
		statusName = "진행중";
	} else if (item.status === "2") {
		statusName = "완료";
		stausColor = "status-color-2";
		stausTitleColor = "rgb(20, 109, 156)";
	} else if (item.status === "3") {
		statusName = "지연";
		stausColor = "status-color-3";
		stausTitleColor = "rgb(119, 37, 167);";
	}

	// 2. 요소의 속성 설정
	tr.dataset.pid = item.pid;
	tr.innerHTML = /*html*/ `
	<td>
		<div class="status-layout ${stausColor}"><span style="color:${stausTitleColor}">●</span> <span>${statusName}</span></div>
	</td>
	<td> ${item.image ? `<img src="${item.image}">` : ""}</td>
  <td>${item.title}</td>
  `;
	return tr;
}

// 내가 참여한 프로젝트 Table tr요소 이벤트 핸들러 추가하기
function createTableBody() {
	const tableBody = document.querySelector("tbody");

	tableBody.addEventListener("click", (event) => {
		const clickedElement = event.target;
		const trElement = clickedElement.closest("tr");
		const pid = trElement.getAttribute("data-pid");

		// console.log("trElement==>");
		// console.log(trElement);
		// console.log(pid);

		if (pid != null && pid > 0) {
			// 프로젝트 수정 페이지로 이동
			const actionUrl = `/task/task-list.html?pid=${pid}`;
			window.location.href = actionUrl;
		}
	});
}

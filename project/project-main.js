let currentPage = 0; // 현재 페이지 번호
let isLastPage = false; // 마지막 페이지 인지 여부
const PAGE_SIZE = 6; // 고정된 페이지 사이즈
let currentQuery = ""; // 현재 검색 키워드

// 웹 페이지 로딩이 완료되면, 페이징으로 데이터 조회 및 화면 display
(() => {
	window.addEventListener("DOMContentLoaded", () => {
		// request parameter 정보를 가져온다. (URL QueryString)
		const params = new URLSearchParams(window.location.search);
		if (params.get("search")) {
			getPagedList(0, "myproject");
		} else {
			getPagedList(0);
		}

		// getJoinProjects();
	});
})();

// 이전/다음 페이징
(() => {
	// const buttons =
	// document.forms[1].querySelectorAll("button");
	// const btnPrev = buttons[0];
	// const btnNext = buttons[1];

	const btnPrev = document.getElementById("btnPrev");
	const btnNext = document.getElementById("btnNext");

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

// 데이터 조회(페이징 처리)
async function getPagedList(page, query) {
	let url = `http://localhost:8080/project/paging?page=${page}&size=${PAGE_SIZE}`;

	// 검색 조건이 있으면...
	if (query) {
		url = `http://localhost:8080/project/paging/myproject?page=${page}&size=${PAGE_SIZE}`;
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

			const template = cardTemplate(item);
			// console.log("--- debuging template");
			// console.log(template);

			divContent.insertAdjacentHTML("afterbegin", template);

			// div 클릭 이벤트 핸들러 추가하기
			createDivEvent(divContent);
		});

	currentPage = result.number; // 현재 페이지 설정
	isLastPage = result.last; // 마지막 페이지 여부

	// console.log("--- debuging currentPage, isLastPage");
	// console.log(currentPage + "," + isLastPage);

	// 이전/다음 버튼 활성화 여부 처리
	setBtnActive();

	// 검색 조건이 있으면...
	if (query) {
		document.querySelector("form h1").innerHTML = "내 프로젝트";
	}
}

// 데이터 조회(내가 참여한 프로젝트)
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

function cardTemplate(item) {
	const template = /*html*/ `
  <div id="card-layout-item" class="item">    
      <ul data-no='${item.pid}'>
        <li>      
        ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ""}
        </li>
        <li>${item.title}</li>
        <li>${item.description}</li>
      </ul>
  </div>
  `;

	return template;
}

// div 클릭 이벤트 핸들러 추가하기
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
		const actionUrl = `http://localhost:5500/project/project-modify.html?${queryStr}`;
		window.location.href = actionUrl;
		// const newWindow = window.open(actionUrl, "_blank");
	});
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
  <td>${item.status}</td>  
  `;
	return tr;
}

// 이전/다음 버튼 활성화 여부 처리
function setBtnActive() {
	const btnPrev = document.getElementById("btnPrev");
	const btnNext = document.getElementById("btnNext");

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

// 날짜 포맷 (yyyy-MM-dd)
function dateFormat(date) {
	let resultDateFormat =
		date.getFullYear() +
		"-" +
		(date.getMonth() + 1 < 9
			? "0" + (date.getMonth() + 1)
			: date.getMonth() + 1) +
		"-" +
		(date.getDate() < 9 ? "0" + date.getDate() : date.getDate());
	return resultDateFormat;
}

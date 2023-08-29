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
			getPagedList(0, "myproject");

			// 내가 참여한 프로젝트 조회
			getJoinProjects();

			// ul li 요소의 클릭 이벤트 핸들러 추가하기
			joinProjectsEvent();
		} else {
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

	const result = await response.json();
	console.log("*** getJoinProjects data");
	console.log(result);

	const targetbody = document
		.querySelector(".joinProjects")
		.querySelector("ul");

	console.log(targetbody);

	// 목록 초기화
	targetbody.innerHTML = "";

	if (result.length > 0) {
		// 배열 반복을 해서 tr만든다음에 tbody 가장 마지막 자식에 추가
		for (let item of result) {
			let createdEle = createRow(item);

			// targetbody li 요소 추가
			targetbody.append(createdEle);

			// targetbody li 요소의 클릭 이벤트 핸들러 추가하기
			// createEleEvent(createdEle);
		}
	} else {
		targetbody.append("** 아직 참여중인 프로젝트가 없습니다.");
	}

	// 내가 참여한 프로젝트 조회 layer 보이기
	const secondLeftBox = document.querySelector("#left-box-second");
	secondLeftBox.hidden = false;
}

// 내가 참여한 프로젝트 정보 template
function createRow(item) {
	// 1. 요소 생성
	const li = document.createElement("li");

	// console.log(item.image);

	// 2. 요소의 속성 설정
	li.dataset.tid = item.tid;
	li.innerHTML = /*html*/ `    
  <div> ${
		item.image ? `<img src="${item.image}" class="joinProjects">` : ""
	}</div>
  <div>${item.title}</div>
  `;
	return li;

	// <div><img src="/image/profile.png" width="40px"></div>
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

// 내가 참여한 프로젝트 리스트의 클릭 이벤트 핸들러 추가하기
function joinProjectsEvent() {
	const li = document.querySelector("ul");
	// document.getElementById("card-layout-item");

	li.addEventListener("click", (e) => {
		const datano = document.querySelector("ul").getAttribute("data-no");
		// alert(datano);

		// 기본 제출 동작을 막음.
		e.preventDefault();

		// 프로젝트 수정 페이지로 이동
		const actionUrl = `http://localhost:5500/task/task-list.html?pid=${datano}`;
		window.location.href = actionUrl;
		// const newWindow = window.open(actionUrl, "_blank");
	});
}

// // 날짜 포맷 (yyyy-MM-dd)
// function dateFormat(date) {
// 	let resultDateFormat =
// 		date.getFullYear() +
// 		"-" +
// 		(date.getMonth() + 1 < 9
// 			? "0" + (date.getMonth() + 1)
// 			: date.getMonth() + 1) +
// 		"-" +
// 		(date.getDate() < 9 ? "0" + date.getDate() : date.getDate());
// 	return resultDateFormat;
// }

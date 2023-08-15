let currentPage = 0; // 현재 페이지 번호
let isLastPage = false; // 마지막 페이지 인지 여부
const PAGE_SIZE = 6; // 고정된 페이지 사이즈
let currentQuery = ""; // 현재 검색 키워드

function cardTemplate(item) {
	const template = /*html*/ `
  <div id="card-layout-item" class="item">    
      <ul data-no='${item.projectid}'>
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

// 데이터 조회(페이징 처리)
async function getPagedList(page, query) {
	let url = `http://localhost:8080/project/paging?page=${page}&size=${PAGE_SIZE}`;

	// 검색 조건이 있으면...
	if (query) {
	}

	// http 통신을 통해서 데이터 조회 후 응답값 받음
	//  - await 키워드는 async 함수에서만 사용 가능
	const response = await fetch(url);
	const result = await response.json();

	console.log("--- debuging result");
	console.log(result);

	// 응답값 객체를 배열로 전환
	const data = Array.from(result.content);

	console.log("--- debuging data");
	console.log(data);

	// 화면 dispaly
	const divContent = document.getElementById("card-layout");
	divContent.innerHTML = ""; // div clear

	// 요소 속성 설정하기
	data
		.sort((a, b) => a.projectid - b.projectid)
		.forEach((item) => {
			// console.log("--- debuging item");
			// console.log(item);

			const template = cardTemplate(item);
			console.log("--- debuging template");
			console.log(template);

			divContent.insertAdjacentHTML("afterbegin", template);

			// div 클릭 이벤트 핸들러 추가하기
			createDivEvent(divContent);
		});

	currentPage = result.number; // 현재 페이지 설정
	isLastPage = result.last; // 마지막 페이지 여부

	console.log("--- debuging currentPage, isLastPage");
	console.log(currentPage + "," + isLastPage);

	// 이전/다음 버튼 활성화 여부 처리
	setBtnActive();
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
			projectid: divItemDataNo,
		};

		// 폼 데이터를 쿼리 문자열로 변환합니다.
		const queryStr = new URLSearchParams(formData).toString();

		// 새 창을 엽니다.
		const actionUrl = `http://localhost:5500/project/project-modify.html?${queryStr}`;
		window.location.href = actionUrl;
		// const newWindow = window.open(actionUrl, "_blank");
	});
}

// 웹 페이지 로딩이 완료되면, 페이징으로 데이터 조회 및 화면 display
(() => {
	window.addEventListener("DOMContentLoaded", () => {
		getPagedList(0);
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

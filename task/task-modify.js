// 웹 페이지 로딩이 완료되면, 프로젝트 정보 조회
(() => {
	window.addEventListener("DOMContentLoaded", () => {
		// URL의 쿼리 문자열을 가져옵니다.
		const queryString = window.location.search;

		// console.log(`queryString = ${queryString}`);

		// 쿼리 문자열을 파싱하여 폼 데이터 객체로 변환합니다.
		const formData = {};
		const params = new URLSearchParams(queryString);
		for (const [key, value] of params) {
			formData[key] = value;
		}

		// alert(formData.pid+","+formData.tid);

		// 폼 데이터를 사용하여 프로젝트 정보 조회
		getProject(formData.pid);

		// Task 정보 조회
		getTask(formData.tid);
	});
})();

// Task 정보 수정
(() => {
	const btnSave = document.querySelector("article").querySelector("button");

	btnSave.addEventListener("click", async (e) => {
		e.preventDefault();

		const pid = document.querySelector("input[name='pid']").value; // projectid
		const tid = document.querySelector("input[name='tid']").value; // task id
		const title = document.querySelector("input[name='title']").value;
		const description = document.querySelector("textarea").value;
		const startDate = document.querySelector("input[name='start-date']").value;
		const endDate = document.querySelector("input[name='end-date']").value;
		const status = document.querySelector("input[name='status']:checked").value;

		console.log("----debug---");
		console.log("pid:" + pid + ", tid:" + tid);
		console.log("title:" + title);
		console.log("description:" + description);
		console.log("startDate:" + startDate);
		console.log("endDate:" + endDate);
		console.log("status:" + status);

		if (title === "") {
			alert("Task명을 입력해주세요.");
			return;
		}

		if (description === "") {
			alert("Task에 대한 소개를 입력해주세요.");
			return;
		}

		if (startDate === "") {
			alert("시작일을 선택해주세요.");
			return;
		}

		if (endDate === "") {
			alert("종료일을 선택해주세요.");
			return;
		}

		// Task 정보 수정(DB : update)
		// PUT /project/task/{tid}
		const response = await fetch(`http://localhost:8080/project/task/${tid}`, {
			// HTTP Method
			method: "PUT",
			// 보낼 데이터 형식은 json
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${getCookie("token")}`,
			},
			body: JSON.stringify({
				title,
				description,
				startDate,
				endDate,
				status,
			}),
		});

		// 서버에서 response 받기
		const result = await response.json();

		console.log("----debug---");
		console.log("result" + result);
		console.log("response.status:" + response.status);

		if ([200].includes(response.status)) {
			alert("Task가 수정 되었습니다.");
			// Task 현황 페이지로 이동
			window.location.href = `/task/task-list.html?pid=${pid}`;
		}
	});
})();

// Task 정보 삭제
(() => {
	const btnRemove = document
		.querySelector("article")
		.querySelector("button:nth-of-type(2)");

	// 삭제 버튼 클릭
	btnRemove.addEventListener("click", async (e) => {
		e.preventDefault();

		const pid = document.querySelector("input[name='pid']").value; // projectid
		const tid = document.querySelector("input[name='tid']").value; // task id

		// Task 정보 삭제(DB : delete)
		// DELETE /project/task/{tid}
		const response = await fetch(`http://localhost:8080/project/task/${tid}`, {
			// HTTP Method
			method: "DELETE",
			// 보낼 데이터 형식은 json
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${getCookie("token")}`,
			},
		});

		console.log("----debug---");
		console.log("response.status:" + response.status);

		if ([200].includes(response.status)) {
			alert("Task가 삭제 되었습니다.");
			// Task 현황 페이지로 이동
			window.location.href = `/task/task-list.html?pid=${pid}`;
		}
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

	console.log("--- debuging result");
	console.log(result);

	document.querySelector("input[name='project-title']").value =
		result.data.title; // project title
	document.querySelector("input[name='pid']").value = result.data.pid; // pid
	document.querySelector("input[name='project-status']").value =
		result.data.status; // project 상태

	document.querySelector("input[name='project-title']").readOnly = true;
}

// 데이터 조회(Task 정보)
async function getTask(tid) {
	let url = `http://localhost:8080/project/task?tid=${tid}`;

	// http 통신을 통해서 데이터 조회 후 응답값 받음
	//  - await 키워드는 async 함수에서만 사용 가능
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${getCookie("token")}`,
		},
	});

	const result = await response.json();

	console.log("--- getTask result");
	console.log(result);

	// 화면 dispaly
	const form = document.forms[0];

	form.querySelector("input[name='title']").value = result.data.title; // 제목
	form.querySelector("textarea").value = result.data.description; // 설명

	// 시작일
	const startDateInput = document.getElementById("startDateInput");
	startDateInput.value = dateFormat(new Date(result.data.startDate)); // YYYY-MM-DD 형식으로 변환

	// 종료일
	const endDateInput = document.getElementById("endDateInput");
	endDateInput.value = dateFormat(new Date(result.data.endDate)); // YYYY-MM-DD 형식으로 변환

	// 상태
	setRadioButton(result.data.status);

	form.querySelector("input[name='tid']").value = result.data.tid; // tid

	// 내 프로젝트만 수정/삭제할 수 있도록 버튼처리 함
	const buttonLayerDiv = document.querySelector(".button-layer");
	if (result.role === "modify") {
		buttonLayerDiv.style.display = "";
	} else {
		buttonLayerDiv.style.display = "none";
	}
}

function setRadioButton(selectedValue) {
	// 외부 변수로 받은 값을 저장합니다.
	// var selectedValue = "20"; // 원하는 value 값

	// CSS 선택자를 사용하여 원하는 value 값과 일치하는 라디오 버튼을 선택합니다.
	var selectedRadioButton = document.querySelector(
		'input[name="status"][value="' + selectedValue + '"]'
	);

	// 선택된 라디오 버튼을 체크합니다.
	if (selectedRadioButton) {
		selectedRadioButton.checked = true;
	}
}
// // 날짜 포맷 (yyyy-MM-dd)
// function dateFormat(date) {
// 	let resultDateFormat =
// 		date.getFullYear() +
// 		"-" +
// 		(date.getMonth() + 1 < 10
// 			? "0" + (date.getMonth() + 1)
// 			: date.getMonth() + 1) +
// 		"-" +
// 		(date.getDate() < 9 ? "0" + date.getDate() : date.getDate());
// 	return resultDateFormat;
// }

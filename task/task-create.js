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

		// 폼 데이터를 사용하여 프로젝트 정보 조회
		// alert(formData.pid);
		getProject(formData.pid);
	});
})();

// Task 정보 등록
(() => {
	const btnSave = document.querySelector("article").querySelector("button");

	btnSave.addEventListener("click", async (e) => {
		e.preventDefault();

		const pid = document.querySelector("input[name='pid']").value; // projectid
		const title = document.querySelector("input[name='title']").value;
		const description = document.querySelector("textarea").value;
		const startDate = document.querySelector("input[name='start-date']").value;
		const endDate = document.querySelector("input[name='end-date']").value;

		console.log("----debug---");
		console.log("title:" + title);
		console.log("description:" + description);
		console.log("startDate:" + startDate);
		console.log("endDate:" + endDate);

		if (title === "") {
			alert("작업명을 입력해주세요.");
			return;
		}

		if (description === "") {
			alert("작업 대한 소개를 입력해주세요.");
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

		// Task 생성을 위해 서버로 Http 요청 - fetch : url, option
		const response = await fetch(`http://localhost:8080/project/${pid}/task`, {
			// HTTP Method
			method: "POST",
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
			}),
		});

		// 서버에서 response 받기
		const result = await response.json();

		console.log("----debug---");
		console.log("result" + result);
		console.log("response.status:" + response.status);

		if ([201].includes(response.status)) {
			// alert("작업이 등록되었습니다.");
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

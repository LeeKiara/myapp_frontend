// 웹 페이지 로딩이 완료되면, 데이터 조회 및 화면 display
(() => {
	window.addEventListener("DOMContentLoaded", () => {
		// URL의 쿼리 문자열을 가져옵니다.
		const queryString = window.location.search;

		// 쿼리 문자열을 파싱하여 폼 데이터 객체로 변환합니다.
		const formData = {};
		const params = new URLSearchParams(queryString);
		for (const [key, value] of params) {
			formData[key] = value;
		}

		// 폼 데이터를 사용하여 프로젝트 정보 조회
		// alert(formData.projectid);
		getProject(formData.projectid);

		// 이미지 파일 선택 후 div에 선택된 이미지 보여주기
		loadImage();
	});
})();

// 데이터 조회(프로젝트 정보)
async function getProject(projectid) {
	// alert(projectid);

	let url = `http://localhost:8080/project/${projectid}`;

	// http 통신을 통해서 데이터 조회 후 응답값 받음
	//  - await 키워드는 async 함수에서만 사용 가능
	const response = await fetch(url);
	const result = await response.json();

	console.log("--- debuging result");
	console.log(result);

	// 화면 dispaly
	const form = document.forms[0];

	form.querySelector("input").value = result.data.title; // 제목
	form.querySelector("textarea").value = result.data.description; // 설명

	// 시작일
	const startDateInput = document.getElementById("startDateInput");
	startDateInput.value = new Date(result.data.startDate)
		.toISOString()
		.slice(0, 10); // YYYY-MM-DD 형식으로 변환

	// 종료일
	const endDateInput = document.getElementById("endDateInput");
	endDateInput.value = new Date(result.data.endDate).toISOString().slice(0, 10); // YYYY-MM-DD 형식으로 변환

	// 이미지 표시
	createImage(result.data.image);

	form.querySelector("input[name='projectid']").value = result.data.projectid; // projectid
	form.querySelector("input[name='status']").value = result.data.status; // project 상태
}

function createImage(image) {
	// console.log(image);

	const template = /*html*/ `
  ${image ? `<img src="${image}">` : ""}`;

	const divProjectImage = document.getElementById("project-image");

	divProjectImage.insertAdjacentHTML("afterbegin", template);

	return divProjectImage;
}

// 이미지 파일 선택 후 div에 선택된 이미지 보여주기
function loadImage() {
	const inputFile = document.querySelector("input[type='file']");
	const projectImageDiv = document.getElementById("project-image");

	// 파일이 변경되는 이벤트가 발생이 되면...
	inputFile.addEventListener("change", (e) => {
		const selectedFile = e.target.files[0];

		// 선택된 파일이 있으면
		if (selectedFile) {
			// 기존에 표시된 이미지 clear
			projectImageDiv.innerHTML = "";

			const reader = new FileReader();

			reader.addEventListener("load", (e) => {
				// console.log(e);
				// file -> base64 data-url
				const image = e.target.result;

				// div 요소에 이미지 내용 삽입
				createImage(image);
			});
			// 파일을 dataURL(base64)로 읽음
			reader.readAsDataURL(selectedFile);
		}
	});
}

// 프로젝트 정보 수정(서버로 요청)
(() => {
	const btnSave = document.querySelector("article button");

	btnSave.addEventListener("click", async (e) => {
		e.preventDefault();

		const form = document.forms[0];

		const title = form.querySelector("input[name='title']").value;
		const description = form.querySelector(
			"textarea[name='description']"
		).value;
		const startDate = form.querySelector("input[name='start-date']").value;
		const endDate = form.querySelector("input[name='end-date']").value;
		const projectid = form.querySelector("input[name='projectid']").value;
		const status = form.querySelector("input[name='status']").value;

		const file = form.querySelector("input[name='image-file']");

		console.log("----debug---");
		console.log("title:" + title);
		console.log("description:" + description);
		console.log("startDate:" + startDate);
		console.log("endDate:" + endDate);
		console.log("projectid:" + projectid);
		console.log("status:" + status);

		if (title === "") {
			alert("프로젝트명을 입력해주세요.");
			return;
		}

		if (description === "") {
			alert("프로젝트 소개를 입력해주세요.");
			return;
		}

		if (startDate === "") {
			alert("시작일을 입력해주세요.");
			return;
		}

		if (endDate === "") {
			alert("종료일을 입력해주세요.");
			return;
		}

		if (file.files[0]) {
			// 파일이 있을 때
			const reader = new FileReader();
			// reader로 파일을 읽기가 완료되면 실행되면 이벤트 핸들러 함수
			reader.addEventListener("load", async (e) => {
				console.log(e);
				// file -> base64 data-url
				const image = e.target.result;
				modifyProject(projectid, image);
			});
			// 파일을 dataURL(base64)로 읽음
			reader.readAsDataURL(file.files[0]);
		} else {
			// 파일이 없을 때
			modifyProject(projectid);
		}

		// 데이터를 서버에 전송, 결과값으로 UI요소 생성
		async function modifyProject(projectid, image) {
			console.log(image);

			// 서버에 Http 요청 (프로젝트 수정)
			// fetch : url, option
			const response = await fetch(
				`http://localhost:8080/project/${projectid}`,
				{
					// HTTP Method
					method: "PUT",
					// 보낼 데이터 형식은 json
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						title,
						description,
						startDate,
						endDate,
						image: image ? image : null,
						status,
					}),
				}
			);

			console.log(response.status);

			if ([200].includes(response.status)) {
				alert("프로젝트가 수정되었습니다.");
			}
		}
	});
})();

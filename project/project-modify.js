// 웹 페이지 로딩이 완료되면, 데이터 조회 및 화면 display
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

		// 프로젝트 정보 조회
		// alert(formData.pid);
		getProject(formData.pid);

		// 이미지 파일 선택 후 div에 선택된 이미지 보여주기
		loadImage();
	});
})();

// 프로젝트 정보 수정(서버로 요청)
(() => {
	const btnSave = document.querySelector("article button:nth-of-type(1)");

	btnSave.addEventListener("click", async (e) => {
		e.preventDefault();

		const form = document.forms[0];

		const pid = form.querySelector("input[name='pid']").value;
		const title = form.querySelector("input[name='title']").value;
		const description = form.querySelector(
			"textarea[name='description']"
		).value;
		const startDate = form.querySelector("input[name='start-date']").value;
		const endDate = form.querySelector("input[name='end-date']").value;
		const status = document.querySelector("input[name='status']:checked").value;

		const file = form.querySelector("input[name='image-file']");

		console.log("----debug---");
		console.log("pid:" + pid);
		console.log("title:" + title);
		console.log("description:" + description);
		console.log("startDate:" + startDate);
		console.log("endDate:" + endDate);
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
				modifyProject(pid, image);
			});
			// 파일을 dataURL(base64)로 읽음
			reader.readAsDataURL(file.files[0]);
		} else {
			// 파일이 없을 때
			modifyProject(pid);
		}

		// 데이터를 서버에 전송, 결과값으로 UI요소 생성
		async function modifyProject(pid, image) {
			console.log(image);

			// 서버에 Http 요청 (프로젝트 수정)
			// fetch : url, option
			const response = await fetch(`${apiUrl()}/project/${pid}`, {
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
					image: image ? image : null,
					status,
				}),
			});

			console.log(response.status);

			if ([200].includes(response.status)) {
				alert("프로젝트가 수정되었습니다.");
				window.location.href = "/project/project-main.html?search=myproject";
			} else {
				window.location.href = "/common/system-notice.html";
			}
		}
	});
})();

// 프로젝트 정보 삭제(서버로 요청)
(() => {
	const btnRemove = document.querySelector("article button:nth-of-type(2)");

	btnRemove.addEventListener("click", async (e) => {
		e.preventDefault();

		if (!confirm("삭제 하시겠습니까?")) {
			return;
		}

		const form = document.forms[0];

		const pid = form.querySelector("input[name='pid']").value;
		console.log("----debug---");
		console.log("pid:" + pid);

		if (pid === null) {
			alert("삭제 대상이 선택되지 않았습니다.");
			return;
		}

		// 삭제 처리 전에 프로젝트에 등록된 Task가 있는지 확인한다.
		const resTask = await fetch(`${apiUrl()}/project/${pid}/task/count`, {
			headers: {
				Authorization: `Bearer ${getCookie("token")}`,
			},
		});

		const resultTask = await resTask.json();
		const arrayTask = Array.from(resultTask);

		console.log("-----countTask");
		console.log(resultTask.data);

		if (resultTask.data > 0) {
			alert(
				`해당 프로젝트에 등록된 Task가 ${resultTask.data}건 존재합니다. Task 먼저 삭제 후 프로젝틑를 삭제하시기 바랍니다.`
			);

			window.location.href = `/task/task-list.html?pid=${pid}`;
			return;
		}

		// 서버에 Http 요청 (프로젝트 삭제)
		// fetch : url, option
		const response = await fetch(`${apiUrl()}/project/${pid}`, {
			// HTTP Method
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${getCookie("token")}`,
			},
		});

		console.log(response.status);

		if ([200].includes(response.status)) {
			alert("프로젝트가 삭제 되었습니다.");

			window.location.href = "/project/project-main.html";
		} else {
			alert(
				"삭제 처리 실패! -> TODO : 프로젝트의 Task가 존재할 경우 삭제할 수 없도록 수정 또는 해당 TASK 모두 삭제 예정"
			);
			// window.location.href = "/common/system-notice.html";
		}
	});
})();

// 프로젝트 팀원 조회 버튼 클릭 이벤트
(() => {
	const btnTeamMemberList = document.querySelector(
		".button-layer button:nth-of-type(3)"
	);

	// 버튼 클릭 이벤트 핸들러
	btnTeamMemberList.addEventListener("click", async (e) => {
		e.preventDefault();

		const form = document.forms[0];

		const pid = form.querySelector("input[name='pid']").value;

		// 프로젝트 팀원 조회 페이지로 이동
		const actionUrl = `/team/tmember-list.html?pid=${pid}`;
		window.location.href = actionUrl;
	});
})();

// 작업 조회 버튼 클릭 이벤트
(() => {
	const btnTask = document.querySelector(".button-layer button:nth-of-type(4)");

	// 버튼 클릭 이벤트 핸들러
	btnTask.addEventListener("click", async (e) => {
		e.preventDefault();

		const form = document.forms[0];

		const pid = form.querySelector("input[name='pid']").value;

		// 작업 조회 페이지로 이동
		const actionUrl = `/task/task-list.html?pid=${pid}`;
		window.location.href = actionUrl;
	});
})();

// 데이터 조회(프로젝트 정보)
async function getProject(pid) {
	// alert(pid);

	let url = `${apiUrl()}/project/${pid}`;

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

	// 화면 dispaly
	const form = document.forms[0];

	form.querySelector("input").value = result.data.title; // 제목
	form.querySelector("textarea").value = result.data.description; // 설명

	// 시작일
	const startDateInput = document.getElementById("startDateInput");
	startDateInput.value = dateFormat(new Date(result.data.startDate)); // YYYY-MM-DD 형식으로 변환

	// 종료일
	const endDateInput = document.getElementById("endDateInput");
	endDateInput.value = dateFormat(new Date(result.data.endDate)); // YYYY-MM-DD 형식으로 변환

	// 이미지 표시
	createImage(result.data.image);

	// 상태값 radio button 처리
	setRadioButton(result.data.status);

	form.querySelector("input[name='pid']").value = result.data.pid; // pid
	form.querySelector("input[name='status']").value = result.data.status; // project 상태
	document.getElementById("pm-id").innerHTML = result.data2.mname; // project pm id

	console.log(result.role);

	// 내 프로젝트만 수정/삭제할 수 있도록 버튼처리 함
	const buttonLayerDiv = document.querySelector(".button-layer");
	const buttons = buttonLayerDiv.querySelectorAll("button");
	if (result.role === "modify") {
		// buttonLayerDiv.style.display = "";
		buttons[0].style.display = "";
		buttons[1].style.display = "";
	} else {
		// buttonLayerDiv.style.display = "none";
		buttons[0].style.display = "none";
		buttons[1].style.display = "none";
	}
}

function createImage(image) {
	// console.log(image);

	const template = /*html*/ `
  ${image ? `<img src="${image}">` : ""}`;

	const divProjectImage = document.getElementById("project-image");

	divProjectImage.insertAdjacentHTML("afterbegin", template);

	if (image != null) {
		divProjectImage.style.display = "";
	} else {
		divProjectImage.style.display = "none";
	}
	return divProjectImage;
}

// 이미지 파일 선택 후 div에 선택된 이미지 보여주기
function loadImage() {
	const inputFile = document.querySelector("input[type='file']");
	const projectImageDiv = document.getElementById("project-image");

	// projectImageDiv.style.display = "none";

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

			// projectImageDiv.style.display = "";
		}
	});
}

function setRadioButton(selectedValue) {
	// CSS 선택자를 사용하여 원하는 value 값과 일치하는 라디오 버튼을 선택합니다.
	var selectedRadioButton = document.querySelector(
		'input[name="status"][value="' + selectedValue + '"]'
	);

	// 선택된 라디오 버튼을 체크합니다.
	if (selectedRadioButton) {
		selectedRadioButton.checked = true;
	}
}

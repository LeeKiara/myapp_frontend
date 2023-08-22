// 웹 페이지 로딩이 완료되면, 프로젝트 정보, 팀 멤버 조회 및 화면 display
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
		getProject(formData.pid);

		// 팀 멤버 조회
		getTeamMember(formData.pid, formData.mid);
		
	});
})();

// 팀 멤버 삭제(서버로 요청)
(() => {
	const btnRemove = document.querySelector(".button-layer button:nth-of-type(1)");

	btnRemove.addEventListener("click", async (e) => {
		e.preventDefault();

		if(!confirm("삭제 하시겠습니까?")) {
			return;
		}

		const form = document.forms[0];
		const pid = form.querySelector("input[name='pid']").value;
		const mid = form.querySelector("input[name='mid']").value;
    
		console.log("----debug---");
		console.log("pid:" + pid);
		console.log("mid:" + mid);

		if (pid === "") {
			alert("정보가 유효하지 않습니다.");
			return;
		}

		if (mid === "") {
			alert("정보가 유효하지 않습니다.");
			return;
		}

			// 서버에 Http 요청 (프로젝트 생성)
			// fetch : url, option
			const response = await fetch("http://localhost:8080/project/member", {
				// HTTP Method
				method: "DELETE",
				// 보낼 데이터 형식은 json
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					pid,
					mid,
				}),
			});

			console.log("----debug---");
			console.log("response.status:" + response.status);

			if ([200].includes(response.status)) {
				alert("삭제 되었습니다.");
				window.location.href = "/team/tmember-list.html?pid="+pid;
			}      
	});

})();

// 목록으로 이동
(() => {
	const btnList = document.querySelector(".button-layer button:nth-of-type(2)");

	btnList.addEventListener("click", async (e) => {
		e.preventDefault();

		const form = document.forms[0];
		const pid = form.querySelector("input[name='pid']").value;

		window.location.href = `/team/tmember-list.html?pid=${pid}`;

	});

})();


// 데이터 조회(프로젝트 정보)
async function getProject(pid) {
	// alert(pid);

	let url = `http://localhost:8080/project/${pid}`;

	// http 통신을 통해서 데이터 조회 후 응답값 받음
	//  - await 키워드는 async 함수에서만 사용 가능
	const response = await fetch(url);
	const result = await response.json();

	console.log("--- debuging result");
	console.log(result);

	// 화면 dispaly
	const form = document.forms[0];

	form.querySelector("input").value = result.data.title; // 제목
	form.querySelector("input[name='pid']").value = result.data.pid; // pid
}

// 데이터 조회(팀 멤버 정보)
async function getTeamMember(pid, mid) {	

	let url = `http://localhost:8080/project/member?pid=${pid}&mid=${mid}`;

	// http 통신을 통해서 데이터 조회 후 응답값 받음
	//  - await 키워드는 async 함수에서만 사용 가능
	const response = await fetch(url);
	const result = await response.json();

	console.log("--- debuging result");
	console.log(result);

	// 화면 dispaly
	const form = document.forms[0];

	// 사용자 정보 화면에 보여주기
	form.querySelector("input[name='email']").value = result.email; // member email
	form.querySelector("input[name='username']").value = result.username; // member name
	form.querySelector("input[name='mid']").value = result.mid; // mid	
	
}


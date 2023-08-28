// 웹 페이지 로딩이 완료되면, 프로젝트 정보 조회 및 화면 display
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

// 이메일로 사용자정보 찾기 
(()=>{
  
  const btnFindMemer = document.querySelector("form button:nth-of-type(1)");

  // 이메일로 사용자정보 찾기 버튼 클릭 이벤트 핸들러
  btnFindMemer.addEventListener("click", async (e) => {
      e.preventDefault();

      const form = document.forms[0];

      const email = form.querySelector("input[name='email']").value;

      // 이메일로 사용자정보 찾기 요청(서버로 요청처리)
      getMember(email);

  });

})();

// 프로젝트 팀 멤버 등록(서버로 요청)
(() => {
	const btnSave = document.querySelector(".button-layer");

	btnSave.addEventListener("click", async (e) => {
		e.preventDefault();

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
				method: "POST",
				// 보낼 데이터 형식은 json
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					pid,
					mid,
				}),
			});

			// 서버에서 response 받기
			const result = await response.json();

			// const { data } = result;

			console.log("----debug---");
			console.log("result" + result);
			console.log("response.status:" + response.status);

			if ([201].includes(response.status)) {
				alert("프로젝트 팀 멤버로 등록하였습니다.");
				window.location.href = "/team/tmember-list.html?pid="+pid;
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

	// 화면 dispaly
	const form = document.forms[0];

	form.querySelector("input").value = result.data.title; // 제목
	form.querySelector("input[name='pid']").value = result.data.pid; // pid
}

// 데이터 조회(사용자 정보)
async function getMember(email) {
	
  if( (email === null) || (email === "")) {
    alert("이메일을 입력하세요.");
    return;
  }

  // 서버에 Http 요청 (프로젝트 수정)
  // fetch : url, option
  const response = await fetch(
    `http://localhost:8080/member/${email}`,
    {
      // HTTP Method
      method: "PUT"      
    }
  );

	console.log("--- debuging response");
	console.log(response);

  const result = await response.json();

  console.log("--- debuging result");
	console.log(result);
	console.log(result.data);

	// 화면 dispaly
	const form = document.forms[0];

  // 사용자 정보 화면에 보여주기
	form.querySelector("input[name='username']").value = result.data.username; // member name
	form.querySelector("input[name='mid']").value = result.data.mid; // mid	
}

// 웹 페이지 로딩이 완료되면, 팀 멤버 리스트 조회 및 화면 display
(() => {
	window.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    pid = params.get("pid");

    // 프로젝트 정보 조회
		getProject(pid);

    // 팀 멤버 리스트 조회
		getList(pid);

    // project id form 값에 넣어주기
    const form = document.querySelector("form");
    form.querySelector("input[name='pid']").value = pid; 

    // 프로젝트 정보 select box
    const selectElement = document.querySelector('.select-box select');
		selectElement.addEventListener('change', () => {
			if (selectElement.value === '') {
				alert('옵션을 선택해주세요.'); // 사용자에게 메시지 표시
				selectElement.selectedIndex = -1; // 선택 취소
			} else {
				alert(selectElement.value);
			}
		});

	});
})();

// 팀원등록 버튼 클릭 : 프로젝트 팀원 등록 페이지 이동
// (()=>{
  
//   const btnTeamMember = document.querySelector(".button-layer button");

//   // 버튼 클릭 이벤트 핸들러
//   btnTeamMember.addEventListener("click", async (e) => {
      
// 		e.preventDefault();

//     const form = document.forms[0];

//     const pid = form.querySelector("input[name='pid']").value;

//     // 프로젝트 팀원 등록 페이지로 이동
// 		const actionUrl = `http://localhost:5500/team/tmember-create.html?pid=${pid}`;
// 		window.location.href = actionUrl;

//   });

// })();

// 프로젝트 팀 멤버 등록(서버로 요청)
(() => {
	const btnSave = document.querySelector("#add-team-member");

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

// 이메일로 사용자정보 찾기 
(()=>{
  
  const btnFindMemer = document.querySelector("#find-user");

  // 이메일로 사용자정보 찾기 버튼 클릭 이벤트 핸들러
  btnFindMemer.addEventListener("click", async (e) => {
      e.preventDefault();

      const modalForm = document.querySelector('form[name="modal"]');

      const email = modalForm.querySelector("input[name='email']").value;

      // 이메일로 사용자정보 찾기 요청(서버로 요청처리)
      getMember(email);

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

	console.log("--- debuging getProject result");
	console.log(result);

  // 프로젝트 제목 넣어주기
  document.querySelector("input[name='title']").value = result.data.title;
  
}

// 데이터 조회(팀 멤버 리스트)
async function getList(pid) {

  console.log("pid : "+pid);

  let url = `http://localhost:8080/project/member/list?pid=${pid}`;

  const response = await fetch(url);

  // 401: 미인증, 403: 미인가(허가없는)
  // if ([401, 403].includes(response.status)) {
  //   // 로그인 페이지로 튕김
  //   alert("인증처리가 되지 않았습니다.");
  //   window.location.href = "/login.html";
  // }

  // 결과가 배열
  const result = await response.json();
  console.log(result);

  const tbody = document.querySelector("form ul");

  // 목록 초기화
  tbody.innerHTML = "";
  // 배열 반복을 해서 tr만든다음에 tbody 가장 마지막 자식에 추가
  for (let item of result) {
    let createdTr = createRow(
      item.mid,
      item.username,
      item.email,
    );

    // tbody에 tr 추가
    tbody.append(createdTr);

    // Table tr 요소의 클릭 이벤트 핸들러 추가하기
    createTrEvent(createdTr);

  }

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

  if([404].includes(response.status)) {
    alert("사용자 정보가 없습니다.");
    return;
  }

  const result = await response.json();

  console.log("--- debuging result");
	console.log(result);
	console.log(result.data);

	// 화면 dispaly
	const form = document.querySelector("form[name='modal']");

  // 사용자 정보 화면에 보여주기
	form.querySelector("input[name='username']").value = result.data.username; // member name
	form.querySelector("input[name='mid']").value = result.data.mid; // mid	
}


// 팀원 정보 테이블 template
function createRow(mid, name, email) {
  // 1. 요소 생성
  const li = document.createElement("li");

  // 2. 요소의 속성 설정
  li.dataset.mid = mid;
  li.innerHTML = /*html*/ `  
  <div><img src="/image/profile.png" width="40px"></div>
  <div>${name}</div>
  <div>${email}</div>
  `;
  return li;
}

// Table tr 요소의 클릭 이벤트 핸들러 추가하기
function createTrEvent(createdTr) {

	createdTr.addEventListener("click", (e) => {
		// 기본 제출 동작을 막음.
		e.preventDefault();

		let mid = createdTr.getAttribute("data-mid");

    let pid = document.querySelector("input[name='pid']").value;

    // alert(pid +","+mid);

		// 멤버 수정 페이지로 이동
		const actionUrl = `http://localhost:5500/team/tmember-modify.html?pid=${pid}&mid=${mid}`;
		window.location.href = actionUrl;

	});
}

// 팀원 등록 버튼 클릭 이벤트
(() => {
  const btnTeamMember = document.querySelector(".button-layer button");

  btnTeamMember.addEventListener("click", (e) => {

    		e.preventDefault();

      // 수정버튼을 클릭한 이벤트에 작동
      // if (
      //   e.target.classList.contains("btn-modify")
      // ) {

        // jsdoc type 힌트를 넣어줌
        // /** @type {HTMLButtonElement} */
        // const modifyBtn = e.target;
        // // button -> td -> tr
        // const row =
        //   modifyBtn.parentElement.parentElement; // tr
        // // tr의 모든 데이터셀의 내부값 가져오기
        // const cells = row.querySelectorAll("td");
        // console.log(
        //   cells[0].innerHTML,
        //   cells[1].innerHTML,
        //   cells[2].innerHTML
        // );

        // 모달 레이어 띄우기
        /** @type {HTMLDivElement} */
        const layer = document.querySelector(
          "#modify-layer"
        );
        layer.hidden = false;

        // // 모달 내부의 폼에 선택값을 채워 넣음
        // layer.querySelector("h3").innerHTML =
        //   cells[2].innerHTML;
        // const inputs =
        //   layer.querySelectorAll("input");
        // inputs[0].value = cells[0].innerHTML;
        // inputs[1].value = cells[1].innerHTML;

        // 확인/취소 버튼이 이벤트 핸들러 추가
        const buttons =
          layer.querySelectorAll("#modify-layer button");
        // 취소 버튼
        buttons[1].addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            layer.hidden = true;
          }
        );

        // // 수정 버튼
        // buttons[0].addEventListener(
        //   "click",
        //   async (e) => {
        //     e.preventDefault();
        //     // 셀이 있는 고정값
        //     const email = cells[2].innerHTML;
        //     // 입력값으로
        //     const name = inputs[0].value;
        //     const phone = inputs[1].value;

        //     const options = {
        //       method: "PUT",
        //       headers: {
        //         "content-type":
        //           "application/json",
        //         Authorization: `Bearer ${getCookie(
        //           "token"
        //         )}`,
        //       },
        //       body: JSON.stringify({
        //         name,
        //         phone,
        //       }),
        //     };
        //     // 서버 연동
        //     const response = await fetch(
        //       `http://localhost:8080/contacts/${email}`,
        //       options
        //     );

        //     console.log(response.status);

        //     // 데이터셀의 값을 수정입력 폼의 값으로 바꿨음.
        //     cells[0].innerHTML = inputs[0].value;
        //     cells[1].innerHTML = inputs[1].value;
        //     layer.hidden = true;
        //   }
        // );

      // }
    });
})();

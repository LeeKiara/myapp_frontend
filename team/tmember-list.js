// 웹 페이지 로딩이 완료되면, 팀 멤버 리스트 조회 및 화면 display
(() => {
	window.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    pid = params.get("pid");

    console.log("<< tmember-list page에서 pid 확인 >> "+pid);

    // 등록/삭제 버튼 초기화(권한이 있을경우에만 보여주기)
    const buttonLayerDiv = document.querySelector(".button-layer");
    buttonLayerDiv.style.display = "none";

    if(pid != null) {
      // url 파라메터로 pid가 들어올 경우, 폼 hidden 값에 넣어주기
      document.querySelector("form[name='team-members']").querySelector("input[name='pid']").value = pid;

		  // 프로젝트 권한 조회
		  getProjectRole(pid);

    }    

    // 프로젝트 정보 select box에 넣어주기
    // setProjectList(pid);

    getTeamMeberList(pid);
    document.querySelector("form[name='team-members']").querySelector("input[name='pid']").value = pid;   
    
    // teamMembersClickEvent();
	});
})();

// 데이터 조회(프로젝트 권한 정보)
async function getProjectRole(pid) {
	// alert(pid);

	let url = `http://localhost:8080/project/${pid}/role`;

	// http 통신을 통해서 데이터 조회 후 응답값 받음
	//  - await 키워드는 async 함수에서만 사용 가능
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${getCookie("token")}`,
		},
	});
	const result = await response.json();

	console.log("--- debuging getProjectRole result");
	console.log(result);

	// Project member 등록/수정 권한 체크
	// 해당 유저가 프로젝트 관리자일 경우에만, 수정/삭제할 수 있도록 버튼처리 함
	const buttonLayerDiv = document.querySelector(".button-layer");
	if (result["role-tmember"] != "R") {
		buttonLayerDiv.style.display = "";
	} else {
		buttonLayerDiv.style.display = "none";
	}

}


// 팀 멤버 삭제(서버로 요청)
(() => {
	const btnRemove = document.querySelector(".button-layer button:nth-of-type(2)");

	btnRemove.addEventListener("click", async (e) => {
		e.preventDefault();

		const form = document.querySelector("form[name='team-members']");
		const pid = form.querySelector("input[name='pid']").value;
    // console.log("모달레이어 pid:"+pid);

    if(pid < 1) {
      alert("프로젝트를 선택해주세요.");
      return;
    }

		if(!confirm("삭제 하시겠습니까?")) {
			return;
		}


    const checkedMember = document.querySelector("input[name='members']:checked");
    let mid = checkedMember.value;

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

// 프로젝트 정보 리스트 조회하여 select 요소에 값 넣어주기
async function setProjectList(pid) {

  let url = `http://localhost:8080/project/list-all`;

	// http 통신을 통해서 데이터 조회 후 응답값 받음
	//  - await 키워드는 async 함수에서만 사용 가능
  const response = await fetch(url, { 
		headers: {
			Authorization: `Bearer ${getCookie("token")}`,
		},
	});
	const result = await response.json();

	console.log("--- debuging setProjectList result");
	console.log(result);

  // select 요소
  const selectElement = document.querySelector('.select-box select');
  
  // 목록 초기화
  selectElement.innerHTML = "";

  // select 첫번째 option 추가
  const createElement = document.createElement("option");
  createElement.value = "";
  createElement.innerHTML = `프로젝트를 선택하세요.`;
  selectElement.append(createElement);

  // 배열 반복을 해서 option 만든다음에 select 가장 마지막 자식에 추가
  for (let item of result) {
      
    // 요소 생성
    const createElement = document.createElement("option");

    // 2. 요소의 속성 설정    
    createElement.value = `${item.pid}`;
    createElement.innerHTML = `${item.title}`;

    // tbody에 tr 추가
    selectElement.append(createElement);

  }

  // 외부 파라메터로 pid가 넘어올 경우, 해당 pid로 select box 선택하기
  selectOptionByValue(pid); 

  // select option 요소의 클릭 이벤트 핸들러 추가하기
  createOptionEvent(); 

  if(pid > 0) {
    getTeamMeberList(pid);
    document.querySelector("form[name='team-members']").querySelector("input[name='pid']").value = pid;    
  }

}

// select option 요소의 클릭 이벤트 핸들러 추가하기
function createOptionEvent() {
        
  // 프로젝트 정보 select box
  const selectElement = document.querySelector('.select-box select');
  
  selectElement.addEventListener('change', () => {
    let selectPid = 0;

    if (selectElement.value === '') {
      alert('옵션을 선택해주세요.'); // 사용자에게 메시지 표시
      selectElement.selectedIndex = -1; // 선택 취소
    } else {
      selectPid = selectElement.value;
      // alert(" select option 요소의 클릭 이벤트 >"+selectPid);
      window.location.href = "/team/tmember-list.html?pid="+selectPid;
      return;
    }

    // alert("this..");

    // if(selectPid > 0) {
    //   getTeamMeberList(selectPid);
    // }
  });

}

// 데이터 조회(팀 멤버 리스트)
async function getTeamMeberList(pid) {

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
  console.log("getTeamMeberList:");
  console.log(result);

  // 'team-members' form의 ul 태그에 정보 넣어주기
  const form = document.querySelector("form[name='team-members']");
  const targetElement = form.querySelector("ul");

  // 목록 초기화
  targetElement.innerHTML = "";
  // 배열 반복을 해서 tr만든다음에 tbody 가장 마지막 자식에 추가
  for (let item of result) {
    let createdEle = createRow(
      item.mid,
      item.mname,
      item.username,
      item.email,
    );

    // targetElement에 정보 추가
    targetElement.append(createdEle);

    // Table tr 요소의 클릭 이벤트 핸들러 추가하기
    // createTrEvent(createdEle);
  }

  if(result.length == 0) {
    const li = document.createElement("li");
    li.innerHTML = "&nbsp;&nbsp;&nbsp;* 등록된 팀원 정보가 없습니다.";
    targetElement.append(li);
  }
}

// 팀원 정보 테이블 template
function createRow(mid, mname, username, email) {
  // 1. 요소 생성
  const li = document.createElement("li");

  // 2. 요소의 속성 설정
  li.dataset.mid = mid;
  li.innerHTML = /*html*/ `  
  <div><input type="radio" name="members" value=${mid}></div>
  <div><img src="/image/profile.png" width="40px"></div>
  <div>${mname}</div>  
  <div>(${email})</div>
  `;
  return li;
}

// 외부 파라메터로 pid가 넘어올 경우, 해당 pid로 select box 선택하기
function selectOptionByValue(value) {
  const selectElement = document.getElementById('projectSelect');

  for (let option of selectElement.options) {
    if (option.value === value) {
      option.selected = true;
      break;
    }
  }
}



// 팀 멤버 목록 click event
function teamMembersClickEvent() {
  const ulBody = document.querySelector('ul');

  ulBody.addEventListener('click', (event) => {
    
    const clickedElement = event.target;
    const liElement = clickedElement.closest('li');
    const mid = liElement.getAttribute('data-mid');

    alert("ul li click : clickedElement.type=>"+clickedElement.type+", mid"+mid);

    if(mid != null) {

    }
    // if (clickedElement.tagName === 'INPUT' && clickedElement.type === 'checkbox') {

    //   alert(`Checkbox with value ${tid} clicked.`);

    //   // 여기에 체크박스 클릭 이벤트에 대한 처리 코드를 추가하면 됩니다.
    // } else {
    //   alert(`Non Checkbox with value ${tid} clicked.`);
    // }
  });

}

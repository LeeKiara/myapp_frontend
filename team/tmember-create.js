// 팀원 등록 버튼 클릭 > 모달 백그라운드 레이어 보여주기
(() => {
	const btnTeamMember = document.querySelector(".button-layer button");

	btnTeamMember.addEventListener("click", (e) => {
		e.preventDefault();

		const parentForm = document.querySelector("form[name='team-members']");

		const pid = parentForm.querySelector("input[name='pid']").value;
		console.log("모달레이어 pid:" + pid);

		if (pid < 1) {
			alert("프로젝트를 선택해주세요.");
			return;
		}

		// 모달 레이어 띄우기
		/** @type {HTMLDivElement} */
		const layer = document.querySelector("#modal-layer");
		layer.hidden = false;

		// 프로젝트 pid
		layer.querySelector("h3").innerHTML = pid;

		// 취소 버튼
		document.querySelector("#modal-cancel").addEventListener("click", (e) => {
			e.preventDefault();
			layer.hidden = true;
		});

		// 팀원 추가 버튼
		document
			.querySelector("#add-team-member")
			.addEventListener("click", async (e) => {
				e.preventDefault();

				const form = document.querySelector("form[name='modal']");
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

				// 서버에 Http 요청 (팀원 추가)
				// fetch : url, option
				const response = await fetch(`${apiUrl()}/project/member`, {
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

				console.log("----팀원 추가---");
				console.log("result" + result);
				console.log("response.status:" + response.status);

				// 이미 등록된 데이터를 등록하려고 할 때 409 Conflict 상태 코드가 반환됨
				if ([409].includes(response.status)) {
					alert("등록된 팀원 입니다.");
					// layer.hidden = true;
					// window.location.reload();
				}

				if ([201].includes(response.status)) {
					// alert("프로젝트 팀 멤버로 등록하였습니다.");
					// window.location.href = "/team/tmember-list.html?pid="+pid;
					layer.hidden = true;
					window.location.reload();
				}
			});
	});
})();

// 이메일로 사용자정보 찾기
(() => {
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

// 데이터 조회(사용자 정보)
async function getMember(email) {
	if (email === null || email === "") {
		alert("이메일을 입력하세요.");
		return;
	}

	// 서버에 Http 요청 (프로젝트 수정)
	// fetch : url, option
	const response = await fetch(`${apiUrl()}/member/${email}`, {
		// HTTP Method
		method: "PUT",
	});

	console.log("--- debuging response");
	console.log(response);

	if ([404].includes(response.status)) {
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

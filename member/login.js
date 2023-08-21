// 로그인
(() => {
			// URL의 쿼리 문자열을 가져오기
			const queryString = window.location.search;

			// 쿼리 문자열을 파싱하여 폼 데이터 객체로 변환
			const formData = {};
			const params = new URLSearchParams(queryString);
			for (const [key, value] of params) {
				formData[key] = value;
			}
			
			// 로그인 처리 응답값이 400(Bad-Request)일경우 alert창
			if (formData["return-status"] === "400") {
				alert("아이디 또는 비밀번호를 입력하세요");
				return;
			}

			// 로그인 처리 응답값이 401(Unauthorized)일경우 alert창
			if (formData["return-status"] === "401") {
				alert("아이디 또는 비밀번호가 맞지 않습니다.");
				return;
			}
})();

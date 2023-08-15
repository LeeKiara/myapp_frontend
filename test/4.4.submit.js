// 이전/다음 페이징
(() => {
	const divContent = document.getElementById("card-layout-item");

	divContent.addEventListener("click", (e) => {
		// 기본 제출 동작을 막음.
		e.preventDefault();

		// 이전 페이지에서 폼 데이터를 가져오거나 생성합니다.
		const formData = {
			projectid: 1,
		};

		// 폼 데이터를 쿼리 문자열로 변환합니다.
		const queryStr = new URLSearchParams(formData).toString();

		// 새 창을 엽니다.
		const actionUrl = `http://127.0.0.1:5500/project/project-modify.html?${queryStr}`;
		const newWindow = window.open(actionUrl, "_blank");
	});
})();

(()=>{

  const btnSave = document.querySelector("button");

  btnSave.addEventListener("click", async(e) => {

    e.preventDefault();

    const form = document.forms[0];
    const inputs = form.querySelectorAll("input");
    const title = inputs[0].value;
    const startDate = inputs[1].value;
    const endDate = inputs[2].value;
    const description = form.querySelector("textarea").value;
    const file = inputs[3];
    
    console.log("----debug---")
    console.log("title:"+title);
    console.log("description:"+description);
    console.log("startDate:"+startDate);
    console.log("endDate:"+endDate);

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
      reader.addEventListener(
        "load",
        async (e) => {
          console.log(e);
          // file -> base64 data-url
          const image = e.target.result;
          alert(image);

          // 이미지가 삽입된 div 요소 생성
          const div = createImage(image);
          alert(div.outerHTML);

        }
      );
      // 파일을 dataURL(base64)로 읽음
      reader.readAsDataURL(file.files[0]);
    }

    const imageElement = document.querySelector("img");

    // 서버에 Http 요청 (프로젝트 생성)
    const response = await fetch("http://localhost:8080/project", {
          // HTTP Method  
          method: "POST",
          // 보낼 데이터 형식은 json
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
              title,          
              description,          
              startDate,          
              endDate,
              image: imageElement ? imageElement.src : null,
          }),
        });

    const result = await response.json();

    console.log("----debug---")
    console.log("result"+result);
    console.log("response.status:"+response.status);

    if ([201].includes(response.status)) {
      alert("프로젝트가 생성되었습니다.");
    }
  });

})();

// 
function createImage(image) {
  
  const template = /*html*/ `
  ${image ? 
    `<img width="auto" height="30" src="${image}">`
    : ""
  }`;

  const divProjectImage = document.getElementById("projectImage");

  divProjectImage.insertAdjacentHTML(
      "afterbegin",
      template
    );

  return divProjectImage;
}
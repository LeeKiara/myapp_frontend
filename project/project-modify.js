// 웹 페이지 로딩이 완료되면, 데이터 조회 및 화면 display
(() => {

  window.addEventListener("DOMContentLoaded", () => {
  getProject(0);    

  });

})();


// 데이터 조회(프로젝트 정보)
async function getProject(projectId) {

  alert(projectId);

  let url = `http://localhost:8080/project/${projectId}`;

  // http 통신을 통해서 데이터 조회 후 응답값 받음
  //  - await 키워드는 async 함수에서만 사용 가능
  const response = await fetch(url);
  const result = await response.json();

  console.log("--- debuging result");
  console.log(result);

  // 응답값 객체를 배열로 전환
  const data = Array.from(result.content);  

  console.log("--- debuging data");
  console.log(data);

  // 화면 dispaly
  // const divContent = document.getElementById("card-layout");
  // divContent.innerHTML = "";  // div clear
  
  // data
  // .sort((a,b)=>(a.projectId - b.projectId))
  // .forEach(item => {
  //   // console.log("--- debuging item");
  //   // console.log(item);

  //   const template = cardTemplate(item);
  //   console.log("--- debuging template");
  //   console.log(template);

  //   divContent.insertAdjacentHTML(
  //     "afterbegin",
  //     template
  //   );    
  // });


  
}

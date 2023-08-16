(() => {
  const btnLogin = document.querySelector("form button");
  
  btnLogin.addEventListener("click", (e) => {
    e.preventDefault();

    window.location.href = "/project/project-list.html";
  });
})();
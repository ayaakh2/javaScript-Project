const getStartedBtn = document.getElementById("getStartedBtn");
const loginBtn = document.getElementById("loginBtn");
window.onload = function () {
  const user = getCurrentUser();
  if (user) {
    if (user.role === "teacher") {
      window.location.replace("teacher/dashboard.html");
    } else if (user.role === "student") {
      window.location.replace("student/dashboard.html");
    }
  } else {
    getStartedBtn.onclick = function () {
      window.location.href = "Login.html";
    };
    loginBtn.onclick = function () {
      window.location.href = "Login.html";
    };
  }
};

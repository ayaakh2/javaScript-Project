const getStartedBtn = document.getElementById("getStartedBtn");
const loginBtn = document.getElementById("loginBtn");
window.onload = function () {
  const user = getCurrentUser();
  if (user) {
    if (user.role === "teacher") {
      window.location.replace("Teacher/dashboard.html");
    } else if (user.role === "student") {
      window.location.replace("Student/student-dashboard.html");
    }
  } else {
    getStartedBtn.onclick = function () {
      window.location.href = "Public/Login.html";
    };
    loginBtn.onclick = function () {
      window.location.href = "Public/Login.html";
    };
  }
};

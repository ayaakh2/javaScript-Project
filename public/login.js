if (readStore(KEYS.USERS).length === 0) {
  writeStore(KEYS.USERS, users);
}
if (readStore(KEYS.EXAMS).length === 0) {
  writeStore(KEYS.EXAMS, exam);
}
if (readStore(KEYS.RESULTS).length === 0) {
  writeStore(KEYS.RESULTS, results);
}

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const eyeIcon = document.getElementById("eyeIcon");
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const wrongAlert = document.getElementById("wrongAlert");

togglePassword.onclick = function () {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  if (type === "text") {
    eyeIcon.className = "bi bi-eye-slash";
  } else {
    eyeIcon.className = "bi bi-eye";
  }
};

loginForm.onsubmit = function (event) {
  event.preventDefault();

  const usernameVal = usernameInput.value.trim();
  const passwordVal = passwordInput.value;
  const currentUsers = readStore(KEYS.USERS);
  const foundUser = currentUsers.find(function (u) {
    return u.username === usernameVal && u.password === passwordVal;
  });

  if (foundUser) {
    if (wrongAlert) wrongAlert.innerHTML = "";

    sessionStorage.setItem(KEYS.SESSION, JSON.stringify(foundUser));

    if (foundUser.role === "teacher") {
      // alert("Welcome, Teacher " + foundUser.fullName);
      window.location.href = "../Teacher/dashboard.html";
    } else if (foundUser.role === "student") {
      //   alert("Welcome, Student " + foundUser.fullName);
      window.location.href = "../student/student-dashboard.html";
    }
  } else {
    if (wrongAlert) {
      wrongAlert.innerHTML = "Invalid username or password! Please try again.";
    } else {
      alert("Invalid username or password! Please try again.");
    }
  }
};

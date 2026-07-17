//    Load BEFORE any page script.

/*   Storage keys (the contract with the Teacher section)   */
const KEYS = {
    USERS: "users", // localStorage   -> [ user ]
    EXAMS: "exams", // localStorage   -> [ exam ]
    RESULTS: "results", // localStorage   -> [ result ]
    SESSION: "currentUser", // sessionStorage -> user object
};

//   read / write
function readStore(key) {
    const raw = localStorage.getItem(key);

    if (!raw) return [];

    const data = JSON.parse(raw);

    if (!Array.isArray(data)) return [];

    return data;
}

function writeStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

//    Session
function getCurrentUser() {
    const raw = sessionStorage.getItem(KEYS.SESSION);

    if (!raw) return null;

    return JSON.parse(raw);
}

// not working yet
// function logout() {
//     sessionStorage.removeItem(KEYS.SESSION);
//     window.location.href = "../login.html";
// }

//   Blocks the page unless a user with the required role is logged in.
//   Returns the user object so the page can use it straight away.

function requireRole(role) {
    const user = getCurrentUser();

    if (!user) {
        window.location.replace("../login.html");
        return null;
    }

    // not working yet
    // if (user.role !== role) {
    //     // Logged in, but wrong dashboard — send them to their own.
    //     window.location.replace(
    //         user.role === "teacher"
    //             ? "../teacher/dashboard.html"
    //             : "../student/dashboard.html",
    //     );
    //     return null;
    // }
    return user;
}

//  Active exams only
function getActiveExams() {
    return readStore(KEYS.EXAMS).filter((exam) => exam.status === "active");
}

// every result belonging to one student.
function getResultsFor(studentId) {
    return readStore(KEYS.RESULTS).filter(
        (result) => result.studentId === studentId,
    );
}

//  One attempt per exam
function hasTakenExam(studentId, examId) {
    return getResultsFor(studentId).some((result) => result.examId === examId);
}

/** Total points an exam is worth. */
function examTotalPoints(exam) {
    return exam.questions.reduce((sum, q) => sum + (q.points || 1), 0);
}

/*   Small formatters   */

//  in case the questions has some special char.
function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function firstName(fullName) {
    return String(fullName || "")
        .trim()
        .split(" ")[0];
}

//  One exam card
function renderExamCard(exam) {
    const questionCount = exam.questions ? exam.questions.length : 0;

    return `
    <div class="col-6 col-lg-3">
      <article class="card exam-card">
        <h3 class="exam-card__title">${escapeHtml(exam.title)}</h3>

        <p class="exam-card__meta">
          <i class="bi bi-clock"></i> ${exam.duration} Mins
        </p>
        <p class="exam-card__meta">
          <i class="bi bi-journal"></i> ${questionCount} Questions
        </p>

        <a class="btn btn--accent" href="exam.html?id=${exam.id}">Start Exam</a>
      </article>
    </div>`;
}

// Normalizes the three choice types into one shape:
//   label  : what the student reads
//   stored : what goes into answers[]  (index for mcq/multiple, boolean for T/F)

function choiceValues(question) {
    if (question.type === "truefalse") {
        return [
            { label: "True", stored: true },
            { label: "False", stored: false },
        ];
    }
    return question.options.map(function (option, index) {
        return { label: option, stored: index };
    });
}

//    Grading
function isCorrect(question, answer) {
    if (answer === undefined || answer === null || answer === "") return false;

    if (question.type === "multiple") {
        return sameSet(answer, question.correct); // all-or-nothing
    }
    if (question.type === "short") {
        return sameShortAnswer(answer, question.correct);
    }
    return answer === question.correct; // mcq (index) and truefalse (boolean)
}

function sameShortAnswer(answer, correct) {
    const given = String(answer).trim();
    const expected = String(correct).trim();

    const bothNumeric =
        given !== "" &&
        expected !== "" &&
        !isNaN(Number(given)) &&
        !isNaN(Number(expected));

    if (bothNumeric) return Number(given) === Number(expected);

    return given.toLowerCase() === expected.toLowerCase();
}

/** All-or-nothing: order ignored. */
function sameSet(chosen, correct) {
    if (!Array.isArray(chosen) || !Array.isArray(correct)) return false;
    if (chosen.length !== correct.length) return false;

    const a = chosen.slice().sort();
    const b = correct.slice().sort();

    return a.every(function (value, index) {
        return value === b[index];
    });
}

// sidebar + logout
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("sidebarToggle");
    const backdrop = document.getElementById("sidebarBackdrop");

    function closeSidebar() {
        sidebar.classList.remove("is-open");
        backdrop.classList.remove("is-open");
    }

    if (toggle && sidebar && backdrop) {
        toggle.onclick = function () {
            sidebar.classList.toggle("is-open");
            backdrop.classList.toggle("is-open");
        };
        backdrop.onclick = closeSidebar;
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = function (e) {
            e.preventDefault();
            logout();
        };
    }
});

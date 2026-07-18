const greeting = document.getElementById("greeting");
const statCompleted = document.getElementById("statCompleted");
const statAverage = document.getElementById("statAverage");
const statIncomplete = document.getElementById("statIncomplete");
const examGrid = document.getElementById("examGrid");

window.onload = function () {
    const teacher = requireRole("teacher"); // this is the teacher dashboard
    if (!teacher) return;

    showGreeting(teacher);
    showStats();
    showTools();
};

function showGreeting(teacher) {
    greeting.textContent = `Welcome back ${firstName(teacher.fullName)},`;
}

// teacher-side totals pulled straight from storage
function showStats() {
    const users = readStore(KEYS.USERS); // read the users store
    const exams = readStore(KEYS.EXAMS); // read the exams store
    const results = readStore(KEYS.RESULTS); // read the results store

    statCompleted.textContent = users.filter(
        (u) => u.role === "student",
    ).length; // number of students
    statAverage.textContent = exams.length; // number of exams
    statIncomplete.textContent = results.length; // number of submitted results
}

// quick links to the teacher tools
function showTools() {
    examGrid.innerHTML = `
      <div class="col-6 col-lg-3">
        <a class="card exam-card" href="exam.html">
          <h3 class="exam-card__title">Exams</h3>
          <p class="exam-card__meta"><i class="bi bi-journal"></i> Create &amp; manage exams</p>
        </a>
      </div>
      <div class="col-6 col-lg-3">
        <a class="card exam-card" href="student.html">
          <h3 class="exam-card__title">Students</h3>
          <p class="exam-card__meta"><i class="bi bi-people"></i> Add &amp; manage students</p>
        </a>
      </div>
      <div class="col-6 col-lg-3">
        <a class="card exam-card" href="results.html">
          <h3 class="exam-card__title">Results</h3>
          <p class="exam-card__meta"><i class="bi bi-bar-chart"></i> View student results</p>
        </a>
      </div>`;
}

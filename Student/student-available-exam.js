const searchInput = document.getElementById("searchInput");
const examGrid = document.getElementById("examGrid");

let student = null;
let availableExams = []; // the full list , search filters a copy

window.onload = function () {
    student = requireRole("student");
    if (!student) return;

    // Active exams
    availableExams = getActiveExams().filter(function (exam) {
        return !hasTakenExam(student.id, exam.id);
    });

    showExams(availableExams);
};

/*   Search   */
searchInput.oninput = function () {
    searchByTitle(searchInput.value);
};

function searchByTitle(term) {
    const needle = term.trim().toLowerCase();

    if (needle === "") {
        showExams(availableExams);
        return;
    }

    const matches = availableExams.filter(function (exam) {
        return String(exam.title).toLowerCase().includes(needle);
    });

    showExams(matches, needle);
}

/*   Render   */
function showExams(exams, searchTerm) {
    if (exams.length === 0) {
        examGrid.innerHTML = searchTerm
            ? noMatchesState(searchTerm)
            : noExamsState();
        return;
    }

    let cards = "";
    exams.forEach(function (exam) {
        cards += renderExamCard(exam);
    });
    examGrid.innerHTML = cards;
}

function noExamsState() {
    return `
    <div class="col-12">
      <div class="empty">
        <i class="bi bi-check2-circle"></i>
        <p>No exams available right now</p>
        <span>Exams appear here as soon as your teacher activates them.</span>
      </div>
    </div>`;
}

function noMatchesState(term) {
    return `
    <div class="col-12">
      <div class="empty">
        <i class="bi bi-search"></i>
        <p>No exams match "${escapeHtml(term)}"</p>
        <span>Try a different title.</span>
      </div>
    </div>`;
}

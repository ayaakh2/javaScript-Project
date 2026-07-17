const greeting = document.getElementById("greeting");
const statCompleted = document.getElementById("statCompleted");
const statAverage = document.getElementById("statAverage");
const statIncomplete = document.getElementById("statIncomplete");
const examGrid = document.getElementById("examGrid");

window.onload = function () {
    const student = requireRole("student");
    if (!student) return; // guard already redirected

    showGreeting(student);
    showStats(student);
    showQuickAccess(student);
};

//    Greeting
function showGreeting(student) {
    greeting.textContent = `Welcome back ${firstName(student.fullName)},`;
}

//    Stat cards
function showStats(student) {
    const results = getResultsFor(student.id);
    const activeExams = getActiveExams();

    //  one result = one finished exam
    statCompleted.textContent = results.length;

    // Average
    // exam can't outweigh a whole short exam.
    statAverage.textContent = averagePercent(results) + "%";

    // active exams this student still hasn't submitted.
    const notTaken = activeExams.filter(
        (exam) => !hasTakenExam(student.id, exam.id),
    );
    statIncomplete.textContent = notTaken.length;
}

function averagePercent(results) {
    if (results.length === 0) return 0;

    const sum = results.reduce(function (total, result) {
        return total + (result.total ? (result.score / result.total) * 100 : 0);
    }, 0);

    return Math.round(sum / results.length);
}

//    Quick access
function showQuickAccess(student) {
    const available = getActiveExams()
        .filter((exam) => !hasTakenExam(student.id, exam.id))
        .slice(0, QUICK_ACCESS_LIMIT);

    if (available.length === 0) {
        examGrid.innerHTML = `
      <div class="col-12">
        <div class="empty">
          <i class="bi bi-check2-circle"></i>
          <p>You're all caught up</p>
          <span>New exams appear here as soon as your teacher activates them.</span>
        </div>
      </div>`;
        return;
    }

    let cards = "";
    available.forEach(function (exam) {
        cards += renderExamCard(exam);
    });
    examGrid.innerHTML = cards;
}

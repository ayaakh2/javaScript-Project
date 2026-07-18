const DONUT_RADIUS = 52;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

/* Bands read off the average grade. The lowest one is a failing average,
   so it stays neutral rather than congratulatory. */
const BANDS = [
    { min: 90, text: "Excellent" },
    { min: 75, text: "Very good" },
    { min: 60, text: "Good" },
    { min: 50, text: "Pass" },
    { min: 0, text: "Needs work", low: true },
];

const summary = document.getElementById("summary");
const donutRing = document.getElementById("donutRing");
const donutValue = document.getElementById("donutValue");
const completedLine = document.getElementById("completedLine");
const bandLine = document.getElementById("bandLine");
const bestScore = document.getElementById("bestScore");
const bestExam = document.getElementById("bestExam");
const historyTitle = document.getElementById("historyTitle");
const historyGrid = document.getElementById("historyGrid");

let exams = [];

window.onload = function () {
    const student = requireRole("student");
    if (!student) return;

    exams = readStore(KEYS.EXAMS);

    // Newest first — the exam they just sat is the one they want.
    const results = getResultsFor(student.id).sort(function (a, b) {
        return new Date(b.submittedAt) - new Date(a.submittedAt);
    });

    if (results.length === 0) {
        showEmpty();
        return;
    }

    summary.classList.remove("u-hidden");
    historyTitle.classList.remove("u-hidden");

    showSummary(results);
    showBest(results);
    showHistory(results);
};

/*   Summary   */
function showSummary(results) {
    const average = averagePercent(results);

    donutValue.textContent = `${average}%`;
    completedLine.textContent = `You have completed ${results.length} exam${results.length === 1 ? "" : "s"}`;

    const band = BANDS.find((item) => average >= item.min);
    bandLine.textContent = band.text;
    bandLine.classList.toggle("summary-card__band--low", band.low === true);

    drawDonut(average);
}

function drawDonut(percent) {
    donutRing.style.strokeDasharray = DONUT_CIRCUMFERENCE;
    donutRing.style.strokeDashoffset = DONUT_CIRCUMFERENCE; // start empty

    // Let the browser paint the empty ring first, so the fill animates in.
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            const filled = DONUT_CIRCUMFERENCE * (percent / 100);
            donutRing.style.strokeDashoffset = DONUT_CIRCUMFERENCE - filled;
        });
    });
}

/*   Highest score   */
function showBest(results) {
    // Best by percentage, so a 5/5 beats an 18/20.
    const best = results.reduce(function (leader, result) {
        return percentOf(result) > percentOf(leader) ? result : leader;
    });

    bestScore.textContent = `${best.score}/${best.total}`;
    bestExam.textContent = examTitle(best.examId);
}

function percentOf(result) {
    return result.total ? (result.score / result.total) * 100 : 0;
}

/*   History cards   */
function showHistory(results) {
    let cards = "";
    results.forEach(function (result) {
        cards += historyCard(result);
    });
    historyGrid.innerHTML = cards;
}

function historyCard(result) {
    const status = result.passed
        ? `<p class="hist-card__status hist-card__status--pass">
         <i class="bi bi-check-circle-fill"></i> Passed</p>`
        : `<p class="hist-card__status hist-card__status--fail">
         <i class="bi bi-x-circle-fill"></i> Failed</p>`;

    return `
    <div class="col-6 col-lg-3">
      <article class="card hist-card">
        <h3 class="hist-card__title">${escapeHtml(examTitle(result.examId))}</h3>

        <p class="hist-card__meta">
          <i class="bi bi-calendar3"></i> ${formatDate(result.submittedAt)}
        </p>
        <p class="hist-card__meta">
          <i class="bi bi-star"></i> ${result.score}/${result.total}
        </p>

        ${status}

        <a class="btn btn--accent" href="student-review.html?id=${result.id}">Review</a>
      </article>
    </div>`;
}

/*   Helpers   */

/** The exam may have been deleted since — don't let that blank the card. */
function examTitle(examId) {
    const exam = exams.find((item) => item.id === examId);
    return exam ? exam.title : "Deleted exam";
}

function formatDate(value) {
    const date = new Date(value);
    if (isNaN(date)) return "—";

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function showEmpty() {
    historyGrid.innerHTML = `
    <div class="col-12">
      <div class="empty">
        <i class="bi bi-clock-history"></i>
        <p>No exams yet</p>
        <span>Your grades and exam history will appear here once you take your first exam.</span>
      </div>
    </div>`;
}

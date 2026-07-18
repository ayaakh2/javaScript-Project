/* ==========================================================================
   review.js — student/review.html
   Reads one result by ?id=, pairs each stored answer with its question, and
   lays them all out. Grading is NOT redone here for the mark — result.score
   is what exam.js stored. isCorrect() is only used per question, to decide
   which block is green and which option gets a tick.
   ========================================================================== */

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

const examTitleEl = document.getElementById("examTitle");
const examSubEl = document.getElementById("examSub");
const scoreValue = document.getElementById("scoreValue");
const reviewList = document.getElementById("reviewList");

window.onload = function () {
    const student = requireRole("student");
    if (!student) return;

    const id = Number(new URLSearchParams(window.location.search).get("id"));
    const result = findResult(id, student);
    if (!result) return;

    const exam = readStore(KEYS.EXAMS).find(
        (item) => item.id === result.examId,
    );
    if (!exam) {
        window.location.replace("dashboard.html");
        return;
    }

    examTitleEl.textContent = exam.title;
    examSubEl.textContent = submittedOn(result);
    scoreValue.textContent = `${result.score}/${result.total}`;

    renderQuestions(exam, result);
};

/** A result id in the URL is not proof of ownership. */
function findResult(id, student) {
    const found = readStore(KEYS.RESULTS).find((item) => item.id === id);

    if (!found || found.studentId !== student.id) {
        window.location.replace("dashboard.html");
        return null;
    }
    return found;
}

function submittedOn(result) {
    const date = new Date(result.submittedAt);
    if (isNaN(date)) return "";

    return (
        `Submitted ${date.toLocaleDateString()} at ` +
        `${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    );
}

/*   Answers   */
function answerFor(result, questionId) {
    const entry = result.answers.find((item) => item.questionId === questionId);
    return entry ? entry.answer : undefined;
}

function isBlank(answer) {
    if (answer === undefined || answer === null || answer === "") return true;
    if (Array.isArray(answer) && answer.length === 0) return true;
    return false;
}

/*   Render   */
function renderQuestions(exam, result) {
    let html = "";

    exam.questions.forEach(function (question, index) {
        const answer = answerFor(result, question.id);
        const blank = isBlank(answer);
        const correct = !blank && isCorrect(question, answer);

        html += questionBlock(question, index, answer, blank, correct);
    });

    reviewList.innerHTML = html;
}

function questionBlock(question, index, answer, blank, correct) {
    const body =
        question.type === "short"
            ? shortBody(question, answer, blank, correct)
            : optionsBody(question, answer, blank, correct);

    return `
    <article class="qblock ${correct ? "qblock--correct" : "qblock--wrong"}">
      <div class="qblock__head">
        <span class="qblock__num">Question ${index + 1}</span>
        ${badge(blank, correct)}
      </div>

      <p class="qblock__text">${escapeHtml(question.text)}</p>

      ${body}
    </article>`;
}

function badge(blank, correct) {
    if (correct) {
        return `<span class="qblock__badge qblock__badge--correct">
              <i class="bi bi-check-circle-fill"></i> Correct</span>`;
    }
    if (blank) {
        return `<span class="qblock__badge qblock__badge--wrong">
              <i class="bi bi-dash-circle-fill"></i> Not answered</span>`;
    }
    return `<span class="qblock__badge qblock__badge--wrong">
            <i class="bi bi-x-circle-fill"></i> Wrong</span>`;
}

/*   MCQ / True-False / Multiple   */
function optionsBody(question, answer, blank, blockCorrect) {
    const values = choiceValues(question);
    const isMultiple = question.type === "multiple";

    let rows = "";

    values.forEach(function (value, index) {
        const picked = blank
            ? false
            : isPicked(answer, value, index, isMultiple);
        const right = isMultiple
            ? question.correct.includes(index)
            : question.correct === value.stored;

        let cls = "";
        let tag = "";

        if (picked) {
            // A pick that happens to be right stays green even in a wrong block —
            // on Multiple Answers he was right about this one, just not complete.
            cls = right ? "qopt--right" : "qopt--wrong";
            tag = `<span class="qopt__tag qopt__tag--yours">Your answer</span>`;
        } else if (right && !blockCorrect) {
            cls = "qopt--right";
            tag = `<span class="qopt__tag qopt__tag--correct">Correct answer</span>`;
        }

        rows += `
      <div class="qopt ${cls}">
        <span class="qopt__marker ${isMultiple ? "qopt__marker--square" : ""}">${LETTERS[index]}</span>
        <span class="qopt__text">${escapeHtml(value.label)}</span>
        ${tag}
      </div>`;
    });

    return `<div class="qopts">${rows}</div>`;
}

function isPicked(answer, value, index, isMultiple) {
    if (isMultiple) return Array.isArray(answer) && answer.includes(index);
    return answer === value.stored;
}

/*   Short answer   */
function shortBody(question, answer, blank, correct) {
    const value = blank
        ? `<span class="qshort__value qshort__value--empty">Not answered</span>`
        : `<span class="qshort__value">${escapeHtml(answer)}</span>`;

    // Nothing is repeated on a correct block — he already knows what he typed.
    const line = correct
        ? ""
        : `
    <p class="qanswer">Correct answer: <strong>${escapeHtml(question.correct)}</strong></p>`;

    return `
    <div class="qshort ${correct ? "qshort--right" : "qshort--wrong"}">
      <span class="qshort__label">Your answer:</span>
      ${value}
    </div>
    ${line}`;
}

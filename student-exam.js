/* 
   exam.js — student/student-exam.html
   One question per screen. Answers are drafted to sessionStorage so a refresh
   doesn't wipe them; the draft is only promoted to a real result on submit.
   Leaving without submitting stores nothing — the exam stays available.
    */

const BUBBLES_PER_PAGE = 8;
const PASS_PERCENT = 50;

const examTitle = document.getElementById("examTitle");
const bubbles = document.getElementById("bubbles");
const questionHeading = document.getElementById("questionHeading");
const questionText = document.getElementById("questionText");
const questionHint = document.getElementById("questionHint");
const options = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const endExamBtn = document.getElementById("endExamBtn");

let student = null;
let exam = null;
let answers = {}; // { questionId: answer }
let currentIndex = 0;
let bubblePage = 0;
let draftKey = "";

/*   Boot   */
window.onload = function () {
    student = requireRole("student");
    if (!student) return;

    exam = findExamFromUrl();
    if (!exam) return; // findExamFromUrl already redirected

    draftKey = `examDraft:${exam.id}`;
    examTitle.textContent = `${exam.title} Exam`;

    loadDraft();
    render();
};

/**
 * Reads ?id= and validates it. A student must not reach this page for an exam
 * that doesn't exist, isn't active, or that they've already submitted.
 */
function findExamFromUrl() {
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    const found = readStore(KEYS.EXAMS).find((item) => item.id === id);

    if (
        !found ||
        found.status !== "active" ||
        !found.questions ||
        found.questions.length === 0
    ) {
        window.location.replace("student-dashboard.html");
        return null;
    }
    if (hasTakenExam(student.id, found.id)) {
        alert("You have already submitted this exam.");
        window.location.replace("student-dashboard.html");
        return null;
    }
    return found;
}

/*   Draft   */
function loadDraft() {
    const raw = sessionStorage.getItem(draftKey);
    if (!raw) return;

    const draft = JSON.parse(raw);
    answers = draft.answers || {};
    currentIndex = draft.currentIndex || 0;
    bubblePage = Math.floor(currentIndex / BUBBLES_PER_PAGE);
}

function saveDraft() {
    sessionStorage.setItem(
        draftKey,
        JSON.stringify({
            answers: answers,
            currentIndex: currentIndex,
        }),
    );
}

/*   Render   */
function render() {
    renderBubbles();
    renderQuestion();
    renderFooter();
}

/*   Bubbles   */
function renderBubbles() {
    const total = exam.questions.length;
    const pageCount = Math.ceil(total / BUBBLES_PER_PAGE);
    const start = bubblePage * BUBBLES_PER_PAGE;
    const slice = exam.questions.slice(start, start + BUBBLES_PER_PAGE);

    let html = "";

    if (pageCount > 1) {
        html += `<button class="bubble-arrow" data-page="${bubblePage - 1}"
              ${bubblePage === 0 ? "disabled" : ""} aria-label="Previous questions">
              <i class="bi bi-chevron-left"></i></button>`;
    }

    slice.forEach(function (question, offset) {
        const index = start + offset;
        const state = [
            isAnswered(question) ? "is-answered" : "",
            index === currentIndex ? "is-current" : "",
        ].join(" ");

        html += `<button class="bubble ${state}" data-index="${index}"
              aria-label="Question ${index + 1}">${index + 1}</button>`;
    });

    if (pageCount > 1) {
        html += `<button class="bubble-arrow" data-page="${bubblePage + 1}"
              ${bubblePage >= pageCount - 1 ? "disabled" : ""} aria-label="More questions">
              <i class="bi bi-chevron-right"></i></button>`;
    }

    bubbles.innerHTML = html;

    bubbles.querySelectorAll(".bubble").forEach(function (button) {
        button.onclick = function () {
            goTo(Number(button.dataset.index));
        };
    });

    bubbles.querySelectorAll(".bubble-arrow").forEach(function (button) {
        button.onclick = function () {
            bubblePage = Number(button.dataset.page);
            renderBubbles();
        };
    });
}

/*   Question + options   */
function renderQuestion() {
    const question = exam.questions[currentIndex];

    questionHeading.textContent = `Question ${currentIndex + 1}`;
    questionText.textContent = question.text;

    questionHint.classList.toggle("u-hidden", question.type !== "multiple");

    if (question.type === "short") {
        renderShortAnswer(question);
    } else {
        renderChoices(question);
    }
}

/** Builds the option list for mcq, truefalse and multiple. */
function renderChoices(question) {
    const letters = ["A", "B", "C", "D", "E", "F"];
    const values = choiceValues(question);
    const isMultiple = question.type === "multiple";
    const chosen = answers[question.id];

    let html = "";

    values.forEach(function (value, index) {
        const selected = isMultiple
            ? Array.isArray(chosen) && chosen.includes(index)
            : chosen === value.stored;

        html += `
      <button class="option ${selected ? "is-selected" : ""}" data-index="${index}">
        <span class="option__marker ${isMultiple ? "option__marker--square" : ""}">${letters[index]}</span>
        <span class="option__text">${escapeHtml(value.label)}</span>
      </button>`;
    });

    options.innerHTML = html;

    options.querySelectorAll(".option").forEach(function (button) {
        button.onclick = function () {
            chooseOption(question, Number(button.dataset.index), values);
        };
    });
}

function renderShortAnswer(question) {
    const value = answers[question.id];

    // The teacher decides the answer type, so this stays a plain text field —
    // the value is stored exactly as typed and normalised at grading time.
    options.innerHTML = `
    <label class="short-answer__label" for="shortAnswer">Your answer</label>
    <input type="text" id="shortAnswer" class="short-answer"
           placeholder="Type your answer" autocomplete="off"
           value="${value === undefined ? "" : escapeHtml(value)}">`;

    const input = document.getElementById("shortAnswer");

    input.oninput = function () {
        if (input.value.trim() === "") {
            delete answers[question.id];
        } else {
            answers[question.id] = input.value;
        }
        saveDraft();
        renderBubbles(); // only the bubble state changes — don't rebuild the input
    };
}

/*   Choosing   */
function chooseOption(question, index, values) {
    if (question.type === "multiple") {
        const chosen = Array.isArray(answers[question.id])
            ? answers[question.id]
            : [];
        const position = chosen.indexOf(index);

        if (position === -1) {
            chosen.push(index);
        } else {
            chosen.splice(position, 1); // tapping again clears it
        }

        if (chosen.length === 0) {
            delete answers[question.id];
        } else {
            answers[question.id] = chosen;
        }
    } else {
        answers[question.id] = values[index].stored;
    }

    saveDraft();
    render();
}

/*   Footer   */
function renderFooter() {
    const isLast = currentIndex === exam.questions.length - 1;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.classList.toggle("u-hidden", isLast); // last question: End Exam is the only way out
}

prevBtn.onclick = function () {
    goTo(currentIndex - 1);
};
nextBtn.onclick = function () {
    goTo(currentIndex + 1);
};

function goTo(index) {
    if (index < 0 || index >= exam.questions.length) return;

    currentIndex = index;
    bubblePage = Math.floor(currentIndex / BUBBLES_PER_PAGE);
    saveDraft();
    render();
}

/*   Answer checks   */
function isAnswered(question) {
    const answer = answers[question.id];

    if (answer === undefined || answer === null || answer === "") return false;
    if (Array.isArray(answer) && answer.length === 0) return false;

    return true;
}

/*   Submit   */
endExamBtn.onclick = function () {
    const unanswered = exam.questions.filter(function (question) {
        return !isAnswered(question);
    }).length;

    const message =
        unanswered > 0
            ? `You have ${unanswered} unanswered question${unanswered === 1 ? "" : "s"}. ` +
              `They will be marked wrong.\n\nEnd the exam anyway?`
            : "End the exam and submit your answers?";

    if (!confirm(message)) return;

    submitExam();
};

function submitExam() {
    const total = examTotalPoints(exam);
    let score = 0;

    const submitted = exam.questions.map(function (question) {
        const answer = answers[question.id];

        if (isCorrect(question, answer)) score += question.points || 1;

        return {
            questionId: question.id,
            answer: answer === undefined ? null : answer,
        };
    });

    const results = readStore(KEYS.RESULTS);

    const result = {
        id: nextResultId(results),
        examId: exam.id,
        studentId: student.id,
        answers: submitted,
        score: score,
        total: total,
        passed: (score / total) * 100 >= PASS_PERCENT,
        submittedAt: new Date().toISOString(),
    };

    results.push(result);
    writeStore(KEYS.RESULTS, results);

    sessionStorage.removeItem(draftKey); // the draft has served its purpose
    window.location.replace(`student-result.html?id=${result.id}&celebrate=1`);
}

/** Ids must survive deletions elsewhere, so take max + 1 rather than length. */
function nextResultId(results) {
    let highest = -1;
    results.forEach(function (result) {
        if (result.id > highest) highest = result.id;
    });
    return highest + 1;
}

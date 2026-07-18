const COUNT_UP_MS = 900;
const COUNT_UP_DELAY_MS = 600; // wait for the score's pop-in before counting

const stage = document.getElementById("stage");
const artPass = document.getElementById("artPass");
const artFail = document.getElementById("artFail");
const card = document.getElementById("card");
const title = document.getElementById("title");
const scoreEl = document.getElementById("score");
const reviewBtn = document.getElementById("reviewBtn");

window.onload = function () {
    const student = requireRole("student");
    if (!student) return;

    const params = new URLSearchParams(window.location.search);
    const result = findResult(Number(params.get("id")), student);
    if (!result) return; // findResult already redirected

    const celebrate = params.get("celebrate") === "1";
    if (!celebrate) document.body.classList.add("is-static");

    dressPage(result);
    reviewBtn.href = `student-review.html?id=${result.id}`;

    if (celebrate) {
        scoreEl.textContent = `0/${result.total}`;
        setTimeout(function () {
            countUp(result.score, result.total);
        }, COUNT_UP_DELAY_MS);
    } else {
        scoreEl.textContent = `${result.score}/${result.total}`;
    }
};

/**
 * A result id in the URL is not proof of ownership — without this check a
 * student could read someone else's score by editing the address bar.
 */
function findResult(id, student) {
    const found = readStore(KEYS.RESULTS).find((item) => item.id === id);

    if (!found || found.studentId !== student.id) {
        window.location.replace("student-dashboard.html");
        return null;
    }
    return found;
}

/*   Pass / fail dressing   */
function dressPage(result) {
    if (result.passed) {
        card.classList.add("result-card--pass");
        artPass.classList.remove("u-hidden");
        title.textContent = "Congratulations!";
    } else {
        stage.classList.add("result-stage--fail");
        card.classList.add("result-card--fail");
        artFail.classList.remove("u-hidden");
        title.textContent = "Unfortunately";
    }
}

/*   Score count-up   */
function countUp(score, total) {
    if (score === 0) {
        scoreEl.textContent = `0/${total}`;
        return;
    }

    const start = performance.now();

    function step(now) {
        const progress = Math.min((now - start) / COUNT_UP_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // fast, then settles

        scoreEl.textContent = `${Math.round(eased * score)}/${total}`;

        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

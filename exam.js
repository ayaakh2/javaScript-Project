const title = document.getElementById("title");
const date = document.getElementById("date");
const time = document.getElementById("time");
const All_questions = document.getElementById("All_questions");
const btn_add_exam = document.getElementById("add_exam");
const show = document.getElementById("exams");

const type = document.getElementById("type");
const questionText = document.getElementById("questionText");
const options = document.getElementById("options");
const correctAnswer = document.getElementById("correctAnswer");
const add_questions = document.getElementById("add_questions");
const edit_questions = document.getElementById("edit_question");
let arr_questions = [];
/*Exam*/
display_exams();
btn_add_exam.onclick = function () {
    add_exam();
    display_exams();
};

function add_exam() {
    const Exams = JSON.parse(localStorage.getItem("exams")) || [];
    const exam = {
        id: Exams.length, // student side reads exam.id
        title: title.value,
        dateTime: `${date.value} ${time.value}`, // student side reads one dateTime field
        status: "inactive", // lowercase to match the student side's status check
        questions: arr_questions,
    };
    Exams.push(exam);
    localStorage.setItem("exams", JSON.stringify(Exams));
    location.reload();
    alert("done");
}
function display_exams() {
    const Exams = JSON.parse(localStorage.getItem("exams")) || [];
    let text = ``;
    let isFind = false;
    Exams.forEach((exam, index) => {
        isFind = true;
        text += `<tr>
         <td>${index + 1}</td>
         <td>${exam.title}</td>
         <td>${exam.dateTime}</td>
         <td><input type="checkbox" ${exam.status == "active" ? "checked" : ""} onclick="Toggle_active_exam(${index})"></td> 
         <td onclick="Display_questions_by_exam(${index})">show</td>
         <td onclick="Display_questions_by_exam(${index})">show</td>
         </tr>`;
    });

    if (!isFind) show.innerHTML = `Sorry, we couldn't find any Exams.`;
    else
        show.innerHTML = `<table>
                <tr><th>#</th><th>Title</th><th>Date &amp; Time</th><th>status</th><th>Actions</th></tr>    
                ${text}</table>`;
}
function Display_questions_by_exam(id) {
    const Exams = JSON.parse(localStorage.getItem("exams")) || [];
    let text = ``;
    Exams[id].questions.forEach((question, index) => {
        text += `<tr>
            <td>${index + 1}</td>
            <td>${question.type}</td>
            <td>${question.text}</td>
            <td>${question.options}</td>
            <td>${question.correct}</td>
        </tr>`;
    });

    All_questions.innerHTML = `
    <table>
        <tr>
            <th>#</th>
            <th>type</th>
            <th>question Text</th>
            <th>options</th>
            <th>correct Answer</th>
        </tr>
        ${text}
    </table>
    `;
}
function Toggle_active_exam(id) {
    const Exams = JSON.parse(localStorage.getItem("exams")) || [];

    if (Exams[id].status == "active") Exams[id].status = "inactive";
    else Exams[id].status = "active";

    localStorage.setItem("exams", JSON.stringify(Exams));
    location.reload();
}

/*Questions*/

let id_edit = -1;
add_questions.onclick = function () {
    add_question_in_form();
    Display_question_in_form();
};

function add_question_in_form() {
    arr_questions.push(build_question(arr_questions.length)); // build in the student-side shape
}

// turns the form inputs into the shape the student pages grade against
function build_question(qId) {
    const opts = String(options.value)
        .split(",")
        .map((o) => o.trim())
        .filter((o) => o !== ""); // trim the comma-split
    return {
        id: qId, // student side reads question.id
        type: normalizeType(type.value), // map the teacher labels to the student keys
        text: questionText.value, // student side reads question.text
        options: opts,
        correct: normalizeCorrect(type.value, correctAnswer.value, opts), // student side reads question.correct
        points: 1, // one mark per question
    };
}

// MCQ -> mcq, Short_Answer -> short, true/false -> truefalse, Multiple -> multiple
function normalizeType(t) {
    if (t === "MCQ") return "mcq";
    if (t === "Short_Answer") return "short";
    if (t === "true/false") return "truefalse";
    if (t === "Multiple") return "multiple";
    return t;
}

// convert the typed answer(s) into the value the grader expects for each type
function normalizeCorrect(t, raw, opts) {
    const answers = String(raw)
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a !== ""); // trim the comma-split
    if (t === "MCQ") return opts.indexOf(answers[0]); // store the option index
    if (t === "true/false") return answers[0].toLowerCase() === "true"; // store a boolean
    if (t === "Short_Answer") return answers[0]; // store the value as typed
    if (t === "Multiple") return answers.map((a) => opts.indexOf(a)); // store an array of indexes
    return answers[0];
}
function Display_question_in_form() {
    let text = ``;
    arr_questions.forEach((question, index) => {
        text += `<tr>
            <td>${index + 1}</td>
            <td>${question.type}</td>
            <td>${question.text}</td>
            <td>${question.options}</td>
            <td>${question.correct}</td>
            <td onclick="delete_question_from_form(${index})">X</td>
            <td onclick="befor_edit_question(${index})">edit</td>
        </tr>`;
    });

    All_questions.innerHTML = `
    <table>
        <tr>
            <th>#</th>
            <th>type</th>
            <th>question Text</th>
            <th>options</th>
            <th>correct Answer</th>
            <th colspan="2">Action</th>
        </tr>
        ${text}
    </table>
    `;
}
edit_questions.onclick = function () {
    edit_question_in_form(id_edit);
    Display_question_in_form();
    id_edit = -1;
};
function befor_edit_question(id) {
    id_edit = id;
    type.value = denormalizeType(arr_questions[id].type); // show the teacher label in the dropdown
    questionText.value = arr_questions[id].text; // read the student-side field
    options.value = arr_questions[id].options.join(","); // options is an array now
    correctAnswer.value = correctToText(arr_questions[id]); // turn the stored answer back into text
    edit_questions.style.display = "block";
    add_questions.style.display = "none";
}

// student key -> teacher dropdown label
function denormalizeType(t) {
    if (t === "mcq") return "MCQ";
    if (t === "short") return "Short_Answer";
    if (t === "truefalse") return "true/false";
    if (t === "multiple") return "Multiple";
    return t;
}

// turn a stored correct value back into the comma text the form shows
function correctToText(q) {
    if (q.type === "mcq") return q.options[q.correct] ?? ""; // index back to option text
    if (q.type === "truefalse") return String(q.correct); // boolean back to "true"/"false"
    if (q.type === "multiple")
        return q.correct.map((i) => q.options[i]).join(","); // indexes back to text
    return q.correct; // short answer is already text
}
function edit_question_in_form(id) {
    arr_questions[id] = build_question(id); // rebuild in the student-side shape
    edit_questions.style.display = "none";
    add_questions.style.display = "block";

    questionText.value = ``;
    options.value = ``;
    correctAnswer.value = ``;
}
function delete_question_from_form(id) {
    if (id == 0) arr_questions.splice(0, 1);
    else arr_questions.splice(id, id);
    Display_question_in_form();
}

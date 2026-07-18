const show=document.getElementById("results");
const show_answer=document.getElementById("show_answer");

display_results();

function display_results(){
    const results=JSON.parse(localStorage.getItem("results"))||[];
    const exams=JSON.parse(localStorage.getItem("exams"))||[];
    const users=JSON.parse(localStorage.getItem("users"))||[];
    let text=``;

    

    results.forEach((result,index) => {
        text+=`<tr>
            <td>${index+1}</td>
            <td>${users[result.studentId].fullName}</td>
            <td>${exams[result.examId].title}</td>
            <td>${result.score} /${result.totalScore}</td>
            <td>${result.status}</td>
            <td>${result.date}</td>
            <td onclick="answer_by_exam(${index})"  data-bs-toggle="modal" data-bs-target="#myModal" class="btn btn--accent" >show</td>
        </tr>`;
    });

    show.innerHTML=`<table>
        <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Exam Title</th>
            <th>Result</th>
            <th>status</th>
            <th>Date</th>
            <th>Answer</th>
        </tr>
        ${text}
        </table>`;
}

function answer_by_exam(id){
    const results=JSON.parse(localStorage.getItem("results"))||[];
    //const exams=JSON.parse(localStorage.getItem("exams"))||[];
    let text=``;

    results[id].studentAnswers.forEach((Answer,index)=>{
         text+=`<tr>
            <td>${Answer.questionId}</td>
            <td>${Answer.userAnswer}</td>
            <td>${Answer.isCorrect} </td>
        </tr>`;

    });
     show_answer.innerHTML=`<table>
        <tr>
            <th>question</th>
            <th>Answer</th>
            <th>is Correct</th>
        </tr>
        ${text}
        </table>`
}

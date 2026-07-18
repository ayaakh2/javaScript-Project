const title=document.getElementById("title");
const date=document.getElementById("date");
const time=document.getElementById("time");
const All_questions=document.getElementById("All_questions");
const btn_add_exam=document.getElementById("add_exam");
const btn_edit_exam=document.getElementById("edit_exam");
const btn_add_new_question=document.getElementById("add_new_question");
const btn_add_popup=document.getElementById("add");
const show=document.getElementById("exams");

const type=document.getElementById("type");
const questionText=document.getElementById("questionText");
const options=document.getElementById("options");
const correctAnswer=document.getElementById("correctAnswer");
const add_questions=document.getElementById("add_questions");
const edit_questions=document.getElementById("edit_question");
const show_questions=document.getElementById("questions");
let arr_questions=[];

/*Exam*/
display_exams();
btn_add_popup.onclick=function(){
    title.value=``;
    date.value=``;
    time.value=``;
    All_questions.innerHTML=`<table>
                <tr>
                      <th>#</th>
                    <th>type</th>
                    <th>question Text</th>
                    <th>options</th>
                    <th>correct Answer</th>
                </tr>
              </table>`;
;}


btn_add_exam.onclick=function(){
    add_exam();
    display_exams();
}
function add_exam(){
const Exams=JSON.parse(localStorage.getItem("exams"))||[];
    const exam= {
        "examId": Exams.length,
        "title": title.value,
        "date": date.value,
        "time": time.value,
        "status": "Inactive", 
        "questions": arr_questions
    }
    Exams.push(exam);
    localStorage.setItem("exams",JSON.stringify(Exams));
    location.reload();
    alert("done");
}
function display_exams(){
    const Exams=JSON.parse(localStorage.getItem("exams"))||[];
    let text=``;
    let isFind=false;
    Exams.forEach((exam,index)=>{
         isFind=true;
         text+=`<tr>
         <td>${index+1}</td>
         <td>${exam.title}</td>
         <td>${exam.date}</td>
         <td>${exam.time}</td>
         <td><input type="checkbox" ${exam.status=="active"?"checked":""} onclick="Toggle_active_exam(${index})"></td> 
         <td onclick="Display_questions_by_exam(${index})"  data-bs-toggle="modal" data-bs-target="#myModal">show</td>
         <td onclick="befor_edit_form(${index})"  data-bs-toggle="modal" data-bs-target="#myModal">edit</td>
         </tr>`;
    })

    if(!isFind)
        show.innerHTML=`Sorry, we couldn't find any Exams.`;
    else
        show.innerHTML=`<table>
                <tr><th>#</th><th>Title</th><th>Date</th><th>Time</th><th>status</th><th colspan=2>Actions</th></tr>    
                ${text}</table>`;
}
function Display_questions_by_exam(id){
    const Exams=JSON.parse(localStorage.getItem("exams"))||[];
    let text=``;
    Exams[id].questions.forEach((question,index)=>{
        text+=`<tr>
            <td>${index+1}</td>
            <td>${question.type}</td>
            <td>${question.questionText}</td>
            <td>${question.options}</td>
            <td>${question.correctAnswer}</td>
        </tr>`
    })
    
    All_questions.innerHTML=`
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
    `
     
}
function Toggle_active_exam(id) {
    const Exams=JSON.parse(localStorage.getItem("exams"))||[];

    if(Exams[id].status=="active")
        Exams[id].status="inactive";
    else
        Exams[id].status="active";

    localStorage.setItem("exams",JSON.stringify(Exams));
    location.reload();
}
function befor_edit_form(id){
    btn_add_exam.style.display="none";
    btn_edit_exam.style.display="block";
    sessionStorage.setItem("id_edit",id+"")
    const Exams=JSON.parse(localStorage.getItem("exams"))||[];
    title.value=Exams[id].title;
    date.value=Exams[id].date;
    time.value=Exams[id].time;
    arr_questions=Exams[id].questions.map((question,index)=>{
         const edit_question2= {
        "questionId": index,
        "type": question.type,
        "questionText":question.questionText,
        "options":String(question.options).split(","),
        "correctAnswer": String(question.correctAnswer).split(",")
    }  
        return edit_question2;
    })
    Display_question_in_form();
   
}
btn_edit_exam.onclick=function(){
    edit_exam();
}
function edit_exam() {
    id=Number(sessionStorage.getItem("id_edit"));
    const Exams=JSON.parse(localStorage.getItem("exams"))||[];
    Exams[id].title=title.value;
    Exams[id].time=time.value;
    Exams[id].date=date.value;
    Exams[id].questions=arr_questions;
    localStorage.setItem("exams",JSON.stringify(Exams));
    
    btn_add_exam.style.display="block";
    btn_edit_exam.style.display="none";
    location.reload();

}

btn_add_new_question.onclick=function(){
    show_questions.style.display="block";
}

/*Questions*/
let id_edit=-1;
add_questions.onclick=function(){
    add_question_in_form();
    Display_question_in_form();
   // show_questions.style.display="none"
}
function add_question_in_form() {
    const question= {
        "questionId": arr_questions.length,
        "type": type.value,
        "questionText":questionText.value,
        "options":String(options.value).split(","),
        "correctAnswer": String(correctAnswer.value).split(",")
    }
    arr_questions.push(question);
}
function Display_question_in_form_by_exam(id) {
    const Exams=JSON.parse(localStorage.getItem("exams"))||[];
    let text=``;
    Exams[id].questions.forEach((question,index)=>{
        text+=`<tr>
            <td>${index+1}</td>
            <td>${question.type}</td>
            <td>${question.questionText}</td>
            <td>${question.options}</td>
            <td>${question.correctAnswer}</td>
            <td onclick="delete_question_from_form(${index})">X</td>
            <td onclick="befor_edit_question_from_form(${index})">edit</td>
        </tr>`
    })
    
    All_questions.innerHTML=`
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
    `
};
function Display_question_in_form() {
    let text=``;
    arr_questions.forEach((question,index)=>{
        text+=`<tr>
            <td>${index+1}</td>
            <td>${question.type}</td>
            <td>${question.questionText}</td>
            <td>${question.options}</td>
            <td>${question.correctAnswer}</td>
            <td onclick="delete_question_from_form(${index})">X</td>
            <td onclick="befor_edit_question_from_form(${index})">edit</td>
        </tr>`
    })
    
    All_questions.innerHTML=`
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
    `
};
edit_questions.onclick=function(){
    edit_question_in_form(id_edit);
    Display_question_in_form();
    id_edit=-1;
}
function befor_edit_question_from_form(id){
    id_edit=id;
    type.value=arr_questions[id].type;
    questionText.value=arr_questions[id].questionText;
    options.value=arr_questions[id].options;
    correctAnswer.value=arr_questions[id].correctAnswer;
    edit_questions.style.display="block";
    add_questions.style.display="none";
}
function edit_question_in_form(id) {
    const question= {
        "questionId": id,
        "type": type.value,
        "questionText":questionText.value,
        "options":String(options.value).split(","),
        "correctAnswer": String(correctAnswer.value).split(",")
    }
    arr_questions[id]=question;
    edit_questions.style.display="none";
    add_questions.style.display="block";

    questionText.value=``;
    options.value=``;
    correctAnswer.value=``;
}
function delete_question_from_form(id) {
    if(id==0)
        arr_questions.splice(0,1);
    else
        arr_questions.splice(id,id);
    Display_question_in_form();
};


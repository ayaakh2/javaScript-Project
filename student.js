const Full_Name=document.getElementById("Full_Name");
const username=document.getElementById("username");
const password=document.getElementById("password");
const phone=document.getElementById("phone");
const male=document.getElementById("male");
const female=document.getElementById("female");
const nationalId=document.getElementById("nationalId");
const submit=document.getElementById("submit");
const btn_edit=document.getElementById("edit");

const search_name=document.getElementById("search_name");
const search_btn=document.getElementById("search_btn");

const show=document.getElementById("show");
const show_results=document.getElementById("show_results");
const show_answer=document.getElementById("show_answer");

//add Student + Check username is used
submit.onclick=function(){
    add_user();
};

//Display All student in table
window.onload=function(){
    Display_all_student();
};

//Display searched student in table
search_name.oninput=function(){
    search_by_name(search_name.value)
}
search_btn.onclick=function(){
    search_by_name(search_name.value)
}

btn_edit.onclick=function(){
    edit_users();
}

let id_edit=-1;
function add_user() {
    let users=JSON.parse(localStorage.getItem("users"))||[];

    let user_name_is_used=false;
    users.forEach((user)=>{
        if(user.username==username.value)
            user_name_is_used=true;
    })
    if(!user_name_is_used){
        const student={
        "id": users.length,
        "role": "student",
        "fullName": Full_Name.value,
        "username": username.value,
        "password": password.value,
        "phone": phone.value,
        "gender":male.checked==true?"male":"female" ,
        "nationalId": nationalId.value
        }
        users.push(student);
        localStorage.setItem("users",JSON.stringify(users));
        location.reload();
        alert("done");
    }else{
        alert("user name is used")
    };
};

function befor_edit(id){
    let users=JSON.parse(localStorage.getItem("users"))||[];
    id_edit=id;

    Full_Name.value=users[id].fullName;
    username.value=users[id].username;
    phone.value=users[id].phone;
    users[id].gender=="male"?male.checked=true:female.checked=true;
    nationalId.value=users[id].nationalId;
    submit.style.display="none";
    password.style.display="none";
    btn_edit.style.display="Block";


}

function edit_users(){
    let users=JSON.parse(localStorage.getItem("users"))||[];
    let user_name_is_used=false;
     
    users.forEach((user)=>{
        if(user.username==username.value)
            user_name_is_used=true;
    })
    if(!user_name_is_used){
        const student={
        "id": users.length,
        "role": "student",
        "fullName": Full_Name.value,
        "username": username.value,
        "password": users[id_edit].password,
        "phone": phone.value,
        "gender":male.checked==true?"male":"female" ,
        "nationalId": nationalId.value
        }
        users[id_edit]=student;
        localStorage.setItem("users",JSON.stringify(users));
        
        submit.style.display="Block";
        password.style.display="Block";
        btn_edit.style.display="none";
        Full_Name.innerHTML=``;
        username.innerHTML=``;
        phone.innerHTML=``;
        nationalId.innerHTML=``;
        location.reload();
        alert("edited");
    }else{
        alert("user name is used")
    };

}

function Display_all_student(){
const users=JSON.parse(localStorage.getItem("users"))||[];
    let text=``;

    users.forEach((user,index) => {
        if(String(user.role)=="student"){
            isFind=true;
            text+=`<tr>
                <td>${user.fullName}</td>
                <td>${user.username}</td>
                <td>${user.phone}</td>
                <td>${user.gender}</td>
                <td>${user.nationalId}</td>
                <td onclick="befor_edit(${index})">edit</td>
                <td onclick="reuslt_by_user(${index})">show</td>
                </tr>`;
        }
    });
     if(!isFind)
        show.innerHTML=`Sorry, we couldn't find any students.`;
    else
        show.innerHTML=`<table>
                <tr>
                <th>Full Name</th>
                <th>username</th>
                <th>phone</th>
                <th>Gender</th>
                <th>national ID</th>
                <th colspan="2">Actions</th>
                </tr>    
                ${text}
                </table>`;
};

function search_by_name(name) {
    const users=JSON.parse(localStorage.getItem("users"));
    let text=``;
    let isFind=false;

    users.forEach((user) => {
        if(String(user.fullName).includes(name)&&String(user.role)=="student"){
            isFind=true;
            text+=`<tr>
                <td>${user.fullName}</td>
                <td>${user.username}</td>
                <td>${user.phone}</td>
                <td>${user.gender}</td>
                <td>${user.nationalId}</td>
                </tr>`;
        }
    });
    if(!isFind)
        show.innerHTML=`Sorry, we didn't find any results matching your search.`;
    else
        show.innerHTML=`<table>
                <tr><th>Full Name</th><th>username</th><th>phone</th><th>Gender</th><th>national ID</th></tr>    
                ${text}</table>`;
    
};

function reuslt_by_user(id){
    const users=JSON.parse(localStorage.getItem("users"))||[];
    const results=JSON.parse(localStorage.getItem("results"))||[];
    const exams=JSON.parse(localStorage.getItem("exams"))||[];

    let text=``;

    results.forEach((result,index) => {
        if(result.studentId==id){
            text+=`<tr>
                <td>${index+1}</td>
                <td>${exams[result.examId].title}</td>
                <td>${result.score} /${result.totalScore}</td>
                <td>${result.status}</td>
                <td>${result.date}</td>
                <td onclick="answer_by_exam(${result.examId})">show</td>
            </tr>`;
        }
    });

    show_results.innerHTML=`<table>
        <tr>
            <th>#</th>
            <th>Exam Title</th>
            <th>Result</th>
            <th>status</th>
            <th>Date</th>
            <th>Answer</th>
        </tr>
        ${text}
        </table>`;
};

function answer_by_exam(id){
    const results=JSON.parse(localStorage.getItem("results"))||[];
    const exams=JSON.parse(localStorage.getItem("exams"))||[];
    let text=``;

    results[id].studentAnswers.forEach((Answer,index)=>{
         text+=`<tr>
            <td>${Answer.questionId}</td>
            <td>${exams[id].questions[Answer.questionId-1].questionText}</td>
            <td>${Answer.userAnswer}</td>
            <td>${Answer.isCorrect} </td>
        </tr>`;

    });
     show_answer.innerHTML=`<table>
        <tr>
            <th>Question</th>
            <th>Question Title</th>
            <th>Answer</th>
            <th>is Correct</th>
        </tr>
        ${text}
        </table>`
}


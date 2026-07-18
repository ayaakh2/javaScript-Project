const Full_Name=document.getElementById("Full_Name");
const username=document.getElementById("username");
const password=document.getElementById("password");
const phone=document.getElementById("phone");
const male=document.getElementById("male");
const female=document.getElementById("female");
const nationalId=document.getElementById("nationalId");
const submit=document.getElementById("submit");
const btn_edit=document.getElementById("edit");
const btn_add=document.getElementById("add");

const search_name=document.getElementById("search_name");
const search_btn=document.getElementById("search_btn");

const show=document.getElementById("show");
const show_results=document.getElementById("show_results");
const show_answer=document.getElementById("show_answer");



btn_add.onclick=function(){
    Full_Name.value=``;
    username.value=``;
    password.value=``;
    phone.value=``;
    nationalId.value=``;
    submit.style.display="Block";
    password.style.display="Block";
    btn_edit.style.display="none";
}

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
        "id": id_edit,
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
    show.style.display="block";
    show_results.style.display="none";
    

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
                <td class="d-flex  justify-content-center gap-3">
                <div onclick="befor_edit(${index})" class="bg-orange" data-bs-toggle="modal" data-bs-target="#myModal"><i class="bi bi-pencil"></i></div>    
                <div onclick="reuslt_by_user(${index})" class="bg-orange"><i class="bi bi-eye"></i></div>
                </td>
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
                <th>Phone Number</th>
                <th>Gender</th>
                <th>national ID</th>
                <th>Actions</th>
                </tr>    
                ${text}
                </table>`;
};

function search_by_name(name) {
    const users=JSON.parse(localStorage.getItem("users"));
    let text=``;
    let isFind=false;

    users.forEach((user,index) => {
        if(String(user.fullName).includes(name)&&String(user.role)=="student"){
            isFind=true;
            text+=`<tr>
                <td>${user.fullName}</td>
                <td>${user.username}</td>
                <td>${user.phone}</td>
                <td>${user.gender}</td>
                <td>${user.nationalId}</td>
                <td class="d-flex  justify-content-center gap-3">
                <div onclick="befor_edit(${index})" class="bg-orange" data-bs-toggle="modal" data-bs-target="#myModal"><i class="bi bi-pencil"></i></div>    
                <div onclick="reuslt_by_user(${index})" class="bg-orange"><i class="bi bi-eye"></i></div>
                </td>
                </tr>`;
        }
    });
    if(!isFind)
        show.innerHTML=`Sorry, we didn't find any results matching your search.`;
    else
        show.innerHTML=`<table>
                <tr>
                <th>Full Name</th>
                <th>username</th>
                <th>Phone Number</th>
                <th>Gender</th>
                <th>national ID</th>
                <th>Actions</th>
                </tr>    
                ${text}
                </table>`;
    
};

function reuslt_by_user(id){
    show.style.display="none";
    show_results.style.display="block";
   

    const users=JSON.parse(localStorage.getItem("users"))||[];
    const results=JSON.parse(localStorage.getItem("results"))||[];
    const exams=JSON.parse(localStorage.getItem("exams"))||[];

    let text=``;

    results.forEach((result,index) => {
        if(result.studentId==id){
            text+=`<tr>
                <td>${result.examId}</td>
                <td>${exams[result.examId].title}</td>
                <td>${result.score} /${result.totalScore}</td>
                <td><div class="status ${result.status=="pass"?"pass":"Failed"}">${result.status}</div></td>
                <td>${result.date}</td>
                <td onclick="answer_by_exam(${index})" class="d-flex justify-content-center accent" data-bs-toggle="modal" data-bs-target="#answer" id="add">View</td>
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
            <th>Answers</th>
        </tr>
        ${text}
        </table>
        
        <button onclick="Display_all_student()" class="btn_border">back</button>
        `;
};

function answer_by_exam(id){

    const results=JSON.parse(localStorage.getItem("results"))||[];
    const exams=JSON.parse(localStorage.getItem("exams"))||[];
    if (!results[id]) {
        alert(`Result index ${id} not found.`);
        return;
    }
    let text=``;

    results[id].studentAnswers.forEach((Answer,index)=>{
         text+=`<tr>
            <td>${Answer.questionId}</td>
            <td>${(exams[results[id].examId].questions[Answer.questionId].questionText)}</td>
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


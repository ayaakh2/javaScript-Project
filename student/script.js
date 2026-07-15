const Full_Name=document.getElementById("Full_Name");
const username=document.getElementById("username");
const password=document.getElementById("password");
const phone=document.getElementById("phone");
const male=document.getElementById("male");
const female=document.getElementById("female");
const nationalId=document.getElementById("nationalId");
const submit=document.getElementById("submit");

const search_name=document.getElementById("search_name");
const search_btn=document.getElementById("search_btn");

const show=document.getElementById("show");

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
}

function Display_all_student(){
const users=JSON.parse(localStorage.getItem("users"))||[];
    let text=``;

    users.forEach((user) => {
        if(String(user.role)=="student"){
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
        show.innerHTML=`Sorry, we couldn't find any students.`;
    else
        show.innerHTML=`<table>
                <tr><th>Full Name</th><th>username</th><th>phone</th><th>Gender</th><th>national ID</th></tr>    
                ${text}</table>`;
}

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
    
}


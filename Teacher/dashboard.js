const greeting = document.getElementById("greeting");
const Total_Students = document.getElementById("Total_Students");
const Active_Exams = document.getElementById("Active_Exams");
const Inactive_Exams = document.getElementById("Inactive_Exams");
const examGrid = document.getElementById("examGrid");

const exams=JSON.parse(localStorage.getItem("exams"));
window.onload = function () {
    //const Teacher = JSON.parse(sessionStorage.getItem("login"));
    //if (!Teacher) return; // guard already redirected

    //showGreeting(Teacher);
    showStats();
    display_exams_by_last_week()
};


//    Greeting
function showGreeting(user) {
    greeting.textContent = `Welcome back ${user.fullName},`;
}

//    Stat cards
function showStats() {
    const Students=JSON.parse(localStorage.getItem("users"));
    Total_Students_counter=0;
    Students.forEach((student) => {
        Total_Students_counter++;
    });
    Total_Students.innerHTML=Total_Students_counter;

    
    Active_Exams_counter=0;
    Inactive_Exams_counter=0;
    exams.forEach((exam) => {
        if(exam.status=="active")
            Active_Exams_counter++;
        else
            Inactive_Exams_counter++;
    });
    Active_Exams.innerHTML=Active_Exams_counter;
    Inactive_Exams.innerHTML=Inactive_Exams_counter;
}

function display_exams_by_last_week(){
    const oneWeekAgo = new Date(Date.now() - 3 * 86400000/*= one day*/ );
    let text=``;
    

    exams.forEach((exam)=>{
        if(new Date(exam.date)>oneWeekAgo && new Date(exam.date)<new Date(Date.now()))
            text+=`<tr>
                <td>${exam.title}</td>
                <td>${exam.date}</td>
                <td>${exam.time}</td>
                <td>${exam.questions.length} Questions</td>
                <td class="status ${exam.status=="active"?"active":"inactive"}">${exam.status}</td>
            </tr>`;
    })
    examGrid.innerHTML=`<table>
        <tr>
            <th>Exam Title</th>
            <th>Date</th>
            <th>Time</th>
            <th>Questions</th>
            <th>Status</th>
        </tr>
        ${text}
    </table>`   ;
}



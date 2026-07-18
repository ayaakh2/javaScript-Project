const firstNames = [
  "Ahmad",
  "Omar",
  "Ali",
  "Hassan",
  "Kareem",
  "Tariq",
  "Ziad",
  "Yousef",
  "Khalid",
  "Bilal",
  "Faisal",
  "Sami",
  "Fatima",
  "Aisha",
  "Mariam",
  "Laila",
  "Nour",
  "Huda",
  "Rana",
  "Salma",
  "Maha",
  "Yasmin",
  "Hiba",
  "Sara",
];
const lastNames = [
  "Abdullah",
  "Al-Masri",
  "Haddad",
  "Najjar",
  "Mansour",
  "Mahmoud",
  "Ibrahim",
  "Yassin",
  "Suleiman",
  "Khalil",
  "Qasim",
  "Zayed",
  "Saleh",
  "Salem",
  "Saad",
];

const femaleNames = [
  "Fatima",
  "Aisha",
  "Mariam",
  "Laila",
  "Nour",
  "Huda",
  "Rana",
  "Salma",
  "Maha",
  "Yasmin",
  "Hiba",
  "Sara",
];

const users = [
  {
    id: 0,
    role: "teacher",
    fullName: "Ahmad Ali",
    username: "Admin",
    password: "Admin",
    phone: "0790000000",
    gender: "Male",
    nationalId: "1234567890",
  },
];

for (let i = 1; i <= 29; i++) {
  let fname = firstNames[Math.floor(Math.random() * firstNames.length)];
  let lname = lastNames[Math.floor(Math.random() * lastNames.length)];
  let gender = femaleNames.includes(fname) ? "Female" : "Male";

  users.push({
    id: i,
    role: "student",
    fullName: `${fname} ${lname}`,
    username: `student${i}`,
    password: `pass${i}`,
    phone: `079${Math.floor(1000000 + Math.random() * 9000000)}`,
    gender: gender,
    nationalId: `20000000${i.toString().padStart(2, "0")}`,
  });
}

const today = new Date();
const twoMonthsAgo = new Date(
  today.getFullYear(),
  today.getMonth() - 2,
  today.getDate(),
);
const twoMonthsFuture = new Date(
  today.getFullYear(),
  today.getMonth() + 2,
  today.getDate(),
);

const examSubjects = [
  "Mathematics",
  "Science",
  "English Literature",
  "World History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Physical Education",
  "Art",
  "Music",
  "Economics",
  "Business",
  "Programming",
  "Networking",
  "Databases",
  "Psychology",
  "Sociology",
  "Philosophy",
];

const exams = [];
for (let i = 0; i < 20; i++) {
  const randomTime =
    twoMonthsAgo.getTime() +
    Math.random() * (twoMonthsFuture.getTime() - twoMonthsAgo.getTime());
  const examDateObj = new Date(randomTime);
  const examDateStr = `${examDateObj.getFullYear()}-${String(examDateObj.getMonth() + 1).padStart(2, "0")}-${String(examDateObj.getDate()).padStart(2, "0")}`;

  exams.push({
    examId: i,
    title: `${examSubjects[i]} Exam`,
    date: examDateStr,
    time: "10:00",
    status: examDateObj > today ? "active" : "completed",
    _dateObj: examDateObj,
    questions: [
      {
        questionId: 1,
        type: "True/False",
        questionText:
          "This subject is considered a core part of the curriculum.",
        options: ["True", "False"],
        correctAnswer: "True",
      },
      {
        questionId: 2,
        type: "MCQ",
        questionText:
          "What is the appropriate difficulty rating for this exam?",
        options: ["Very Easy", "Medium", "Hard", "Challenging"],
        correctAnswer: "Medium",
      },
      {
        questionId: 3,
        type: "Checkbox",
        questionText:
          "Select the chapters you reviewed for the exam (choose multiple):",
        options: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"],
        correctAnswer: ["Chapter 1", "Chapter 2"],
      },
      {
        questionId: 4,
        type: "Number",
        questionText:
          "How many semesters are there in a standard academic year? (Number from 0 to 9)",
        options: [],
        correctAnswer: "2",
      },
    ],
  });
}

const results = [];
let resultIdCounter = 0;

for (let studentId = 1; studentId <= 29; studentId++) {
  let numExamsTaken = Math.floor(Math.random() * 16) + 5;
  let shuffledExams = [...exams].sort(() => 0.5 - Math.random());
  let takenExams = shuffledExams.slice(0, numExamsTaken);

  takenExams.forEach((exam) => {
    let studentAnswers = [];
    let score = 0;
    let totalScore = exam.questions.length * 25;

    exam.questions.forEach((q) => {
      let isCorrect = Math.random() > 0.3;
      let userAnswer;

      if (isCorrect) {
        userAnswer = q.correctAnswer;
        score += 25;
      } else {
        if (q.type === "True/False")
          userAnswer = q.correctAnswer === "True" ? "False" : "True";
        else if (q.type === "MCQ")
          userAnswer = q.options.find((opt) => opt !== q.correctAnswer);
        else if (q.type === "Checkbox") userAnswer = ["Chapter 3"];
        else if (q.type === "Number") userAnswer = "5";
      }

      studentAnswers.push({
        questionId: q.questionId,
        userAnswer: userAnswer,
        isCorrect: isCorrect,
      });
    });

    let resultDateObj = new Date(
      exam._dateObj.getTime() + Math.random() * (3 * 24 * 60 * 60 * 1000),
    );

    let hours = String(resultDateObj.getHours()).padStart(2, "0");
    let minutes = String(resultDateObj.getMinutes()).padStart(2, "0");

    let resultDateStr = `${resultDateObj.getFullYear()}-${String(resultDateObj.getMonth() + 1).padStart(2, "0")}-${String(resultDateObj.getDate()).padStart(2, "0")} ${hours}:${minutes}:00`;

    results.push({
      resultId: resultIdCounter++,
      studentId: studentId,
      examId: exam.examId,
      score: score,
      totalScore: totalScore,
      status: score >= 50 ? "pass" : "fail",
      date: resultDateStr,
      studentAnswers: studentAnswers,
    });
  });
}

exams.forEach((exam) => delete exam._dateObj);

localStorage.setItem("users", JSON.stringify(users));
localStorage.setItem("exams", JSON.stringify(exams));
localStorage.setItem("results", JSON.stringify(results));

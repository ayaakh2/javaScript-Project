const users=[
  {
    "id": 0,
    "role": "teacher",
    "fullName": "Ahmad Ali",
    "username": "admin",
    "password": "password123",
    "phone": "0790000000",
    "gender": "Male",
    "nationalId": "1234567890"
  },
  {
    "id": 1,
    "role": "student",
    "fullName": "محمد الطالب",
    "username": "student1",
    "password": "passStudent",
    "phone": "0791111111",
    "gender": "Male",
    "nationalId": "0987654321"
  }
];
const exam=[
  {
    "examId": 0,
    "title": "Programming exam",
    "date": "2024-7-14",
    "time": "10:00 PM",
    "status": "active", 
    "questions": [
      {
        "questionId": 0,
        "type": "MCQ",
        "questionText": "What is the language used to build a web page structure?",
        "options": ["HTML", "CSS", "Python", "Java"],
        "correctAnswer": "HTML"
      },
      {
        "questionId": 1,
        "type": "Short Answer",
        "questionText": "How many bits are in one byte?",
        "options": [],
        "correctAnswer": "8"
      }
    ]
  }
]
console.log(exam[0].questions.length);

const results=[
  {
    "resultId": 0,
    "studentId": 2, 
    "examId": 0,
    "score": 50, 
    "totalScore": 100,
    "status": "fail", 
    "date": "2026-7-14 1:30:00 PM",
    "studentAnswers": [
      {
        "questionId": 1,
        "userAnswer": "CSS", 
        "isCorrect": false
      },
      {
        "questionId": 2,
        "userAnswer": "8",
        "isCorrect": true
      }
    ]
  }
]
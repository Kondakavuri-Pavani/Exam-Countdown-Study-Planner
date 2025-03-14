let exams = JSON.parse(localStorage.getItem("exams")) || [];

function addExam() {
    let name = document.getElementById("exam-name").value;
    let date = document.getElementById("exam-date").value;
    let subjects = document.getElementById("exam-subjects").value.split(",");
    let subtopics = document.getElementById("exam-subtopics").value.split(",");
    
    let studyHours = document.getElementById("study-hours").value || 0;
    let studyMinutes = document.getElementById("study-minutes").value || 0;
    let subtopicHours = document.getElementById("subtopic-hours").value || 0;
    let subtopicMinutes = document.getElementById("subtopic-minutes").value || 0;

    if (name && date && subjects.length > 0) {
        let today = new Date();
        let examDate = new Date(date);
        let daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
        
        let exam = { 
            name, 
            date, 
            daysLeft, 
            subjects, 
            subtopics, 
            studyTime: `${studyHours}h ${studyMinutes}m`,
            subtopicTime: `${subtopicHours}h ${subtopicMinutes}m`
        };

        exams.push(exam);
        localStorage.setItem("exams", JSON.stringify(exams));
        updateExamList();
        generateFlowchart();
    } else {
        alert("Please fill out all fields.");
    }
}

function updateExamList() {
    let examsList = document.getElementById("exams-list");
    examsList.innerHTML = "";
    
    exams.forEach((exam, index) => {
        let examItem = document.createElement("div");
        examItem.classList.add("exam-item");
        examItem.innerHTML = `
            <span>${exam.name} - ${exam.date} (in ${exam.daysLeft} days)</span>
            <p>📖 Study Topics: ${exam.subjects.join(", ")}</p>
            <p>📌 Sub-topics: ${exam.subtopics.join(", ")}</p>
            <p>⏳ Study Time: ${exam.studyTime} per topic</p>
            <p>⏳ Study Time: ${exam.subtopicTime} per sub-topic</p>
            <button onclick="deleteExam(${index})" class="delete-btn">Delete</button>
        `;
        examsList.appendChild(examItem);
    });
}

function deleteExam(index) {
    exams.splice(index, 1);
    localStorage.setItem("exams", JSON.stringify(exams));
    updateExamList();
    generateFlowchart();
}

function showPreviousPlans() {
    exams = JSON.parse(localStorage.getItem("exams")) || [];
    updateExamList();
    generateFlowchart();
}

function generateFlowchart() {
    let chartData = "graph TD;\n";
    exams.forEach((exam, i) => {
        chartData += `Exam${i}["📅 ${exam.name} - ${exam.date}\\n(in ${exam.daysLeft} days)"];\n`;
        exam.subjects.forEach((subject, j) => {
            chartData += `Subject${i}${j}["📖 ${subject} - ${exam.studyTime}"] --> Exam${i};\n`;
            exam.subtopics.forEach((sub, k) => {
                chartData += `Sub${i}${j}${k}["📌 ${sub} - ${exam.subtopicTime}"] --> Subject${i}${j};\n`;
            });
        });
    });

    document.getElementById("flowchart").innerHTML = `<div class="mermaid">${chartData}</div>`;
    mermaid.init(undefined, document.querySelectorAll(".mermaid"));
}

showPreviousPlans();

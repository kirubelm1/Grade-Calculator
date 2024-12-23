// Initialize an array to store students' data
let students = JSON.parse(localStorage.getItem('students')) || [];

// Elements
const studentNameInput = document.getElementById('student-name');
const addStudentButton = document.getElementById('add-student');
const studentList = document.getElementById('student-list');
const createReportButton = document.getElementById('create-report');
const reportCardSlip = document.getElementById('report-card-slip');

// Add Student
addStudentButton.addEventListener('click', () => {
    const studentName = studentNameInput.value.trim();
    if (studentName) {
        const student = {
            name: studentName,
            subjects: []
        };
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
        renderStudentList();
        studentNameInput.value = '';
    }
});

// Render the student list with subjects and grades
function renderStudentList() {
    studentList.innerHTML = '';
    students.forEach((student, index) => {
        const studentDiv = document.createElement('div');
        studentDiv.classList.add('student-container');
        studentDiv.innerHTML = `
            <h3>${student.name}</h3>
            <div>
                <input type="text" class="subject-name" placeholder="Subject" />
                <input type="number" class="subject-grade" placeholder="Grade" />
                <button class="add-subject" data-index="${index}">Add Subject</button>
            </div>
            <ul class="subjects-list"></ul>
        `;
        studentDiv.querySelector('.add-subject').addEventListener('click', () => addSubject(index));
        studentList.appendChild(studentDiv);
        renderSubjects(index);
    });
}

// Add Subject
function addSubject(studentIndex) {
    const subjectNameInput = document.querySelectorAll('.subject-name')[studentIndex];
    const subjectGradeInput = document.querySelectorAll('.subject-grade')[studentIndex];
    const subjectName = subjectNameInput.value.trim();
    const subjectGrade = parseFloat(subjectGradeInput.value);

    if (subjectName && !isNaN(subjectGrade)) {
        students[studentIndex].subjects.push({ name: subjectName, grade: subjectGrade });
        localStorage.setItem('students', JSON.stringify(students));
        renderStudentList();
        subjectNameInput.value = '';
        subjectGradeInput.value = '';
    }
}

// Render Subjects for each student
function renderSubjects(studentIndex) {
    const student = students[studentIndex];
    const subjectsList = studentList.children[studentIndex].querySelector('.subjects-list');
    subjectsList.innerHTML = '';
    student.subjects.forEach(subject => {
        const li = document.createElement('li');
        li.textContent = `${subject.name}: ${subject.grade}`;
        subjectsList.appendChild(li);
    });
}

// Calculate average and rank
function calculateAverage(studentIndex) {
    const student = students[studentIndex];
    const totalGrades = student.subjects.reduce((sum, subject) => sum + subject.grade, 0);
    return totalGrades / student.subjects.length;
}

// Create Report Card Slip
createReportButton.addEventListener('click', () => {
    let reportHTML = '<h2>Student Report Cards</h2>';
    students.forEach(student => {
        const average = calculateAverage(students.indexOf(student));
        reportHTML += `
            <div class="report-card-slip">
                <h3>${student.name}</h3>
                <table>
                    <thead>
                        <tr><th>Subject</th><th>Grade</th></tr>
                    </thead>
                    <tbody>
                        ${student.subjects.map(subject => `<tr><td>${subject.name}</td><td>${subject.grade}</td></tr>`).join('')}
                    </tbody>
                </table>
                <p><strong>Average: </strong>${average.toFixed(2)}</p>
            </div>
        `;
    });
    reportCardSlip.innerHTML = reportHTML;
    reportCardSlip.style.display = 'block';
});

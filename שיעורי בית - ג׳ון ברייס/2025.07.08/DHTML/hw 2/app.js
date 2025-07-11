const STUDENT_KEY_NAME = "student-info";

function addStudentInfoAndGrade(event) {
  event.preventDefault(); // prevent form submission
  const data = collectDataFromForm();
  const newTR = generateTR(data);
  injectTRToDOM(newTR);
  saveStudentInfoToLocalStorage(data);
  clearForm();
}

function collectDataFromForm() {
  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const grade = document.getElementById("grade").value;

  return {
    firstName,
    lastName,
    grade,
  };
}

function generateTR(data) {
  const newTR = `
        <tr>
            <td>${data.firstName}</td>
            <td>${data.lastName}</td>
            <td>${data.grade}</td>
        </tr>
    `;
  return newTR;
}

function injectTRToDOM(newTR) {
  document.getElementById("student-list").innerHTML += newTR;
}

function loadStudentInfoFromStorage() {
  const studentsJSON = localStorage.getItem(STUDENT_KEY_NAME);
  if (studentsJSON) {
    const students = JSON.parse(studentsJSON);
    for (const student of students) {
      const newTR = generateTR(student);
      injectTRToDOM(newTR);
    }
  }
}

function saveStudentInfoToLocalStorage(student) {
  const studentsJSON = localStorage.getItem(STUDENT_KEY_NAME) || "[]";
  const students = JSON.parse(studentsJSON);
  students.push(student);
  localStorage.setItem(STUDENT_KEY_NAME, JSON.stringify(students));
  getAverage(students);
}

function clearForm() {
  document.getElementById("students-form").reset();
}

function getAverage(students) {
    let counter = 0;
    let sum = 0;

    for (const student of students) {
        let grade = +(student.grade);
        sum += grade;
        counter++;
    }
    const average = counter > 0 ? (sum / counter).toFixed(2) : 0;
    document.getElementById("grades-avg").innerHTML = `Grades average: ${average}`;
}

function loadAverageFromData() {
  const studentsJSON = localStorage.getItem(STUDENT_KEY_NAME) || "[]";
  const students = JSON.parse(studentsJSON);
  getAverage(students);
}

loadStudentInfoFromStorage();
loadAverageFromData();
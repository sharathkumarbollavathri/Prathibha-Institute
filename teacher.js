// Switch sections based on button clicks    //***active current code***
document.getElementById('homeBtn').addEventListener('click', () => {
    toggleSection('homeSection');
});
document.getElementById('studentsBtn').addEventListener('click', () => {
    toggleSection('studentsSection');
    loadStudents();  // Dynamically load student data
});
document.getElementById('attendanceBtn').addEventListener('click', () => {
    toggleSection('attendanceSection');
    loadAttendance();  // Dynamically load attendance data
});
document.getElementById('feedbackBtn').addEventListener('click', () => {
    toggleSection('feedbackSection');
    loadFeedback();  // Dynamically load feedback data
});

// Toggle between sections (show/hide)
function toggleSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('d-none'));  // Hide all sections
    document.getElementById(sectionId).classList.remove('d-none');  // Show the selected section
}

// Dynamically load student data
function loadStudents() {
    const students = [
        { name: 'Alice Smith', rollNo: '101' },
        { name: 'Bob Johnson', rollNo: '102' },
        { name: 'Charlie Lee', rollNo: '103' }
    ];
    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '';  // Clear previous student list
    students.forEach(student => {
        const studentCard = `
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        ${student.name}
                    </div>
                    <div class="card-body">
                        <p>Roll No: <a href="#" onclick="showStudentDetails('${student.rollNo}')">${student.rollNo}</a></p>
                    </div>
                </div>
            </div>
        `;
        studentsList.innerHTML += studentCard;
    });
}

// Dynamically load attendance data
function loadAttendance() {
    const students = [
        { rollNo: '101' },
        { rollNo: '102' },
        { rollNo: '103' }
    ];

    const dates = ['2025-02-01', '2025-02-02', '2025-02-03']; // Static dates for structure

    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';  // Clear previous attendance list

    let tableHTML = `<table class="table">
        <thead>
            <tr>
                <th>Roll No</th>`;

    // Add column headers for each date
    dates.forEach(date => {
        tableHTML += `<th>${date}</th>`;
    });
    tableHTML += `</tr></thead><tbody>`;

    // Add rows for each student
    students.forEach(student => {
        tableHTML += `<tr>
            <td>${student.rollNo}</td>`;
        dates.forEach(() => {
            tableHTML += `<td>Present/Absent</td>`; // Placeholder for attendance data
        });
        tableHTML += `</tr>`;
    });

    tableHTML += `</tbody></table>`;
    attendanceList.innerHTML = tableHTML;
}

// Dynamically load feedback data
function loadFeedback() {
    const feedback = [
        { rollNo: '101', message: 'Great class!' },
        { rollNo: '102', message: 'Could be more interactive.' },
        { rollNo: '103', message: 'I enjoyed the lesson.' }
    ];
    const feedbackList = document.getElementById('feedbackList');
    feedbackList.innerHTML = '';  // Clear previous feedback list
    feedback.forEach(record => {
        const feedbackCard = `
            <div class="card">
                <div class="card-header">
                    Roll No: ${record.rollNo}
                </div>
                <div class="card-body">
                    <p>Feedback: ${record.message}</p>
                </div>
            </div>
        `;
        feedbackList.innerHTML += feedbackCard;
    });
}

// Show details of a student
function showStudentDetails(rollNo) {
    const studentDetails = {
        '101': { name: 'Alice Smith', dob: '01-Jan-2000', parentName: 'John Smith', mobileNo: '1234567890', address: '123 Main St', feeDue: '500' },
        '102': { name: 'Bob Johnson', dob: '10-Feb-2001', parentName: 'Sarah Johnson', mobileNo: '9876543210', address: '456 Oak St', feeDue: '200' },
        '103': { name: 'Charlie Lee', dob: '05-Mar-2002', parentName: 'David Lee', mobileNo: '1122334455', address: '789 Pine St', feeDue: '300' }
    };

    const student = studentDetails[rollNo];
    alert(`Name: ${student.name}\nDOB: ${student.dob}\nParent: ${student.parentName}\nMobile: ${student.mobileNo}\nAddress: ${student.address}\nFee Due: ${student.feeDue}`);
}
// teacher.js

// Function to handle logout
function logout() {
    // Redirect to the dashboard page (replace 'dashboard.html' with your actual dashboard page URL)
    window.location.href = 'index.html';
}

// Add event listener to the logout button
document.getElementById('logoutBtn').addEventListener('click', logout);
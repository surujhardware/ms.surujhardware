/* ================================
   EMPLOYEE ATTENDANCE & SALARY
================================ */

let employees = JSON.parse(localStorage.getItem("employees")) || [];

/* ADD EMPLOYEE */
function addEmployee() {
    const name = empName.value.trim();
    const salary = Number(empSalary.value);

    if (!name || salary <= 0) {
        alert("Enter valid name and salary");
        return;
    }

    employees.push({
        name,
        salary,
        attendance: {},
        salaryPaid: false,
        paidDate: null
    });

    localStorage.setItem("employees", JSON.stringify(employees));

    empName.value = "";
    empSalary.value = "";

    renderEmployees();
}

/* MARK ATTENDANCE */
function markAttendance(index, status) {
    const today = new Date().toDateString();
    employees[index].attendance[today] = status;
    localStorage.setItem("employees", JSON.stringify(employees));
    renderEmployees();
}

/* PAY SALARY */
function paySalary(index) {
    employees[index].salaryPaid = true;
    employees[index].paidDate = new Date().toLocaleDateString();
    localStorage.setItem("employees", JSON.stringify(employees));
    renderEmployees();
}

/* RENDER TABLE */
function renderEmployees() {
    empTable.innerHTML = "";

    employees.forEach((emp, i) => {
        empTable.innerHTML += `
        <tr>
            <td>${emp.name}</td>
            <td>₹ ${emp.salary}</td>
            <td>
                <button onclick="markAttendance(${i}, 'Present')">Present</button>
                <button onclick="markAttendance(${i}, 'Absent')">Absent</button>
            </td>
            <td>
                ${emp.salaryPaid ? 
                "Paid on " + emp.paidDate : 
                "Unpaid"}
            </td>
            <td>
                ${emp.salaryPaid ? "-" :
                `<button onclick="paySalary(${i})">Pay Salary</button>`}
            </td>
        </tr>
        `;
    });
}

/* BACK */
function logout() {
    window.location.href = "index.html";
}

/* LOAD */
renderEmployees();

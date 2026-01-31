/* ===================================================
   DASHBOARD LOGIC – SURUJ HARDWARE
   Auto Bill No | Bill History | Daily Summary
   =================================================== */

if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

/* -------------------------
   GLOBAL VARIABLES
------------------------- */
let billItems = [];
let subtotal = 0;

// Load saved data
let billHistory = JSON.parse(localStorage.getItem("billHistory")) || [];
let billCounter = Number(localStorage.getItem("billCounter")) || 1;

// Set bill date
document.getElementById("billDate").textContent =
    new Date().toLocaleString();

/* -------------------------
   ADD ITEM (MANUAL PRODUCT)
------------------------- */
function addItem() {
    const name = productName.value.trim();
    const rateVal = Number(rate.value);
    const qtyVal = Number(qty.value);
    const unitVal = unit.value;

    if (!name || rateVal <= 0 || qtyVal <= 0) {
        alert("Enter product name, rate and quantity");
        return;
    }

    const amount = rateVal * qtyVal;

    billItems.push({
        name,
        qty: qtyVal,
        unit: unitVal,
        rate: rateVal,
        amount
    });

    productName.value = "";
    rate.value = "";
    qty.value = "";

    renderBill();
}

/* -------------------------
   RENDER BILL
------------------------- */
function renderBill() {
    billTable.innerHTML = "";
    subtotal = 0;

    billItems.forEach((item, index) => {
        subtotal += item.amount;

        billTable.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>${item.unit}</td>
                <td>${item.rate}</td>
                <td>${item.amount}</td>
                <td><button onclick="removeItem(${index})">X</button></td>
            </tr>
        `;
    });

    calculateTotal();
}

/* -------------------------
   REMOVE ITEM
------------------------- */
function removeItem(index) {
    billItems.splice(index, 1);
    renderBill();
}

/* -------------------------
   CALCULATE TOTAL
------------------------- */
function calculateTotal() {
    const discountVal = Number(discount.value) || 0;

    sub.textContent = subtotal.toFixed(2);

    let finalTotal = subtotal - discountVal;
    if (finalTotal < 0) finalTotal = 0;

    total.textContent = finalTotal.toFixed(2);
}

/* -------------------------
   SAVE BILL (IMPORTANT)
------------------------- */
function saveBill() {
    if (billItems.length === 0) {
        alert("No items in bill");
        return;
    }

    const billNo = "SH-" + new Date().getFullYear() + "-" + String(billCounter).padStart(3, "0");
    billCounter++;
    localStorage.setItem("billCounter", billCounter);

    const billData = {
        billNo: billNo,
        date: new Date().toLocaleString(),
        customer: custName.value || "Walk-in Customer",
        items: billItems,
        subtotal: subtotal,
        discount: Number(discount.value) || 0,
        total: Number(total.textContent),
        payment: paymentMode.value
    };

    billHistory.push(billData);
    localStorage.setItem("billHistory", JSON.stringify(billHistory));

    alert("Bill Saved Successfully\nBill No: " + billNo);

    // Reset bill
    billItems = [];
    billTable.innerHTML = "";
    discount.value = 0;
    subtotal = 0;
    sub.textContent = "0";
    total.textContent = "0";

    updateBillHistory();
    updateTodaySummary();
}

/* -------------------------
   BILL HISTORY DISPLAY
------------------------- */
function updateBillHistory() {
    billHistoryTable.innerHTML = "";

    billHistory.slice().reverse().forEach(bill => {
        billHistoryTable.innerHTML += `
            <tr>
                <td>${bill.billNo}</td>
                <td>${bill.date}</td>
                <td>${bill.customer}</td>
                <td>${bill.total}</td>
            </tr>
        `;
    });
}

/* -------------------------
   DAILY TOTAL SUMMARY
------------------------- */
function updateTodaySummary() {
    const today = new Date().toDateString();
    let todayTotal = 0;

    billHistory.forEach(bill => {
        if (new Date(bill.date).toDateString() === today) {
            todayTotal += bill.total;
        }
    });

    todayTotalSpan = document.getElementById("todayTotal");
    todayTotalSpan.textContent = todayTotal.toFixed(2);
}

/* -------------------------
   PDF DOWNLOAD
------------------------- */
function downloadPDF() {
    if (billHistory.length === 0) {
        alert("Save bill before downloading PDF");
        return;
    }

    html2pdf().set({
        margin: 10,
        filename: "MS_Suruj_Hardware_Bill.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    }).from(document.getElementById("invoice")).save();
}

/* -------------------------
   LOGOUT
------------------------- */
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}

/* -------------------------
   INITIAL LOAD
------------------------- */
updateBillHistory();
updateTodaySummary();

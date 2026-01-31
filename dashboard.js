/* =====================================================
   DASHBOARD.JS – M/S SURUJ HARDWARE
   Fully Free | Website Only | Professional Billing
   ===================================================== */

/* -----------------------------
   LOGIN CHECK
----------------------------- */
if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

/* -----------------------------
   GLOBAL VARIABLES
----------------------------- */
let billItems = [];
let subtotal = 0;

// Load stored data
let billHistory = JSON.parse(localStorage.getItem("billHistory")) || [];
let billCounter = Number(localStorage.getItem("billCounter")) || 1;

// Set bill date
document.getElementById("billDate").textContent =
    new Date().toLocaleString();

/* -----------------------------
   ADD ITEM TO BILL
----------------------------- */
function addItem() {
    const name = productName.value.trim();
    const rateVal = Number(rate.value);
    const qtyVal = Number(qty.value);
    const unitVal = unit.value;

    if (!name || rateVal <= 0 || qtyVal <= 0) {
        alert("Please enter product name, rate and quantity");
        return;
    }

    const amount = rateVal * qtyVal;

    billItems.push({
        name: name,
        rate: rateVal,
        qty: qtyVal,
        unit: unitVal,
        amount: amount
    });

    productName.value = "";
    rate.value = "";
    qty.value = "";

    renderBill();
}

/* -----------------------------
   RENDER BILL TABLE
----------------------------- */
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
                <td>
                    <button onclick="removeItem(${index})">X</button>
                </td>
            </tr>
        `;
    });

    calculateTotal();
}

/* -----------------------------
   REMOVE ITEM
----------------------------- */
function removeItem(index) {
    billItems.splice(index, 1);
    renderBill();
}

/* -----------------------------
   CALCULATE TOTAL
----------------------------- */
function calculateTotal() {
    const discountVal = Number(discount.value) || 0;

    sub.textContent = subtotal.toFixed(2);

    let finalTotal = subtotal - discountVal;
    if (finalTotal < 0) finalTotal = 0;

    total.textContent = finalTotal.toFixed(2);
}

/* -----------------------------
   SAVE BILL
----------------------------- */
function saveBill() {
    if (billItems.length === 0) {
        alert("No items added to bill");
        return;
    }

    const billNo =
        "SH-" +
        new Date().getFullYear() +
        "-" +
        String(billCounter).padStart(3, "0");

    billCounter++;
    localStorage.setItem("billCounter", billCounter);

    const billData = {
        billNo: billNo,
        date: new Date().toLocaleString(),
        customer: custName.value || "Walk-in Customer",
        phone: custPhone.value || "-",
        address: custAddress.value || "-",
        items: billItems,
        subtotal: subtotal,
        discount: Number(discount.value) || 0,
        total: Number(total.textContent),
        payment: paymentMode.value
    };

    billHistory.push(billData);
    localStorage.setItem("billHistory", JSON.stringify(billHistory));

    alert("Bill Saved Successfully\nBill No: " + billNo);

    // Reset current bill
    billItems = [];
    billTable.innerHTML = "";
    discount.value = 0;
    subtotal = 0;
    sub.textContent = "0";
    total.textContent = "0";

    updateBillHistory();
    updateTodaySummary();
}

/* -----------------------------
   BILL HISTORY TABLE
----------------------------- */
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

/* -----------------------------
   DAILY TOTAL SUMMARY
----------------------------- */
function updateTodaySummary() {
    const today = new Date().toDateString();
    let todayTotal = 0;

    billHistory.forEach(bill => {
        if (new Date(bill.date).toDateString() === today) {
            todayTotal += bill.total;
        }
    });

    document.getElementById("todayTotal").textContent =
        todayTotal.toFixed(2);
}

/* -----------------------------
   DOWNLOAD FULL BILL PDF
----------------------------- */
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

/* -----------------------------
   DOWNLOAD SOLD ITEMS LIST PDF
   (WITH PRICE & AMOUNT)
----------------------------- */
function downloadItemListPDF() {
    if (billHistory.length === 0) {
        alert("No saved bill found");
        return;
    }

    const lastBill = billHistory[billHistory.length - 1];

    const itemBox = document.createElement("div");
    itemBox.style.padding = "20px";
    itemBox.style.fontFamily = "Arial";

    let html = `
        <h2>M/S Suruj Hardware</h2>
        <p><strong>Bill No:</strong> ${lastBill.billNo}</p>
        <p><strong>Date:</strong> ${lastBill.date}</p>
        <p><strong>Customer:</strong> ${lastBill.customer}</p>
        <hr>

        <h3>Items Sold</h3>
        <table border="1" width="100%" cellspacing="0" cellpadding="8">
            <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate (₹)</th>
                <th>Amount (₹)</th>
            </tr>
    `;

    lastBill.items.forEach(item => {
        html += `
            <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>${item.unit}</td>
                <td>${item.rate}</td>
                <td>${item.amount}</td>
            </tr>
        `;
    });

    html += `
        </table>

        <p style="margin-top:12px;">
            <strong>Total Amount:</strong> ₹ ${lastBill.total}
        </p>

        <p style="margin-top:15px;font-size:13px;">
            Items mentioned above can be returned within 7 days.
            Only selected items are eligible for return.
        </p>
    `;

    itemBox.innerHTML = html;
    document.body.appendChild(itemBox);

    html2pdf().set({
        margin: 10,
        filename: lastBill.billNo + "_Sold_Items.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    }).from(itemBox).save().then(() => {
        document.body.removeChild(itemBox);
    });
}

/* -----------------------------
   LOGOUT
----------------------------- */
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}

/* -----------------------------
   INITIAL LOAD
----------------------------- */
updateBillHistory();
updateTodaySummary();

/* =====================================================
   M/S SURUJ HARDWARE - MAIN SCRIPT FILE
   Website-only | Fully Free | No Backend
   ===================================================== */

/* ===============================
   MANAGER LOGIN DATA
   =============================== */

const managers = {
    "9387127176": {
        name: "Newaj Ahmed",
        password: "7176"
    },
    "9957713500": {
        name: "Shamim Ahmed",
        password: "3500"
    },
    "9394019372": {
        name: "Rejuyan Ahmed",
        password: "9372"
    }
};

let currentManager = null;

/* ===============================
   BASIC DATA STORAGE
   =============================== */

// Products (can be expanded later)
let products = JSON.parse(localStorage.getItem("products")) || [
    { name: "Cement", price: 350 },
    { name: "TMT Rod", price: 600 },
    { name: "Sanitary Ware", price: 500 },
    { name: "Pipes & Fittings", price: 250 }
];

// Current bill items
let billItems = [];

// Totals
let subtotal = 0;

/* ===============================
   LOGIN FUNCTION
   =============================== */

function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (managers[user] && managers[user].password === pass) {
        currentManager = managers[user].name;

        document.getElementById("login").classList.add("hidden");
        document.getElementById("panel").classList.remove("hidden");

        // Set bill date
        document.getElementById("billDate").textContent =
            new Date().toLocaleString();

        loadProducts();

        alert("Welcome " + currentManager);
    } else {
        alert("Invalid login details");
    }
}

/* ===============================
   LOAD PRODUCT LIST
   =============================== */

function loadProducts() {
    const plist = document.getElementById("plist");
    plist.innerHTML = "";

    products.forEach((product, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = product.name + " (₹" + product.price + ")";
        plist.appendChild(option);
    });
}

/* ===============================
   ADD ITEM TO BILL
   =============================== */

function addItem() {
    const productIndex = document.getElementById("plist").value;
    const quantity = Number(document.getElementById("qty").value);
    const unit = document.getElementById("unit").value;

    if (productIndex === "" || isNaN(quantity) || quantity <= 0) {
        alert("Please select product and enter valid quantity");
        return;
    }

    const product = products[productIndex];
    const amount = product.price * quantity;

    billItems.push({
        name: product.name,
        qty: quantity,
        unit: unit,
        price: product.price,
        amount: amount
    });

    document.getElementById("qty").value = "";

    renderBillTable();
}

/* ===============================
   RENDER BILL TABLE
   =============================== */

function renderBillTable() {
    const table = document.getElementById("billTable");
    table.innerHTML = "";
    subtotal = 0;

    billItems.forEach((item, index) => {
        subtotal += item.amount;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>${item.unit}</td>
            <td>${item.amount.toFixed(2)}</td>
            <td>
                <button onclick="removeItem(${index})">Remove</button>
            </td>
        `;

        table.appendChild(row);
    });

    calculateTotal();
}

/* ===============================
   REMOVE ITEM FROM BILL
   =============================== */

function removeItem(index) {
    billItems.splice(index, 1);
    renderBillTable();
}

/* ===============================
   CALCULATE TOTAL (NO GST)
   =============================== */

function calculateTotal() {
    const discountInput = document.getElementById("discount").value;
    const discount = Number(discountInput) || 0;

    document.getElementById("sub").textContent =
        subtotal.toFixed(2);

    let finalTotal = subtotal - discount;
    if (finalTotal < 0) finalTotal = 0;

    document.getElementById("total").textContent =
        finalTotal.toFixed(2);
}

/* ===============================
   SAVE BILL (LOGICAL SAVE)
   =============================== */

function saveBill() {
    if (billItems.length === 0) {
        alert("No items in bill");
        return;
    }

    const customerName =
        document.getElementById("custName").value || "Walk-in Customer";
    const customerPhone =
        document.getElementById("custPhone").value || "-";
    const customerAddress =
        document.getElementById("custAddress").value || "-";
    const paymentMode =
        document.getElementById("paymentMode").value;

    // Attach customer details to invoice display
    document.getElementById("custName").value = customerName;
    document.getElementById("custPhone").value = customerPhone;
    document.getElementById("custAddress").value = customerAddress;

    alert(
        "Bill saved successfully\n" +
        "Customer: " + customerName + "\n" +
        "Payment Mode: " + paymentMode
    );
}

/* ===============================
   DOWNLOAD PDF (FIXED)
   =============================== */

function downloadPDF() {
    if (billItems.length === 0) {
        alert("Please add items and save bill before downloading PDF");
        return;
    }

    const invoice = document.getElementById("invoice");

    const opt = {
        margin: 10,
        filename: "MS_Suruj_Hardware_Bill.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait"
        }
    };

    html2pdf().set(opt).from(invoice).save();
}

/* ===============================
   LOGOUT
   =============================== */

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        location.reload();
    }
}

/* =====================================================
   END OF SCRIPT
   ===================================================== */

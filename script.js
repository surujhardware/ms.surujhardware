const ADMIN_MOBILE = "9387127176";
const ADMIN_PASS = "Newaj@12";

let products = JSON.parse(localStorage.getItem("products")) || [];
let daily = JSON.parse(localStorage.getItem("daily")) || { sale:0, purchase:0, profit:0 };
let monthly = JSON.parse(localStorage.getItem("monthly")) || { sale:0, purchase:0, profit:0 };
let billCounter = Number(localStorage.getItem("billCounter")) || 1;

let billTotal = 0;
let billProfitValue = 0;

/* NAVIGATION */
function openAdmin() {
    document.getElementById("roleSection").classList.add("hidden");
    document.getElementById("adminLogin").classList.remove("hidden");
}

function openCustomer() {
    document.getElementById("roleSection").classList.add("hidden");
    document.getElementById("customerView").classList.remove("hidden");
}

function goHome() {
    location.reload();
}

/* ADMIN LOGIN */
function loginAdmin() {
    const mobile = document.getElementById("adminMobile").value;
    const pass = document.getElementById("adminPassword").value;

    if (mobile === ADMIN_MOBILE && pass === ADMIN_PASS) {
        document.getElementById("adminLogin").classList.add("hidden");
        document.getElementById("adminPanel").classList.remove("hidden");
        loadProducts();
        updateDaily();
        updateMonthly();
        setBillInfo();
    } else {
        alert("Invalid admin login");
    }
}

/* BILL INFO */
function setBillInfo() {
    document.getElementById("billNo").textContent = billCounter;
    document.getElementById("billDate").textContent = new Date().toLocaleDateString();
}

/* PRODUCT MASTER */
function addProduct() {
    const name = pname.value;
    const buy = Number(buyPrice.value);
    const sell = Number(sellPrice.value);

    if (!name || !buy || !sell) return;

    products.push({ name, buy, sell });
    localStorage.setItem("products", JSON.stringify(products));

    pname.value = buyPrice.value = sellPrice.value = "";
    loadProducts();
}

function loadProducts() {
    const select = document.getElementById("productSelect");
    select.innerHTML = "<option value=''>Select Product</option>";
    products.forEach((p, i) => {
        select.innerHTML += `<option value="${i}">${p.name}</option>`;
    });
}

/* BILLING */
function addToBag() {
    const index = productSelect.value;
    const quantity = Number(qty.value);

    if (index === "" || quantity <= 0) return;

    const p = products[index];
    const itemTotal = p.sell * quantity;
    const itemProfit = (p.sell - p.buy) * quantity;

    billTotal += itemTotal;
    billProfitValue += itemProfit;

    const li = document.createElement("li");
    li.textContent = `${p.name} × ${quantity} = ₹${itemTotal}`;
    bag.appendChild(li);

    updateBill();
}

function updateBill() {
    const gst = billTotal * Number(gstRate.value) / 100;
    subTotal.textContent = billTotal.toFixed(2);
    gstAmount.textContent = gst.toFixed(2);
    grandTotal.textContent = (billTotal + gst).toFixed(2);
    billProfit.textContent = billProfitValue.toFixed(2);
}

/* SAVE BILL */
function saveBill() {
    const gst = billTotal * Number(gstRate.value) / 100;
    const grand = billTotal + gst;

    daily.sale += grand;
    daily.purchase += billTotal - billProfitValue;
    daily.profit += billProfitValue;

    monthly.sale += grand;
    monthly.purchase += billTotal - billProfitValue;
    monthly.profit += billProfitValue;

    localStorage.setItem("daily", JSON.stringify(daily));
    localStorage.setItem("monthly", JSON.stringify(monthly));

    billCounter++;
    localStorage.setItem("billCounter", billCounter);

    bag.innerHTML = "";
    billTotal = 0;
    billProfitValue = 0;

    updateBill();
    updateDaily();
    updateMonthly();
    setBillInfo();

    alert("Bill saved successfully");
}

/* REPORTS */
function updateDaily() {
    sale.textContent = daily.sale.toFixed(2);
    purchase.textContent = daily.purchase.toFixed(2);
    profit.textContent = daily.profit.toFixed(2);
}

function updateMonthly() {
    mSale.textContent = monthly.sale.toFixed(2);
    mPurchase.textContent = monthly.purchase.toFixed(2);
    mProfit.textContent = monthly.profit.toFixed(2);
}

/* PDF */
function downloadPDF() {
    html2pdf().from(document.getElementById("invoice"))
        .save(`Bill_${billCounter}.pdf`);
}

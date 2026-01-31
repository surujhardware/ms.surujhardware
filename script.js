const managers = {
    "9387127176": "2716",
    "9957713500": "3500",
    "9394019372": "9372"
};

let products = JSON.parse(localStorage.getItem("products")) || [
    { name: "Cement", price: 350 },
    { name: "TMT Rod", price: 600 },
    { name: "Sanitary", price: 500 }
];

let billItems = [];
let subtotal = 0;

function login() {
    if (managers[username.value] === password.value) {
        document.getElementById("login").classList.add("hidden");
        document.getElementById("panel").classList.remove("hidden");
        billDate.textContent = new Date().toLocaleString();
        loadProducts();
    } else {
        alert("Invalid login");
    }
}

function loadProducts() {
    plist.innerHTML = "";
    products.forEach((p,i)=>{
        plist.innerHTML += `<option value="${i}">${p.name}</option>`;
    });
}

function addItem() {
    const p = products[plist.value];
    const q = Number(qty.value);
    if (!q) return alert("Enter quantity");

    const amt = p.price * q;
    billItems.push({ ...p, qty: q, unit: unit.value, amount: amt });
    renderBill();
}

function removeItem(i) {
    billItems.splice(i,1);
    renderBill();
}

function renderBill() {
    billTable.innerHTML = "";
    subtotal = 0;

    billItems.forEach((item,i)=>{
        subtotal += item.amount;
        billTable.innerHTML += `
        <tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>${item.unit}</td>
            <td>${item.amount}</td>
            <td><button onclick="removeItem(${i})">X</button></td>
        </tr>`;
    });

    calculateTotal();
}

function calculateTotal() {
    sub.textContent = subtotal.toFixed(2);
    const d = Number(discount.value) || 0;
    total.textContent = Math.max(subtotal - d, 0).toFixed(2);
}

function saveBill() {
    alert("Bill saved successfully");
}

function downloadPDF() {
    const invoice = document.getElementById("invoice");
    html2pdf().set({
        filename: "MS_Suruj_Hardware_Bill.pdf",
        margin: 10,
        html2canvas: { scale: 2 }
    }).from(invoice).save();
}

function logout() {
    location.reload();
}

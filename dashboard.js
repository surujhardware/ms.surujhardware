if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

const products = [
    { name: "Cement", price: 350 },
    { name: "TMT Rod", price: 600 },
    { name: "Sanitary Ware", price: 500 },
    { name: "Pipes & Fittings", price: 250 }
];

let billItems = [];
let subtotal = 0;

billDate.textContent = new Date().toLocaleString();

products.forEach((p, i) => {
    plist.innerHTML += `<option value="${i}">${p.name} (₹${p.price})</option>`;
});

function addItem() {
    const p = products[plist.value];
    const q = Number(qty.value);
    if (!q || q <= 0) return alert("Enter quantity");

    billItems.push({
        name: p.name,
        qty: q,
        unit: unit.value,
        amount: p.price * q
    });

    qty.value = "";
    renderBill();
}

function renderBill() {
    billTable.innerHTML = "";
    subtotal = 0;

    billItems.forEach((item, i) => {
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

function removeItem(i) {
    billItems.splice(i, 1);
    renderBill();
}

function calculateTotal() {
    sub.textContent = subtotal.toFixed(2);
    const d = Number(discount.value) || 0;
    total.textContent = Math.max(subtotal - d, 0).toFixed(2);
}

function saveBill() {
    alert("Bill saved");
}

function downloadPDF() {
    html2pdf().from(invoice).save("MS_Suruj_Hardware_Bill.pdf");
}

function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}

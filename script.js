const ADMIN_PASSWORD = "Newaj@12";

let products = JSON.parse(localStorage.getItem("products")) || [];
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let auditLog = JSON.parse(localStorage.getItem("audit")) || [];

let billTotal = 0;

/* LOGIN */
function login() {
    if (adminPass.value === ADMIN_PASSWORD) {
        document.getElementById("login").classList.add("hidden");
        document.getElementById("adminPanel").classList.remove("hidden");
        loadProducts();
        loadCustomers();
        loadStock();
        loadAudit();
    } else {
        alert("Wrong password");
    }
}

/* CUSTOMER */
function addCustomer() {
    customers.push({
        name: custName.value,
        phone: custPhone.value,
        address: custAddress.value
    });
    localStorage.setItem("customers", JSON.stringify(customers));
    custName.value = custPhone.value = custAddress.value = "";
    loadCustomers();
}

function loadCustomers() {
    customerSelect.innerHTML = "<option value=''>Select Customer</option>";
    customers.forEach((c,i)=>{
        customerSelect.innerHTML += `<option value="${i}">${c.name}</option>`;
    });
}

/* PRODUCTS */
function addProduct() {
    products.push({
        name: pname.value,
        price: +price.value,
        stock: +stock.value
    });
    localStorage.setItem("products", JSON.stringify(products));
    pname.value = price.value = stock.value = "";
    loadProducts();
    loadStock();
}

function loadProducts() {
    plist.innerHTML = "";
    products.forEach((p,i)=>{
        plist.innerHTML += `<option value="${i}">${p.name}</option>`;
    });
}

function loadStock() {
    stockTable.innerHTML = "";
    products.forEach(p=>{
        stockTable.innerHTML += `<tr><td>${p.name}</td><td>${p.stock}</td><td>${p.price}</td></tr>`;
    });
}

/* BILLING */
function addBill() {
    let p = products[plist.value];
    let q = +qty.value;

    if (q > p.stock) return alert("Low stock");

    let amt = p.price * q;
    billTotal += amt;
    p.stock -= q;

    billTable.innerHTML += `<tr><td>${p.name}</td><td>${q}</td><td>${amt}</td></tr>`;
    updateBill();

    localStorage.setItem("products", JSON.stringify(products));
    loadStock();
}

function updateBill() {
    let cg = billTotal * 0.09;
    let sg = billTotal * 0.09;
    sub.textContent = billTotal.toFixed(2);
    cgst.textContent = cg.toFixed(2);
    sgst.textContent = sg.toFixed(2);
    total.textContent = (billTotal + cg + sg).toFixed(2);
}

/* SAVE BILL */
function saveBill() {
    let customer = customerSelect.value
        ? customers[customerSelect.value].name
        : "Walk-in";

    auditLog.push(`Bill for ${customer} on ${new Date().toLocaleString()}`);
    localStorage.setItem("audit", JSON.stringify(auditLog));

    billTable.innerHTML = "";
    billTotal = 0;
    updateBill();
    loadAudit();

    alert("Bill saved");
}

/* PDF DOWNLOAD */
function downloadPDF() {
    const element = document.getElementById("invoice");
    html2pdf().from(element).save("MS_Suruj_Hardware_Bill.pdf");
}

/* AUDIT */
function loadAudit() {
    audit.innerHTML = "";
    auditLog.forEach(a => audit.innerHTML += `<li>${a}</li>`);
}

/* LOGOUT */
function logout() {
    location.reload();
}

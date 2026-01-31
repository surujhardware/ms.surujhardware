const ADMIN_PASSWORD = "Newaj@12";

let products = JSON.parse(localStorage.getItem("products")) || [];
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let auditLog = JSON.parse(localStorage.getItem("audit")) || [];

let billTotal = 0;

function login() {
    if (adminPass.value === ADMIN_PASSWORD) {
        loginSection = document.getElementById("login");
        loginSection.classList.add("hidden");
        adminPanel.classList.remove("hidden");
        loadProducts();
        loadCustomers();
        loadStock();
        loadAudit();
    } else alert("Wrong password");
}

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
    let cgstVal = billTotal * 0.09;
    let sgstVal = billTotal * 0.09;
    sub.textContent = billTotal.toFixed(2);
    cgst.textContent = cgstVal.toFixed(2);
    sgst.textContent = sgstVal.toFixed(2);
    total.textContent = (billTotal + cgstVal + sgstVal).toFixed(2);
}

function saveBill() {
    let customer = customerSelect.value ? customers[customerSelect.value].name : "Walk-in";
    auditLog.push(`Bill for ${customer} on ${new Date().toLocaleString()}`);
    localStorage.setItem("audit", JSON.stringify(auditLog));

    billTable.innerHTML = "";
    billTotal = 0;
    updateBill();
    loadAudit();
    alert("Bill saved");
}

function loadAudit() {
    audit.innerHTML = "";
    auditLog.forEach(a => audit.innerHTML += `<li>${a}</li>`);
}

function logout() {
    location.reload();
}

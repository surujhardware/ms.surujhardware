const ADMIN_PASSWORD = "Newaj@12";

let products = JSON.parse(localStorage.getItem("products")) || [];
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let auditLog = JSON.parse(localStorage.getItem("audit")) || [];

let billItems = [];
let billTotal = 0;

function login() {
    if (adminPass.value === ADMIN_PASSWORD) {
        document.getElementById("login").classList.add("hidden");
        document.getElementById("adminPanel").classList.remove("hidden");
        loadProducts();
        loadCustomers();
        document.getElementById("billDate").textContent =
            new Date().toLocaleString();
    } else alert("Wrong password");
}

/* CUSTOMER */
function loadCustomers() {
    customerSelect.innerHTML = "<option value=''>Select Customer</option>";
    customers.forEach((c,i)=>{
        customerSelect.innerHTML += `<option value="${i}">${c.name}</option>`;
    });
}

/* PRODUCTS */
function loadProducts() {
    plist.innerHTML = "";
    products.forEach((p,i)=>{
        plist.innerHTML += `<option value="${i}">${p.name}</option>`;
    });
}

/* ADD ITEM */
function addBill() {
    const p = products[plist.value];
    const q = Number(qty.value);
    const u = unit.value;

    if (q <= 0 || q > p.stock) {
        alert("Invalid quantity");
        return;
    }

    const amt = p.price * q;
    p.stock -= q;

    billItems.push({ name: p.name, qty: q, unit: u, amount: amt });
    localStorage.setItem("products", JSON.stringify(products));

    renderBill();
}

function removeItem(index) {
    const item = billItems[index];
    const p = products.find(x => x.name === item.name);
    p.stock += item.qty;

    billItems.splice(index,1);
    localStorage.setItem("products", JSON.stringify(products));
    renderBill();
}

/* RENDER BILL */
function renderBill() {
    billTable.innerHTML = "";
    billTotal = 0;

    billItems.forEach((item,i)=>{
        billTotal += item.amount;
        billTable.innerHTML += `
        <tr>
          <td>${item.name}</td>
          <td>${item.qty}</td>
          <td>${item.unit}</td>
          <td>${item.amount}</td>
          <td><button onclick="removeItem(${i})">Remove</button></td>
        </tr>`;
    });

    updateBill();
}

/* CALCULATE TOTAL */
function updateBill() {
    const discountVal = Number(discount.value) || 0;
    const taxable = Math.max(billTotal - discountVal, 0);
    const cg = taxable * 0.09;
    const sg = taxable * 0.09;

    sub.textContent = billTotal.toFixed(2);
    cgst.textContent = cg.toFixed(2);
    sgst.textContent = sg.toFixed(2);
    total.textContent = (taxable + cg + sg).toFixed(2);
}

/* SAVE BILL */
function saveBill() {
    const c = customers[customerSelect.value];
    billCustName.textContent = c.name;
    billCustPhone.textContent = c.phone;
    billCustAddress.textContent = c.address;
    billPayment.textContent = paymentMode.value;

    auditLog.push(`Bill for ${c.name} on ${new Date().toLocaleString()}`);
    localStorage.setItem("audit", JSON.stringify(auditLog));

    alert("Bill saved");
}

/* PDF */
function downloadPDF() {
    const element = document.getElementById("invoice");
    html2pdf().from(element).save("MS_Suruj_Hardware_Bill.pdf");
}

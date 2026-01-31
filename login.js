const managers = {
    "9387127176": "7176",
    "9957713500": "3500",
    "9394019372": "9372"
};

function login() {
    const u = username.value.trim();
    const p = password.value.trim();

    if (managers[u] === p) {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid login");
    }
}

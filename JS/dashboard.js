// security check
const isLoggedIn = localStorage.getItem("isLoggedIn");
const userId = localStorage.getItem("userId");

if (isLoggedIn !== "true") {
  // ❌ bina login dashboard open
  window.location.href = "../login.html";
}
// if (!localStorage.getItem("loggedIn")) {
//   window.location.href = "login.html";
// }

function logout() {
  localStorage.clear();
  window.location.href = "../login.html";
}

function showMsg(text) {
  document.getElementById("msg").innerText =
    text + " option selected";
}

function openReport(){
  window.location.href = "../Pages/report.html";
}

function openClosure() {
  window.location.href = "closure.html";
}
function openDump(){
  window.location.href = "../Pages/dump.html";
}

function openAnalysis(){
  window.location.href = "../Pages/analysis.html";
}

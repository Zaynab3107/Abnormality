
// ================= SIGNUP REDIRECT =================
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { db } from "./firebase.js"; 

async function loginProcess() {
    const userId = document.getElementById("userId").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("error");

    error.innerText = ""; 

    if (!userId || !password) {
        error.innerText = "All fields are required";
        return;
    }

    try {
        // Code ab 'users' collection mein 'userId' (e.g. zaynab123) naam ka document dhoondega
        const userDocRef = doc(db, "users", userId); 
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            if (userData.password === password) {
                localStorage.setItem("userId", userId);
                localStorage.setItem("role", userData.role || "user"); 
                localStorage.setItem("isLoggedIn", "true");

                window.location.href = "Pages/dashboard.html"; 
            } else {
                error.innerText = "Invalid password!";
            }
        } else {
            error.innerText = "User ID not found! Check if Document ID matches your input.";
        }
    } catch (err) {
        console.error(err);
        error.innerText = "Database connection error!";
    }
}

window.onload = function () {
    // HTML ke buttons ko direct ID se select karna zyada safe hai
    const loginBtn = document.getElementById("loginBtn") || document.querySelector('button[onclick="login()"]');
    const signupBtn = document.getElementById("signupBtn") || document.querySelector('button[onclick="goToSignup()"]');

    if (loginBtn) {
        loginBtn.removeAttribute("onclick");
        loginBtn.addEventListener("click", loginProcess);
    }

    if (signupBtn) {
        signupBtn.removeAttribute("onclick");
        signupBtn.addEventListener("click", () => {
            window.location.href = "Pages/signup.html";
        });
    }
};
// NEW CODE
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
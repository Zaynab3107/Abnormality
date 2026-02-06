// function signup() {
//   const id = document.getElementById("signupId").value;
//   const password = document.getElementById("signupPassword").value;
//   const error = document.getElementById("error");

//   if (id === "" || password === "" ) {
//     error.innerText = "Please fill all fields";
//     return;
//   }

//   alert(
//     "Account Created Successfully\n" +
//     "ID: " + id + "\n" 
//   );
// }

import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { db } from "./firebase.js"; 

async function signupProcess() {
    const userId = document.getElementById("signupId").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const error = document.getElementById("error");

    error.innerText = ""; 

    if (!userId || !password) {
        error.innerText = "Please fill all fields";
        return;
    }

    try {
        // 1. Check karein ki ye User ID pehle se toh nahi bani
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            error.innerText = "User ID already exists. Try another one.";
            return;
        }

        // 2. Naya user create karein (Firestore mein save karein)
        await setDoc(userDocRef, {
            password: password,
            // role: "operator", // Default role
            createdAt: new Date()
        });

        alert("Account Created Successfully for ID: " + userId);
        
        // Login page par wapas bhej dein
        window.location.href = "../login.html";

    } catch (err) {
        console.error(err);
        error.innerText = "Error creating account. Please try again.";
    }
}

// Global scope ke liye function attach karein (Module scope fix)
window.signup = signupProcess;
import { db } from "./firebase.js";
import { doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", () => {
    // 1. Description aur Status set karein
    const descField = document.getElementById("desc"); 
    const savedDesc = localStorage.getItem("closureDescription");
    
    if (descField && savedDesc) {
        descField.value = savedDesc;
    }
});

async function updateClosure(event) {
    event.preventDefault(); 
    
    const docId = localStorage.getItem("closureId");
    if (!docId) {
        alert("❌ Reference ID missing! Please click 'Take Action' again.");
        return;
    }

    const submitBtn = event.target.querySelector("button[type='submit']");
    const selectedStatus = document.querySelector('input[name="status"]:checked').value;
    const actionTaken = document.getElementById("actionTaken").value;
    const closedBy = document.getElementById("closedBy").value;
    const closureDate = document.getElementById("closureDate").value;

    if(submitBtn) {
        submitBtn.innerText = "Saving...";
        submitBtn.disabled = true;
    }

    try {
        // --- STEP 1: Firebase Update ---
        const docRef = doc(db, "dump", docId);
        await updateDoc(docRef, {
            status: selectedStatus,
            actionTaken: actionTaken,
            closedBy: closedBy,
            closureDate: closureDate,
            updatedAt: serverTimestamp()
        });

        // --- STEP 2: LocalStorage Update (Dump Data sync) ---
        let dumpData = JSON.parse(localStorage.getItem("dumpData")) || [];
        const index = dumpData.findIndex(item => item.id === docId || item.number == docId);

        if (index !== -1) {
            dumpData[index].status = selectedStatus;
            dumpData[index].actionTaken = actionTaken;
            localStorage.setItem("dumpData", JSON.stringify(dumpData));
        }

        alert("✅ Data successfully saved!");
        
        // Cleanup and Redirect
        localStorage.removeItem("closureId");
        localStorage.removeItem("closureDescription");
        window.location.href = "dump.html"; 

    } catch (e) {
        console.error("Error: ", e);
        alert("❌ Error: " + e.message);
        if(submitBtn) {
            submitBtn.innerText = "Submit Closure";
            submitBtn.disabled = false;
        }
    }
}

// Global scope fix
window.updateClosure = updateClosure;
window.goBack = () => window.location.href = "dashboard.html";

// // 🔐 Security
// if (localStorage.getItem("isLoggedIn") !== "true") {
//   window.location.href = "../login.html";
// }

// const form = document.getElementById("closureForm");
// const msg = document.getElementById("msg");

// // 🔹 Load description
// window.onload = function () {
//   const desc = localStorage.getItem("closureDescription");
//   if (desc) {
//     document.getElementById("desc").value = desc;
//   }
// };

// form.addEventListener("submit", function (e) {
//   e.preventDefault();

//   const date = document.getElementById("closureDate").value;
//   const action = document.getElementById("actionTaken").value.trim();
//   const statusInput = document.querySelector('input[name="status"]:checked');
//   const closedBy = document.getElementById("closedBy").value.trim();

//   if (!date || !action || !statusInput || !closedBy) {
//     alert("Please fill all required fields");
//     return;
//   }

//   const status = statusInput.value;
//   const closureId = localStorage.getItem("closureId");

//   let dumpData = JSON.parse(localStorage.getItem("dumpData")) || [];

//   // 🔁 UPDATE SAME OBJECT
//   const index = dumpData.findIndex(r => r.number == closureId);

//   if (index === -1) {
//     alert("Record not found in dump");
//     return;
//   }

//   dumpData[index].closureDate = date;
//   dumpData[index].actionTaken = action;
//   dumpData[index].status = status;
//   dumpData[index].closedBy = closedBy;

//   // 💾 SAVE BACK
//   localStorage.setItem("dumpData", JSON.stringify(dumpData));

//   msg.innerText = "✅ Closure submitted successfully!";
//   msg.style.color = "green";

//   // ⏩ BACK TO DUMP (FORCE RELOAD)
//   setTimeout(() => {
//     window.location.href = "dump.html";
//   }, 800);
// });

// function goBack() {
//   window.location.href = "dashboard.html";
// }


































import { db } from "./firebase.js";
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("#dumpTable tbody");
    if (!tbody) return;

    const q = query(collection(db, "dump"), orderBy("number", "desc"));

    onSnapshot(q, (snapshot) => {
        tbody.innerHTML = "";

        snapshot.forEach((doc) => {
            const item = doc.data();
            const docId = doc.id;

            let statusClass = item.status === "Close" ? "status-close" : "status-open";

            tbody.innerHTML += `
                <tr>
                    <td>${item.number || "-"}</td>
                    <td>${item.date || "-"}</td>
                    <td>${item.shift || "-"}</td>
                    <td>${item.identifyBy || "-"}</td>
                    <td>${item.department || "-"}</td>
                    <td>${item.line || "-"}</td>
                    <td>${item.area || ""}</td>
                    <td>${item.description || "-"}</td>
                    <td>${item.tag || "-"}</td>
                    <td>${item.type || "-"}</td>
                    <td>${item.assignTo || "-"}</td>
                    <td>
                        <span class="${statusClass}" onclick="toggleAction(this, '${item.status}')">
                            ${item.status || "Open"}
                        </span>
                        ${item.status !== "Close" ? `
                            <div class="action-box" style="display:none;">
                                <button type="button" onclick="openClosure('${docId}', '${(item.description || "").replace(/'/g, "\\'")}')">
                                    Take Action
                                </button>
                            </div>` : ""
                        }
                    </td>
                    <td>${item.closureDate || "-"}</td>
                    <td>${item.actionTaken || "-"}</td>
                    <td>${item.closedBy || "-"}</td>
                </tr>`;
        });
    });
});

window.openClosure = (id, desc) => {
    localStorage.setItem("closureId", id);
    localStorage.setItem("closureDescription", desc);
    window.location.href = "closure.html";
};
window.exportToExcel = function () {
    const table = document.getElementById("dumpTable");
    if (!table) {
        alert("Table nahi mila!");
        return;
    }
    const html = table.outerHTML;
    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Abnormalities_Dump.xls";
    a.click();
};

window.toggleAction = (el, status) => {
    if (status === "Close") return;
    const box = el.closest("td").querySelector(".action-box");
    box.style.display = box.style.display === "block" ? "none" : "block";
};

window.goBack = () => { window.location.href = "../Pages/dashboard.html"; };

// // ================= LOAD DATA (Real-time) =================
// window.addEventListener("DOMContentLoaded", () => {
//     const tbody = document.querySelector("#dumpTable tbody");
//     if (!tbody) return;

//     const q = query(collection(db, "dump"), orderBy("number", "desc"));

//     onSnapshot(q, (snapshot) => {
//         tbody.innerHTML = ""; // Double entry fix karne ke liye

//         snapshot.forEach((reportDoc) => {
//             const item = reportDoc.data();
//             const docId = reportDoc.id;

//             let statusClass = item.status === "Close" ? "status-close" : "status-open";

//             tbody.innerHTML += `
//                 <tr>
//                     <td>${item.number || "-"}</td>
//                     <td>${item.date || "-"}</td>
//                     <td>${item.shift || "-"}</td>
//                     <td>${item.identifyBy || "-"}</td>
//                     <td>${item.department || "-"}</td>
//                     <td>${item.line || "-"}</td>
//                     <td>${item.area || "-"}</td>
//                     <td>${item.description || "-"}</td>
//                     <td>${item.tag || "-"}</td>
//                     <td>${item.type || "-"}</td>
//                     <td>${item.assignTo || "-"}</td>
//                     <td>
//                         <span class="${statusClass}" onclick="toggleAction(this, '${item.status || "Open"}')">
//                             ${item.status || "Open"}
//                         </span>
//                         ${(item.status || "Open").toLowerCase() !== "close" ? `
//                             <div class="action-box" style="display:none;">
//                                 <button type="button" onclick="openClosure('${docId}', '${(item.description || "").replace(/'/g, "\\'")}')">
//                                     Take Action
//                                 </button>
//                             </div>` : ""
//                         }
//                     </td>
//                     <td>${item.closureDate || "-"}</td>
//                     <td>${item.actionTaken || "-"}</td>
//                     <td>${item.closedBy || "-"}</td>
//                 </tr>`;
//         });
//     });
// });

// // ================= BUTTONS LOGIC =================

// // 1. Back to Dashboard Button
// window.goBack = function () {
//     console.log("Back button clicked");
//     window.location.href = "../Pages/dashboard.html"; 
// };

// // 2. Export to Excel Button
// window.exportToExcel = function () {
//     const table = document.getElementById("dumpTable");
//     const html = table.outerHTML;
//     const blob = new Blob([html], { type: "application/vnd.ms-excel" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = "Abnormalities_Dump.xls";
//     a.click();
// };

// // 3. Toggle Status Box
// window.toggleAction = function (el, status) {
//     if (status === "Close") return;
//     const box = el.closest("td").querySelector(".action-box");
//     if (box) box.style.display = box.style.display === "block" ? "none" : "block";
// };

// // 4. Open Closure Page
// window.openClosure = function (id, description) {
//     localStorage.setItem("closureId", id); 
//     localStorage.setItem("closureDescription", description);
//     window.location.href = "closure.html";
// };
// // Buttons logic (goBack, exportToExcel, toggleAction, openClosure) yahan rahega...

// // // ================= LOAD DATA =================
// // window.addEventListener("DOMContentLoaded", loadDumpData);

// // function loadDumpData() {
// //   const tbody = document.querySelector("#dumpTable tbody");
// //   if (!tbody) return;

// //   const dumpData = JSON.parse(localStorage.getItem("dumpData")) || [];
// //   tbody.innerHTML = "";

// //   if (dumpData.length === 0) {
// //     tbody.innerHTML = `<tr><td colspan="15">No records found</td></tr>`;
// //     return;
// //   }

// //   dumpData.forEach((item, index) => {
// //     let statusClass = "status-open";
// //     if (item.status === "Close") statusClass = "status-close";
// //     else if (item.status === "In Progress") statusClass = "status-progress";

// //     tbody.innerHTML += `
// //       <tr>
// //         <td>${item.number || index + 1}</td>
// //         <td>${item.date || "-"}</td>
// //         <td>${item.shift || "-"}</td>
// //         <td>${item.identifyBy || "-"}</td>
// //         <td>${item.department || "-"}</td>
// //         <td>${item.line || "-"}</td>
// //         <td>${item.area || "-"}</td>
// //         <td>${item.description || "-"}</td>
// //         <td>${item.tag || "-"}</td>
// //         <td>${item.type || "-"}</td>
// //         <td>${item.assignTo || "-"}</td>
// //      <td>
// //   <span class="${statusClass}"
// //         onclick="toggleAction(this, '${item.status || "Open"}')">
// //     ${item.status || "Open"}
// //   </span>

// //   ${
// //     (item.status || "Open").toLowerCase() !== "close"
// //       ? `<div class="action-box" style="display:none;">
// //           <button type="button"
// //             onclick="event.stopPropagation(); openClosure('${item.number}')">
// //             Take Action
// //           </button>
// //         </div>`
// //       : ""
// //   }
// // </td>

        
// //         <td>${item.closureDate || "-"}</td>
// //         <td>${item.actionTaken || "-"}</td>
// //         <td>${item.closedBy || "-"}</td>
// //       </tr>
// //     `;
// //   });
// // }


// // window.openClosure = function (id) {
// //   const dumpData = JSON.parse(localStorage.getItem("dumpData")) || [];

// //   const row = dumpData.find(r => r.number == id);
// //   if (!row) {
// //     alert("Record not found");
// //     return;
// //   }

// //   localStorage.setItem("closureId", row.number);
// //   localStorage.setItem("closureDescription", row.description);

// //   window.location.href = "closure.html";
// // };


// // // ================= BACK BUTTON =================
// // window.goBack = function () {
// //   window.location.href = "../Pages/dashboard.html";
// // };

// // // ================= EXPORT TO EXCEL =================
// // window.exportToExcel = function () {
// //   const table = document.getElementById("dumpTable").outerHTML;
// //   const blob = new Blob([table], {
// //     type: "application/vnd.ms-excel"
// //   });

// //   const a = document.createElement("a");
// //   a.href = URL.createObjectURL(blob);
// //   a.download = "Abnormalities_Dump.xls";
// //   a.click();
// // };

// // // ================= SAVE DUMP (LOCAL ONLY) =================
// // window.saveDumpToFirebase = function () {
// //   const dumpData = JSON.parse(localStorage.getItem("dumpData")) || [];

// //   if (dumpData.length === 0) {
// //     alert("❌ Dump me koi data nahi hai");
// //     return;
// //   }

// //   alert("✅ Dump localStorage me already saved hai");
// // };

// // // ================= TOGGLE ACTION =================
// // window.toggleAction = function (el, status) {
// //   if (status === "Close") return;

// //   const td = el.closest("td");
// //   if (!td) return;

// //   const box = td.querySelector(".action-box");
// //   if (!box) return;

// //   box.style.display =
// //     box.style.display === "block" ? "none" : "block";
// // };




































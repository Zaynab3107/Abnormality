// import { db } from "./firebase.js";
// import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// window.addEventListener("DOMContentLoaded", () => {
//     const analysisBody = document.querySelector("#analysisTable tbody");
//     if (!analysisBody) return;

    
//     onSnapshot(collection(db, "dump"), (snapshot) => {
//         const stats = {};
//         const lineStats = {};

//         // 1. Data ko Department wise group karna
//         snapshot.forEach((doc) => {
//             const data = doc.data();
//             const dept = data.department || "Unknown";
//             const status = (data.status || "Open").toLowerCase();

//             if (!stats[dept]) {
//                 stats[dept] = { identified: 0, mitigation: 0 };
//             }

//             stats[dept].identified++; // Total count
//             if (status === "close") {
//                 stats[dept].mitigation++; // Closed count
//             }
//         });


//         // 2. Table ko refresh karna
//         analysisBody.innerHTML = "";

//         Object.keys(stats).forEach((dept) => {
//             const { identified, mitigation } = stats[dept];
            
//             // Compliance Calculation
//             const compliance = identified > 0
//                 ? ((mitigation / identified) * 100).toFixed(1)
//                 : 0;

//             analysisBody.innerHTML += `
//                 <tr>
//                     <td>${dept}</td>
//                     <td>${identified}</td>
//                     <td>${mitigation}</td>
//                     <td>
//                         <div style="display: flex; align-items: center;">
//                             <span style="width: 40px;">${compliance}%</span>
//                             <div style="flex-grow: 1; background: #eee; height: 10px; margin-left: 10px; border-radius: 5px;">
//                                 <div style="width: ${compliance}%; background: ${getBarColor(compliance)}; height: 100%; border-radius: 5px;"></div>
//                             </div>
//                         </div>
//                     </td>
//                 </tr>`;
//         });
//     });
// });

// // Compliance ke hisab se color change karne ke liye
// function getBarColor(value) {
//     if (value >= 90) return "#28a745"; // Green
//     if (value >= 50) return "#ffc107"; // Yellow
//     return "#dc3545"; // Red
// }


import { db } from "./firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", () => {
    const deptBody = document.querySelector("#analysisTable tbody");
    const lineBody = document.querySelector("#lineAnalysisTable tbody");

    // Firebase se real-time data lena
    onSnapshot(collection(db, "dump"), (snapshot) => {
        const deptStats = {}; // Department table ke liye data
        const lineStats = {}; // Line table ke liye data

        snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Fields ki checking (Firebase field names yahan match karein)
            const dept = data.department || "Unknown Dept";
            const line = data.line || "Unknown Line";
            const status = (data.status || "Open").toLowerCase();

            // 1. Department wise grouping logic
            if (!deptStats[dept]) {
                deptStats[dept] = { identified: 0, mitigation: 0 };
            }
            deptStats[dept].identified++;
            if (status === "close") {
                deptStats[dept].mitigation++;
            }

            // 2. Line wise grouping logic
            if (!lineStats[line]) {
                lineStats[line] = { identified: 0, mitigation: 0 };
            }
            lineStats[line].identified++;
            if (status === "close") {
                lineStats[line].mitigation++;
            }
        });

        // Dono tables ko HTML mein render karna
        renderTable(deptBody, deptStats);
        renderTable(lineBody, lineStats);
    });
});

/**
 * Table render karne ka common function
 * @param {HTMLElement} tableBody - Jis table mein data daalna hai
 * @param {Object} statsObj - Grouped data object
 */
function renderTable(tableBody, statsObj) {
    if (!tableBody) return;
    
    tableBody.innerHTML = ""; // Purana data saaf karna

    const sortedKeys = Object.keys(statsObj).sort(); // A-Z sort karne ke liye

    sortedKeys.forEach((key) => {
        const { identified, mitigation } = statsObj[key];
        
        // Compliance Calculation
        const compliance = identified > 0
            ? ((mitigation / identified) * 100).toFixed(1)
            : 0;

        tableBody.innerHTML += `
            <tr>
                <td>${key}</td>
                <td style="text-align: center;">${identified}</td>
                <td style="text-align: center;">${mitigation}</td>
                <td>
                    <div style="display: flex; align-items: center;">
                        <span style="width: 45px; font-weight: bold;">${compliance}%</span>
                        <div style="flex-grow: 1; background: #eee; height: 12px; margin-left: 10px; border-radius: 6px; overflow: hidden;">
                            <div style="width: ${compliance}%; background: ${getBarColor(compliance)}; height: 100%; transition: width 0.5s ease;"></div>
                        </div>
                    </div>
                </td>
            </tr>`;
    });

    // Agar data empty ho
    if (Object.keys(statsObj).length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No data found in Firebase.</td></tr>`;
    }
}

/**
 * Percentage ke hisab se color return karna
 */
function getBarColor(value) {
    if (value >= 90) return "#28a745"; // Green (Excellent)
    if (value >= 60) return "#ffc107"; // Yellow (Average)
    return "#dc3545"; // Red (Needs Improvement)
}
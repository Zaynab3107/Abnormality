import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", loadDumpData);

async function loadDumpData() {
  const tbody = document.querySelector("#dumpTable tbody");
  tbody.innerHTML = "";

  const q = query(collection(db, "dump"), orderBy("number", "asc"));
  const snap = await getDocs(q);

  if (snap.empty) {
    tbody.innerHTML = `<tr><td colspan="15">No records found</td></tr>`;
    return;
  }

  snap.forEach(doc => {
    const item = doc.data();

    tbody.innerHTML += `
      <tr>
        <td>${item.number}</td>
        <td>${item.date}</td>
        <td>${item.shift}</td>
        <td>${item.identifyBy}</td>
        <td>${item.department}</td>
        <td>${item.line || "-"}</td>
        <td>${item.area || "-"}</td>
        <td>${item.description}</td>
        <td>${item.tag}</td>
        <td>${item.type}</td>
        <td>${item.assignTo}</td>
        <td>${item.status}</td>
        <td>${item.closureDate || "-"}</td>
        <td>${item.actionTaken || "-"}</td>
        <td>${item.closedBy || "-"}</td>
      </tr>
    `;
  });
}

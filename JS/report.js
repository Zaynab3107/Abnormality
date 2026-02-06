import { db } from "./firebase.js";
import { 
    collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


let isSubmitting = false;

async function submitForm(event) {
    event.preventDefault();


    if (isSubmitting) return; 

    const msg = document.getElementById("msg");
    const reportForm = document.getElementById("reportForm");
    const submitBtn = event.target.querySelector('button[type="submit"]');

    // Inputs collection
    const date = document.getElementById("date").value;
    const identifyBy = document.getElementById("identifyBy").value.trim();
    const department = document.getElementById("department").value;
    const line = document.getElementById("line").value; 
    const equipment = document.getElementById("equipment").value;
    const area = document.getElementById("area").value;
    const desc = document.getElementById("decAbnormalities").value.trim();
    const type = document.getElementById("types").value;
    const shift = document.getElementById("shift").value;
    const radioChecked = document.querySelector('input[name="tag"]:checked');
    const assignTo = document.getElementById("assignTo")?.value || "-";

    if (!date || !identifyBy || !radioChecked) {
        msg.innerHTML = "❌ Please fill required fields!";
        msg.style.color = "red";
        return;
    }

    try {
        // State set karein aur button disable karein
        isSubmitting = true;
        if(submitBtn) submitBtn.disabled = true;

        msg.innerHTML = "⏳ Sending data to Server...";
        msg.style.color = "blue";

        // Last Token Number fetch karein
        const q = query(collection(db, "dump"), orderBy("number", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        let nextNumber = 1;
        
        if (!querySnapshot.empty) {
            const lastDoc = querySnapshot.docs[0].data();
            nextNumber = (Number(lastDoc.number) || 0) + 1;
        }

        const newEntry = {
            number: nextNumber,
            date: date,
            shift: shift,
            identifyBy: identifyBy,
            department: department,
            description: desc,
            line: line,
            // equipment: equip,
            area: area,
            tag: radioChecked.value,
            type: type,
            assignTo: assignTo,
            status: "Open",
            actionTaken: "-",
            closedBy: "-",
            closureDate: "-",
            timestamp: serverTimestamp()
        };

        // Firestore mein add karein
        await addDoc(collection(db, "dump"), newEntry);

        msg.innerHTML = `✅ Successfully Saved! (Token: ${nextNumber})`;
        msg.style.color = "green";
        reportForm.reset();
        window.scrollTo(0, 0);

    } catch (error) {
        console.error("Submission Error:", error);
        msg.innerHTML = "❌ Server Error: " + error.message;
    } finally {
        // Reset flags and button
        isSubmitting = false;
        if(submitBtn) submitBtn.disabled = false;
    }
}

// Sirf ek baar event listener attach karein
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reportForm");
    if (form) {
        // Agar pehle se HTML mein onsubmit likha hai, toh usey hata dein
        form.onsubmit = null; 
        form.addEventListener("submit", submitForm);
    }
});

// Dropdown Data
const departmentDropdown = document.getElementById("department");
const lineDiv = document.getElementById("lineDiv");
const equipmentDiv = document.getElementById("equipmentDiv");
const areaDiv = document.getElementById("areaDiv");
const areaDropdown = document.getElementById("area");
const lineDropdown = document.getElementById("line");
const equipmentDropdown = document.getElementById("equipment");


const lines = ["A1Q1-PET 10", "A1C1-PET 20", "A1D1-PET 30", "A1C2-PET 40", "A1E1-PET 50", "A1C3-ASSP", "A1G1-TETRA OLD","A1G2-TETRA NEW","A1H1-RGB", "A1U1-BIB"];
const equipments = {
    "Line 1": ["Motor", "Conveyor", "Sensor"],
    "A1Q1-PET 10": ["Blow mould","Filler","FMS","Conveyors","Titlter",
            "Cooling Tunnel","Sleever","Date Coder","TSP",
            "Pack Conveyor","Palletizer","Strech Warp","Label Applicator","Chiller","Tempering Unit","Other"],
    "A1C1-PET 20": ["Blow mould","Filler","FMS","Air conveyors",
                "Warmer","Labeler","Date Coder","TSP","Pack Conveyor",
                "Palletizer","Label Applicator","Chiller","Other",],
    "A1D1-PET 30": ["Blow mould","Filler","FMS","Air conveyors",
            "Tilter","Cooling Tunnel","Labeler","Date Coder","TSP",
            "Pack Conveyor","Palletizer","Strech Warp","Chiller","Tempering Unit","Other"],
    "A1C2-PET 40": ["Blow mould","Filler","FMS","Conveyors","Warmer","Labeler",
            "Date Coder","TSP","Pack Conveyor","Palletizer",
            "Strech Warp","Label Applicator","Chiller","Air Blower","Other"],
    "A1E1-PET 50": [
            "Blow mould","Filler","FMS","Conveyors","Labeler",
            "Date Coder","TSP","Pack Conveyor","Palletizer",
            "Strech Warp","Label Applicator","Chiller","Air Blower","Other"],
    "A1C3-ASSP": [
            "Blow mould","Filler","FMS","Conveyors","Labeler",
            "Date Coder","TSP","Pack Conveyor","Palletizer",
            "Strech Warp","Label Applicator","Chiller","Plasmax","Other"],
    "A1H1-RGB": [
            "Depalletizer","Decamatic","Incamatic","Bottle Washer",
            "Conveyor","ASEBI","Filler","Tunnel Pasteurization","Other"],
    "A1G1-TETRA OLD": [
            "Air Blower","A3 Speed Filler","CBP","Conveyor","Labeler",
            "Date Coder","TS","Pack Conveyor","Palletizer",
            "Strech Wrap","Label Applicator","Chiller","FMS","Robo","Other"],
    "A1G2-TETRA NEW": [
            "Air Blower","A3 Speed Filler","CBP","Conveyor","Labeler",
            "Date Coder","TS","Pack Conveyor","Palletizer",
            "Strech Wrap","Label Applicator","Chiller","FMS","Robo","Other"],
    "A1U1-BIB": [
            "Filler","Carton Date Coder","Strip Machine",
            "Roller Conveyor","Strech Wrap","Other"],
};

departmentDropdown.addEventListener("change", function() {
    const value = this.value;
    
    // Reset Views
    lineDiv.style.display = "none";
    equipmentDiv.style.display = "none";
    areaDiv.style.display = "none";

    if (value === "Production") {
        lineDiv.style.display = "block";
        // Populate Line Dropdown
        lineDropdown.innerHTML = '<option value="">Select Line</option>' + 
            lines.map(l => `<option value="${l}">${l}</option>`).join('');
    } else if (value !== "") {
        areaDiv.style.display = "block";
    }
});
// Area Data Configuration
const areaData = {
    "Stores": ["Sugar Storage", "Co2 Tank", "Liquid N2", "HSD Tank","Chemical Storage", "Concentrate Storage","Pulp Storage", "PM Storage","Store Room","Store Rack","Store Office","Oil Storage Room"],
    "Shipping": ["Shipping Office", "Old ASRS", "New ASRS", "RGB Packaging Warhouse","Empty Yard","Loading Bay","Empty Sorting"],
    "Admin": ["Plant Office", "HR Office", " Quality Conference Room","Admin Conference Room","Canteen","Security Office","Technical Training Center","Library","Old prodcution Office","New production Office"],
    "Safety": ["OHS Room", "DMC/CMC","Fire house",],
    "Utility":["Boiler","Chiller","DG","HP","LP","AHU","VAM","Cooling Tower"],
    "Quality":["Raw Syrup Room","Ready Syrup Room","Sugar Dumping Section","CIP Room","Thawing Room","Juice Room","Old Lab","New lab","Retention Room","Sensory Room","Sampling Room"],
    "Maintenance":["Fitter Room","Forklift Repair Area","Battery Charging Room",]
};

departmentDropdown.addEventListener("change", function() {
    const dept = this.value;

    // Default: Sab chupao
    lineDiv.style.display = "none";
    equipmentDiv.style.display = "none";
    areaDiv.style.display = "none";
    areaDropdown.innerHTML = '<option value="">Select Area</option>';

    if (dept === "Production") {
        lineDiv.style.display = "block";
    } 
    else if (areaData[dept]) {
        // Agar selected department areaData mein maujood hai
        areaDiv.style.display = "block";
        
        // Dropdown mein options bharna
        areaData[dept].forEach(area => {
            const option = document.createElement("option");
            option.value = area;
            option.textContent = area;
            areaDropdown.appendChild(option);
        });
    }
});

lineDropdown.addEventListener("change", function() {
    const selectedLine = this.value;
    if (selectedLine) {
        equipmentDiv.style.display = "block";
        const items = equipments[selectedLine] || [];
        equipmentDropdown.innerHTML = '<option value="">Select Equipment</option>' + 
            items.map(e => `<option value="${e}">${e}</option>`).join('');
    } else {
        equipmentDiv.style.display = "none";
    }
});


// window.goBack = () => { window.location.href = "../Pages/dashboard.html"; };
window.goBack = () => window.location.href = "../Pages/dashboard.html";















// function submitForm(event) {
//     event.preventDefault();

//     const msg = document.getElementById("msg");
//     const date = document.getElementById("date").value;
//     const identifyBy = document.getElementById("identifyBy").value.trim();
//     const department = document.getElementById("department").value;
//     const desc = document.getElementById("decAbnormalities").value.trim();
//     const type = document.getElementById("types").value;
//     const shift = document.getElementById("shift").value;
//     const assignTo = document.getElementById("assignTo").value.trim();
    
//     // Radio button check karne ka sahi tarika
//     const radioChecked = document.querySelector('input[name="tag"]:checked');

//     // Debugging ke liye (Browser Console me dikhega ki kya missing hai)
//     console.log({date, identifyBy, department, desc, type, shift, radioChecked});

//     // Validation: Agar inme se kuch bhi missing hai
//     if (!date || !identifyBy || !department || !desc || !type || !shift || !radioChecked) {
//         msg.innerHTML = "❌ Please fill all required fields (Check Tag Type)";
//         msg.style.color = "red";
        
//         // Focus on top of form so user sees error
//         window.scrollTo(0, 0); 
//         return false;
//     }

//     // Data Preparation
//     let dumpData = JSON.parse(localStorage.getItem("dumpData")) || [];
//     let count = dumpData.length + 1;

//     const newEntry = {
//         number: count,
//         date: date,
//         shift: shift,
//         identifyBy: identifyBy,
//         department: department,
//         line: document.getElementById("line")?.value || "N/A",
//         equipment: document.getElementById("equipment")?.value || "N/A",
//         area: document.getElementById("area")?.value || "N/A",
//         description: desc,
//         tag: radioChecked.value, 
//         type: type,
//         assignTo: assignTo,
//         status: "Open"
//     };

//     // Save to LocalStorage
//     dumpData.push(newEntry);
//     localStorage.setItem("dumpData", JSON.stringify(dumpData));

//     // Success Feedback
//     msg.innerHTML = "✅ Submitted Successfully! (Token No: " + count + ")";
//     msg.style.color = "green";

//     // Form Reset
//     document.getElementById("reportForm").reset();
//     document.getElementById("preview").style.display = "none";
//     document.getElementById("lineDiv").style.display = "none";
//     document.getElementById("areaDiv").style.display = "none";

//     return false;
// }
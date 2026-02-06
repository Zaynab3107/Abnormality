// // Import auth and db from your existing firebase.js
// import { auth, db } from "./firebase.js"; 
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
// import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// // ================= SIGNUP FUNCTION =================
// window.signup = async function() {
//   const userId = document.getElementById("signupId").value.trim();
//   const password = document.getElementById("signupPassword").value;
//   const role = document.getElementById("signupRole").value;
//   const errorEl = document.getElementById("error");

//   if (!userId || !password || !role) {
//     errorEl.textContent = "Please fill in all fields.";
//     return;
//   }

//   try {
//     // Firebase Auth requires email, so use userId + domain
//     const email = userId + "@abnormalitiesapp.com";
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Save role and userId in Firestore
//     await setDoc(doc(db, "users", user.uid), {
//       userId: userId,
//       role: role,
//       createdAt: new Date()
//     });

//     alert("Account created successfully!");
//     window.location.href = "../login.html"; // Redirect to login
//   } catch (error) {
//     console.error(error);
//     errorEl.textContent = error.message;
//   }
// };

// // ================= LOGIN FUNCTION =================
// window.login = async function() {
//   const userId = document.getElementById("userId").value.trim();
//   const password = document.getElementById("password").value;
//   const role = document.getElementById("role").value;
//   const errorEl = document.getElementById("error");

//   if (!userId || !password || !role) {
//     errorEl.textContent = "Please fill in all fields.";
//     return;
//   }

//   try {
//     const email = userId + "@abnormalitiesapp.com";

//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Check role in Firestore
//     const docRef = doc(db, "users", user.uid);
//     const docSnap = await getDoc(docRef);

//     if (!docSnap.exists()) {
//       errorEl.textContent = "User data not found!";
//       return;
//     }

//     const userData = docSnap.data();

//     if (userData.role !== role) {
//       errorEl.textContent = "Role does not match!";
//       return;
//     }

//     // Login successful
//     alert(`Welcome ${userData.userId} (${userData.role})`);

//     // Redirect based on role (optional)
//     if (role === "operator") window.location.href = "operator_dashboard.html";
//     else if (role === "supervisor") window.location.href = "supervisor_dashboard.html";
//     else if (role === "manager") window.location.href = "manager_dashboard.html";

//   } catch (error) {
//     console.error(error);
//     errorEl.textContent = error.message;
//   }
// };

// // ================= GO TO SIGNUP =================
// window.goToSignup = function() {
//   window.location.href = "signup.html";
// };

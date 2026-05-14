import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDEGFN4ESTLI1aLHAobBvPJwOlRYuw5gQI",
  authDomain: "interview-practice-website.firebaseapp.com",
  projectId: "interview-practice-website",
  storageBucket: "interview-practice-website.appspot.com",
  messagingSenderId: "779044973158",
  appId: "1:779044973158:web:e5f8406a74b5be56929ba7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("User not logged in.");
    window.location.href = "../signin/signin.html";
    return;
  }

  // Set initial values
  document.getElementById("user-email").value = user.email;
  document.getElementById("display-name").value = user.displayName || "";
  document.getElementById("profile-pic").src = user.photoURL || "https://via.placeholder.com/100";
  document.getElementById("bio").value = localStorage.getItem(`bio-${user.uid}`) || "";

  // Save button
  document.getElementById("save-btn").addEventListener("click", async () => {
    const name = document.getElementById("display-name").value.trim();
    const bio = document.getElementById("bio").value.trim();
    const statusMsg = document.getElementById("status-msg");

    try {
      await updateProfile(user, {
        displayName: name
      });

      localStorage.setItem(`bio-${user.uid}`, bio);
      statusMsg.textContent = "Profile updated successfully!";
    } catch (err) {
      statusMsg.textContent = "Error updating profile: " + err.message;
      statusMsg.style.color = "red";
    }
  });
});


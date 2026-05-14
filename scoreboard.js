import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDEGFN4ESTLI1aLHAobBvPJwOlRYuw5gQI",
  authDomain: "interview-practice-website.firebaseapp.com",
  projectId: "interview-practice-website",
  storageBucket: "interview-practice-website.appspot.com",
  messagingSenderId: "779044973158",
  appId: "1:779044973158:web:e5f8406a74b5be56929ba7"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Render Chart
function renderChart(data) {
  const ctx = document.getElementById("scoreChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Coding", "MCQ", "Tech", "HR", "Daily"],
      datasets: [{
        label: "Score Breakdown",
        data: [
          data.coding || 0,
          data.mcq || 0,
          data.tech || 0,
          data.hr || 0,
          data.daily || 0
        ],
        backgroundColor: [
          "#1abc9c", "#3498db", "#9b59b6", "#e67e22", "#e74c3c"
        ],
        borderRadius: 8,
        barThickness: 40
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

// Reset scores
window.resetScores = async function () {
  const user = auth.currentUser;
  if (!user) return;

  const uid = user.uid;
  await setDoc(doc(db, "scores", uid), {
    coding: 0,
    mcq: 0,
    tech: 0,
    hr: 0,
    daily: 0
  });

  alert("Scores reset!");
  location.reload();
};

// Load Leaderboard (Top 3)
async function loadLeaderboard(currentUid) {
  const snapshot = await getDocs(collection(db, "scores"));
  const leaderboard = [];

  for (const docSnap of snapshot.docs) {
    const uid = docSnap.id;
    const scoreData = docSnap.data();

    const totalScore = (scoreData.coding || 0) +
                       (scoreData.mcq || 0) +
                       (scoreData.tech || 0) +
                       (scoreData.hr || 0) +
                       (scoreData.daily || 0);

    let userName = "User-" + uid.slice(0, 5);

    // Fetch name from Firestore 'users' collection
    try {
     // inside loadLeaderboard()
const userDoc = await getDoc(doc(db, "users", uid));
if (userDoc.exists()) {
  const userData = userDoc.data();
  userName = userData.name || "Unknown";
}

    } catch (err) {
      console.error("Error getting user name:", err);
    }

    leaderboard.push({ name: userName, score: totalScore });
  }

  leaderboard.sort((a, b) => b.score - a.score);
  const top3 = leaderboard.slice(0, 3);

  const tableBody = document.querySelector(".leaderboard");
  tableBody.innerHTML = "";

  const rankEmojis = ["🥇", "🥈", "🥉"];
  top3.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${rankEmojis[index]}</td>
      <td>${entry.name}</td>
      <td>${entry.score}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Auth listener
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../signin/signin.html";
    return;
  }

  const uid = user.uid;
  const scoreRef = doc(db, "scores", uid);
  let scoreData = {
    coding: 0,
    mcq: 0,
    tech: 0,
    hr: 0,
    daily: 0
  };

  const snapshot = await getDoc(scoreRef);
  if (snapshot.exists()) {
    scoreData = snapshot.data();
  } else {
    await setDoc(scoreRef, scoreData);
  }

  const total = Object.values(scoreData).reduce((sum, val) => sum + (val || 0), 0);
  document.getElementById("total-score").textContent = total;

  // Get user name from Firestore users collection
  const userDoc = await getDoc(doc(db, "users", uid));
  const userData = userDoc.exists() ? userDoc.data() : {};
  document.getElementById("user-name").textContent = userData.name || user.displayName || "You";

  renderChart(scoreData);
  loadLeaderboard(uid);
});


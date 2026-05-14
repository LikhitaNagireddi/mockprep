import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDEGFN4ESTLI1aLHAobBvPJwOlRYuw5gQI",
  authDomain: "interview-practice-website.firebaseapp.com",
  projectId: "interview-practice-website",
  storageBucket: "interview-practice-website.appspot.com",
  messagingSenderId: "779044973158",
  appId: "1:779044973158:web:e5f8406a74b5be56929ba7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const topicFilter = document.getElementById("topicFilter");
const questionList = document.getElementById("questionList");

// Load questions (all subjects)
async function loadQuestions(language) {
  questionList.innerHTML = "<p>Loading...</p>";
  console.log("[DEBUG] Loading questions for:", language);

  try {
    // Fetch all tech questions from Firestore (no subject filter)
    const q = query(collection(db, "mock_questions"), where("type", "==", "tech"));
    const snapshot = await getDocs(q);

    questionList.innerHTML = "";

    if (snapshot.empty) {
      questionList.innerHTML = "<p>No questions found.</p>";
      console.warn("[DEBUG] No tech questions in Firestore.");
      return;
    }

    // Client-side filtering: show all if language is "all", else filter by selected subject
    const filteredDocs = snapshot.docs.filter(doc => {
      const sub = doc.data().subject;
      if (language === "all") return true;         // show all
      return sub.toLowerCase() === language.toLowerCase();
    });

    if (filteredDocs.length === 0) {
      questionList.innerHTML = "<p>No questions found.</p>";
      console.warn("[DEBUG] No questions matched filter.");
      return;
    }

    // Render filtered questions
    filteredDocs.forEach(doc => {
      const data = doc.data();
      console.log("[DEBUG] Doc data:", data);

      const div = document.createElement("div");
      div.className = "question-box";
      div.innerHTML = `
        <a href="compiler.html?question=${encodeURIComponent(data.question)}&subject=${encodeURIComponent(data.subject)}">
          ${data.question}
        </a>
        <p class="question-topic">
          ${data.subject.toUpperCase()} ${data.level ? "| " + data.level.toUpperCase() : ""}
        </p>
      `;
      questionList.appendChild(div);
    });

  } catch (err) {
    console.error("[ERROR] Failed to fetch questions:", err);
    questionList.innerHTML = "<p>Error loading questions. Check console for details.</p>";
  }
}

// Initial load: show all subjects
loadQuestions("all");

// Dropdown filter change
topicFilter.addEventListener("change", () => {
  const selected = topicFilter.value;
  loadQuestions(selected);
});

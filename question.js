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

// Allowed subjects
const allowedSubjects = ["java", "python", "javascript", "c++", "c"];

// Load questions
async function loadQuestions(language) {
  questionList.innerHTML = "<p>Loading...</p>";
  console.log("[DEBUG] Loading questions for:", language);

  let q;

  try {
    if (language === "all") {
      // Fetch all questions for allowed subjects
      q = query(
        collection(db, "mock_questions"),
        where("type", "==", "tech"),
        where("subject", "in", allowedSubjects)
      );
    } else {
      const subject = language.toLowerCase();
      if (!allowedSubjects.includes(subject)) {
        questionList.innerHTML = "<p>No questions found.</p>";
        return;
      }
      q = query(
        collection(db, "mock_questions"),
        where("type", "==", "tech"),
        where("subject", "==", subject)
      );
    }

    const snapshot = await getDocs(q);
    questionList.innerHTML = "";

    if (snapshot.empty) {
      questionList.innerHTML = "<p>No questions found.</p>";
      console.warn("[DEBUG] No matching documents in Firestore.");
      return;
    }

    snapshot.forEach(doc => {
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

// Initial load
loadQuestions("all");

// Dropdown filter change
topicFilter.addEventListener("change", () => {
  const selected = topicFilter.value;
  loadQuestions(selected);
});

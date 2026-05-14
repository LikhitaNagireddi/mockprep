// Load data from localStorage
let progressData = JSON.parse(localStorage.getItem("mockprep_progress")) || [];

const tbody = document.getElementById("progressBody");

function renderProgress() {
  tbody.innerHTML = "";

  if (progressData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No coding attempts yet.</td></tr>`;
    return;
  }

  progressData.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.question}</td>
      <td>${entry.date}</td>
      <td>${entry.time}</td>
      <td>${entry.result}</td>
      <td>
        <button onclick="editEntry(${index})">Edit</button>
        <button class="delete" onclick="deleteEntry(${index})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function deleteEntry(index) {
  if (confirm("Delete this record?")) {
    progressData.splice(index, 1);
    localStorage.setItem("mockprep_progress", JSON.stringify(progressData));
    renderProgress();
  }
}

function editEntry(index) {
  const newResult = prompt("Update Result (e.g. Passed, Failed):", progressData[index].result);
  if (newResult !== null) {
    progressData[index].result = newResult;
    localStorage.setItem("mockprep_progress", JSON.stringify(progressData));
    renderProgress();
  }
}

renderProgress();


let assignments =
    JSON.parse(localStorage.getItem("assignments")) || [];

let seconds = 1500;
let interval = null;

function updateTimer() {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;

    document.getElementById("timer").textContent =
        String(mins).padStart(2, "0") + ":" +
        String(secs).padStart(2, "0");
}

function startTimer() {

    if (interval) return;

    interval = setInterval(() => {
        seconds--;

        if (seconds <= 0) {
            clearInterval(interval);
            interval = null;
            alert("Pomodoro complete!");
        }

        updateTimer();

    }, 1000);
}

function pauseTimer() {
    clearInterval(interval);
    interval = null;
}

function resetTimer() {
    pauseTimer();
    seconds = 1500;
    updateTimer();
}

function saveData() {
    localStorage.setItem(
        "assignments",
        JSON.stringify(assignments)
    );
}

function addAssignment() {

    const title =
        document.getElementById("title").value;

    const course =
        document.getElementById("course").value;

    const priority =
        document.getElementById("priority").value;

    if (title === "" || course === "") {
        alert("Fill in all fields");
        return;
    }

    assignments.push({
        id: Date.now(),
        title,
        course,
        priority,
        complete: false
    });

    saveData();
    renderAssignments();

    document.getElementById("title").value = "";
    document.getElementById("course").value = "";
}

function toggleAssignment(id) {

    assignments.forEach(a => {
        if (a.id === id) {
            a.complete = !a.complete;
        }
    });

    saveData();
    renderAssignments();
}

function deleteAssignment(id) {

    assignments =
        assignments.filter(a => a.id !== id);

    saveData();
    renderAssignments();
}

function renderAssignments() {

    const list =
        document.getElementById("assignmentList");

    list.innerHTML = "";

    let completed = 0;

    assignments.forEach(a => {

        if (a.complete) completed++;

        const div =
            document.createElement("div");

        div.className =
            "assignment " +
            (a.complete ? "completed" : "");

        div.innerHTML = `
            <strong>${a.title}</strong><br>
            ${a.course}<br>
            Priority: ${a.priority}<br>

            <button onclick="toggleAssignment(${a.id})">
                ${a.complete ? "Undo" : "Complete"}
            </button>

            <button onclick="deleteAssignment(${a.id})">
                Delete
            </button>
        `;

        list.appendChild(div);
    });

    let percent =
        assignments.length === 0
        ? 0
        : Math.round(
            completed / assignments.length * 100
        );

    document.getElementById("progressBar")
        .style.width = percent + "%";

    document.getElementById("progressText")
        .textContent =
        percent + "% Complete";
}

document
    .getElementById("darkModeBtn")
    .addEventListener("click", () => {

        document.body.classList.toggle("dark");
    });

updateTimer();
renderAssignments();

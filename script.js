const inputBox = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// Display chat messages with HTML rendering
function displayMessage(message, fromUser = false) {
    const msgDiv = document.createElement("div");
    msgDiv.className = fromUser ? "user-message" : "bot-message";
    msgDiv.innerHTML = message; // Use innerHTML to render <br> properly
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Typing indicator
function showTyping(duration = 1000) {
    const typingDiv = document.createElement("div");
    typingDiv.className = "bot-message typing";
    typingDiv.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    return new Promise(resolve => {
        setTimeout(() => {
            chatBox.removeChild(typingDiv);
            resolve();
        }, duration);
    });
}

// Format course response with HTML line breaks
function formatCourse(courseName) {
    const course = careerData[courseName];
    if (!course) return "Sorry, course information not found.";

    let text = `<b>${courseName}</b><br>${course.description}<br><br>`;

    course.jobs.forEach((job, i) => {
        text += `<b>Job:</b> ${job.title}<br><br>`;
        text += `<b>Tasks:</b><br>${job.tasks.map(task => " - " + task).join("<br>")}<br><br>`;
        text += `<b>Requirements:</b><br>${job.requirements.map(req => " - " + req).join("<br>")}<br><br>`;
        if (job.skills) text += `<b>Skills:</b><br>${job.skills.map(skill => " - " + skill).join("<br>")}<br><br>`;
        text += `<b>Advantages:</b><br>${job.advantages.map(a => " - " + a).join("<br>")}<br><br>`;
        text += `<b>Disadvantages:</b><br>${job.disadvantages.map(d => " - " + d).join("<br>")}<br><br>`;
        text += `<b>Salary:</b> ${job.salary || "N/A"}<br><br>`;
        text += `<b>Companies:</b> ${job.companies.join(", ")}<br><br>`;
        text += `<b>Steps to achieve this role:</b><br>${job.steps.map(step => " → " + step).join("<br>")}<br><br>`;
        text += `<b>Career Growth:</b> ${job.growth}<br><br>`;
    });

    text += "🔹 Click 'Copy Course Info' to save this information.";

    return text;
}

// Copy course info
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Course information copied!");
    }).catch(err => alert("Failed to copy: " + err));
}

// Find related courses
function getRelatedCourses(query) {
    const input = query.toLowerCase();
    const suggestions = [];
    for (const course in careerData) {
        const name = course.toLowerCase();
        const desc = careerData[course].description.toLowerCase();
        if (name.includes(input) || desc.includes(input)) suggestions.push(course);
    }
    return suggestions;
}

// Show clickable suggestions
function showSuggestions(courses) {
    const container = document.createElement("div");
    container.className = "bot-message";
    courses.forEach(course => {
        const btn = document.createElement("button");
        btn.textContent = course;
        btn.className = "suggestion-button";
        btn.onclick = () => {
            displayMessage(course, true);
            displayCourse(course);
        };
        container.appendChild(btn);
    });
    chatBox.appendChild(container);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Display course with typing
async function displayCourse(courseName) {
    await showTyping();
    const details = formatCourse(courseName);
    displayMessage(details, false);

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy Course Info";
    copyBtn.className = "suggestion-button";
    copyBtn.onclick = () => copyToClipboard(details.replace(/<br>/g,"\n")); // Copy clean text
    chatBox.appendChild(copyBtn);
}

// Main chatbot logic
async function handleInput(userInput) {
    userInput = userInput.trim();
    if (!userInput) return;

    displayMessage(userInput, true);

    // Greeting
    if (/^(hi|hello)$/i.test(userInput)) {
        await showTyping();
        displayMessage(
            "Hello! I am your Career Guidance Assistant. Ask me about any university course, career path, tasks, salary, or growth opportunities.",
            false
        );
        return;
    }

    // Exact match
    if (careerData[userInput]) {
        await displayCourse(userInput);
        return;
    }

    // Partial matches
    const related = getRelatedCourses(userInput);
    if (related.length > 0) {
        await showTyping();
        displayMessage("I found these courses related to your query. Click one to see details:", false);
        showSuggestions(related.slice(0, 5));
        return;
    }

    await showTyping();
    displayMessage(
        "Sorry, I couldn't find any course related to that. Try keywords like 'Engineering', 'Medicine', 'Arts', etc.",
        false
    );
}

// Send message
function sendMessage() {
    handleInput(inputBox.value);
    inputBox.value = "";
}

// Enter key support
inputBox.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
        e.preventDefault();
    }
});

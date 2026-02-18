let activeCourse = null;

function handleMessage() {
    const input = document.getElementById("input");
    const message = input.value.trim().toLowerCase();
    if (!message) return;

    addMessage(message, "user");
    const response = generateResponse(message);
    setTimeout(() => addMessage(response, "bot"), 600);
    input.value = "";
}

function addMessage(text, type) {
    const chatBox = document.getElementById("chatBox");
    const div = document.createElement("div");
    div.className = type;
    div.innerHTML = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function generateResponse(message) {

    if (message.includes("hi") || message.includes("hello")) {
        return "Good day. How may I assist you regarding your academic or career path?";
    }

    // Search course
    for (let dept in COURSE_DATABASE) {
        for (let course in COURSE_DATABASE[dept]) {
            if (message.includes(course)) {
                activeCourse = COURSE_DATABASE[dept][course];
                return buildCourseOverview(course, activeCourse);
            }
        }
    }

    if (activeCourse) {
        if (message.includes("job")) return buildJobList(activeCourse);
        if (message.includes("salary")) return buildJobDetail(activeCourse, "salary");
        if (message.includes("company")) return buildJobDetail(activeCourse, "companies");
        if (message.includes("task")) return buildJobDetail(activeCourse, "tasks");
        if (message.includes("advantage")) return buildJobDetail(activeCourse, "advantages");
        if (message.includes("disadvantage")) return buildJobDetail(activeCourse, "disadvantages");
        if (message.includes("requirement")) return buildJobDetail(activeCourse, "requirements");
    }

    return "Kindly specify a course or clarify your request so I may guide you appropriately.";
}

function buildCourseOverview(name, data) {
    return `<strong>${name.toUpperCase()}</strong><br><br>
    ${data.description}<br><br>
    Core Skills Required:<br>${data.coreSkills.join(", ")}<br><br>
    You may ask about jobs, salary, requirements, companies, tasks, advantages, or disadvantages.`;
}

function buildJobList(course) {
    return "Major Career Paths:<br><br>" + Object.keys(course.jobs).join("<br>");
}

function buildJobDetail(course, field) {
    let result = "";
    for (let job in course.jobs) {
        result += `<strong>${job}</strong><br>${course.jobs[job][field]}<br><br>`;
    }
    return result;
}
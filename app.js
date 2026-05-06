const USERNAME = "admin@posbrokers.com";
const PASSWORD = "Court@go23";

/* ---------------- LOGIN ---------------- */

function login() {
  const u = document.getElementById("email").value;
  const p = document.getElementById("password").value;

  if (u === USERNAME && p === PASSWORD) {
    localStorage.setItem("auth", "true");
    window.location.href = "active-tickets.html";
  } else {
    alert("Invalid login");
  }
}

function logout() {
  localStorage.removeItem("auth");
  window.location.href = "index.html";
}

function checkLogin() {
  if (localStorage.getItem("auth") !== "true") {
    window.location.href = "index.html";
  }
}

/* ---------------- STORAGE ---------------- */

function getTickets() {
  return JSON.parse(localStorage.getItem("tickets")) || [];
}

function saveTickets(t) {
  localStorage.setItem("tickets", JSON.stringify(t));
}

/* ---------------- CREATE ---------------- */

function createTicket(e) {
  e.preventDefault();

  const now = new Date().toLocaleString();

  const ticket = {
    id: String(Date.now()),
    businessName: businessName.value,
    merchantId: merchantId.value,
    requester: requester.value,
    date: date.value,
    request: request.value,
    progress: progress.value,
    priority: priority.value,
    notes: [],
    created: now,
    updated: now,
    completed: ""
  };

  const firstNote = notes.value;
  if (firstNote) {
    ticket.notes.push(now + " - " + firstNote);
  }

  const t = getTickets();
  t.push(ticket);
  saveTickets(t);

  window.location.href = "active-tickets.html";
}

/* ---------------- TOGGLE ---------------- */

function toggle(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = el.style.display === "block" ? "none" : "block";
}

/* ---------------- ADD NOTE (FIXED) ---------------- */

function addNote(id) {

  const input = document.getElementById("note-" + id);
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  const now = new Date().toLocaleString();

  const tickets = getTickets();

  tickets.forEach(t => {
    if (String(t.id) === String(id)) {

      if (!Array.isArray(t.notes)) {
        t.notes = [];
      }

      t.notes.push(now + " - " + text);
      t.updated = now;
    }
  });

  saveTickets(tickets);

  render();
}

/* ---------------- STATUS ---------------- */

function updateStatus(id, val) {
  const now = new Date().toLocaleString();

  const t = getTickets();

  t.forEach(x => {
    if (String(x.id) === String(id)) {
      x.progress = val;
      x.updated = now;
      if (val === "Completed") x.completed = now;
    }
  });

  saveTickets(t);
  render();
}

/* ---------------- DELETE ---------------- */

function del(id) {
  saveTickets(getTickets().filter(x => String(x.id) !== String(id)));
  render();
}

/* ---------------- STATS ---------------- */

function stats(t) {
  statAll.textContent = "All: " + t.length;
  statNew.textContent = "New: " + t.filter(x => x.progress === "New").length;
  statProg.textContent = "In Progress: " + t.filter(x => x.progress === "In Progress").length;
  statDone.textContent = "Completed: " + t.filter(x => x.progress === "Completed").length;
}

/* ---------------- RENDER ---------------- */

function render() {

  const box = document.getElementById("activeContainer");
  if (!box) return;

  let t = getTickets();

  const s = (search?.value || "").toLowerCase();
  const f = filter?.value || "All";

  if (f !== "All") {
    t = t.filter(x => x.progress === f);
  }

  if (s) {
    t = t.filter(x =>
      (x.businessName + x.merchantId + x.requester + (x.notes || []).join(" "))
      .toLowerCase()
      .includes(s)
    );
  }

  stats(getTickets());

  box.innerHTML = "";

  t.reverse().forEach(x => {

    let notes = "";
    if (Array.isArray(x.notes)) {
      notes = x.notes.map(n => `<div class="note">${n}</div>`).join("");
    }

    box.innerHTML += `
      <div class="ticket priority-${x.priority}">

        <div class="ticket-summary" onclick="toggle('d-${x.id}')">
          <b>${x.businessName}</b><br>
          ${x.merchantId}<br>
          ${x.requester}<br>
          ${x.date}<br>
          <b>${x.progress}</b>
        </div>

        <div class="ticket-details" id="d-${x.id}">

          <p>${x.request}</p>

          <hr>

          ${notes}

          <textarea id="note-${x.id}"></textarea>
          <button onclick="addNote('${x.id}')">Add Note</button>

          <hr>

          <p>Created: ${x.created}</p>
          <p>Updated: ${x.updated}</p>
          <p>Completed: ${x.completed || "No"}</p>

          <select onchange="updateStatus('${x.id}', this.value)">
            <option ${x.progress==="New"?"selected":""}>New</option>
            <option ${x.progress==="In Progress"?"selected":""}>In Progress</option>
            <option ${x.progress==="Completed"?"selected":""}>Completed</option>
          </select>

          <br><br>

          <button onclick="del('${x.id}')">Delete</button>

        </div>

      </div>
    `;
  });
}

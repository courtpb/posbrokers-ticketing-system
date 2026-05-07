const USERNAME = "admin@posbrokers.com";
const PASSWORD = "Court@go23";

/* LOGIN */

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

/* STORAGE */

function getTickets() {

  return JSON.parse(localStorage.getItem("tickets")) || [];

}

function saveTickets(t) {

  localStorage.setItem("tickets", JSON.stringify(t));

}

/* CREATE TICKET */

function createTicket(e) {

  e.preventDefault();

  const now = new Date().toLocaleString();

  const ticket = {

    id: String(Date.now()),

    businessName: document.getElementById("businessName").value,

    merchantId: document.getElementById("merchantId").value,

    requester: document.getElementById("requester").value,

    date: document.getElementById("date").value,

    request: document.getElementById("request").value,

    progress: document.getElementById("progress").value,

    priority: document.getElementById("priority").value,

    notes: [],

    created: now,

    updated: now,

    completed: ""

  };

  const firstNote = document.getElementById("notes").value;

  if (firstNote && firstNote.trim() !== "") {

    ticket.notes.push(now + " - " + firstNote);

  }

  const tickets = getTickets();

  tickets.push(ticket);

  saveTickets(tickets);

  window.location.href = "active-tickets.html";
}

/* TOGGLE */

function toggle(id) {

  const el = document.getElementById(id);

  if (!el) return;

  el.style.display =
    el.style.display === "block"
      ? "none"
      : "block";
}

/* ADD NOTE */

function addNote(id) {

  const input =
    document.getElementById("note-" + id);

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

/* STATUS */

function updateStatus(id, val) {

  const now = new Date().toLocaleString();

  const tickets = getTickets();

  tickets.forEach(t => {

    if (String(t.id) === String(id)) {

      t.progress = val;

      t.updated = now;

      if (val === "Completed") {

        t.completed = now;

      }
    }
  });

  saveTickets(tickets);

  render();
}

/* DELETE */

function del(id) {

  const updated =
    getTickets().filter(
      t => String(t.id) !== String(id)
    );

  saveTickets(updated);

  render();
}

/* STATS */

function stats(t) {

  statAll.textContent =
    "All: " + t.length;

  statNew.textContent =
    "New: " +
    t.filter(x => x.progress === "New").length;

  statProg.textContent =
    "In Progress: " +
    t.filter(x => x.progress === "In Progress").length;

  statDone.textContent =
    "Completed: " +
    t.filter(x => x.progress === "Completed").length;
}

/* RENDER */

function render() {

  const box =
    document.getElementById("activeContainer");

  if (!box) return;

  let tickets = getTickets();

  const s =
    (document.getElementById("search")?.value || "")
    .toLowerCase();

  const f =
    document.getElementById("filter")?.value || "All";

  if (f !== "All") {

    tickets =
      tickets.filter(
        t => t.progress === f
      );
  }

  if (s) {

    tickets =
      tickets.filter(t =>

        (
          t.businessName +
          t.merchantId +
          t.requester +
          (t.notes || []).join(" ")

        )
          .toLowerCase()
          .includes(s)
      );
  }

  stats(getTickets());

  box.innerHTML = "";

  tickets.reverse().forEach(t => {

    let notesHTML = "";

    if (
      Array.isArray(t.notes) &&
      t.notes.length > 0
    ) {

      notesHTML =
        t.notes
          .map(
            n =>
              `<div class="note">${n}</div>`
          )
          .join("");

    } else {

      notesHTML =
        `<div class="note">No notes yet</div>`;
    }

    box.innerHTML += `

      <div class="ticket priority-${t.priority}">

        <div
          class="ticket-summary"
          onclick="toggle('d-${t.id}')"
        >

          <b>${t.businessName}</b><br>

          ${t.merchantId}<br>

          ${t.requester}<br>

          ${t.date}<br>

          <b>${t.progress}</b>

        </div>

        <div
          class="ticket-details"
          id="d-${t.id}"
        >

          <p>${t.request}</p>

          <hr>

          ${notesHTML}

          <textarea
            id="note-${t.id}"
            placeholder="Add note"
          ></textarea>

          <br><br>

          <button
            onclick="addNote('${t.id}')"
          >
            Add Note
          </button>

          <hr>

          <p>Created: ${t.created}</p>

          <p>Updated: ${t.updated}</p>

          <p>
            Completed:
            ${t.completed || "No"}
          </p>

          <select
            onchange="
              updateStatus(
                '${t.id}',
                this.value
              )
            "
          >

            <option
              ${t.progress==="New"?"selected":""}
            >
              New
            </option>

            <option
              ${t.progress==="In Progress"?"selected":""}
            >
              In Progress
            </option>

            <option
              ${t.progress==="Completed"?"selected":""}
            >
              Completed
            </option>

          </select>

          <br><br>

          <button
            onclick="del('${t.id}')"
          >
            Delete
          </button>

        </div>

      </div>
    `;
  });
}

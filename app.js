const USERNAME = "admin@posbrokers.com";
const PASSWORD = "Court@go23";

/* LOGIN */

function login() {

  const u =
    document.getElementById("email").value;

  const p =
    document.getElementById("password").value;

  if (
    u === USERNAME &&
    p === PASSWORD
  ) {

    localStorage.setItem(
      "auth",
      "true"
    );

    window.location.href =
      "active-tickets.html";

  } else {

    alert("Invalid login");
  }
}

function logout() {

  localStorage.removeItem("auth");

  window.location.href =
    "index.html";
}

function checkLogin() {

  if (
    localStorage.getItem("auth")
    !== "true"
  ) {

    window.location.href =
      "index.html";
  }
}

/* STORAGE */

function getTickets() {

  return JSON.parse(
    localStorage.getItem("tickets")
  ) || [];
}

function saveTickets(t) {

  localStorage.setItem(
    "tickets",
    JSON.stringify(t)
  );
}

/* CREATE TICKET */

function createTicket(e) {

  e.preventDefault();

  const now =
    new Date().toLocaleString();

  const ticket = {

    id: String(Date.now()),

    businessName:
      document.getElementById(
        "businessName"
      ).value,

    merchantId:
      document.getElementById(
        "merchantId"
      ).value,

    requester:
      document.getElementById(
        "requester"
      ).value,

    date:
      document.getElementById(
        "date"
      ).value,

    ticketType:
      document.getElementById(
        "ticketType"
      ).value,

    assignedTo:
      document.getElementById(
        "assignedTo"
      ).value,

    request:
      document.getElementById(
        "request"
      ).value,

    progress:
      document.getElementById(
        "progress"
      ).value,

    priority:
      document.getElementById(
        "priority"
      ).value,

    notes: [],

    created: now,

    updated: now,

    completed: ""

  };

  const firstNote =
    document.getElementById(
      "notes"
    ).value;

  if (
    firstNote &&
    firstNote.trim() !== ""
  ) {

    ticket.notes.push(
      now + " - " + firstNote
    );
  }

  const tickets =
    getTickets();

  tickets.push(ticket);

  saveTickets(tickets);

  window.location.href =
    "active-tickets.html";
}

/* TOGGLE DETAILS */

function toggle(id) {

  const el =
    document.getElementById(id);

  if (!el) return;

  el.style.display =
    el.style.display === "block"
      ? "none"
      : "block";
}

/* ADD NOTE */

function addNote(id) {

  const input =
    document.getElementById(
      "note-" + id
    );

  if (!input) return;

  const text =
    input.value.trim();

  if (!text) return;

  const tickets =
    getTickets();

  const now =
    new Date().toLocaleString();

  tickets.forEach(t => {

    if (
      String(t.id) === String(id)
    ) {

      t.notes.push(
        now + " - " + text
      );

      t.updated = now;
    }
  });

  saveTickets(tickets);

  render();
}

/* UPDATE STATUS */

function updateStatus(id, val) {

  const tickets =
    getTickets();

  const now =
    new Date().toLocaleString();

  tickets.forEach(t => {

    if (
      String(t.id) === String(id)
    ) {

      t.progress = val;

      t.updated = now;

      if (
        val === "Completed"
      ) {

        t.completed = now;
      }
    }
  });

  saveTickets(tickets);

  render();
}

/* UPDATE ASSIGNED */

function updateAssigned(id, val) {

  const tickets =
    getTickets();

  const now =
    new Date().toLocaleString();

  tickets.forEach(t => {

    if (
      String(t.id) === String(id)
    ) {

      t.assignedTo = val;

      t.updated = now;
    }
  });

  saveTickets(tickets);

  render();
}

/* DELETE */

function del(id) {

  const updated =
    getTickets().filter(
      t =>
        String(t.id)
        !== String(id)
    );

  saveTickets(updated);

  render();
}

/* EXPORT ALL TICKETS */

function exportTickets() {

  const tickets =
    getTickets();

  if (tickets.length === 0) {

    alert(
      "No tickets to export"
    );

    return;
  }

  const headers = [

    "Business Name",
    "Merchant ID",
    "Requester",
    "Ticket Type",
    "Assigned To",
    "Date",
    "Status",
    "Priority",
    "Request",
    "Notes",
    "Created",
    "Updated",
    "Completed"

  ];

  const rows =
    tickets.map(t => [

      t.businessName || "",
      t.merchantId || "",
      t.requester || "",
      t.ticketType || "",
      t.assignedTo || "",
      t.date || "",
      t.progress || "",
      t.priority || "",
      t.request || "",

      Array.isArray(t.notes)
        ? t.notes.join(" | ")
        : "",

      t.created || "",
      t.updated || "",
      t.completed || ""

    ]);

  let csv =
    headers.join(",") + "\n";

  rows.forEach(r => {

    csv +=
      r.map(x =>

        `"${String(x).replace(/"/g, '""')}"`

      ).join(",") + "\n";
  });

  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download =
    "all-tickets.csv";

  link.click();
}

/* RENDER */

function render() {

  const box =
    document.getElementById(
      "activeContainer"
    );

  if (!box) return;

  let tickets =
    getTickets();

  const search =
    (
      document.getElementById(
        "search"
      )?.value || ""
    ).toLowerCase();

  const filter =
    document.getElementById(
      "filter"
    )?.value || "All";

  if (filter !== "All") {

    tickets =
      tickets.filter(
        t =>
          t.progress === filter
      );
  }

  if (search) {

    tickets =
      tickets.filter(t =>

        (
          t.businessName +
          t.merchantId +
          t.requester +
          t.assignedTo +
          t.ticketType
        )
          .toLowerCase()
          .includes(search)
      );
  }

  document.getElementById(
    "statAll"
  ).textContent =
    "All: " +
    getTickets().length;

  document.getElementById(
    "statNew"
  ).textContent =
    "New: " +
    getTickets().filter(
      t => t.progress === "New"
    ).length;

  document.getElementById(
    "statProg"
  ).textContent =
    "In Progress: " +
    getTickets().filter(
      t =>
        t.progress ===
        "In Progress"
    ).length;

  document.getElementById(
    "statDone"
  ).textContent =
    "Completed: " +
    getTickets().filter(
      t =>
        t.progress ===
        "Completed"
    ).length;

  box.innerHTML = "";

  tickets.reverse().forEach(t => {

    const notes =
      t.notes.length > 0
        ? t.notes.map(n =>
            `<div class="note">${n}</div>`
          ).join("")
        : "<div>No notes yet</div>";

    box.innerHTML += `

      <div class="ticket">

        <div
          class="ticket-summary"
          onclick="toggle('d-${t.id}')"
        >

          <b>${t.businessName}</b><br>

          ${t.merchantId}<br>

          ${t.requester}<br>

          ${t.ticketType}<br>

          Assigned:
          <b>${t.assignedTo}</b><br>

          ${t.progress}

        </div>

        <div
          class="ticket-details"
          id="d-${t.id}"
        >

          <p>${t.request}</p>

          <hr>

          ${notes}

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

          <br><br>

          <label>
            Assign:
          </label>

          <select
            onchange="
              updateAssigned(
                '${t.id}',
                this.value
              )
            "
          >

            <option
              ${t.assignedTo==="Bryan"?"selected":""}
            >
              Bryan
            </option>

            <option
              ${t.assignedTo==="Che"?"selected":""}
            >
              Che
            </option>

            <option
              ${t.assignedTo==="Courtney"?"selected":""}
            >
              Courtney
            </option>

            <option
              ${t.assignedTo==="Pat"?"selected":""}
            >
              Pat
            </option>

          </select>

          <br><br>

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

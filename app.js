const USERNAME = 'support';
const PASSWORD = 'Pos2026!';

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email === USERNAME && password === PASSWORD) {
    localStorage.setItem('loggedIn', 'true');
    window.location.href = 'active-tickets.html';
  } else {
    alert('Invalid Login');
  }
}

function logout() {
  localStorage.removeItem('loggedIn');
  sessionStorage.clear();
  window.location.replace('index.html');
}

function checkLogin() {
  if (localStorage.getItem('loggedIn') !== 'true') {
    window.location.href = 'index.html';
  }
}

function getTickets() {
  return JSON.parse(localStorage.getItem('tickets')) || [];
}

function saveTickets(tickets) {
  localStorage.setItem('tickets', JSON.stringify(tickets));
}

function createTicket(event) {
  event.preventDefault();

  const tickets = getTickets();
  const now = new Date().toLocaleString();

  const ticket = {
    id: 'POS-' + Date.now(),
    businessName: document.getElementById('businessName').value,
    merchantId: document.getElementById('merchantId').value,
    request: document.getElementById('request').value,
    progress: document.getElementById('progress').value,
    date: document.getElementById('date').value,
    requester: document.getElementById('requester').value,
    noteHistory: [],
    createdDate: now,
    lastUpdated: now,
    completedDate: ''
  };

  const firstNote = document.getElementById('notes').value;
  if (firstNote) {
    ticket.noteHistory.push(`${now} - ${firstNote}`);
  }

  tickets.push(ticket);
  saveTickets(tickets);

  alert('Ticket Created');
  window.location.href = 'active-tickets.html';
}

function toggleTicket(id) {
  const el = document.getElementById(`details-${id}`);
  if (!el) return;

  el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

function addNote(id) {
  const input = document.getElementById(`note-${id}`);
  const text = input.value.trim();
  if (!text) return alert('Enter a note');

  const tickets = getTickets();
  const now = new Date().toLocaleString();

  const updated = tickets.map(t => {
    if (t.id === id) {
      if (!t.noteHistory) t.noteHistory = [];
      t.noteHistory.push(`${now} - ${text}`);
      t.lastUpdated = now;
    }
    return t;
  });

  saveTickets(updated);
  location.reload();
}

function updateStatus(id, status) {
  const tickets = getTickets();
  const now = new Date().toLocaleString();

  const updated = tickets.map(t => {
    if (t.id === id) {
      t.progress = status;
      t.lastUpdated = now;
      if (status === 'Completed') t.completedDate = now;
    }
    return t;
  });

  saveTickets(updated);
  location.reload();
}

function deleteTicket(id) {
  if (!confirm('Delete ticket?')) return;

  const tickets = getTickets().filter(t => t.id !== id);
  saveTickets(tickets);
  location.reload();
}

function loadTickets(statuses, containerId) {
  const container = document.getElementById(containerId);
  const tickets = getTickets();

  container.innerHTML = '';

  const filtered = tickets.filter(t => statuses.includes(t.progress));

  if (filtered.length === 0) {
    container.innerHTML = `<div class="ticket"><div class="ticket-summary"><h3>No Tickets Found</h3></div></div>`;
    return;
  }

  filtered.reverse().forEach(t => {

    const notes = (t.noteHistory || [])
      .map(n => `<div class="note-item">${n}</div>`)
      .join('');

    container.innerHTML += `
      <div class="ticket">

        <div class="ticket-summary" onclick="toggleTicket('${t.id}')">
          <h3>${t.businessName}</h3>
          <p>${t.merchantId}</p>
          <p>${t.requester}</p>
          <p>${t.date}</p>
          <p><strong>${t.progress}</strong></p>
        </div>

        <div class="ticket-details" id="details-${t.id}">

          <p><strong>Request:</strong></p>
          <p>${t.request}</p>

          <hr>

          <p><strong>Notes</strong></p>
          ${notes}

          <textarea id="note-${t.id}" placeholder="Add note"></textarea>
          <button onclick="addNote('${t.id}')">Add Note</button>

          <hr>

          <p><strong>Created:</strong> ${t.createdDate}</p>
          <p><strong>Last Updated:</strong> ${t.lastUpdated}</p>
          <p><strong>Completed:</strong> ${t.completedDate || 'Not Completed'}</p>

          <label>Status</label>
          <select onchange="updateStatus('${t.id}', this.value)">
            <option ${t.progress==='New'?'selected':''}>New</option>
            <option ${t.progress==='In Progress'?'selected':''}>In Progress</option>
            <option ${t.progress==='Completed'?'selected':''}>Completed</option>
          </select>

          <br><br>
          <button onclick="deleteTicket('${t.id}')">Delete</button>

        </div>

      </div>
    `;
  });
}

function searchTickets(inputId, containerId) {
  const val = document.getElementById(inputId).value.toLowerCase();
  document.querySelectorAll(`#${containerId} .ticket`).forEach(t => {
    t.style.display = t.innerText.toLowerCase().includes(val) ? 'block' : 'none';
  });
}

function exportCSV() {
  const tickets = getTickets();

  let csv = 'ID,Business,Merchant,Requester,Date,Status,Request,Notes\n';

  tickets.forEach(t => {
    const notes = (t.noteHistory || []).join(' | ');
    csv += `"${t.id}","${t.businessName}","${t.merchantId}","${t.requester}","${t.date}","${t.progress}","${t.request}","${notes}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'tickets.csv';
  a.click();
}

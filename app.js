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

  alert('Logged Out Successfully');

  window.location.replace('index.html');

}

function checkLogin() {

  if (localStorage.getItem('loggedIn') !== 'true') {

    window.location.href = 'index.html';

  }

}

function getTickets() {

  const tickets = localStorage.getItem('tickets');

  return tickets ? JSON.parse(tickets) : [];

}

function saveTickets(tickets) {

  localStorage.setItem('tickets', JSON.stringify(tickets));

}

function createTicket(event) {

  event.preventDefault();

  const tickets = getTickets();

  const currentDate = new Date().toLocaleString();

  const ticket = {

    id: 'POS-' + Date.now(),

    businessName: document.getElementById('businessName').value,

    merchantId: document.getElementById('merchantId').value,

    request: document.getElementById('request').value,

    progress: document.getElementById('progress').value,

    date: document.getElementById('date').value,

    requester: document.getElementById('requester').value,

    notes: document.getElementById('notes').value,

    createdDate: currentDate,

    notesUpdatedDate: currentDate,

    completedDate: '',

    lastUpdated: currentDate

  };

  tickets.push(ticket);

  saveTickets(tickets);

  alert('Ticket Created Successfully');

  document.getElementById('ticketForm').reset();

  window.location.href = 'active-tickets.html';

}

function loadTickets(statuses, containerId) {

  const tickets = getTickets();

  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = '';

  const filteredTickets = tickets.filter(ticket =>
    statuses.includes(ticket.progress)
  );

  if (filteredTickets.length === 0) {

    container.innerHTML = `
      <div class="ticket">
        <h3>No Tickets Found</h3>
        <p>Create a new ticket to get started.</p>
      </div>
    `;

    return;

  }

  filteredTickets
    .slice()
    .reverse()
    .forEach(ticket => {

      container.innerHTML += `

        <div class="ticket">

          <h3>${ticket.id}</h3>

          <p><strong>Business:</strong> ${ticket.businessName}</p>

          <p><strong>Merchant ID:</strong> ${ticket.merchantId}</p>

          <p><strong>Requester:</strong> ${ticket.requester}</p>

          <p><strong>Date:</strong> ${ticket.date}</p>

          <p><strong>Status:</strong> ${ticket.progress}</p>

          <hr>

          <div class="edit-section">

            <label><strong>Request</strong></label>

            <textarea onchange="updateField('${ticket.id}', 'request', this.value)">
${ticket.request}
            </textarea>

            <label><strong>Notes</strong></label>

            <textarea onchange="updateField('${ticket.id}', 'notes', this.value)">
${ticket.notes}
            </textarea>

          </div>

          <p><strong>Date Created:</strong> ${ticket.createdDate}</p>

          <p><strong>Last Updated:</strong> ${ticket.lastUpdated}</p>

          <p><strong>Notes Updated:</strong> ${ticket.notesUpdatedDate}</p>

          <p><strong>Date Completed:</strong> ${ticket.completedDate || 'Not Completed'}</p>

          <label><strong>Update Status</strong></label>

          <select onchange="updateStatus('${ticket.id}', this.value)">

            <option value="New" ${ticket.progress === 'New' ? 'selected' : ''}>
              New
            </option>

            <option value="In Progress" ${ticket.progress === 'In Progress' ? 'selected' : ''}>
              In Progress
            </option>

            <option value="Completed" ${ticket.progress === 'Completed' ? 'selected' : ''}>
              Completed
            </option>

          </select>

          <br>

          <button onclick="deleteTicket('${ticket.id}')">
            Delete Ticket
          </button>

        </div>

      `;

    });

}

function updateStatus(id, newStatus) {

  const tickets = getTickets();

  const updatedTickets = tickets.map(ticket => {

    if (ticket.id === id) {

      ticket.progress = newStatus;

      ticket.lastUpdated = new Date().toLocaleString();

      if (newStatus === 'Completed') {

        ticket.completedDate = new Date().toLocaleString();

      }

    }

    return ticket;

  });

  saveTickets(updatedTickets);

  location.reload();

}

function updateField(id, field, value) {

  const tickets = getTickets();

  const updatedTickets = tickets.map(ticket => {

    if (ticket.id === id) {

      ticket[field] = value;

      ticket.lastUpdated = new Date().toLocaleString();

      if (field === 'notes') {

        ticket.notesUpdatedDate = new Date().toLocaleString();

      }

    }

    return ticket;

  });

  saveTickets(updatedTickets);

}

function deleteTicket(id) {

  const confirmDelete = confirm('Delete this ticket?');

  if (!confirmDelete) return;

  let tickets = getTickets();

  tickets = tickets.filter(ticket => ticket.id !== id);

  saveTickets(tickets);

  location.reload();

}

function searchTickets(inputId, containerId) {

  const input = document
    .getElementById(inputId)
    .value
    .toLowerCase();

  const tickets = document.querySelectorAll(
    `#${containerId} .ticket`
  );

  tickets.forEach(ticket => {

    if (ticket.innerText.toLowerCase().includes(input)) {

      ticket.style.display = 'block';

    } else {

      ticket.style.display = 'none';

    }

  });

}

function exportCSV() {

  const tickets = getTickets();

  let csv =
    'Ticket ID,Business Name,Merchant ID,Requester,Date,Status,Request,Notes,Created Date,Last Updated,Notes Updated,Completed Date\n';

  tickets.forEach(ticket => {

    csv += `"${ticket.id}","${ticket.businessName}","${ticket.merchantId}","${ticket.requester}","${ticket.date}","${ticket.progress}","${ticket.request}","${ticket.notes}","${ticket.createdDate}","${ticket.lastUpdated}","${ticket.notesUpdatedDate}","${ticket.completedDate}"\n`;

  });

  const blob = new Blob([csv], {
    type: 'text/csv'
  });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');

  a.setAttribute('hidden', '');

  a.setAttribute('href', url);

  a.setAttribute('download', 'tickets.csv');

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

}

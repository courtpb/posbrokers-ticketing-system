const USERNAME = 'admin@posbrokers.com';
const PASSWORD = 'Court@go23';

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
  window.location.href = 'index.html';
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

  container.innerHTML = '';

  const filteredTickets = tickets.filter(ticket =>
    statuses.includes(ticket.progress)
  );

  if (filteredTickets.length === 0) {
    container.innerHTML = `
      <div class="ticket">
        <h3>No Tickets Found</h3>
}

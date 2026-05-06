const USERNAME = 'admin@posbrokers.com';
const PASSWORD = 'Court@go23';

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email === USERNAME && password === PASSWORD) {
    localStorage.setItem('loggedIn', 'true');
    window.location.href = 'create-ticket.html';
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

  const ticket = {
    id: 'POS-' + Date.now(),
    businessName: document.getElementById('businessName').value,
    merchantId: document.getElementById('merchantId').value,
    request: document.getElementById('request').value,
    progress: document.getElementById('progress').value,
    date: document.getElementById('date').value,
    requester: document.getElementById('requester').value,
    notes: document.getElementById('notes').value,
    createdAt: new Date().toISOString()
  };

  tickets.push(ticket);

  saveTickets(tickets);

  alert('Ticket Created');

  document.getElementById('ticketForm').reset();
}

function loadTickets(statuses, containerId) {
  const tickets = getTickets();
  const container = document.getElementById(containerId);

  container.innerHTML = '';

}

const USERNAME = 'support';
const PASSWORD = 'Pos2026!';

/* ---------------- LOGIN ---------------- */

function login() {
  const u = document.getElementById('email').value;
  const p = document.getElementById('password').value;

  if (u === USERNAME && p === PASSWORD) {
    localStorage.setItem('loggedIn', 'true');
    window.location.href = 'active-tickets.html';
  } else {
    alert('Invalid Login');
  }
}

function logout() {
  localStorage.removeItem('loggedIn');
  sessionStorage.clear();
  window.location.href = 'index.html';
}

function checkLogin() {
  if (localStorage.getItem('loggedIn') !== 'true') {
    window.location.href = 'index.html';
  }
}

/* ---------------- STORAGE ---------------- */

function getTickets() {
  return JSON.parse(localStorage.getItem('tickets')) || [];
}

function saveTickets(t) {
  localStorage.setItem('tickets', JSON.stringify(t));
}

/* ---------------- CREATE ---------------- */

function createTicket(e) {
  e.preventDefault();

  const now = new Date().toLocaleString();

  const ticket = {
    id: 'POS-' + Date.now(),
    businessName: businessName.value,
    merchantId: merchantId.value,
    request: request.value,
    progress: progress.value,
    date: date.value,
    requester: requester.value,
    priority: priority?.value || 'low',
    notes: [],
    created: now,
    updated: now,
    completed: ''
  };

  const firstNote = notes.value;
  if (firstNote) {
    ticket.notes.push(`${now} - ${firstNote}`);
  }

  const t = getTickets();
  t.push(ticket);
  saveTickets(t);

  location.href = 'active-tickets.html';
}

/* ---------------- TOGGLE ---------------- */

function toggle(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

/* ---------------- ADD NOTE ---------------- */

function addNote(id) {
  const input = document.getElementById('note-' + id);
  const text = input.value.trim();
  if (!text) return;

  const now = new Date().toLocaleString();

  const t = getTickets();

  t.forEach(x => {
    if (x.id === id) {
      x.notes.push(`${now} - ${text}`);
      x.updated = now;
    }
  });

  saveTickets(t);
  render();
}

/* ---------------- STATUS ---------------- */

function updateStatus(id, val) {
  const now = new Date().toLocaleString();

  const t = getTickets();

  t.forEach(x => {
    if (x.id === id) {
      x.progress = val;
      x.updated = now;
      if (val === 'Completed') x.completed = now;
    }
  });

  saveTickets(t);
  render();
}

/* ---------------- DELETE ---------------- */

function del(id) {
  saveTickets(getTickets().filter(x => x.id !== id));
  render();
}

/* ---------------- DASHBOARD ---------------- */

function stats(t) {
  statAll.textContent = 'All: ' + t.length;
  statNew.textContent = 'New: ' + t.filter(x => x.progress === 'New').length;
  statProg.textContent = 'In Progress: ' + t.filter(x => x.progress === 'In Progress').length;
  statDone.textContent = 'Completed: ' + t.filter(x => x.progress === 'Completed').length;
}

/* ---------------- RENDER ---------------- */

function render() {

  const box = document.getElementById('activeContainer');
  if (!box) return;

  let t = getTickets();

  const s = search?.value?.toLowerCase() || '';
  const f = filter?.value || 'All';

  if (f !== 'All') {
    t = t.filter(x => x.progress === f);
  }

  if (s) {
    t = t.filter(x =>
      (x.businessName + x.merchantId + x.requester + x.notes.join(' '))
      .toLowerCase().includes(s)
    );
  }

  stats(getTickets());

  box.innerHTML = '';

  t.reverse().forEach(x => {

    const notes = x.notes.map(n => `<div class="note">${n}</div>`).join('');

    box.innerHTML += `
      <div class="ticket priority-${x.priority}">

        <div class="ticket-summary" onclick="toggle('d-${x.id}')">

          <h3>${x.businessName}</h3>
          <p>${x.merchantId}</p>
          <p>${x.requester}</p>
          <p>${x.date}</p>
          <p><b>${x.progress}</b></p>

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
          <p>Completed: ${x.completed || 'No'}</p>

          <select onchange="updateStatus('${x.id}', this.value)">
            <option ${x.progress==='New'?'selected':''}>New</option>
            <option ${x.progress==='In Progress'?'selected':''}>In Progress</option>
            <option ${x.progress==='Completed'?'selected':''}>Completed</option>
          </select>

          <br><br>
          <button onclick="del('${x.id}')">Delete</button>

        </div>

      </div>
    `;
  });
}

/* ---------------- SEARCH ---------------- */

function searchTickets() {
  render();
}

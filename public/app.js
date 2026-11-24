const state = { sessionId: null, polling: false };

async function jsonRequest(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

async function createSession() {
  const result = await jsonRequest('/api/session', { method: 'POST' });
  state.sessionId = result.sessionId;
  document.querySelector('#sessionId').textContent = state.sessionId;
}

async function requestDecision() {
  if (!state.sessionId) await createSession();
  const result = await jsonRequest('/api/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: state.sessionId })
  });
  document.querySelector('#status').textContent = result.status;
}

async function pollStatus() {
  if (!state.sessionId || state.polling) return;
  state.polling = true;
  try {
    const result = await jsonRequest(
      `/api/status?sessionId=${encodeURIComponent(state.sessionId)}`
    );
    document.querySelector('#status').textContent = result.status;
  } catch (error) {
    console.error(error);
  } finally {
    state.polling = false;
  }
}

document.querySelector('#requestButton').addEventListener('click', requestDecision);

createSession().then(() => {
  setInterval(pollStatus, 2000);
}).catch(console.error);

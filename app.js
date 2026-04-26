const USERS = {
  muskan: { password: "muskan@112", canDelete: false, role: "Learner" },
  shariff: { password: "shariff@112", canDelete: true, role: "Admin Mentor" }
};

const STORAGE_KEY = "edubridge-chat-v1";

const loginScreen = document.getElementById("loginScreen");
const chatScreen = document.getElementById("chatScreen");
const loginForm = document.getElementById("loginForm");
const msgForm = document.getElementById("msgForm");
const chatList = document.getElementById("chatList");
const loginError = document.getElementById("loginError");
const roleInfo = document.getElementById("roleInfo");
const adminControls = document.getElementById("adminControls");
const clearBtn = document.getElementById("clearBtn");
const exportBtn = document.getElementById("exportBtn");
const logoutBtn = document.getElementById("logoutBtn");
const messageInput = document.getElementById("messageInput");

let currentUser = null;

function getMessages() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function formatTime(isoTime) {
  return new Date(isoTime).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function renderMessages() {
  const messages = getMessages();
  chatList.innerHTML = "";

  messages.forEach((message) => {
    const wrap = document.createElement("article");
    const mine = message.author === currentUser;
    wrap.className = `message ${mine ? "mine" : "theirs"}`;

    const text = document.createElement("p");
    text.textContent = message.text;

    const meta = document.createElement("div");
    meta.className = "meta";

    const stamp = document.createElement("span");
    stamp.className = "time";
    stamp.textContent = `${message.author} · ${formatTime(message.createdAt)}`;

    meta.appendChild(stamp);

    if (USERS[currentUser].canDelete) {
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "delete-msg";
      removeBtn.textContent = "Delete";
      removeBtn.addEventListener("click", () => deleteMessage(message.id));
      meta.appendChild(removeBtn);
    }

    wrap.append(text, meta);
    chatList.appendChild(wrap);
  });

  chatList.scrollTop = chatList.scrollHeight;
}

function showChatFor(user) {
  currentUser = user;
  loginScreen.classList.remove("active");
  chatScreen.classList.add("active");
  roleInfo.textContent = `Signed in as ${user} (${USERS[user].role})`;
  adminControls.classList.toggle("hidden", !USERS[user].canDelete);
  renderMessages();
}

function logout() {
  currentUser = null;
  chatScreen.classList.remove("active");
  loginScreen.classList.add("active");
  loginForm.reset();
  loginError.textContent = "";
}

function deleteMessage(id) {
  if (!currentUser || !USERS[currentUser].canDelete) return;
  const filtered = getMessages().filter((item) => item.id !== id);
  saveMessages(filtered);
  renderMessages();
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const account = USERS[username];

  if (!account || account.password !== password) {
    loginError.textContent = "Invalid credentials";
    return;
  }

  showChatFor(username);
});

msgForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!currentUser) return;

  const text = messageInput.value.trim();
  if (!text) return;

  const messages = getMessages();
  messages.push({
    id: crypto.randomUUID(),
    author: currentUser,
    text,
    createdAt: new Date().toISOString()
  });

  saveMessages(messages);
  messageInput.value = "";
  renderMessages();
});

clearBtn.addEventListener("click", () => {
  if (!currentUser || !USERS[currentUser].canDelete) return;
  saveMessages([]);
  renderMessages();
});

exportBtn.addEventListener("click", () => {
  const messages = getMessages();
  const body = messages
    .map((m) => `[${formatTime(m.createdAt)}] ${m.author}: ${m.text}`)
    .join("\n");
  const blob = new Blob([body || "No messages"], { type: "text/plain" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = "study-exchange-chat.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
});

logoutBtn.addEventListener("click", logout);

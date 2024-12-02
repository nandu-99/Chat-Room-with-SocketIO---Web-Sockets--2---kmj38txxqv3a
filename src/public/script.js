// Socket io on client side
const socket = io();

// Refer to chatbox.html & open it in browser to know what they represent
const usersList = document.querySelector(".users-name");
const chatForm = document.getElementById("message-form");
const messageInput = document.querySelector("#msg");
const messages = document.querySelector(".messages");

// Getting username from index.html, here qs is a library to parse querystring in url 
const { username } = Qs.parse(location.search, { ignoreQueryPrefix: true });

// Emit 'userJoin' event to the server with the username
socket.emit("userJoin", username);

// Listen for 'updateUsers' event from the server and update the users list
socket.on("updateUsers", (users) => {
  // Clear the existing list
  usersList.innerHTML = '';
  
  // Populate the users list with new users
  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user.username;
    usersList.appendChild(li);
  });
});

// Listen for 'message' event from the server and display the message
socket.on("message", (msgData) => {
  const { username, message } = msgData;
  
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  
  const meta = document.createElement("p");
  meta.classList.add("meta");
  meta.textContent = username;
  
  const text = document.createElement("p");
  text.classList.add("text");
  text.textContent = message;
  
  messageDiv.appendChild(meta);
  messageDiv.appendChild(text);
  
  messages.appendChild(messageDiv);
});

// Listen for form submission to send chat messages to the server
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const message = messageInput.value;
  
  // Emit 'chatMessage' event to the server with username and message
  socket.emit("chatMessage", { username, message });
  
  // Clear the input field after sending the message
  messageInput.value = '';
});

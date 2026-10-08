document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const messageText = chatInput.value.trim();

      if (messageText !== "") {
        // Create new message item
        const msgCard = document.createElement("div");
        msgCard.className = "chat-msg";
        msgCard.style.cssText = "background: #eef6ff; padding: 8px 12px; border-radius: 6px; font-size: 0.9rem; border-left: 3px solid #0056b3;";
        msgCard.innerHTML = `<strong>Citizen Visitor:</strong> ${messageText}`;
        
        // Append message to chat container
        chatMessages.appendChild(msgCard);
        
        // Clear input and auto-scroll to bottom
        chatInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });
  }
});
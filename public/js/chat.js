const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const creditsCount = document.getElementById('creditsCount');
const errorMsg = document.getElementById('errorMsg');


function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addBubble(text, role) {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  if (role === 'user') {
    bubble.classList.add('user-bubble');
  } else {
    bubble.classList.add('assistant-bubble');
  }
  bubble.textContent = text;
  chatBox.appendChild(bubble);
  scrollToBottom();
}

function showLoadingBubble() {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble', 'assistant-bubble');
  bubble.id = 'loadingBubble';
  bubble.textContent = 'Thinking...';
  chatBox.appendChild(bubble);
  scrollToBottom();
}

function removeLoadingBubble() {
  const bubble = document.getElementById('loadingBubble');
  if (bubble) {
    bubble.remove();
  }
}

async function sendMessage() {
  const text = messageInput.value.trim();

  if (text === '') {
    return;
  }

  errorMsg.style.display = 'none';


  addBubble(text, 'user');
  messageInput.value = '';


  sendBtn.disabled = true;
  messageInput.disabled = true;
  showLoadingBubble();

  try {
    const response = await fetch('/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();

    removeLoadingBubble();

    if (!response.ok) {
      errorMsg.textContent = data.error;
      errorMsg.style.display = 'block';

      
      if (response.status === 403) {
        sendBtn.disabled = true;
        messageInput.disabled = true;
        return;
      }
    } else {
      addBubble(data.reply, 'assistant');
      creditsCount.textContent = data.credits;

      // if credits just hit zero, disable input
      if (data.credits <= 0) {
        sendBtn.disabled = true;
        messageInput.disabled = true;
        errorMsg.textContent = 'You have used all your credits.';
        errorMsg.style.display = 'block';
        return;
      }
    }

  } catch (err) {
    removeLoadingBubble();
    errorMsg.textContent = 'Something went wrong. Please try again.';
    errorMsg.style.display = 'block';
  }

  
  sendBtn.disabled = false;
  messageInput.disabled = false;
  messageInput.focus();
}

sendBtn.addEventListener('click', sendMessage);


messageInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});


scrollToBottom();
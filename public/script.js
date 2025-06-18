const speakBtn = document.getElementById('speakBtn');
const userText = document.getElementById('userText');
const botResponse = document.getElementById('botResponse');
const listeningIndicator = document.getElementById('listeningIndicator');
const themeSwitcher = document.getElementById('themeSwitcher');
const uploadBtn = document.getElementById('uploadBtn');
const uploadFile = document.getElementById('uploadFile');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;

speakBtn.addEventListener('click', () => {
  listeningIndicator.classList.remove('hidden');
  recognition.start();
});

recognition.onresult = async (event) => {
  listeningIndicator.classList.add('hidden');
  const question = event.results[0][0].transcript;
  userText.textContent = question;
  getBotResponse(question);
};

recognition.onerror = (e) => {
  listeningIndicator.classList.add('hidden');
  alert('Speech recognition error: ' + e.error);
};

themeSwitcher.addEventListener('change', () => {
  document.body.classList.toggle('dark', themeSwitcher.checked);
});

uploadBtn.addEventListener('click', () => {
  const file = uploadFile.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result.trim();
      userText.textContent = content;
      getBotResponse(content);
    };
    reader.readAsText(file);
  } else {
    alert("Please select a .txt file first.");
  }
});

async function getBotResponse(question) {
  const response = await fetch('/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });

  const data = await response.json();
  botResponse.textContent = data.answer;

  const utterance = new SpeechSynthesisUtterance(data.answer);
  speechSynthesis.speak(utterance);
}

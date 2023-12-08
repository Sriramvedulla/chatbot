const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatBox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "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";

const createChatli = (message, className) => {
  //create a chat <li> element with passed message and classname
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateResponse = (incomingChatLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  };

  //send post request to api and get response
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops! Something went wrong. Please try again.";
    })
    .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";

  //append the users message to the chatbox
  chatBox.appendChild(createChatli(userMessage, "outgoing"));
  chatBox.scrollTo(0, chatBox.scrollHeight);

  setTimeout(() => {
    //display "Thinking..." message while waiting for the response
    const incomingChatLi = createChatli("Thinking...", "incoming");
    chatBox.appendChild(incomingChatLi);
    chatBox.scrollTo(0, chatBox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);

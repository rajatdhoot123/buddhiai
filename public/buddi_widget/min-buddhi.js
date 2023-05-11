(() => {
  var buddiAppId = document.currentScript.getAttribute("buddhi_api_id");
  var initialMessage = document.currentScript.getAttribute("initial_message");
  const messageSvg = `<svg class="buddhi-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 001.28.53l4.184-4.183a.39.39 0 01.266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0012 2.25zM8.25 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zm2.625 1.125a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd"></path></svg>`;
  const chatMessageIcon = `<div id="chat-icon">${messageSvg}</div>`;
  const closeSvg = `<svg class="buddhi-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>`;
  // create iframe HTML
  const iframeHtml = `
<div class="buddhi_hidden" id="chat-iframe-container">
  <iframe id="chat-iframe" src="https://buddhiai.app/embed/app/${buddiAppId}?initial_message=${initialMessage}"></iframe>
</div>
`;

  // add bubble chat icon and iframe HTML to the document
  document.body.insertAdjacentHTML("beforeend", chatMessageIcon);
  document.body.insertAdjacentHTML("beforeend", iframeHtml);

  // select elements
  const chatIcon = document.getElementById("chat-icon");
  const iframeContainer = document.getElementById("chat-iframe-container");

  // add event listener to chat icon
  chatIcon.addEventListener("click", () => {
    if (iframeContainer.className === "buddhi_hidden") {
      chatIcon.innerHTML = closeSvg;
      iframeContainer.classList.remove("buddhi_hidden");
      iframeContainer.classList.add("buddhi_flex");
    } else {
      chatIcon.innerHTML = messageSvg;
      iframeContainer.classList.remove("buddhi_flex");
      iframeContainer.classList.add("buddhi_hidden");
    }
  });

  window.onmessage = function (e) {
    if (e.origin == "https://buddhiai.app" && e.data === "closeBuddhiChat") {
      chatIcon.innerHTML = messageSvg;
      iframeContainer.classList.remove("buddhi_flex");
      iframeContainer.classList.add("buddhi_hidden");
    }
  };

  // add styles to the document
  const styles = `
#chat-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #3f51b5;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 9997;
}

.buddhi-svg {
  height: 30px;
  width: 30px;
  color: white;
}

#chat-icon img {
  display: block;
  width: 50%;
  margin: auto;
  margin-top: 25%;
}

#chat-iframe {
  border-radius: 6px;
  flex-grow: 1;
}

#chat-iframe-container {
  flex-direction: column;
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 350px;
  height: 80vh;
  border: none;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 9998;
}

.buddhi_hidden {
  display: none;
}

.buddhi_flex {
  display: flex;
}

#close-btn {
  border: none;
  background: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

@media only screen and (max-width: 767px) {
  #chat-iframe-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: none;
    z-index: 9998;
    animation: chat-frame-open 0.5s ease-in-out;
  }

  #chat-iframe {
    border-radius: 0px;
    flex-grow: 1;
  }

  #close-btn {
    border: none;
    background: none;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
  }
}
`;

  const styleSheet = document.createElement("style");
  styleSheet.innerHTML = styles;
  document.head.appendChild(styleSheet);
})();

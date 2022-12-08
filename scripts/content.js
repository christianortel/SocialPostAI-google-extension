const insert = (content) => {     
    const element = document.getElementsByClassName(
    "public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
)[0].firstChild.firstChild
element.innerText = content
    
console.log(content, "Hello")
console.log(element)
return true;
};

chrome.runtime.onMessage.addListener(
    
    (request, sender, sendResponse) => {
    if (request.message === 'inject') {
      const { content } = request;
  
      const result = insert(content);
			
      // If something went wrong, send a failes status
      if (!result) {
        sendResponse({ status: 'failed' });
      }

      sendResponse({ status: 'success' });
    }
  }
);
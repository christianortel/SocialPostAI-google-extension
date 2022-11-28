const insert = (content) => { 
    // Find Twitter editor input section
const elements = document.getElementsByClassName('public-DraftStyleDefault-block public-DraftStyleDefault-ltr');

if (elements.length === 0) {
    return;
}
    
const element = document.getElementsByClassName("public-DraftStyleDefault-block public-DraftStyleDefault-ltr")[0].firstChild.firstChild
element.innerText = content
console.log(content)        
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
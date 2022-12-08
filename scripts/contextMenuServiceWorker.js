const getKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      if (result['openai-key']) {
        const decodedKey = atob(result['openai-key']);
        resolve(decodedKey);
      } else {
        reject('Key not found in storage.');
      }
    });
  })
;}
const sendMessage = (content) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;

    chrome.tabs.sendMessage(
      activeTab,
      { message: 'inject', content },
      (response) => {
        if (response.status === 'failed') {
          console.log('injection failed.');
        }
      }
    );
  });
};
const generate = async (prompt) => {
  
  const key = await getKey();
  const url = 'https://api.openai.com/v1/completions';

  const completionResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'text-davinci-002',
      prompt: prompt,
      max_tokens: 1250,
      temperature: 0.7,
    }),
  });
	
  // Select the top choice and send back
  const completion = await completionResponse.json();
  return completion.choices.pop();
}  
const generateCompletionAction = async (info) => {
  try {
    sendMessage('generating...');
    const { selectionText } = info;
    const basePromptPrefix = 
      `
      Help me write a twitter post based on the title below. Write this in the style of author Kent Beck. Please make it seem like the writer is very knowledgeable on the topic and did their research. 

      Title:
      `;

        
      const baseCompletion = await generate(
        `${basePromptPrefix}${selectionText}`
      );
  
      generatedText = baseCompletion.text;
      sendMessage(generatedText);
      console.log(generatedText);
    } catch (error) {
      console.log(error);
    }
  };
  
  // Inject the latest generated text into the active tab
  const injectGeneratedText = () => {
    sendMessage(generatedText);
  };
  
  chrome.contextMenus.create({
    id: 'context-run',
    title: 'Generate tweet',
    contexts: ['selection'],
  });
  
  chrome.contextMenus.onClicked.addListener(generateCompletionAction);
  
  // Inject the latest generated text whenever the active tab is updated
  chrome.tabs.onUpdated.addListener(injectGeneratedText);
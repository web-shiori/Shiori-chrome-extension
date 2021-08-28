let clickedEl: MouseEvent;
document.addEventListener(
    'contextmenu',
    function (event) {
        clickedEl = event;
    },
    true
);

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//     console.log(message, sender, sendResponse);
//     // sendResponse({ value: clickedEl?.target ?? '' })
//     sendResponse();
//     return;
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(sender);
    if (message.method === 'getSelection') {
        // @ts-ignore
        var word = window.getSelection().toString().trim();
        console.log(word);
        sendResponse({ data: word });
    } else {
        sendResponse({});
    }
});

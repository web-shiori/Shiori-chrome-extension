let clickedText: string;
document.addEventListener(
    'contextmenu',
    function (event) {
        const clickedEl: HTMLTextAreaElement = <HTMLTextAreaElement>(
            event.target
        );
        clickedText = clickedEl.innerText;
    },
    true
);

chrome.runtime.onMessage.addListener(async function (message, _, sendResponse) {
    /**
     * バックグラウンドからメッセージが来たタイミングではまだclickedTextにテキストが入っていない
     * 可能性があるので、少しだけ時間を置いてリトライする
     */
    const maxRetryCnt = 5;
    if (message.method === 'getSelection') {
        let retryCnt = 0;
        while (clickedText === undefined) {
            if (retryCnt >= maxRetryCnt) break;
            await sleep(10);
        }
        sendResponse({ data: clickedText });
    }
});

// msミリ秒間待機
function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

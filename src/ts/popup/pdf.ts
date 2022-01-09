module popup {
    // PDFかどうかを判定する.
    // function isPDF(): boolean {
    //     chrome.tabs.query(
    //         {active: true, lastFocusedWindow: true},
    //         function (tabs) {
    //             const urlStr = tabs[0].url ?? ''
    //             const url = new URL(urlStr)
    //             alert(url.pathname)
    //         }
    //     )
    //     return true
    // }

    // PDFのスクリーンショットを撮影する.
    // base64エンコードをFileに変換する
    // PDFのスクリーンショット(File型)を返す. PDF出ない場合はnilを返す.
    // function getPDFScreenShot(): Promise<File|null> {
    //     return new Promise<File>((resolve => {
    //         if (isPDF()) {
    //
    //         } else {
    //             resolve(undefined)
    //         }
    //     }))
    // }
    export function getPDFScreenShot() {
        // isPDF()

        alert('aaa');
    }
}

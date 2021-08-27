// ログアウトボタンを押したときの処理
const optionsPageSignOutButton = document.getElementById("options-page-sign-out-button")
if (optionsPageSignOutButton !== null) {
    optionsPageSignOutButton.addEventListener('click', function () {
        chrome.storage.sync.remove(["uid", "client", "accessToken"], function() {
            console.log('removed');
        });
        window.close()
    })
}

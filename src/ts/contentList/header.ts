module contentList {

    // 入力された検索ワードを取得
    function getSearchQuery(): Promise<string> {
        const searchQuery = (<HTMLInputElement>document.getElementById("search-text-field")).value || ""
        return new Promise<string>((resolve => {
            resolve(searchQuery)
        }))
    }

    const searchForm = document.getElementById("search-form")
    if (searchForm !== null) {
        searchForm.onsubmit = function () {
            getSearchQuery().then((searchQuery => {
                initializeContent(searchQuery, currentFolderId)
            }))
            // ページのリロードを防ぐ
            return false;
        }
    }

    // フォルダ追加ボタンをクリックしたときの処理
    const addingFolderButton = document.getElementById("adding-folder-button")
    if (addingFolderButton !== null) {
        addingFolderButton.addEventListener("click", function () {
            alert("folder")
        })
    }
}

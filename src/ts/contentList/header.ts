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

    //NOTE: もっとかんたんにやる方法ある気がする。formのAPIを調べる
    const searchButton = document.getElementById("search-button")
    if (searchButton !== null) {
        searchButton.addEventListener("click", async function () {
            const searchQuery = await getSearchQuery()
            initializeContent(searchQuery, currentFolderId)
        })
    }
}

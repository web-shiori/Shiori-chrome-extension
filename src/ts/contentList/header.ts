module contentList {
    //NOTE: もっとかんたんにやる方法ある気がする。formのAPIを調べる
    const searchButton = document.getElementById("search-button")
    if (searchButton !== null) {
        searchButton.addEventListener("click", function () {
            const searchQuery = (<HTMLInputElement>document.getElementById("search-text-field")).value || ""
            initializeContent(searchQuery, currentFolderId)
        })
    }
}

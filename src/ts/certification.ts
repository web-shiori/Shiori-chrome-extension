let currentUser: User|undefined = undefined

// ユーザがログインしているかどうかを判定する
function isLoggedInUser(): boolean {
    // TODO: ストレージにユーザ情報があるかどうかで判定するように変更
    return currentUser !== undefined
}

// currentUserにユーザをセットする
function setCurrentUser() {
    console.log("setCurrentUser")
    currentUser = new User("unko@gmail.com", "iXFWJAgK28eBDNeFfXSpWA", "_wngFEvVAn1X5hTZ1mbiew")
}

// ストレージからユーザ情報を取得する
function fetchUserInfoFromStorage() {

}

// ストレージにユーザ情報を保存する
function storeUserInfoToStorage() {

}

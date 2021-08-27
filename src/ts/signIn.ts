const signInWithPasswordForm = document.getElementById("sign-in-with-password-form")
if (signInWithPasswordForm !== null) {
    signInWithPasswordForm.onsubmit = function () {
        //  メールアドレスとパスワードを取得
        // 送信
        // 成功時: レスポンスヘッダを保存する
        // 失敗時: エラー表示
        return false;
    }
}


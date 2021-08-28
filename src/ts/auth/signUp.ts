module auth {
    // NOTE: signInと共有したいが、なぜかundefinedになるのでここでも定義する
    const baseUrl: string = "https://web-shiori.herokuapp.com"

    // 会員登録リクエスト
    function doPostSignUp(email: string, password: string) {
        const url = `${baseUrl}/v1/auth/`
        return fetch(url, {
            method: 'POST',
            // TODO: ヘッダをちゃんとする
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "password": password,
                "password_confirmation": password
            })
        }).then(processResponse).catch(error => {
            console.error(error);
        });

        function processResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                // TODO: ログインに失敗したことをユーザに伝える
                console.error("エラーレスポンス", response.json());
            } else {
                // 会員登録画面を閉じる
                window.close()
                // コンテンツ一覧画面を表示する
                chrome.tabs.create({ url: "../html/contentList.html" })
            }
        }
    }

    // 会員登録フォームに入力されたメールアドレスを取得
    function getEmail(): Promise<string> {
        const email = (<HTMLInputElement>document.getElementById("sign-up-with-password-form-email")).value || ""
        return new Promise<string>((resolve => {
            resolve(email)
        }))
    }

    // 会員登録フォームに入力されたパスワードを取得
    function getPassword(): Promise<string> {
        const password = (<HTMLInputElement>document.getElementById("sign-up-with-password-form-password")).value || ""
        return new Promise<string>((resolve => {
            resolve(password)
        }))
    }

    // 会員登録
    async function signUp() {
        //  メールアドレスとパスワードを取得
        const emailPromise = getEmail()
        const passwordPromise = getPassword()
        const [email, password] = await Promise.all([emailPromise, passwordPromise])
        // 送信
        doPostSignUp(email, password)
    }

    // パスワード会員登録用フォームにonsubmit時の処理を追加
    const signUpWithPasswordForm = document.getElementById("sign-up-with-password-form")
    if (signUpWithPasswordForm !== null) {
        signUpWithPasswordForm.onsubmit = function () {
            signUp()
            return false;
        }
    }
}

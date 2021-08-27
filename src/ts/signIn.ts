const signInWithPasswordForm = document.getElementById("sign-in-with-password-form")
if (signInWithPasswordForm !== null) {
    signInWithPasswordForm.onsubmit = function () {
        return false;
    }
}


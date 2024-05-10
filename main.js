function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const regForm = document.querySelector('#createAccount');
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());
    
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            const result = await response.json();
            if (response.ok) {
                // Store username in sessionStorage for security
                sessionStorage.setItem('username', result.username);
                // Redirect to the home page
                window.location.href = '/';
            } else {
                setFormMessage(loginForm, "error", result.message);
            }
        } catch (error) {
            console.log(error)
            setFormMessage(loginForm, "error", "Error logging in. Please try again later.");
        }
    });

    regForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(regForm);
        const data = Object.fromEntries(formData.entries());
    
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            const result = await response.json();
            if (response.ok) {
                // Store username in sessionStorage for security
                // sessionStorage.setItem('username', result.username);
                // Redirect to the home page
                window.location.href = '/app.html';
            } else {
                setFormMessage(regForm, "error", result.message);
            }
        } catch (error) {
            console.log(error)
            setFormMessage(regForm, "error", "Error Registering. Please try again later.");
        }
    });
      
    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 2) {
                setInputError(inputElement, "Username must be at least 2 characters in length");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});
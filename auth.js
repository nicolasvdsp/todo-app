const base_url = "https://todo-nodejs-pontos-924b3b18c332.herokuapp.com";

let btnSignup = document.querySelector(".signup button");
let btnLogin = document.querySelector(".login button");
    
if(btnSignup) {
    btnSignup.addEventListener("click", (e)=> {
        let email = document.querySelector("#email").value;
        let password = document.querySelector("#password").value;

        // console.log(`${email} ${password}`);

        fetch(base_url + "/users/signup", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        }).then(response => {
            return response.json();
        }).then(json => {
            console.log(json);
            if(json.status === "success") {
                let feedback = document.querySelector(".alert");
                feedback.textContent = "Sign up complete!";
                feedback.classList.remove('hidden');

                let token = json.data.token;
                localStorage.setItem("token", token);
                window.location.href = "index.html";
            }
        });
    });
}

if(btnLogin) {
    function login(e) {
        let email = document.querySelector("#email").value;
        let password = document.querySelector("#password").value;

        fetch(base_url + "/users/login", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        }).then(response => {
            return response.json();
        }).then(json => {
            if (json.status === "success") {
                let token = json.data.token;
                localStorage.setItem("token", token);
                window.location.href = "index.html";
            } else {
                let feedback = document.querySelector(".alert");
                feedback.textContent = json.message.message;
                feedback.classList.remove('hidden');
            }
        })
    }


    btnLogin.addEventListener("click", login);
    window.addEventListener("keyup", e => {
        if(e.keyCode === 13) {
            login(e);
        }
    });
}
const base_url = "https://todo-nodejs-pontos-924b3b18c332.herokuapp.com"

//DEFAULT VERIFICATION IF CORRECT USER IS LOGGED IN.
//IMMEDIATELY LOAD TODOS WHEN PAGE LOADS SO THEY CAN BE LOOPED OVER
fetch(base_url + "/api/v1/todos", {
    "headers": {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
})
.then(result => {
    return result.json();
})
.then(json => {
    let todos = json.data.todos;


    todos.forEach(todo => {
        let newTodo = `<div class="todo${todo.completed===true?' todo--completed':''}" data-id="${todo._id}">
            <input type="checkbox" class="todo__state" data-id="${todo._id}">
            <div class="todo__text">${todo.text}</div>
            <a class="todo__delete" href="#" data-id="${todo._id}">delete</a>
        </div>`;

        document.querySelector(".todo__new").insertAdjacentHTML('afterend', newTodo);     
    });

    document.querySelector(".welcome span").innerText = json.data.user;
    // console.log(json.data.user);
})
.catch(err => {
    // console.log(err);
    window.location.href = "login.html"
});

let input = document.querySelector(".todo__input");
input.addEventListener("keyup", e => {
    if (e.keyCode === 13) {
        let text = input.value;
        
        fetch(base_url + "/api/v1/todos", {
            method: 'post',
            'headers': {
                'Content-Type': 'application/json',
        		'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'text': text
            })
        })
        .then(result => {
            return result.json();
        })
        .then(json => {
            // console.log(json);
            // waar je todo._id aan meegeeft is vrijblijvend, afhankelijk hoe je het wil gebruiken en hoe je code schrijft (parentElement, nextSibling, .querySelector(), ...)
            let todo = `<div class="todo" data-id="${json.data.todo._id}">
                <input type="checkbox" class="todo__state" data-id="${json.data.todo._id}">
                <div class="todo__text">${json.data.todo.text}</div>
                <a class="todo__delete" href="#" data-id="${json.data.todo._id}">delete</a>
            </div>`;
            input.value = "";
            input.focus();
            document.querySelector(".todo__new").insertAdjacentHTML('afterend', todo);
        })
        .catch(err => {
            // console.log(err);
        });

    }
    e.preventDefault();
})

document.querySelector(".app").addEventListener("change", e => {
    if(e.target.classList.contains("todo__state")){
        let todoId = e.target.getAttribute("data-id");
        console.log(todoId);

        fetch(base_url + "/api/v1/todos/"+todoId, {
            method: 'put',
            'headers': {
                'Content-Type': 'application/json',
        		'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'todoId': todoId
            })
        })
        .then(result => {
            return result.json();
        })
        .then(json => {
          console.log(json);
            if(json.status === "success") {
                // e.target.parentElement.classList.append("todo--completed");
                e.target.parentElement.classList.add("todo--completed");

            }
        })
        .catch(err => {
            console.log(err);
        });
    }
})


document.querySelector(".app").addEventListener("click", e => {
    if(e.target.classList.contains("todo__delete")){
        let todoId = e.target.parentElement.getAttribute("data-id");
        console.log(todoId);
        fetch(base_url + "/api/v1/todos/"+todoId, {
            method: 'DELETE',
            'headers': {
                'Content-Type': 'application/json',
        		'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'todoId': todoId
            })
        })
        .then(result => {
            return result.json();
        })
        .then(json => {
            console.log(json);
            e.target.parentElement.remove();
        })
        .then(err => {
            console.log(err);
        });
    }
})





function logout(e) {
    e.preventDefault();
    
    localStorage.removeItem("token");
    window.location.reload();
    // window.location.href = "login.html";
}

document.querySelector(".logout").addEventListener("click", logout)
window.addEventListener("keyup", e => {
    if(e.keyCode === 27) {
        logout(e);
    }
})



// document.querySelector(".app").addEventListener("click", e => {
//     if(e.target.classList.contains("todo")){
//         let todoId = e.target.getAttribute("data-id");
//         let todoText = e.target.querySelector(".todo__text").innerText;
//         console.log(todoId);
//         console.log(todoText);
//     }
// })
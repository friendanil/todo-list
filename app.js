const loginForm = document.getElementById('login-form')
const welcomeSection = document.getElementById('welcome-section')
const todoSection = document.getElementById('todo-section')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('login clicked')
    const formData = new FormData(loginForm)
    const email = formData.get('loginEmail')
    const password = formData.get('loginPassword')

    let data = {
        email: email,
        password: password
    }

    data = JSON.stringify(data)

    // create student account / Signup
    fetch(`https://apitest.boomconcole.com/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data,
    })
    .then(res => res.json())
    .then(data => {
        // console.log('login', data)
        authToken = data.data.token
        console.log('authToken', authToken)

        // listAccount()

        loginForm.reset()
        welcomeSection.classList.add('d-none')
        todoSection.classList.remove('d-none')
        getSuggestionBox()
    })
})

const getSuggestionBox = async () => {
    await fetch(`https://apitest.boomconcole.com/api/list-api-clean?type=suggestionBox`)
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            data.forEach(todo => {
                console.log('todo', todo)
                const todoItem = `
                <div class="todo my-4">
                    <h2>${todo.data.suggestionBox.suggestion}</h2>
                    <a href="${todo.data.suggestionBox.url}" target="_blank">${todo.data.suggestionBox.url}</a>
                    <div class="todo-check">
                        <input type="checkbox" name="isTodoCompleted" id="isTodoCompleted" name="isTodoCompleted">
                        <label for="isTodoCompleted"></label>
                    </div>
                </div>
                `
                document.querySelector('.todo-list').innerHTML += todoItem
            })
        })

    checkStatus()
}

const checkStatus = () => {
    const checkBoxes = document.querySelectorAll('.todo input')
    // console.log('checkBoxes', checkBoxes)
    checkBoxes.forEach(box => {
        box.addEventListener('click', (e) => {
            // console.log(e)
            // console.log(e.target.parentElement.parentElement)
            const todoEl = e.target.parentElement.parentElement
            const todoHeading = todoEl.querySelector('h2')
            todoHeading.classList.toggle('text-decoration-line-through')
        })
    })
}

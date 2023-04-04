const loginForm = document.getElementById('login-form')
const welcomeSection = document.getElementById('welcome-section')
const todoSection = document.getElementById('todo-section')
let todoList = []
let authToken = ''

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
        // console.log('authToken', authToken)

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
            todoList = data
            data.forEach(todo => {
                console.log('todo', todo)
                let isTodoCompleted = false
                if (Object.keys(todo.data.suggestionBox).includes('isTodoCompleted')) {
                    isTodoCompleted = todo.data.suggestionBox.isTodoCompleted
                    console.log('IF')
                }
                console.log('isTodoCompleted', isTodoCompleted)
                
                let checkboxClass = ''
                let isChecked = ''
                if (isTodoCompleted) {
                    checkboxClass = 'text-decoration-line-through'
                    isChecked = 'checked'
                }

                let imgSrc = ''
                let imgClass = ' d-none'
                if (todo.data.suggestionBox.image_path) {
                    imgSrc = `https://apitest.boomconcole.com/${todo.data.suggestionBox.image_path}`
                    imgClass = ''
                }
                
                const todoItem = `
                <div class="todo my-4">
                    <h2 class="${checkboxClass}">${todo.data.suggestionBox.suggestion}</h2>
                    <img src="${imgSrc}" class="img-fluid d-block ${imgClass}" alt="${todo.data.suggestionBox.suggestion}">
                    <a href="${todo.data.suggestionBox.url}" target="_blank">${todo.data.suggestionBox.url}</a>
                    <div class="todo-check">
                        <input type="checkbox" name="isTodoCompleted" id="isTodoCompleted" value="${isTodoCompleted}" ${isChecked}>
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
    checkBoxes.forEach((box, index) => {
        box.addEventListener('click', (e) => {
            console.log(e)

            const todoEl = e.target.parentElement.parentElement
            const todoHeading = todoEl.querySelector('h2')
            
            if (e.target.checked) {
                todoHeading.classList.add('text-decoration-line-through')
            } else {
                todoHeading.classList.remove('text-decoration-line-through')
            }

            todoList[index].data.suggestionBox.isTodoCompleted = e.target.checked

            updateTodo(todoList[index])
        })
        
    })
}

const updateTodo = (data) => {
    console.log('uddateTodo', data)

    let checkboxInfo = data

    console.log('id', checkboxInfo.id)

    let checkboxData = {
        "data": {
            "suggestionBox": {
                "suggestion": checkboxInfo.data.suggestionBox.suggestion,
                "url": checkboxInfo.data.suggestionBox.url,
                "isTodoCompleted": checkboxInfo.data.suggestionBox.isTodoCompleted
            },
            "id": checkboxInfo.id
        },
    }

    if (checkboxInfo.data.suggestionBox.image_path) {
        checkboxData.data.suggestionBox.image_path = checkboxInfo.data.suggestionBox.image_path
    }

    checkboxData = JSON.stringify(checkboxData)

    fetch(`https://apitest.boomconcole.com/api/concepts/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: checkboxData,
    })
    .then(res => res.json())
    .then(data => {
        console.log('update', data)
    })
}

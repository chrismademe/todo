(() => {
    window.taskList = []

    const handleKeyPress = (e) => {
        saveTasks()

        // Create a new task
        if ( e.key === 'Enter' ) {
            createTask()
        }

        // Delete this task
        if ( e.key === 'Backspace' && e.target.value === '' ) {
            removeTask(e.target.parentNode)
        }
    }

    const handleCheckPress = (e) => {
        updateTask(e.target.parentNode, e.target.checked)
        saveTasks()
    }

    const updateTask = (task, isDone) => {
        let input = task.querySelector('input[type="text"]')
        let checkbox = task.querySelector('input[type="checkbox"]')
        
        if ( isDone ) {
            input.classList.add('line-through', 'text-gray-400')
            setTimeout(() => {
                removeTask(task)
            }, 250)
        } else {
            input.classList.remove('line-through', 'text-gray-400')
        }

        saveTasks()
    }

    const removeTask = (task) => {
        task.previousElementSibling.querySelector('input[type="text"]').focus()
        task.parentNode.removeChild(task)
        saveTasks()
    }

    const saveTasks = () => {
        let tasks = document.querySelectorAll('[data-task]')
        let tasksToSave = []

        tasks.forEach((task) => {
            let name = task.querySelector('input[type="text"]').value
            let isDone = task.querySelector('input[type="checkbox"]').checked
            let object = {
                name: name,
                isDone: isDone
            }

            tasksToSave.push(object)
        })

        tasksToSave = window.taskList.concat(tasksToSave)
        localStorage.setItem('tasks', JSON.stringify(tasksToSave))
    }

    const createTask = (name = null, isDone = false) => {
        let taskList = document.querySelector('.list')

        let task = document.createElement('li')
        task.setAttribute('data-task', 1)
        task.classList.add('flex', 'bg-white', 'mt-1', 'text-gray-800')

        let checkbox = document.createElement('input')
        checkbox.setAttribute('type', 'checkbox')
        checkbox.classList.add('p-2', 'cursor-pointer')
        checkbox.style.transform = 'scale(1.1)'
        checkbox.addEventListener('click', handleCheckPress)

        if ( status === true ) {
            checkbox.setAttribute('checked', true)
        }

        let input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.classList.add('ml-2')
        input.setAttribute('placeholder', 'What do you need to do?')
        input.addEventListener('keyup', handleKeyPress)

        if ( name ) {
            input.value = name
        }

        task.appendChild(checkbox)
        task.appendChild(input)

        taskList.appendChild(task)

        input.focus()

        saveTasks()
    }

    const tasks = localStorage.getItem('tasks')

    if ( tasks ) {
        let taskList = JSON.parse(tasks)
        taskList.forEach((task) => {
            let { name, isDone } = task
            createTask(name, isDone)
        })
    } else {
        createTask()
    }

    const addTaskBtn = document.querySelector('[data-action="new-task"]')
    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault()
        createTask()
    })

    // Save tasks every second, just incase
    setInterval(() => {
        saveTasks()
    }, 1000)
})();
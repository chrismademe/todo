(() => {
    window.taskList = []

    /**
     * Do Event
     * @param HTMLElement element Element
     * @param string name Event name
     * @param object data Custom data
     * 
     * @NOTE I'm not using this yet, but I plan to
     * use it instead of calling saveTasks() directly
     * from other functions.
     */
    const doEvent = (element, name, data = {}) => {
        let event = new CustomEvent(name, {detail: data})
        element.dispatchEvent(event)
    }

    /**
     * Generate UID
     * 
     * Generates a unique ID for a task
     */
    const generateTaskID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        })
    }

    /**
     * Handle Key Press
     * @param {*} e Key press event
     * 
     * Handles creating new tasks and deleting tasks when they're empty
     */
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

    /**
     * Handle Check Press
     * @param {*} e Event
     * 
     * Updates a task when it you check the checkbox
     */
    const handleCheckPress = (e) => {
        updateTask(e.target.parentNode, e.target.checked)
        saveTasks()
    }

    /**
     * Update Task
     * @param string task 
     * @param bool isDone 
     * 
     * Updates task state
     */
    const updateTask = (task, isDone) => {
        let input = task.querySelector('input[type="text"]')
        
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

    /**
     * Remove Task
     * @param HTMLElement task 
     * 
     * Removes a task from the list
     */
    const removeTask = (task) => {
        let previousTask = task.previousElementSibling
        let nextTask = task.nextElementSibling

        // Focus on the previous task if one exists
        if ( previousTask != null ) {
            previousTask.querySelector('input[type="text"]').focus()

        // We deleted the first task
        } else if ( nextTask != null ) {
            nextTask.querySelector('input[type="text"]').focus()

        // We deleted all tasks, so create a placeholder
        } else {
            createTask()
        }
        
        task.parentNode.removeChild(task)
        saveTasks()
    }

    /**
     * Save Tasks
     * 
     * Saves the task list to localStorage
     */
    const saveTasks = () => {
        let tasks = document.querySelectorAll('[data-task]')
        let tasksToSave = []

        tasks.forEach((task) => {
            let name = task.querySelector('input[type="text"]').value
            let isDone = task.querySelector('input[type="checkbox"]').checked
            let object = {
                id: task.getAttribute('data-task'),
                name: name,
                isDone: isDone
            }

            tasksToSave.push(object)
        })

        tasksToSave = window.taskList.concat(tasksToSave)
        localStorage.setItem('tasks', JSON.stringify(tasksToSave))
    }

    /**
     * Create Task
     * @param string name 
     * @param bool isDone
     * 
     * Creates a new task 
     */
    const createTask = (name = null, isDone = false, id = null) => {
        let taskList = document.querySelector('.list')

        // Create Task Element
        let task = document.createElement('li')
        task.setAttribute('data-task', id || generateTaskID())
        task.classList.add('flex', 'bg-white', 'mt-1', 'text-gray-800')

        // Create Task Checkbox
        let checkbox = document.createElement('input')
        checkbox.setAttribute('type', 'checkbox')
        checkbox.classList.add('p-2', 'cursor-pointer')
        checkbox.style.transform = 'scale(1.1)'
        checkbox.addEventListener('click', handleCheckPress)

        // Update checkbox state if isDone
        if ( isDone ) {
            checkbox.setAttribute('checked', true)
        }

        // Create Task Input
        let input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.classList.add('ml-2')
        input.setAttribute('placeholder', 'What do you need to do?')
        input.addEventListener('keyup', handleKeyPress)

        // Populate the name field if set
        if ( name ) {
            input.value = name
        }

        // Add the task to the list
        task.appendChild(checkbox)
        task.appendChild(input)
        taskList.appendChild(task)

        // Focus on the new task
        input.focus()

        saveTasks()
    }

    // Get stored tasks
    const tasks = localStorage.getItem('tasks')

    if ( tasks ) {
        let taskList = JSON.parse(tasks)
        taskList.forEach((task) => {
            let { id, name, isDone } = task
            createTask(name, isDone, id)
        })
    } else {
        createTask()
    }

    // Handle click on Add Task button
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
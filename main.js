(() => {
    const taskListState = []

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
        updateTask(e.target.parentNode.parentNode, e.target.checked)
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
        
        if ( isDone ) {
            setTimeout(() => {
                removeTask(task)
            }, 250)
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

            // Skip empty tasks
            if ( name === '' ) return;

            let object = {
                id: task.getAttribute('data-task'),
                name: name,
                isDone: isDone
            }

            tasksToSave.push(object)
        })

        tasksToSave = taskListState.concat(tasksToSave)
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
        task.classList.add('task')

        // Create Task Checkbox
        let checkbox = createCheckbox(isDone)

        // Create Task Input
        let input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.classList.add('task__input')
        input.setAttribute('placeholder', 'What do you need to do?')
        input.addEventListener('keyup', handleKeyPress)

        // Populate the name field if set
        if ( name ) {
            input.value = name
        }

        // Create Sort Icon
        let sortIcon = document.createElement('div')
        let icon = document.querySelector('#icon')
        sortIcon.classList.add('task__sort')
        sortIcon.innerHTML = icon.innerHTML


        // Add the task to the list
        task.appendChild(checkbox)
        task.appendChild(input)
        task.appendChild(sortIcon)
        taskList.appendChild(task)

        // Focus on the new task
        input.focus()

        saveTasks()
    }

    // Create Checkbox
    const createCheckbox = (isChecked) => {
        let container = document.createElement('div')
        container.classList.add('checkbox')
        
        let input = document.createElement('input')
        input.setAttribute('type', 'checkbox')
        input.setAttribute('name', 'checkbox')
        input.addEventListener('click', handleCheckPress)

        if ( isChecked ) {
            input.setAttribute('checked', true)
        }

        let label = document.createElement('label')
        label.setAttribute('for', 'checkbox')

        container.appendChild(input)
        container.appendChild(label)

        return container
    }

    // Flip Checkbox Styles
    let flipSwitch = document.querySelector('.switch [type="checkbox"]');

    flipSwitch.addEventListener('change', (event) => {
        // Get list container
        let list = document.querySelector('.list');

        if ( event.target.checked ) {
            list.classList.add('list--flipped');
        } else {
            list.classList.remove('list--flipped');
        }
    });

    // Get stored tasks
    let tasks = localStorage.getItem('tasks')

    // Fix empty array in localStorage issue
    if ( tasks ) {
        tasks = JSON.parse(tasks)
    }
    
    if ( tasks && tasks.length !== 0 ) {
        tasks.forEach((task) => {
            let { id, name, isDone } = task
            createTask(name, isDone, id)
        })
    } else {
        createTask()
    }

    // Make the tasks sortable
    const tasksContainer = document.querySelector('.list')
    const sortable = new Sortable(tasksContainer, {
        filter: '.task__checkbox',
        onEnd: (e) => {
            saveTasks()
        }
    })

    // Save tasks every second, just incase
    setInterval(() => {
        saveTasks()
    }, 1000)
})();

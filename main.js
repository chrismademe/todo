(() => {

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

    // Get stored tasks
    let tasks = localStorage.getItem('tasks')

    // Fix empty array in localStorage issue
    if ( tasks ) {
        tasks = JSON.parse(tasks)
    } else {
        tasks = [
            {
                id: generateTaskID(),
                name: '',
                isDone: false
            }
        ]
    }

    /**
     * Task Component
     */
    Vue.component('c-task', {
        props: ['id', 'name', 'done'],
        template: `<li class="task" :ref="id" :data-id="id">
            <div class="checkbox">
                <input v-on:click="setTaskDone" type="checkbox" name="checkbox" :checked="done">
                <label for="checkbox"></label>
            </div>
            <input
                v-on:keyup.enter="createNewTask"
                v-model="name"
                type="text" class="task__input"
                :placeholder="name ? false : 'What do you need to do?'"
                >
        </li>`,
        methods: {
            setTaskDone: function(event) {
                if ( this.done ) {
                    this.done = false
                } else {
                    this.done = true
                }
            },
            createNewTask: function(event) {
                let taskId = generateTaskID()
                let newTask = {
                    id: taskId,
                    name: false,
                    done: false
                }

                app.tasks.push(newTask)
            }
        }
    })

    const app = new Vue({
        el: '#app',
        data: {
            title: 'Today',
            tasks: tasks
        }
    })
})()
function data() {
  return {
    todos: [],
    name: '',
    isEditTask: false,
    editId: 0,
    filter: '',
    init() {
      var taskInput = document.querySelector(".task-input input")
      var filters = document.querySelectorAll(".filters span")

      this.loadTodos()

      taskInput.addEventListener("keyup", e => {
        if (e.key == "Escape" && this.name) {
          this.name = ''
          return
        }

        if (e.key == "Enter" && this.name) {
          if (this.isEditTask) {
            this.isEditTask = false;
            this.todos[this.editId].name = this.name;
          } else {
            let task = {name: this.name, class: '', status: false};
            this.todos.push(task);
          }

          this.name = "";
          localStorage.setItem("todo-list", JSON.stringify(this.todos));
        }
      })

      filters.forEach(btn => {
        btn.addEventListener("click", () => {
          var clicked = document.querySelector("span.active")
          clicked.classList.remove("active")
          btn.classList.add("active")
          this.filter = btn.id
        })
      })
    },
    loadTodos() {
      if (JSON.parse(localStorage.getItem('todo-list'))) {
        this.todos = JSON.parse(localStorage.getItem('todo-list'))
      }
    },
    updateStatus(todo) {
      todo.class = todo.status ? '' : 'checked'
      todo.status = !todo.status

      localStorage.setItem("todo-list", JSON.stringify(this.todos))
    },
    editTask(taskId, textName) {
      var taskInput = document.querySelector(".task-input input")
      this.editId = taskId;
      this.isEditTask = true
      this.name = textName
      taskInput.focus()
    },
    deleteTask(deleteId) {
      this.isEditTask = false;
      this.todos.splice(deleteId, 1);
      localStorage.setItem("todo-list", JSON.stringify(this.todos));
    },
    filteredItems() {
      if (this.filter == 'pending') {
        return this.todos.filter(item => !item.status);
      }
      
      if (this.filter == 'completed') {
        return this.todos.filter(item => item.status);
      }

      return this.todos
    }
  }
}
var addTaskInput = document.getElementById("addTask");
var btnAdd = document.getElementById("submitTask");
var taskList = document.getElementById("tasksList");
var searchInput = document.getElementById("searchTask");
var searchBtn = document.getElementById("searchBtn");
var tasks = [];  

// Function to update the time dynamically
function updateTime() {
    var now = new Date();
    var options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Africa/Casablanca" 
    };
    var formattedTime = new Intl.DateTimeFormat("en-US", options).format(now);
    document.getElementById("datetime").textContent = formattedTime;
    requestAnimationFrame(updateTime);
  }
  updateTime();

// Function to create a task item
function createTaskItem(task) {
  // Create list of tasks
  var listItem = document.createElement("li");
  listItem.classList.add("task-list");

  // Create task name element
  var taskName = document.createElement("span");
  taskName.classList.add("task-name");
  taskName.textContent = task.name;

  // Create buttons container
  var buttonsContainer = document.createElement("span");

  // Create done button
  var doneButton = document.createElement("button");
  doneButton.classList.add("task-button", "done-button", "buttons");
  var doneIcon = document.createElement("i");
  doneIcon.classList.add("fas", "fa-check");
  doneButton.appendChild(doneIcon);
  buttonsContainer.appendChild(doneButton);

   // Apply "task-done" class if the task is marked as done
   if (task.done) {
    taskName.classList.add("task-done");
  }
  listItem.appendChild(taskName);

  // Create edit button
  var editButton = document.createElement("button");
  editButton.classList.add("task-button", "buttons");
  var editIcon = document.createElement("i");
  editIcon.classList.add("fas", "fa-pen");
  editButton.appendChild(editIcon);
  buttonsContainer.appendChild(editButton);

  // Create delete button
  var deleteButton = document.createElement("button");
  deleteButton.classList.add("task-button", "buttons");
  var deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fas", "fa-trash");
  deleteButton.appendChild(deleteIcon);
  buttonsContainer.appendChild(deleteButton);

  // Add buttons container to the task item
  listItem.appendChild(buttonsContainer);

  // Event listener for "Done" button
  doneButton.addEventListener("click", function () {
    task.done = !task.done;
    taskName.classList.toggle("task-done");
    saveTasks(); // Save tasks after marking a task as done
  });

  // Event listener for edit button
  editButton.addEventListener("click", function () {
    handleEditTask(task.id);
  });

  // Event listener for delete button
  deleteButton.addEventListener("click", function () {
    handleDeleteTask(task.id);
  });

  return listItem;
}

// Function to handle the edit action
function handleEditTask(taskId) {
    var task = tasks.find(function (task) {
      return task.id === taskId;
    });
  
    if (task) {
      addTaskInput.value = task.name;
      addTaskInput.dataset.taskId = task.id; // Set the task ID as the value of the attribute
    }
  }

// Function to handle the delete action
function handleDeleteTask(taskId) {
  var taskIndex = tasks.findIndex(function (task) {
    return task.id === taskId;
  });

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    displayTasks();
    saveTasks(); // Save tasks after deleting a task
  }
}

// Function to save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to display tasks
function displayTasks() {
  taskList.innerHTML = ""; // Clear the task list

  tasks.forEach(function (task) {
    var listItem = createTaskItem(task);
    taskList.appendChild(listItem);
  });
}

// Function to load tasks from localStorage
function loadTasks() {
  var storedTasks = localStorage.getItem("tasks");

  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    displayTasks();
  }
}

// Function to add a new task
function addTask(event) {
    event.preventDefault();
  
    var taskName = addTaskInput.value.trim();
    var taskId = addTaskInput.dataset.taskId; // Get the task ID from the attribute
  
    if (taskName !== "") {
      if (taskId) {
        // If task ID exists, update the existing task
        var taskIndex = tasks.findIndex(function (task) {
          return task.id === taskId;
        });
  
        if (taskIndex !== -1) {
          tasks[taskIndex].name = taskName;
          displayTasks();
          saveTasks(); // Save tasks after updating a task
        }
      } else {
        // If task ID doesn't exist, add a new task
        taskId = "task-" + Date.now(); // Generate a unique ID for the task
  
        var newTask = {
          id: taskId,
          name: taskName,
          done: false
        };
  
        tasks.push(newTask);
        displayTasks();
        saveTasks(); // Save tasks after adding a new task
      }
  
      addTaskInput.value = "";
      addTaskInput.dataset.taskId = ""; // Reset the task ID attribute
    }
  }

// Function to handle the search action
function searchTasks(event) {
  event.preventDefault();

  var searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm !== "") {
    var filteredTasks = tasks.filter(function (task) {
      return task.name.toLowerCase().includes(searchTerm);
    });

    displayFilteredTasks(filteredTasks);
  } else {
    displayTasks();
  }
}

// Function to display filtered tasks
function displayFilteredTasks(filteredTasks) {
  taskList.innerHTML = ""; // Clear the task list

  filteredTasks.forEach(function (task) {
    var listItem = createTaskItem(task);
    taskList.appendChild(listItem);
  });
}

// Event listener for the "Add Task" button
btnAdd.addEventListener("click", addTask);

// Event listener for the "Search" button
searchBtn.addEventListener("click", searchTasks);

// Event listener for the form submission
document.getElementById("toDo").addEventListener("submit", addTask);

// Event listener for the search form submission
document.getElementById("search").addEventListener("submit", searchTasks);

// Load tasks when the page is loaded
loadTasks();

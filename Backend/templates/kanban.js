let kanbanData = {
    columns: [
        {
            id: 'col1',
            title: 'To Do',
            tasks: [
                { id: 'task1', content: 'Design homepage layout' },
                { id: 'task2', content: 'Create database schema' },
                { id: 'task3', content: 'Write project requirements' }
            ]
        },
        {
            id: 'col2',
            title: 'In Progress',
            tasks: [
                { id: 'task4', content: 'Implement user authentication' },
                { id: 'task5', content: 'Write API documentation' }
            ]
        },
        {
            id: 'col3',
            title: 'Review',
            tasks: [
                { id: 'task6', content: 'Test payment integration' }
            ]
        },
        {
            id: 'col4',
            title: 'Done',
            tasks: [
                { id: 'task7', content: 'Set up development environment' },
                { id: 'task8', content: 'Create project repository' }
            ]
        }
    ]
};
        
const kanbanBoard = document.getElementById('kanbanBoard');
const taskModal = document.getElementById('taskModal');
const taskContent = document.getElementById('taskContent');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const cancelTaskBtn = document.getElementById('cancelTaskBtn');
const deleteTaskBtn = document.getElementById('deleteTaskBtn');
const columnModal = document.getElementById('columnModal');
const columnName = document.getElementById('columnName');
const saveColumnBtn = document.getElementById('saveColumnBtn');
const cancelColumnBtn = document.getElementById('cancelColumnBtn');
const deleteColumnBtn = document.getElementById('deleteColumnBtn');

let currentTask = null;
let currentColumn = null;
let isNewTask = false;
let isNewColumn = false;
let draggedTask = null;
        
function initBoard() {
    const savedData = localStorage.getItem('kanbanData');
    if (savedData) {
        kanbanData = JSON.parse(savedData);
    }
            
    renderBoard();
    setupEventListeners();
}
        
function renderBoard() {
    kanbanBoard.innerHTML = '';
            
    kanbanData.columns.forEach(column => {
        const columnElement = document.createElement('div');
        columnElement.className = 'kanban-column';
        columnElement.dataset.columnId = column.id;
                
        const columnTitle = document.createElement('div');
        columnTitle.className = 'column-title';
        columnTitle.textContent = column.title;
                
        const columnActions = document.createElement('div');
        columnActions.className = 'column-actions';
                
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Edit column';
        editBtn.addEventListener('click', () => openColumnModal(column.id));
                
        columnActions.appendChild(editBtn);
        columnTitle.appendChild(columnActions);
                
        const taskList = document.createElement('div');
        taskList.className = 'task-list';
        taskList.dataset.columnId = column.id;
                
        column.tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
                
        const addTask = document.createElement('div');
        addTask.className = 'add-task';
        addTask.textContent = '+ Add a task';
        addTask.addEventListener('click', () => openTaskModal(null, column.id));
                
        columnElement.appendChild(columnTitle);
        columnElement.appendChild(taskList);
        columnElement.appendChild(addTask);
                
        kanbanBoard.appendChild(columnElement);
    });
            
    const addColumn = document.createElement('div');
    addColumn.className = 'kanban-column';
    addColumn.style.background = 'transparent';
    addColumn.style.boxShadow = 'none';
    addColumn.style.border = '2px dashed #dfe1e6';
    addColumn.style.display = 'flex';
    addColumn.style.alignItems = 'center';
    addColumn.style.justifyContent = 'center';
            
    const addColumnBtn = document.createElement('div');
    addColumnBtn.className = 'add-task';
    addColumnBtn.textContent = '+ Add a column';
    addColumnBtn.style.fontWeight = 'bold';
    addColumnBtn.style.width = '100%';
    addColumnBtn.style.textAlign = 'center';
    addColumnBtn.addEventListener('click', () => openColumnModal(null));
            
    addColumn.appendChild(addColumnBtn);
    kanbanBoard.appendChild(addColumn);
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.dataset.taskId = task.id;
    taskElement.draggable = true;
            
    const taskContent = document.createElement('div');
    taskContent.textContent = task.content;
            
    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';
            
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✏️';
    editBtn.title = 'Edit task';
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openTaskModal(task.id);
    });
            
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = 'Delete task';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });
            
    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);
            
    taskElement.appendChild(taskContent);
    taskElement.appendChild(taskActions);
            
    return taskElement;
}
        
function setupEventListeners() {
    saveTaskBtn.addEventListener('click', saveTask);
    cancelTaskBtn.addEventListener('click', closeTaskModal);
    deleteTaskBtn.addEventListener('click', confirmDeleteTask);
            
    saveColumnBtn.addEventListener('click', saveColumn);
    cancelColumnBtn.addEventListener('click', closeColumnModal);
    deleteColumnBtn.addEventListener('click', confirmDeleteColumn);
            
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);
    document.addEventListener('dragend', handleDragEnd);
}
        
function handleDragStart(e) {
    if (e.target.classList.contains('task')) {
        draggedTask = e.target;
        e.target.style.opacity = '0.4';
                
        const dragImage = e.target.cloneNode(true);
        dragImage.style.width = `${e.target.offsetWidth}px`;
        dragImage.style.opacity = '0.8';
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-9999px';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        setTimeout(() => document.body.removeChild(dragImage), 0);
                
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
    }
}
        
function handleDragOver(e) {
    if (e.target.classList.contains('task-list')) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.target.classList.add('dragover');
    }
}
        
function handleDragLeave(e) {
    if (e.target.classList.contains('task-list')) {
        e.target.classList.remove('dragover');
    }
}
        
function handleDrop(e) {
    e.preventDefault();
    if (e.target.classList.contains('task-list')) {
        e.target.classList.remove('dragover');
                
        const taskId = e.dataTransfer.getData('text/plain');
        const newColumnId = e.target.dataset.columnId;
                
        moveTaskToColumn(taskId, newColumnId);
    }
}
        
function handleDragEnd(e) {
    if (e.target.classList.contains('task')) {
        e.target.style.opacity = '1';
        draggedTask = null;
    }
}
        
function moveTaskToColumn(taskId, newColumnId) {
    let task = null;
    let oldColumnId = null;
            
    kanbanData.columns.forEach(column => {
        const taskIndex = column.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            task = column.tasks[taskIndex];
            oldColumnId = column.id;
            column.tasks.splice(taskIndex, 1);
        }
    });
            
    if (task && oldColumnId !== newColumnId) {
        const newColumn = kanbanData.columns.find(col => col.id === newColumnId);
        if (newColumn) {
            newColumn.tasks.push(task);
            saveToLocalStorage();
            renderBoard();
        }
    }
}
        
function openTaskModal(taskId, columnId = null) {
    if (taskId) {
        currentTask = findTask(taskId);
        currentColumn = findColumnByTaskId(taskId);
        isNewTask = false;
                
        taskContent.value = currentTask.content;
        document.getElementById('modalTitle').textContent = 'Edit Task';
        deleteTaskBtn.style.display = 'inline-block';
    } else {
        currentTask = { id: generateId(), content: '' };
        currentColumn = kanbanData.columns.find(col => col.id === columnId);
        isNewTask = true;
                
        taskContent.value = '';
        document.getElementById('modalTitle').textContent = 'Add New Task';
        deleteTaskBtn.style.display = 'none';
    }
            
    taskModal.style.display = 'flex';
    taskContent.focus();
}
        
function closeTaskModal() {
    taskModal.style.display = 'none';
    currentTask = null;
    currentColumn = null;
}
        
function saveTask() {
    const content = taskContent.value.trim();
    if (!content) return;
            
    currentTask.content = content;
            
    if (isNewTask) {
        currentColumn.tasks.push(currentTask);
    }
            
    saveToLocalStorage();
    renderBoard();
    closeTaskModal();
}
        
function confirmDeleteTask() {
    if (confirm('Are you sure you want to delete this task?')) {
        deleteTask(currentTask.id);
        closeTaskModal();
    }
}
        
function deleteTask(taskId) {
    kanbanData.columns.forEach(column => {
        const index = column.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            column.tasks.splice(index, 1);
        }
    });
            
    saveToLocalStorage();
    renderBoard();
}

function openColumnModal(columnId) {
    if (columnId) {
        currentColumn = kanbanData.columns.find(col => col.id === columnId);
        isNewColumn = false;
                
        columnName.value = currentColumn.title;
        document.getElementById('columnModalTitle').textContent = 'Edit Column';
        deleteColumnBtn.style.display = 'inline-block';
    } else {
        currentColumn = { id: generateId(), title: '', tasks: [] };
        isNewColumn = true;
                
        columnName.value = '';
        document.getElementById('columnModalTitle').textContent = 'Add New Column';
        deleteColumnBtn.style.display = 'none';
    }
            
    columnModal.style.display = 'flex';
    columnName.focus();
}
        
function closeColumnModal() {
    columnModal.style.display = 'none';
    currentColumn = null;
}
        
function saveColumn() {
    const title = columnName.value.trim();
    if (!title) return;
            
    currentColumn.title = title;
            
    if (isNewColumn) {
        kanbanData.columns.push(currentColumn);
    }
            
    saveToLocalStorage();
    renderBoard();
    closeColumnModal();
}
        
function confirmDeleteColumn() {
    if (currentColumn.tasks.length > 0) {
        alert('Cannot delete a column that contains tasks. Please move or delete the tasks first.');
        return;
    }
            
    if (confirm('Are you sure you want to delete this column?')) {
        deleteColumn(currentColumn.id);
        closeColumnModal();
    }
}
        
function deleteColumn(columnId) {
    const index = kanbanData.columns.findIndex(col => col.id === columnId);
    if (index !== -1) {
        kanbanData.columns.splice(index, 1);
    }
            
    saveToLocalStorage();
    renderBoard();
}
        
function findTask(taskId) {
    for (const column of kanbanData.columns) {
        const task = column.tasks.find(t => t.id === taskId);
        if (task) return task;
    }
    return null;
}
        
function findColumnByTaskId(taskId) {
    return kanbanData.columns.find(column => 
        column.tasks.some(task => task.id === taskId)
    );
}
        
function generateId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
}
        
function saveToLocalStorage() {
    localStorage.setItem('kanbanData', JSON.stringify(kanbanData));
}

document.addEventListener('DOMContentLoaded', initBoard);
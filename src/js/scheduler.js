// Scheduler functionality
class Scheduler {
    constructor() {
        this.schedule = [];
        this.plants = [];
    }

    init(schedule, plants) {
        this.schedule = schedule || [];
        this.plants = plants || [];
        
        this.setupAddTaskButton();
        this.renderSchedule();
    }

    setupAddTaskButton() {
        const addBtn = document.getElementById('add-task-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddTaskModal();
            });
        }
    }

    renderSchedule() {
        const today = new Date();
        const days = ['today', 'tomorrow'];
        
        // Add more days
        for (let i = 2; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        }

        const scheduleGrid = document.querySelector('.schedule-grid');
        if (!scheduleGrid) return;

        scheduleGrid.innerHTML = days.map((day, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() + index);
            
            return `
                <div class="day-column">
                    <h4>${day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                    <div class="task-list" data-day="${day}" data-date="${date.toISOString()}">
                        ${this.renderTasksForDay(date)}
                    </div>
                </div>
            `;
        }).join('');

        this.setupTaskInteractions();
    }

    renderTasksForDay(date) {
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const dayTasks = this.schedule.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate >= dayStart && taskDate < dayEnd;
        });

        if (dayTasks.length === 0) {
            return '<div class="no-tasks">No tasks scheduled</div>';
        }

        return dayTasks.map(task => {
            const plant = this.plants.find(p => p.id === task.plantId);
            const plantName = plant ? plant.name : 'Unknown Plant';
            
            return `
                <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                    <div class="task-checkbox">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} 
                               onchange="window.scheduler.toggleTask(${task.id})">
                    </div>
                    <div class="task-content">
                        <div class="task-action">${this.getTaskIcon(task.task)} ${task.task}</div>
                        <div class="task-plant">${plantName}</div>
                    </div>
                    <button class="delete-task" onclick="window.scheduler.deleteTask(${task.id})">
                        ×
                    </button>
                </div>
            `;
        }).join('');
    }

    getTaskIcon(task) {
        const icons = {
            water: '💧',
            fertilize: '🌿',
            prune: '✂️',
            harvest: '🍅',
            repot: '🪴',
            check: '👀'
        };
        return icons[task] || '📝';
    }

    setupTaskInteractions() {
        // Task interactions are handled by inline events for simplicity
    }

    toggleTask(taskId) {
        const task = this.schedule.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveSchedule();
            this.renderSchedule();
            
            // Update dashboard if visible
            if (window.urbanGardenApp.currentSection === 'dashboard') {
                window.urbanGardenApp.renderDashboard();
            }
        }
    }

    deleteTask(taskId) {
        this.schedule = this.schedule.filter(t => t.id !== taskId);
        this.saveSchedule();
        this.renderSchedule();
    }

    showAddTaskModal() {
        const modalContent = `
            <div class="add-task-modal">
                <h3>Add New Task</h3>
                <form id="add-task-form">
                    <div class="form-group">
                        <label for="task-plant">Plant:</label>
                        <select id="task-plant" required>
                            <option value="">Select a plant</option>
                            ${this.plants.map(plant => 
                                `<option value="${plant.id}">${plant.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="task-type">Task:</label>
                        <select id="task-type" required>
                            <option value="water">💧 Water</option>
                            <option value="fertilize">🌿 Fertilize</option>
                            <option value="prune">✂️ Prune</option>
                            <option value="harvest">🍅 Harvest</option>
                            <option value="repot">🪴 Repot</option>
                            <option value="check">👀 Check Progress</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="task-date">Date:</label>
                        <input type="date" id="task-date" required 
                               min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    
                    <div class="form-group">
                        <label for="task-notes">Notes (optional):</label>
                        <textarea id="task-notes" rows="3"></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Add Task</button>
                        <button type="button" class="btn-secondary" onclick="document.getElementById('modal').style.display='none'">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        window.urbanGardenApp.showModal(modalContent);

        // Setup form submission
        document.getElementById('add-task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });
    }

    addTask() {
        const plantId = document.getElementById('task-plant').value;
        const taskType = document.getElementById('task-type').value;
        const taskDate = document.getElementById('task-date').value;
        const notes = document.getElementById('task-notes').value;

        if (!plantId || !taskType || !taskDate) {
            alert('Please fill in all required fields');
            return;
        }

        const newTask = {
            id: Date.now(),
            plantId: plantId,
            task: taskType,
            date: new Date(taskDate).toISOString(),
            notes: notes,
            completed: false
        };

        this.schedule.push(newTask);
        this.saveSchedule();
        this.renderSchedule();

        // Close modal
        document.getElementById('modal').style.display = 'none';
    }

    saveSchedule() {
        if (window.urbanGardenApp) {
            window.urbanGardenApp.userSchedule = this.schedule;
            window.urbanGardenApp.saveUserData();
        }
    }
}

// Initialize scheduler
window.scheduler = new Scheduler();
// 时间轴记事工具 JavaScript

// 事件数据存储
let events = [];

// DOM元素
const eventNameInput = document.getElementById('event-name');
const eventDateInput = document.getElementById('event-date');
const eventNoteInput = document.getElementById('event-note');
const addEventBtn = document.getElementById('add-event');
const timeline = document.getElementById('timeline');

// 初始化
function init() {
    // 从本地存储加载事件
    loadEvents();
    // 渲染时间轴
    renderTimeline();
    // 添加事件监听
    addEventBtn.addEventListener('click', addEvent);
}

// 从本地存储加载事件
function loadEvents() {
    const storedEvents = localStorage.getItem('timelineEvents');
    if (storedEvents) {
        events = JSON.parse(storedEvents);
    }
}

// 保存事件到本地存储
function saveEvents() {
    localStorage.setItem('timelineEvents', JSON.stringify(events));
}

// 添加事件
function addEvent() {
    // 获取输入值
    const name = eventNameInput.value.trim();
    const date = eventDateInput.value;
    const note = eventNoteInput.value.trim();
    
    // 验证输入
    if (!name || !date) {
        alert('请填写事件名称和时间！');
        return;
    }
    
    // 创建事件对象
    const event = {
        id: Date.now().toString(), // 使用时间戳作为唯一ID
        name: name,
        date: date,
        note: note
    };
    
    // 添加到事件数组
    events.push(event);
    
    // 保存到本地存储
    saveEvents();
    
    // 渲染时间轴
    renderTimeline();
    
    // 清空输入框
    clearInputs();
}

// 清空输入框
function clearInputs() {
    eventNameInput.value = '';
    eventDateInput.value = '';
    eventNoteInput.value = '';
}

// 删除事件
function deleteEvent(id) {
    if (confirm('确定要删除这个事件吗？')) {
        // 过滤掉要删除的事件
        events = events.filter(event => event.id !== id);
        // 保存到本地存储
        saveEvents();
        // 渲染时间轴
        renderTimeline();
    }
}

// 进入编辑模式
function editEvent(id) {
    // 找到要编辑的事件
    const event = events.find(event => event.id === id);
    if (!event) return;
    
    // 获取事件元素
    const eventElement = document.getElementById(`event-${id}`);
    if (!eventElement) return;
    
    // 创建编辑表单
    eventElement.innerHTML = `
        <div class="input-group">
            <label>事件名称：</label>
            <input type="text" id="edit-name-${id}" value="${event.name}" required>
        </div>
        <div class="input-group">
            <label>事件时间：</label>
            <input type="datetime-local" id="edit-date-${id}" value="${event.date}" required>
        </div>
        <div class="input-group">
            <label>备注：</label>
            <textarea id="edit-note-${id}" rows="3">${event.note}</textarea>
        </div>
        <div class="event-actions">
            <button class="btn btn-save" onclick="saveEdit('${id}')">保存</button>
            <button class="btn btn-cancel" onclick="cancelEdit('${id}')">取消</button>
        </div>
    `;
    
    // 添加编辑模式样式
    eventElement.classList.add('edit-mode');
}

// 保存编辑
function saveEdit(id) {
    // 获取编辑后的值
    const name = document.getElementById(`edit-name-${id}`).value.trim();
    const date = document.getElementById(`edit-date-${id}`).value;
    const note = document.getElementById(`edit-note-${id}`).value.trim();
    
    // 验证输入
    if (!name || !date) {
        alert('请填写事件名称和时间！');
        return;
    }
    
    // 找到要编辑的事件
    const eventIndex = events.findIndex(event => event.id === id);
    if (eventIndex === -1) return;
    
    // 更新事件
    events[eventIndex] = {
        id: id,
        name: name,
        date: date,
        note: note
    };
    
    // 保存到本地存储
    saveEvents();
    
    // 渲染时间轴
    renderTimeline();
}

// 取消编辑
function cancelEdit(id) {
    // 重新渲染时间轴，取消编辑模式
    renderTimeline();
}

// 渲染时间轴
function renderTimeline() {
    // 清空时间轴
    timeline.innerHTML = '';
    
    // 按时间顺序排序事件（最新的在前面）
    const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 渲染每个事件
    sortedEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.id = `event-${event.id}`;
        
        // 格式化日期
        const formattedDate = new Date(event.date).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // 事件HTML
        eventElement.innerHTML = `
            <div class="event-header">
                <div class="event-name">${event.name}</div>
                <div class="event-date">${formattedDate}</div>
            </div>
            ${event.note ? `<div class="event-note">${event.note}</div>` : ''}
            <div class="event-actions">
                <button class="btn btn-edit" onclick="editEvent('${event.id}')">修改</button>
                <button class="btn btn-delete" onclick="deleteEvent('${event.id}')">删除</button>
            </div>
        `;
        
        // 添加到时间轴
        timeline.appendChild(eventElement);
    });
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);
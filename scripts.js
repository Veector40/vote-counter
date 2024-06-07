let undoStack = [];
let redoStack = [];
let invalidVotes = 0;
let noOneVotes = 0;
let destroyedVotes = 0;
let totalCount = 0;

document.addEventListener("DOMContentLoaded", () => {
    loadCounts();
    loadInvalidVotes();
    loadNoOneVotes();
    loadDestroyedVotes();
    loadUndoRedoStacks();
    updateTotalCount();
    updateButtonStates();
});

function increment(cellId) {
    saveCurrentState();
    let cell = document.getElementById(cellId);
    if (cell) {
        let currentCount = parseInt(cell.textContent);
        cell.textContent = currentCount + 1;
        saveCount(cellId, currentCount + 1);
        updateAllCellColors();
        updateTotalCount();
        redoStack = [];
        saveUndoRedoStacks();
        updateButtonStates();
    }
}

function decrement(cellId) {
    saveCurrentState();
    let cell = document.getElementById(cellId);
    if (cell) {
        let currentCount = parseInt(cell.textContent);
        if (currentCount > 0) {
            cell.textContent = currentCount - 1;
            saveCount(cellId, currentCount - 1);
            updateAllCellColors();
            updateTotalCount();
            redoStack = [];
            saveUndoRedoStacks();
            updateButtonStates();
        }
    }
}

function incrementInvalid() {
    saveCurrentState();
    invalidVotes++;
    let invalidCounter = document.getElementById('invalid-counter');
    invalidCounter.textContent = invalidVotes;
    localStorage.setItem('invalidVotes', invalidVotes);
    updateAllCellColors();
    updateTotalCount();
    redoStack = [];
    saveUndoRedoStacks();
    updateButtonStates();
}

function decrementInvalid() {
    saveCurrentState();
    if (invalidVotes > 0) {
        invalidVotes--;
        let invalidCounter = document.getElementById('invalid-counter');
        invalidCounter.textContent = invalidVotes;
        localStorage.setItem('invalidVotes', invalidVotes);
        updateAllCellColors();
        updateTotalCount();
        redoStack = [];
        saveUndoRedoStacks();
        updateButtonStates();
    }
}

function incrementNoOne() {
    saveCurrentState();
    noOneVotes++;
    let noOneCounter = document.getElementById('no-one-counter');
    noOneCounter.textContent = noOneVotes;
    localStorage.setItem('noOneVotes', noOneVotes);
    updateAllCellColors();
    updateTotalCount();
    redoStack = [];
    saveUndoRedoStacks();
    updateButtonStates();
}

function decrementNoOne() {
    saveCurrentState();
    if (noOneVotes > 0) {
        noOneVotes--;
        let noOneCounter = document.getElementById('no-one-counter');
        noOneCounter.textContent = noOneVotes;
        localStorage.setItem('noOneVotes', noOneVotes);
        updateAllCellColors();
        updateTotalCount();
        redoStack = [];
        saveUndoRedoStacks();
        updateButtonStates();
    }
}

function incrementDestroyed() {
    saveCurrentState();
    destroyedVotes++;
    let destroyedCounter = document.getElementById('destroyed-counter');
    destroyedCounter.textContent = destroyedVotes;
    localStorage.setItem('destroyedVotes', destroyedVotes);
    updateAllCellColors();
    updateTotalCount();
    redoStack = [];
    saveUndoRedoStacks();
    updateButtonStates();
}

function decrementDestroyed() {
    saveCurrentState();
    if (destroyedVotes > 0) {
        destroyedVotes--;
        let destroyedCounter = document.getElementById('destroyed-counter');
        destroyedCounter.textContent = destroyedVotes;
        localStorage.setItem('destroyedVotes', destroyedVotes);
        updateAllCellColors();
        updateTotalCount();
        redoStack = [];
        saveUndoRedoStacks();
        updateButtonStates();
    }
}

function saveCurrentState() {
    let currentState = [];
    for (let i = 1; i <= 32; i++) {
        let cellId = `cell-${i}`;
        let cell = document.getElementById(cellId);
        if (cell) {
            let count = cell.textContent;
            currentState.push({ cellId: cellId, count: count });
        }
    }
    currentState.push({ cellId: 'invalid-counter', count: invalidVotes });
    currentState.push({ cellId: 'no-one-counter', count: noOneVotes });
    currentState.push({ cellId: 'destroyed-counter', count: destroyedVotes });
    undoStack.push(currentState);
    saveUndoRedoStacks();
    updateButtonStates();
}

function saveCount(cellId, count) {
    localStorage.setItem(cellId, count);
}

function loadCounts() {
    for (let i = 1; i <= 32; i++) {
        let cellId = `cell-${i}`;
        let savedCount = localStorage.getItem(cellId);
        if (savedCount !== null) {
            let cell = document.getElementById(cellId);
            cell.textContent = savedCount;
        }
    }
    updateAllCellColors();
}

function loadInvalidVotes() {
    let savedInvalidVotes = localStorage.getItem('invalidVotes');
    if (savedInvalidVotes !== null) {
        invalidVotes = parseInt(savedInvalidVotes);
        let invalidCounter = document.getElementById('invalid-counter');
        invalidCounter.textContent = invalidVotes;
    }
    updateAllCellColors();
}

function loadNoOneVotes() {
    let savedNoOneVotes = localStorage.getItem('noOneVotes');
    if (savedNoOneVotes !== null) {
        noOneVotes = parseInt(savedNoOneVotes);
        let noOneCounter = document.getElementById('no-one-counter');
        noOneCounter.textContent = noOneVotes;
    }
    updateAllCellColors();
}

function loadDestroyedVotes() {
    let savedDestroyedVotes = localStorage.getItem('destroyedVotes');
    if (savedDestroyedVotes !== null) {
        destroyedVotes = parseInt(savedDestroyedVotes);
        let destroyedCounter = document.getElementById('destroyed-counter');
        destroyedCounter.textContent = destroyedVotes;
    }
    updateAllCellColors();
}

function loadUndoRedoStacks() {
    let savedUndoStack = localStorage.getItem('undoStack');
    let savedRedoStack = localStorage.getItem('redoStack');
    if (savedUndoStack) {
        undoStack = JSON.parse(savedUndoStack);
    }
    if (savedRedoStack) {
        redoStack = JSON.parse(savedRedoStack);
    }
}

function saveUndoRedoStacks() {
    localStorage.setItem('undoStack', JSON.stringify(undoStack));
    localStorage.setItem('redoStack', JSON.stringify(redoStack));
}

function undo() {
    if (undoStack.length > 0) {
        let lastState = undoStack.pop();
        redoStack.push(getCurrentState());
        restoreState(lastState);
        updateTotalCount();
        updateAllCellColors();
        saveUndoRedoStacks();
        updateButtonStates();
    }
}

function redo() {
    if (redoStack.length > 0) {
        let nextState = redoStack.pop();
        undoStack.push(getCurrentState());
        restoreState(nextState);
        updateTotalCount();
        updateAllCellColors();
        saveUndoRedoStacks();
        updateButtonStates();
    }
}

function reset() {
    if(confirm('Сигурен ли си, че искаш да нулирате всички гласове?') === false) return;
    if (areAllValuesZero()) {
        return; // Do nothing if all values are zero
    }
    saveCurrentState();
    for (let i = 1; i <= 32; i++) {
        let cellId = `cell-${i}`;
        document.getElementById(cellId).textContent = 0;
        localStorage.setItem(cellId, 0);
    }
    invalidVotes = 0;
    noOneVotes = 0;
    destroyedVotes = 0;
    document.getElementById('invalid-counter').textContent = 0;
    document.getElementById('no-one-counter').textContent = 0;
    document.getElementById('destroyed-counter').textContent = 0;
    localStorage.setItem('invalidVotes', 0);
    localStorage.setItem('noOneVotes', 0);
    localStorage.setItem('destroyedVotes', 0);
    updateTotalCount();
    updateAllCellColors();
    redoStack = [];
    saveUndoRedoStacks();
    updateButtonStates();

    totalCount = 0;
}

function updateCellColor(cell, count, maxCount) {
    if (!cell) return;
    if (maxCount === 0 || count === 0) {
        cell.style.backgroundColor = '#e0e0e0';
    } else {
        let intensity = count > 0 ? Math.floor((count / maxCount) * 255) : 255;
        let red = 255;
        let green = 255 - intensity;
        let blue = 255 - intensity;
        cell.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    }
}

function updateAllCellColors() {
    let maxCount = 0;
    for (let i = 1; i <= 32; i++) {
        let cell = document.getElementById(`cell-${i}`);
        if (cell) {
            let count = parseInt(cell.textContent);
            if (count > maxCount) {
                maxCount = count;
            }
        }
    }
    if (invalidVotes > maxCount) {
        maxCount = invalidVotes;
    }
    if (noOneVotes > maxCount) {
        maxCount = noOneVotes;
    }
    if (destroyedVotes > maxCount) {
        maxCount = destroyedVotes;
    }
    for (let i = 1; i <= 32; i++) {
        let cell = document.getElementById(`cell-${i}`);
        if (cell) {
            let count = parseInt(cell.textContent);
            updateCellColor(cell, count, maxCount);
        }
    }
    let invalidCounter = document.getElementById('invalid-counter');
    updateCellColor(invalidCounter, invalidVotes, maxCount);
    let noOneCounter = document.getElementById('no-one-counter');
    updateCellColor(noOneCounter, noOneVotes, maxCount);
    let destroyedCounter = document.getElementById('destroyed-counter');
    updateCellColor(destroyedCounter, destroyedVotes, maxCount);
}

function areAllValuesZero() {
    for (let i = 1; i <= 32; i++) {
        let cell = document.getElementById(`cell-${i}`);
        if (cell && parseInt(cell.textContent) !== 0) {
            return false;
        }
    }
    return invalidVotes === 0 && noOneVotes === 0 && destroyedVotes === 0;
}

function getCurrentState() {
    let currentState = [];
    for (let i = 1; i <= 32; i++) {
        let cellId = `cell-${i}`;
        let cell = document.getElementById(cellId);
        if (cell) {
            let count = cell.textContent;
            currentState.push({ cellId: cellId, count: count });
        }
    }
    currentState.push({ cellId: 'invalid-counter', count: invalidVotes });
    currentState.push({ cellId: 'no-one-counter', count: noOneVotes });
    currentState.push({ cellId: 'destroyed-counter', count: destroyedVotes });
    return currentState;
}

function restoreState(state) {
    state.forEach(cell => {
        let cellElement = document.getElementById(cell.cellId);
        if (cellElement) {
            cellElement.textContent = cell.count;
            if (cell.cellId === 'invalid-counter') {
                invalidVotes = cell.count;
                localStorage.setItem('invalidVotes', invalidVotes);
            } else if (cell.cellId === 'no-one-counter') {
                noOneVotes = cell.count;
                localStorage.setItem('noOneVotes', noOneVotes);
            } else if (cell.cellId === 'destroyed-counter') {
                destroyedVotes = cell.count;
                localStorage.setItem('destroyedVotes', destroyedVotes);
            } else {
                localStorage.setItem(cell.cellId, cell.count);
            }
        }
    });
}

function updateCellColor(cell, count, maxCount) {
    if (!cell) return;
    if (maxCount === 0 || count === 0) {
        cell.style.backgroundColor = '#e0e0e0';
    } else {
        let intensity = count > 0 ? Math.floor((count / maxCount) * 255) : 255;
        let red = 255;
        let green = 255 - intensity;
        let blue = 255 - intensity;
        cell.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    }
}

function updateAllCellColors() {
    let maxCount = 0;
    for (let i = 1; i <= 32; i++) {
        let cell = document.getElementById(`cell-${i}`);
        if (cell) {
            let count = parseInt(cell.textContent);
            if (count > maxCount) {
                maxCount = count;
            }
        }
    }
    if (invalidVotes > maxCount) {
        maxCount = invalidVotes;
    }
    if (noOneVotes > maxCount) {
        maxCount = noOneVotes;
    }
    if (destroyedVotes > maxCount) {
        maxCount = destroyedVotes;
    }
    for (let i = 1; i <= 32; i++) {
        let cell = document.getElementById(`cell-${i}`);
        if (cell) {
            let count = parseInt(cell.textContent);
            updateCellColor(cell, count, maxCount);
        }
    }
    let invalidCounter = document.getElementById('invalid-counter');
    updateCellColor(invalidCounter, invalidVotes, maxCount);
    let noOneCounter = document.getElementById('no-one-counter');
    updateCellColor(noOneCounter, noOneVotes, maxCount);
    let destroyedCounter = document.getElementById('destroyed-counter');
    updateCellColor(destroyedCounter, destroyedVotes, maxCount);
}


function updateTotalCount() {
    totalCount = 0;
    for (let i = 1; i <= 32; i++) {
        let cellId = `cell-${i}`;
        let cell = document.getElementById(cellId);
        if (cell) {
            totalCount += parseInt(cell.textContent);
        }
    }
    totalCount += invalidVotes + noOneVotes + destroyedVotes;
    document.getElementById('total-counter').textContent = totalCount;
}

function updateButtonStates() {
    document.getElementById('undo-button').disabled = undoStack.length === 0;
    document.getElementById('redo-button').disabled = redoStack.length === 0;
    document.getElementById('reset-button').disabled = areAllValuesZero();
}

// Adding long press functionality
let timer;
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('mousedown', () => {
        timer = setTimeout(() => {
            decrement(cell.id);
        }, 1000); // 1 second long press to decrement
    });

    cell.addEventListener('mouseup', () => {
        clearTimeout(timer);
    });

    cell.addEventListener('mouseleave', () => {
        clearTimeout(timer);
    });
});

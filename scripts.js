let undoStack = [];
let redoStack = [];
let invalidVotes = 0;
let totalCount = 0;
let cellsCount = 32;

document.addEventListener("DOMContentLoaded", () => {
    loadCounts();
    loadInvalidVotes();
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

function saveCurrentState() {
    let currentState = [];
    for (let i = 1; i <= cellsCount; i++) {
        let cellId = `cell-${i}`;
        let cell = document.getElementById(cellId);
        if (cell) {
            let count = cell.textContent;
            currentState.push({ cellId: cellId, count: count });
        }
    }
    currentState.push({ cellId: 'invalid-counter', count: invalidVotes });
    undoStack.push(currentState);
    saveUndoRedoStacks();
    updateButtonStates();

}

function saveCount(cellId, count) {
    localStorage.setItem(cellId, count);
}

function loadCounts() {
    for (let i = 1; i <= cellsCount; i++) {
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

function areAllValuesZero() {
    for (let i = 1; i <= cellsCount; i++) {
        let cell = document.getElementById(`cell-${i}`);
        if (cell && parseInt(cell.textContent) !== 0) {
            return false;
        }
    }
    return invalidVotes === 0;
}

function reset() {
    if (!confirm('Сигурен ли си, че искаш да нулираш всички стойности?')) {
        return;
    }
    if(areAllValuesZero()) {
        return;
    }

    saveCurrentState();
    for (let i = 1; i <= cellsCount; i++) {
        let cellId = `cell-${i}`;
        document.getElementById(cellId).textContent = 0;
        localStorage.setItem(cellId, 0);
    }
    invalidVotes = 0;
    document.getElementById('invalid-counter').textContent = 0;
    localStorage.setItem('invalidVotes', 0);
    updateTotalCount();
    updateAllCellColors();
    redoStack = [];
    saveUndoRedoStacks();
    updateButtonStates();

}

function getCurrentState() {
    let currentState = [];
    for (let i = 1; i <= cellsCount; i++) {
        let cellId = `cell-${i}`;
        let cell = document.getElementById(cellId);
        if (cell) {
            let count = cell.textContent;
            currentState.push({ cellId: cellId, count: count });
        }
    }
    currentState.push({ cellId: 'invalid-counter', count: invalidVotes });
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
            } else {
                localStorage.setItem(cell.cellId, cell.count);
            }
        }
    });
}

function updateCellColor(cell, count, maxCount) {
    if (maxCount === 0 || count === 0) {
        cell.style.backgroundColor = '#e8e8e8';
    } else {
        let intensity = Math.floor((count / maxCount) * 255);
        let aggressiveReduction = 0.6;
        let red = 255;
        let green = 255 - Math.floor(intensity * aggressiveReduction); // Less aggressive green reduction
        let blue = 255 - Math.floor(intensity * aggressiveReduction); // Soft blue to balance the red intensity
        cell.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    }
}

function updateAllCellColors() {
    let maxCount = 0;
    for (let i = 1; i <= cellsCount; i++) {
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
    for (let i = 1; i <= cellsCount; i++) {
        let cell = document.getElementById(`cell-${i}`);
        if (cell) {
            let count = parseInt(cell.textContent);
            updateCellColor(cell, count, maxCount);
        }
    }
    let invalidCounter = document.getElementById('invalid-counter');
    updateCellColor(invalidCounter, invalidVotes, maxCount);
}


function updateButtonStates() {
    document.getElementById('undo-btn').disabled = undoStack.length === 0;
    document.getElementById('redo-btn').disabled = redoStack.length === 0;
    document.getElementById('reset-btn').disabled = areAllValuesZero();
}

function updateTotalCount() {
    totalCount = 0;
    for (let i = 1; i <= cellsCount; i++) {
        let cellId = `cell-${i}`;
        let cell = document.getElementById(cellId);
        if (cell) {
            totalCount += parseInt(cell.textContent);
        }
    }
    totalCount += invalidVotes;
    document.getElementById('total-counter').textContent = totalCount;
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
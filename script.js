class Calculator {
    constructor(prevOperandElement, currOperandElement) {
        this.prevOperandElement = prevOperandElement;
        this.currOperandElement = currOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const intDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let intDisplay;
        if (isNaN(intDigits)) {
            intDisplay = '';
        } else {
            intDisplay = intDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${intDisplay}.${decimalDigits}`;
        } else {
            return intDisplay;
        }
    }

    updateDisplay() {
        this.currOperandElement.innerText = this.getDisplayNumber(this.currentOperand) || '0';
        if (this.operation != null) {
            this.prevOperandElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.prevOperandElement.innerText = '';
        }
    }
}

// DOM Elements
const prevOperandElement = document.getElementById('prevOperand');
const currOperandElement = document.getElementById('currOperand');

const calculator = new Calculator(prevOperandElement, currOperandElement);

// Wait for DOM to be ready
function initializeButtons() {
    // Number buttons
    const numberButtons = document.querySelectorAll('[data-number]');
    numberButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            calculator.appendNumber(this.getAttribute('data-number'));
        });
    });

    // Operation buttons
    const operationButtons = document.querySelectorAll('[data-operation]');
    operationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            calculator.chooseOperation(this.getAttribute('data-operation'));
        });
    });

    // Action buttons
    const actionButtons = document.querySelectorAll('[data-action]');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.getAttribute('data-action');
            if (action === 'clear') {
                calculator.clear();
            } else if (action === 'delete') {
                calculator.delete();
            } else if (action === 'equals') {
                calculator.compute();
            }
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeButtons);
} else {
    initializeButtons();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') calculator.appendNumber(e.key);
    if (e.key === '.') calculator.appendNumber(e.key);
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        calculator.chooseOperation(e.key);
    }
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.compute();
    }
    if (e.key === 'Backspace') calculator.delete();
    if (e.key === 'Escape') calculator.clear();
});
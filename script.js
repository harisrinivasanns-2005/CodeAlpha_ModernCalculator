let currentInput = '0';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;

const mainDisplay = document.getElementById('mainDisplay');
const secondaryDisplay = document.getElementById('secondaryDisplay');

function updateDisplay() {
    mainDisplay.textContent = formatNumber(currentInput);
    mainDisplay.classList.remove('error');

    if (previousInput && operator) {
        secondaryDisplay.textContent = `${formatNumber(previousInput)} ${getOperatorSymbol(operator)}`;
    } else {
        secondaryDisplay.textContent = '';
    }
}

function formatNumber(num) {
    if (num === 'Error') return num;

    const number = parseFloat(num);
    if (isNaN(number)) return num;

    if (Math.abs(number) > 1e15 || (Math.abs(number) < 1e-6 && number !== 0)) {
        return number.toExponential(8);
    }

    if (number % 1 === 0 && Math.abs(number) < 1e15) {
        return number.toString();
    }

    return parseFloat(number.toPrecision(12)).toString();
}

function getOperatorSymbol(op) {
    const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    return symbols[op] || op;
}

function inputNumber(num) {
    if (shouldResetDisplay || currentInput === '0' || currentInput === 'Error') {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

function inputDecimal() {
    if (shouldResetDisplay || currentInput === 'Error') {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function inputOperator(op) {
    if (currentInput === 'Error') {
        clearAll();
        return;
    }

    if (previousInput && operator && !shouldResetDisplay) {
        calculate();
        if (currentInput === 'Error') return;
    }

    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculate() {
    if (!previousInput || !operator || currentInput === 'Error') return;

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                showError('Cannot divide by zero');
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    if (!isFinite(result)) {
        showError('Result too large');
        return;
    }

    currentInput = result.toString();
    previousInput = '';
    operator = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    shouldResetDisplay = false;
    updateDisplay();
}

function showError(message) {
    currentInput = 'Error';
    previousInput = '';
    operator = '';
    shouldResetDisplay = true;
    mainDisplay.classList.add('Error');
    updateDisplay();
}

document.addEventListener('keydown', function (event) {
    event.preventDefault();

    const key = event.key;

    if (key >= '0' && key <= '9') {
        inputNumber(key);
        animateButton(key);
    } else if (key === '.') {
        inputDecimal();
        animateButton('.');
    } else if (['+', '-', '*', '/'].includes(key)) {
        inputOperator(key);
        animateButton(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
        animateButton('Enter');
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearAll();
        animateButton('c');
    } else if (key === 'Backspace') {
        clearEntry();
        animateButton('ce');
    }
});

function animateButton(key) {
    const button = document.querySelector(`[data-key="${key}"]`);
    if (button) {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.47)';
        setTimeout(() => {
            button.style.transform = '';
            button.style.boxShadow = '';
        }, 100);
    }
}

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mousedown', function () {
        this.style.transform = 'translateY(0)';
    });

    button.addEventListener('mouseup', function () {
        this.style.transform = '';
    });

    button.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});

updateDisplay();

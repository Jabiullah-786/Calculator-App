document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.calculator button');
    let currentInput = '';
    let operator = null;
    let previousValue = null;
    let waitingForSecondOperand = false;

    // Helper function to update the display
    const updateDisplay = (value) => {
        display.value = value;
    };

    // Performs the calculation
    const calculate = (first, second, op) => {
        first = parseFloat(first);
        second = parseFloat(second);

        if (isNaN(first) || isNaN(second)) return second;

        switch (op) {
            case '+':
                return first + second;
            case '-':
                return first - second;
            case '×':
                return first * second;
            case '÷':
                if (second === 0) return 'Error'; // Handle division by zero
                return first / second;
            default:
                return second;
        }
    };

    // Handles number, decimal, and operator button presses
    const handleInput = (value) => {
        if (value >= '0' && value <= '9' || value === '.') {
            if (waitingForSecondOperand) {
                currentInput = value;
                waitingForSecondOperand = false;
            } else {
                // Prevent multiple decimals in one number
                if (value === '.' && currentInput.includes('.')) return;
                currentInput += value;
            }
        } else if (value === 'C') {
            // Clear all
            currentInput = '0';
            operator = null;
            previousValue = null;
            waitingForSecondOperand = false;
        } else if (value === '←') {
            // Backspace/Delete last character
            currentInput = currentInput.slice(0, -1) || '0';
        } else if (value === '=' || ['+', '-', '×', '÷'].includes(value)) {
            const inputValue = parseFloat(currentInput);

            if (previousValue === null && !isNaN(inputValue)) {
                previousValue = inputValue;
            } else if (operator) {
                const result = calculate(previousValue, inputValue, operator);
                if (result === 'Error') {
                    currentInput = 'Error';
                    previousValue = null;
                    operator = null;
                    updateDisplay(currentInput);
                    return;
                }
                previousValue = result;
                currentInput = String(result);
            }

            if (value !== '=') {
                operator = value;
                waitingForSecondOperand = true;
            } else {
                operator = null;
                waitingForSecondOperand = true;
            }
        }

        updateDisplay(currentInput);
    };

    // Attach click listeners to all buttons
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const value = event.target.dataset.value;
            handleInput(value);
        });
    });

    /* --- BONUS: Keyboard Support --- */
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        let mappedValue = '';

        if (key >= '0' && key <= '9' || key === '.') {
            mappedValue = key;
        } else if (key === '+') {
            mappedValue = '+';
        } else if (key === '-') {
            mappedValue = '-';
        } else if (key === '*' || key.toLowerCase() === 'x') {
            mappedValue = '×'; // Use the multiplication symbol used in the buttons
        } else if (key === '/') {
            event.preventDefault(); // Prevent default browser actions (like quick find)
            mappedValue = '÷';
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            mappedValue = '=';
        } else if (key === 'Backspace') {
            mappedValue = '←'; // Backspace/Delete button
        } else if (key.toLowerCase() === 'c' || key.toLowerCase() === 'delete') {
            mappedValue = 'C'; // Clear button
        }

        if (mappedValue) {
            handleInput(mappedValue);
        }
    });

    // Initialize display
    updateDisplay('0');
});
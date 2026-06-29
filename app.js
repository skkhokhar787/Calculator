const displyScreen = document.querySelector("#screen");
const historyScreen = document.querySelector("#calc-history");
const keypad = document.querySelectorAll("#keypad button");

function addition(num1, num2) { return num1 + num2; }
function subtraction(num1, num2) { return num1 - num2; }
function multiply(num1, num2) { return num1 * num2; }
function division(num1, num2) { return num1 / num2; }
function percentage(num1, num2) { return (num1 / num2) * 100; }

const state = {
  operand1: "",
  operand2: "",
  operator: null,
  enteringSecond: false,
};

function getDisplayOperator(op) {
  if (op === "*") return "&times;";
  if (op === "/") return "&divide;";
  return op;
}

function updateHistoryUI() {
  if (state.operator) {
    const visualOp = getDisplayOperator(state.operator);
    historyScreen.innerHTML = `${state.operand1} ${visualOp} ${state.operand2}`;
  } else {
    historyScreen.innerHTML = "";
  }
}

function computeResult(s) {
  const a = parseFloat(s.operand1 || "0");
  const b = parseFloat(s.operand2 || "0");
  switch (s.operator) {
    case "+": return addition(a, b);
    case "-": return subtraction(a, b);
    case "*": return multiply(a, b);
    case "/": return division(a, b);
    default: return b;
  }
}

keypad.forEach((key) => {
  key.addEventListener("click", () => {
    const text = key.innerText.trim();

    if (/^\d$/.test(text) || text === ".") {
      const target = state.enteringSecond ? "operand2" : "operand1";
      if (text === "." && state[target].includes(".")) return;
      state[target] += text;
      displyScreen.innerText = state[target] || "0";
      updateHistoryUI();
      return;
    }

    if (text === "C" || text === "AC") {
      state.operand1 = "";
      state.operand2 = "";
      state.operator = null;
      state.enteringSecond = false;
      displyScreen.innerText = "0";
      historyScreen.innerHTML = "";
      return;
    }

    if (text === "+" || text === "−" || text === "×" || text === "÷") {
      let normalizedOp = text;
      if (text === "×") normalizedOp = "*";
      if (text === "÷") normalizedOp = "/";
      if (text === "−") normalizedOp = "-";

      if (state.operator && state.operand2 !== "") {
        const result = computeResult(state);
        state.operand1 = String(result);
        state.operand2 = "";
        displyScreen.innerText = state.operand1;
      }
      
      if (!state.operand1 && displyScreen.innerText !== "0") {
        state.operand1 = displyScreen.innerText;
      } else if (!state.operand1) {
        state.operand1 = "0";
      }

      state.operator = normalizedOp;
      state.enteringSecond = true;
      updateHistoryUI();
      return;
    }

    if (text === "%") {
      if (state.enteringSecond && state.operand2 !== "") {
        const res = percentage(parseFloat(state.operand1 || "0"), parseFloat(state.operand2 || "0"));
        displyScreen.innerText = res;
        state.operand1 = String(res);
        state.operand2 = "";
        state.operator = null;
        state.enteringSecond = false;
      } else {
        const a = parseFloat(state.operand1 || "0");
        const res = a / 100;
        displyScreen.innerText = res;
        state.operand1 = String(res);
      }
      historyScreen.innerHTML = "";
      return;
    }

    if (text === "=") {
      if (state.operator && state.operand2 !== "") {
        updateHistoryUI(); 
        const result = computeResult(state);
        displyScreen.innerText = result;
        state.operand1 = String(result);
        state.operand2 = "";
        state.operator = null;
        state.enteringSecond = false;
      }
      return;
    }
  });
});

window.addEventListener("keydown", (event) => {
  let pressedKey = event.key;

  if (pressedKey === "Enter") pressedKey = "=";
  if (pressedKey === "Escape" || pressedKey === "Backspace") pressedKey = "C";
  if (pressedKey === "*") pressedKey = "×";
  if (pressedKey === "/") pressedKey = "÷";
  if (pressedKey === "-") pressedKey = "−"; 

  const targetButton = Array.from(keypad).find(
    (btn) => btn.innerText.trim() === pressedKey
  );

  if (targetButton) {
    event.preventDefault();
    
    targetButton.classList.add("scale-95", "opacity-80");
    setTimeout(() => {
      targetButton.classList.remove("scale-95", "opacity-80");
    }, 100);

    targetButton.click(); 
  }
});
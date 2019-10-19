let wrap = document.querySelector(".wrap");
let calc = wrap.querySelector(".calc");
let bin = calc.querySelector(".bin");
let dec = calc.querySelector(".dec");
let hex = calc.querySelector(".hex");
let keysWrap = wrap.querySelector(".keys");
let keys = keysWrap.querySelectorAll(".key");

let inputIncrement = () => {
  dec.value++;
  bin.value = parseInt(dec.value, 10).toString(2);
  hex.value = parseInt(dec.value, 10).toString(16);
};

let inputDecrement = () => {
  dec.value--;
  if (dec.value <= 0) {
    bin.value = dec.value = hex.value = "";
  } else {
    bin.value = parseInt(dec.value, 10).toString(2);
    hex.value = parseInt(dec.value, 10).toString(16);
  }
};

let updateFields = input => {
  if (input.value == "") {
    bin.value = dec.value = hex.value = "";
  } else if (input.value == 0) {
    bin.value = dec.value = hex.value = 0;
  } else {
    if (input == bin) {
      dec.value = parseInt(bin.value, 2).toString(10);
      hex.value = parseInt(bin.value, 2).toString(16);
    } else if (input == dec) {
      bin.value = parseInt(dec.value, 10).toString(2);
      hex.value = parseInt(dec.value, 10).toString(16);
    } else if (input == hex) {
      bin.value = parseInt(hex.value, 16).toString(2);
      dec.value = parseInt(hex.value, 16).toString(10);
    }
  }
};

let getStringChunks = input => {
  let start = input.selectionStart;
  let end = input.selectionEnd;
  let array = input.value.split("");
  let leftArr = array.splice(0, start);
  let selectionArr = array.splice(0, end - start);
  let rightArr = array.splice(0);
  return {
    left: leftArr.join(""),
    selection: selectionArr.join(""),
    right: rightArr.join("")
  };
};

let inputSymbol = (input, chunks, symbol) => {
  input.value = chunks.left + symbol + chunks.right;
  input.selectionStart = input.selectionEnd = chunks.left.length + 1;
  updateFields(input);
};

if (touch) {
  window.onorientationchange = () => document.activeElement.focus();

  let inputBackspace = (input, chunks) => {
    if (!chunks.selection) {
      chunks.left = chunks.left.slice(0, -1);
    }
    input.value = chunks.left + chunks.right;
    input.selectionStart = input.selectionEnd = chunks.left.length;
    updateFields(input);
  };

  let inputDelete = (input, chunks) => {
    if (!chunks.selection) {
      chunks.right = chunks.right.slice(1);
    }
    input.value = chunks.left + chunks.right;
    input.selectionStart = input.selectionEnd = chunks.left.length;
    updateFields(input);
  };

  let inputLeft = (input, chunks) => {
    if (chunks.left.length > 0) {
      input.value = chunks.left + chunks.selection + chunks.right;
      if (!chunks.selection) {
        input.selectionStart = input.selectionEnd = chunks.left.length - 1;
      } else {
        input.selectionStart = input.selectionEnd = chunks.left.length;
      }
    } else {
      if (chunks.selection) {
        input.selectionStart = input.selectionEnd = 0;
      }
    }
  };

  let inputRight = (input, chunks) => {
    if (chunks.right.length > 0) {
      input.value = chunks.left + chunks.selection + chunks.right;
      if (!chunks.selection) {
        input.selectionStart = input.selectionEnd = chunks.left.length + 1;
      } else {
        input.selectionStart = input.selectionEnd =
          chunks.left.length + chunks.selection.length;
      }
    } else {
      if (chunks.selection) {
        input.selectionStart = input.selectionEnd =
          chunks.left.length + chunks.selection.length + chunks.right.length;
      }
    }
  };

  document.addEventListener("mousedown", e => {
    e.stopPropagation();
    let target = e.target;

    if (!target.classList.contains("input")) {
      e.preventDefault();
    }

    let input = document.activeElement;
    let chunks = getStringChunks(input);

    if (target.classList.contains("key")) {
      inputSymbol(input, chunks, target.textContent);
    } else if (target.classList.contains("ctl-backspace")) {
      inputBackspace(input, chunks);
    } else if (target.classList.contains("ctl-del")) {
      inputDelete(input, chunks);
    } else if (target.classList.contains("ctl-left")) {
      inputLeft(input, chunks);
    } else if (target.classList.contains("ctl-right")) {
      inputRight(input, chunks);
    } else if (target.classList.contains("ctl-decrement")) {
      inputDecrement(input);
    } else if (target.classList.contains("ctl-increment")) {
      inputIncrement(input);
    }
  });

  calc.addEventListener("click", e => {
    let target = e.target;
    if (target == bin) {
      for (let i = 0, len = keys.length; i < len; i++) {
        if (keys[i].classList.contains("key-bin")) keys[i].disabled = false;
        else keys[i].disabled = true;
      }
    } else if (target == dec) {
      for (let i = 0, len = keys.length; i < len; i++) {
        if (keys[i].classList.contains("key-hex")) keys[i].disabled = true;
        else keys[i].disabled = false;
      }
    } else if (target == hex) {
      for (let i = 0, len = keys.length; i < len; i++) {
        keys[i].disabled = false;
      }
    }
  });
} else {
  // desktop

  let binInclude = ["0", "1"];
  let decInclude = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let allowLetters = ["KeyA", "KeyB", "KeyC", "KeyD", "KeyE", "KeyF"];
  let allowKeys = [
    "Tab",
    "ShiftLeft",
    "ShiftRight",
    "ControlLeft",
    "ControlRight",
    "ArrowLeft",
    "ArrowRight",
    "End",
    "Home",
    "Delete",
    "Backspace"
  ];

  let contains = (arr, key) => {
    let len = arr.length;
    for (var i = 0; i < len; i++) {
      if (arr[i] === key) {
        return true;
      }
    }
    return false;
  };

  bin.onkeydown = e => {
    if (contains(binInclude, e.key) || contains(allowKeys, e.code)) {
      return true;
    } else if (e.code == "ArrowUp") {
      inputIncrement();
    } else if (e.code == "ArrowDown") {
      inputDecrement();
    }
    return false;
  };
  bin.onkeyup = () => {
    updateFields(bin);
  };

  dec.onkeydown = e => {
    if (contains(decInclude, e.key) || contains(allowKeys, e.code)) {
      return true;
    } else if (e.code == "ArrowUp") {
      inputIncrement();
    } else if (e.code == "ArrowDown") {
      inputDecrement();
    }
    return false;
  };
  dec.onkeyup = () => {
    updateFields(dec);
  };

  hex.onkeydown = e => {
    if (contains(decInclude, e.key) || contains(allowKeys, e.code)) {
      return true;
    } else if (contains(allowLetters, e.code)) {
      let chunks = getStringChunks(hex);
      inputSymbol(hex, chunks, e.code.toString().slice(-1));
    } else if (e.code == "ArrowUp") {
      inputIncrement();
    } else if (e.code == "ArrowDown") {
      inputDecrement();
    }
    return false;
  };
  hex.onkeyup = () => {
    updateFields(hex);
  };

  document.querySelector(".top").onclick = e => {
    e.stopPropagation();
    inputIncrement();
  };

  document.querySelector(".bottom").onclick = e => {
    e.stopPropagation();
    inputDecrement();
  };
}

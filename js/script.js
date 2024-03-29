"use strict";

var wrap = document.querySelector(".wrap");
var calc = wrap.querySelector(".calc");
var bin = calc.querySelector(".bin");
var dec = calc.querySelector(".dec");
var hex = calc.querySelector(".hex");
var keysWrap = wrap.querySelector(".keys");
var keys = keysWrap.querySelectorAll(".key");

var inputIncrement = function inputIncrement() {
  dec.value++;
  bin.value = parseInt(dec.value, 10).toString(2);
  hex.value = parseInt(dec.value, 10).toString(16);
};

var inputDecrement = function inputDecrement() {
  dec.value--;

  if (dec.value <= 0) {
    bin.value = dec.value = hex.value = "";
  } else {
    bin.value = parseInt(dec.value, 10).toString(2);
    hex.value = parseInt(dec.value, 10).toString(16);
  }
};

var updateFields = function updateFields(input) {
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

var getStringChunks = function getStringChunks(input) {
  var start = input.selectionStart;
  var end = input.selectionEnd;
  var array = input.value.split("");
  var leftArr = array.splice(0, start);
  var selectionArr = array.splice(0, end - start);
  var rightArr = array.splice(0);
  return {
    left: leftArr.join(""),
    selection: selectionArr.join(""),
    right: rightArr.join("")
  };
};

var inputSymbol = function inputSymbol(input, chunks, symbol) {
  input.value = chunks.left + symbol + chunks.right;
  input.selectionStart = input.selectionEnd = chunks.left.length + 1;
  updateFields(input);
};

if (touch) {
  window.onorientationchange = function() {
    return document.activeElement.focus();
  };

  var inputBackspace = function inputBackspace(input, chunks) {
    if (!chunks.selection) {
      chunks.left = chunks.left.slice(0, -1);
    }

    input.value = chunks.left + chunks.right;
    input.selectionStart = input.selectionEnd = chunks.left.length;
    updateFields(input);
  };

  var inputDelete = function inputDelete(input, chunks) {
    if (!chunks.selection) {
      chunks.right = chunks.right.slice(1);
    }

    input.value = chunks.left + chunks.right;
    input.selectionStart = input.selectionEnd = chunks.left.length;
    updateFields(input);
  };

  var inputLeft = function inputLeft(input, chunks) {
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

  var inputRight = function inputRight(input, chunks) {
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

  document.addEventListener("mousedown", function(e) {
    e.stopPropagation();
    var target = e.target;

    if (!target.classList.contains("input")) {
      e.preventDefault();
    }

    var input = document.activeElement;
    var chunks = getStringChunks(input);

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
  calc.addEventListener("click", function(e) {
    var target = e.target;

    if (target == bin) {
      for (var i = 0, len = keys.length; i < len; i++) {
        if (keys[i].classList.contains("key-bin")) keys[i].disabled = false;
        else keys[i].disabled = true;
      }
    } else if (target == dec) {
      for (var _i = 0, _len = keys.length; _i < _len; _i++) {
        if (keys[_i].classList.contains("key-hex")) keys[_i].disabled = true;
        else keys[_i].disabled = false;
      }
    } else if (target == hex) {
      for (var _i2 = 0, _len2 = keys.length; _i2 < _len2; _i2++) {
        keys[_i2].disabled = false;
      }
    }
  });
} else {
  // desktop
  var binInclude = ["0", "1"];
  var decInclude = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var allowLetters = ["KeyA", "KeyB", "KeyC", "KeyD", "KeyE", "KeyF"];
  var allowKeys = [
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

  var contains = function contains(arr, key) {
    var len = arr.length;

    for (var i = 0; i < len; i++) {
      if (arr[i] === key) {
        return true;
      }
    }

    return false;
  };

  bin.onkeydown = function(e) {
    if (contains(binInclude, e.key) || contains(allowKeys, e.code)) {
      return true;
    } else if (e.code == "ArrowUp") {
      inputIncrement();
    } else if (e.code == "ArrowDown") {
      inputDecrement();
    }

    return false;
  };

  bin.onkeyup = function() {
    updateFields(bin);
  };

  dec.onkeydown = function(e) {
    if (contains(decInclude, e.key) || contains(allowKeys, e.code)) {
      return true;
    } else if (e.code == "ArrowUp") {
      inputIncrement();
    } else if (e.code == "ArrowDown") {
      inputDecrement();
    }

    return false;
  };

  dec.onkeyup = function() {
    updateFields(dec);
  };

  hex.onkeydown = function(e) {
    if (contains(decInclude, e.key) || contains(allowKeys, e.code)) {
      return true;
    } else if (contains(allowLetters, e.code)) {
      var chunks = getStringChunks(hex);
      inputSymbol(hex, chunks, e.code.toString().slice(-1));
    } else if (e.code == "ArrowUp") {
      inputIncrement();
    } else if (e.code == "ArrowDown") {
      inputDecrement();
    }

    return false;
  };

  hex.onkeyup = function() {
    updateFields(hex);
  };

  document.querySelector(".top").onclick = function(e) {
    e.stopPropagation();
    inputIncrement();
  };

  document.querySelector(".bottom").onclick = function(e) {
    e.stopPropagation();
    inputDecrement();
  };
}
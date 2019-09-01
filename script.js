let calc = document.querySelector('.calc');
let input = document.querySelector('.input');
let bin = document.querySelector('.bin');
let dec = document.querySelector('.dec');
let hex = document.querySelector('.hex');
let key = document.querySelectorAll('.key');

let inputSymbol = (field, symbol) => {
    let value = field.value;
    let start = field.selectionStart;
    let end = field.selectionEnd;
    let array = value.split('');
    if (start == end) {
        array.splice(start, 0, symbol);
    } else {
        array.splice(start, end - start, symbol);
    }
    field.value = array.join('');
    field.selectionEnd = start + 1;
    
    updateFields();
};

let inputControl = (field, btn) => {
    let value = field.value;
    let start = field.selectionStart;
    let end = field.selectionEnd;
    let array = value.split('');
    if (start == end) {
        if (btn.classList.contains('ctl-backspace') && start != 0) {
            array.splice(start - 1, 1);
            field.value = array.join('');
            field.selectionStart = field.selectionEnd = start - 1;
        } else if (btn.classList.contains('ctl-del')) {
            array.splice(start, 1);
            field.value = array.join('');
            field.selectionStart = field.selectionEnd = start;
        } else if (btn.classList.contains('ctl-left')) {
            field.selectionStart = field.selectionEnd = start - 1;
        } else if (btn.classList.contains('ctl-right')) {
            field.selectionStart = field.selectionEnd = start + 1;
        } else if (btn.classList.contains('ctl-decrement')) {
            imputDecrement();
            field.selectionStart = field.selectionEnd = start;
        } else if (btn.classList.contains('ctl-increment')) {
            imputIncrement();
            field.selectionStart = field.selectionEnd = start;
        }
        
    } else {
        if (btn.classList.contains('ctl-backspace')) {
            field.selectionStart = field.selectionEnd = start;
        } else if (btn.classList.contains('ctl-del')) {
            array.splice(start, end - start);
            field.value = array.join('');
            field.selectionStart = field.selectionEnd = start;
        } else if (btn.classList.contains('ctl-left')) {
            field.selectionStart = field.selectionEnd = start;
        } else if (btn.classList.contains('ctl-right')) {
            field.selectionStart = field.selectionEnd = end;
        } else if (btn.classList.contains('ctl-decrement')) {
            imputDecrement();
            field.selectionStart = field.selectionEnd = end;
        } else if (btn.classList.contains('ctl-increment')) {
            imputIncrement();
            field.selectionStart = field.selectionEnd = end;
        }
        
    }
    updateFields();
};

let imputDecrement = () => {
    dec.value--;
    bin.value = parseInt(dec.value, 10).toString(2);
    hex.value = parseInt(dec.value, 10).toString(16);
};

let imputIncrement = () => {
    dec.value++;
    bin.value = parseInt(dec.value, 10).toString(2);
    hex.value = parseInt(dec.value, 10).toString(16);
};

let updateFields = () => {
    
    if (document.activeElement == bin) {
        dec.value = parseInt(bin.value, 2).toString(10);
        hex.value = parseInt(bin.value, 2).toString(16);
    } else if (document.activeElement == dec) {
        bin.value = parseInt(dec.value, 10).toString(2);
        hex.value = parseInt(dec.value, 10).toString(16);
    } else if (document.activeElement == hex) {
        bin.value = parseInt(hex.value, 16).toString(2);
        dec.value = parseInt(hex.value, 16).toString(10);
    }
};

document.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    let target = e.target;
    if (target.classList.contains('key')) {
        e.preventDefault();
        inputSymbol(document.activeElement, target.textContent);
    } else if (target.classList.contains('ctl')) {
        e.preventDefault();
        inputControl(document.activeElement, target);
    }
});

calc.addEventListener('click', (e) => {
    let target = e.target;
    if (target == bin) {
        for (let i = 0, len = key.length; i < len; i++) {
            if (key[i].classList.contains('key-bin'))
                key[i].disabled = false;
            else
                key[i].disabled = true;
        }
    } else if (target == dec) {
        for (let i = 0, len = key.length; i < len; i++) {
            if (key[i].classList.contains('key-hex'))
                key[i].disabled = true;
            else
                key[i].disabled = false;
        }
    } else if (target == hex) {
        for (let i = 0, len = key.length; i < len; i++) {
            key[i].disabled = false;
        }
    }
});
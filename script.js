let wrap = document.querySelector('.wrap');
let calc = wrap.querySelector('.calc');
// let input = document.querySelector('.input');
let bin = calc.querySelector('.bin');
let dec = calc.querySelector('.dec');
let hex = calc.querySelector('.hex');
let keysWrap = wrap.querySelector('.keys');
let keys = keysWrap.querySelectorAll('.key');
// let controls = keysWrap.querySelectorAll('.ctl');



let getCursorChunks = (element) => {
    // console.log(element);
    let start = element.selectionStart;
    let end = element.selectionEnd;
    let array = element.value.split('');
    // console.log(start, end, array);
    
    
    let leftArr = array.splice(0, start);
    let middleArr = array.splice(start, end);
    let rightArr = array.splice(end, -1);
    console.log(leftArr, middleArr, rightArr);
    /*return {
        left: leftArr.join(''),
        middle: middleArr.join(''),
        right: rightArr.join('')
    };*/
};



let inputSymbol = (field, symbol) => {
    let value = field.value;
    getCursorChunks(field);
    /*let start = field.selectionStart;
    let end = field.selectionEnd;
    let array = value.split('');
    if (start == end) {
        array.splice(start, 0, symbol);
    } else {
        array.splice(start, end - start, symbol);
    }
    field.value = array.join('');
    field.selectionEnd = start + 1;
    
    updateFields();*/
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
    
    if (!target.classList.contains('input')){
        e.preventDefault();
    }
    
    // console.log(target);
    
    if (target.classList.contains('key')) {
        inputSymbol(document.activeElement, target.textContent);
    } else if (target.classList.contains('ctl')) {
        inputControl(document.activeElement, target);
    }
});

calc.addEventListener('click', (e) => { // деактивация при изменении фокуса в инпутах
    let target = e.target;
    if (target == bin) {
        for (let i = 0, len = keys.length; i < len; i++) {
            if (keys[i].classList.contains('key-bin'))
                keys[i].disabled = false;
            else
                keys[i].disabled = true;
        }
    } else if (target == dec) {
        for (let i = 0, len = keys.length; i < len; i++) {
            if (keys[i].classList.contains('key-hex'))
                keys[i].disabled = true;
            else
                keys[i].disabled = false;
        }
    } else if (target == hex) {
        for (let i = 0, len = keys.length; i < len; i++) {
            keys[i].disabled = false;
        }
    }
});
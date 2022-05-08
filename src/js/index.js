import keysObj from './keys.js';

const keyArray = Object.keys(keysObj);

const settings = {
  language: 'en',
  caps: false,
};

const createKeys = () => {
  const fragment = document.createDocumentFragment();

  const lang = settings.language;

  keyArray.forEach((key) => {
    const keyBtn = document.createElement('div');
    keyBtn.classList.add('key-btn');
    const keyItem = keysObj[key];

    keyBtn.setAttribute('data-code', key);
    keyBtn.setAttribute('data-type', keyItem.type);

    const size = keyItem.size ? keyItem.size : 'small';
    keyBtn.classList.add(`${size}-btn`);

    if (keyItem.type === 'standart') {
      keyBtn.textContent = keyItem[lang].shiftOff;
    } else {
      keyBtn.textContent = keyItem.text;
    }
    if (keyItem.type === 'capsLock') {
      const light = document.createElement('span');
      light.classList.add('capslock-status');
      light.innerText = '●';
      keyBtn.classList.add('capslock');
      keyBtn.append(light);
    }
    fragment.append(keyBtn);
  });
  return fragment;
};

const toUpperCase = (letters) => {
  const lang = settings.language;
  letters.forEach((item) => {
    const { code } = item.dataset;
    const letter = item;
    if (settings.caps) {
      letter.textContent = keysObj[code][lang].shiftOn.toLowerCase();
    } else {
      letter.textContent = keysObj[code][lang].shiftOn;
    }
  });
};

const toLowerCase = (letters) => {
  const lang = settings.language;
  letters.forEach((item) => {
    const { code } = item.dataset;
    const letter = item;
    if (settings.caps) {
      letter.textContent = keysObj[code][lang].shiftOff.toUpperCase();
    } else {
      letter.textContent = keysObj[code][lang].shiftOff;
    }
  });
};

const onActiveShift = (shifts, letters) => {
  shifts.forEach((shift) => {
    shift.addEventListener('mousedown', () => {
      shift.classList.add('pressed');
      toUpperCase(letters);
    });

    shift.addEventListener('mouseup', () => {
      shift.classList.remove('pressed');
      toLowerCase(letters);
    });

    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      if (e.code === shift.dataset.code) {
        shift.classList.add('pressed');
        toUpperCase(letters);
      }
    });
    document.addEventListener('keyup', (e) => {
      e.preventDefault();
      if (e.code === shift.dataset.code) {
        shift.classList.remove('pressed');
        toLowerCase(letters);
      }
    });
  });
};

const toggleCapsLock = (letters) => {
  settings.caps = !settings.caps;
  letters.forEach((item) => {
    const letter = item;
    if (settings.caps) {
      letter.textContent = letter.textContent.toUpperCase();
    } else {
      letter.textContent = letter.textContent.toLowerCase();
    }
  });
};

const onActiveCapsLock = (capsLock, letters) => {
  capsLock.addEventListener('mousedown', () => {
    capsLock.classList.add('pressed');
    capsLock.classList.toggle('active');
    toggleCapsLock(letters);
  });
  capsLock.addEventListener('mouseup', () => {
    capsLock.classList.remove('pressed');
  });

  let isPressed = false;
  document.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.code === 'CapsLock') {
      if (!isPressed) {
        capsLock.classList.add('pressed');
        capsLock.classList.toggle('active');
        toggleCapsLock(letters);
        isPressed = true;
      }
    }
  });

  document.addEventListener('keyup', (e) => {
    e.preventDefault();
    if (e.code === 'CapsLock') {
      capsLock.classList.remove('pressed');
      isPressed = false;
    }
  });
};

const toggleLanguage = (letters) => {
  const lang = settings.language === 'en' ? 'ru' : 'en';

  letters.forEach((item) => {
    const { code } = item.dataset;
    const letter = item;
    if (settings.caps) {
      letter.textContent = keysObj[code][lang].shiftOff.toUpperCase();
    } else {
      letter.textContent = keysObj[code][lang].shiftOff;
    }
  });

  if (localStorage.getItem('language')) {
    localStorage.language = lang;
  } else {
    localStorage.setItem('language', lang);
  }
  settings.language = lang;
};

const changeLanguage = (ctrlBtn, altBtn, letters) => {
  const btnCodes = [ctrlBtn.dataset.code, altBtn.dataset.code];
  const pressedBtns = new Set();

  document.addEventListener('keydown', (e) => {
    pressedBtns.add(e.code);

    for (let i = 0; i < btnCodes.length; i += 1) {
      if (!pressedBtns.has(btnCodes[i])) {
        return;
      }
    }
    pressedBtns.clear();
    toggleLanguage(letters);
  });

  document.addEventListener('keyup', (e) => {
    pressedBtns.delete(e.code);
  });
};

const onBtnDown = (textareaElememt, elem) => {
  const { type } = elem.dataset;
  const textarea = textareaElememt;

  const startSelection = textarea.selectionStart;
  const endSelection = textarea.selectionEnd;
  const valueLength = textarea.value.length;
  const valueBefore = textarea.value.slice(0, startSelection);
  const valueAfter = textarea.value.slice(endSelection);

  if (type === 'standart') {
    textarea.value = valueBefore + elem.textContent + valueAfter;
    textarea.focus();
    const position = startSelection + elem.textContent.length;
    textarea.setSelectionRange(position, position);
  }

  if (type === 'backspace') {
    if (startSelection !== endSelection) {
      textarea.value = textarea.value.slice(0, startSelection) + valueAfter;
      textarea.focus();
      const position = startSelection;
      textarea.setSelectionRange(position, position);
    } else if (startSelection === 0) {
      return;
    } else {
      textarea.value = textarea.value.slice(0, startSelection - 1) + valueAfter;
      textarea.focus();
      const position = startSelection - 1;
      textarea.setSelectionRange(position, position);
    }
  }

  if (type === 'tab') {
    const insertText = '    ';
    textarea.value = valueBefore + insertText + valueAfter;
    textarea.focus();
    const position = startSelection + insertText.length;
    textarea.setSelectionRange(position, position);
  }

  if (type === 'delete') {
    if (startSelection === valueLength) {
      return;
    }
    if (startSelection !== endSelection) {
      textarea.value = textarea.value.slice(0, startSelection) + valueAfter;
      textarea.focus();
      const position = startSelection;
      textarea.setSelectionRange(position, position);
    } else {
      textarea.value = valueBefore + textarea.value.slice(endSelection + 1);
      textarea.focus();
      const position = startSelection;
      textarea.setSelectionRange(position, position);
    }
  }

  if (type === 'enter') {
    const insertText = '\n';
    textarea.value = valueBefore + insertText + valueAfter;
    textarea.focus();
    const position = startSelection + insertText.length;
    textarea.setSelectionRange(position, position);
  }

  if (type === 'space') {
    textarea.value = `${valueBefore} ${valueAfter}`;
    textarea.focus();
    const position = startSelection + 1;
    textarea.setSelectionRange(position, position);
  }

  if (type === 'arrows') {
    textarea.value = valueBefore + elem.textContent + valueAfter;
    textarea.focus();
    const position = startSelection + elem.textContent.length;
    textarea.setSelectionRange(position, position);
  }
};

const createKeyboard = () => {
  const main = document.createElement('main');
  main.classList.add('main');
  const container = document.createElement('div');
  container.classList.add('container');
  const textarea = document.createElement('textarea');
  textarea.classList.add('textarea');
  textarea.setAttribute('type', 'text');
  textarea.autofocus = true;
  const keyboard = document.createElement('div');
  keyboard.classList.add('keyboard');
  const title = document.createElement('h1');
  title.innerText = 'The keyboard was created on Windows. \n To switch the language, press left ctrl + alt';

  document.body.append(main);
  main.append(container);
  container.append(title, textarea, keyboard);

  const keys = createKeys();
  keyboard.append(keys);

  const letters = document.querySelectorAll('[data-type="standart"]');
  const shiftBtns = document.querySelectorAll('[data-type="shift"]');
  const capsLockBtn = document.querySelector('[data-type="capsLock"]');
  const ctrlLeftBtn = document.querySelector('[data-type="controlLeft"]');
  const altLeftBtn = document.querySelector('[data-type="altLeft"]');
  onActiveShift(shiftBtns, letters);
  onActiveCapsLock(capsLockBtn, letters);
  changeLanguage(ctrlLeftBtn, altLeftBtn, letters);

  container.addEventListener('mousedown', (e) => {
    if (e.target.closest('.key-btn')) {
      const pressedElem = e.target.closest('.key-btn');
      pressedElem.classList.add('pressed');
      onBtnDown(textarea, pressedElem);
    }
  });
  container.addEventListener('mouseup', (e) => {
    if (e.target.closest('.key-btn')) {
      const pressedElem = e.target.closest('.key-btn');
      pressedElem.classList.remove('pressed');
      textarea.focus();
    }
  });
  document.addEventListener('keydown', (e) => {
    e.preventDefault();
    const pressedBtn = document.querySelector(`[data-code="${e.code}"]`);
    if (pressedBtn) {
      pressedBtn.classList.add('pressed');
      onBtnDown(textarea, pressedBtn);
    }
  });
  document.addEventListener('keyup', (e) => {
    e.preventDefault();
    const pressedBtn = document.querySelector(`[data-code="${e.code}"]`);
    if (pressedBtn) {
      pressedBtn.classList.remove('pressed');
    }
  });
};

window.onload = () => {
  createKeyboard();
};

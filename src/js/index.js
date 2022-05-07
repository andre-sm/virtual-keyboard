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
  });
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

  const shiftBtns = document.querySelectorAll('[data-type="shift"]');
  const letters = document.querySelectorAll('[data-type="standart"]');
  onActiveShift(shiftBtns, letters);
};

window.onload = () => {
  createKeyboard();
};

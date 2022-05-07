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
    fragment.append(keyBtn);
  });
  return fragment;
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
};

window.onload = () => {
  createKeyboard();
};

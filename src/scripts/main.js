'use strict';
let leftClicked = false;
let rightClicked = false;
const firstPromise = new Promise((resolve, reject) => {
  const clickHandler = (e) => {
    if (e.button === 0) {
      resolve('First promise resolved on left click');
      document.removeEventListener('click', clickHandler);
    }
  };
  document.addEventListener('click', clickHandler);
  setTimeout(() => {
    reject(new Error('First promise rejected after 3s'));
    document.removeEventListener('click', clickHandler);
  }, 3000);
});
const secondPromise = new Promise((resolve) => {
  const clickHandler = (e) => {
    if (e.button === 0 || e.button === 2) {
      resolve('Second promise resolved');
      document.removeEventListener('click', clickHandler);
      document.removeEventListener('contextmenu', clickHandler);
    }
  };
  document.addEventListener('click', clickHandler);
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    clickHandler(e);
  });
});
const thirdPromise = new Promise((resolve) => {
  const checkBoth = () => {
    if (leftClicked && rightClicked) {
      resolve('Third promise resolved after both clicks');
      document.removeEventListener('click', leftHandler);
      document.removeEventListener('contextmenu', rightHandler);
    }
  };
  const leftHandler = (e) => {
    if (e.button === 0) {
      leftClicked = true;
      checkBoth();
    }
  };
  const rightHandler = (e) => {
    if (e.button === 2) {
      e.preventDefault();
      rightClicked = true;
      checkBoth();
    }
  };
  document.addEventListener('click', leftHandler);
  document.addEventListener('contextmenu', rightHandler);
});
const handleSuccess = (message) => {
  const div = document.createElement('div');
  div.dataset.qa = 'notification';
  div.className = 'success';
  div.textContent = message;
  document.body.appendChild(div);
};
const handleError = (err) => {
  const div = document.createElement('div');
  div.dataset.qa = 'notification';
  div.className = 'error';
  div.textContent = err?.message || String(err);
  document.body.appendChild(div);
};
firstPromise.then(handleSuccess).catch(handleError);
secondPromise.then(handleSuccess);
thirdPromise.then(handleSuccess);

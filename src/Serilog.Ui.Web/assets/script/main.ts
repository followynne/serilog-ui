import { initTokenUi, updateJwtToken } from './authentication';
import { changePageByModalChoice } from './pagination';

const initListenersAndDynamicInfo = () => {
  // on jwt save/clear
  document.querySelector('#saveJwt').addEventListener('click', updateJwtToken);

  // enable changePage button
  document
    .querySelector('.custom-pagination-submit')
    .addEventListener('click', changePageByModalChoice);
};

const initHomeButton = () => {
  var homeButton = document.querySelector<HTMLAnchorElement>('#homeAnchor');

  if (window?.config?.homeUrl && window.config.homeUrl != homeButton.href) {
    homeButton.href = window?.config?.homeUrl;
  }
};

const init = () => {
  initListenersAndDynamicInfo();
  initTokenUi();
  initHomeButton();
};

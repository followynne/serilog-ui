import { changePageByModalChoice } from './pagination';

const initListenersAndDynamicInfo = () => {
  // enable changePage button
  document
    .querySelector('.custom-pagination-submit')
    .addEventListener('click', changePageByModalChoice);
};

const init = () => {
  initListenersAndDynamicInfo();
};

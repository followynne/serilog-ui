// import * as $ from 'jquery';
import { isAfter } from 'date-fns';
import { printPagination } from './pagination';
import {
  cleanHtmlTags,
  fixedLengthMessageWithModal,
  printDate,
  printXmlCode,
  getBgLogLevel,
} from './util';
import { AuthType, LogLevel, SearchForm, SearchResult } from '../types/types';

import { AuthPropertiesSingleton } from './Authorization/AuthProperties';

const onFetchLogs = (data: SearchResult) => {
  const tableBody = document.querySelector('#logTable tbody');
  tableBody.innerHTML = '';

  if (!data.logs) return;

  const logStrings: string[] = [];
  data.logs.forEach((log) => {
    logStrings.push(`<tr class="${log.level}">
            <td class="text-center">${log.rowNo}</td>
            <td class="text-center"><span class="log-level text-white ${getBgLogLevel(
              LogLevel[log.level],
            )}">${log.level}</span></td>
            <td class="text-center">${printDate(log.timestamp)}</td>
            <td class="log-message">
                <span class="overflow-auto"><truncate length="100">${fixedLengthMessageWithModal(
                  cleanHtmlTags(log.message),
                  100,
                )}</truncate></span>
            </td>
            <td class="text-center">
                ${exceptionLog(log.exception)}
            </td>
            <td class="text-center">
                <a href="#" class="modal-trigger" title="Click to view" data-type="${
                  log.propertyType
                }">
                    View <span style="display: none">${log.properties}</span>
                </a>
            </td>
        </tr>`);
  });
  tableBody.innerHTML = logStrings.join('');
  attachOpenDetailsModal();
  updateSearchResultInfo(data);
  printPagination(data.total, data.count, data.currentPage);
};

// open an objectDetails modal
const attachOpenDetailsModal = () => {
  document.querySelectorAll('.modal-trigger').forEach((i) =>
    i.addEventListener('click', (e) => {
      e.preventDefault();

      const modalBody = document.querySelector('#messageModal .modal-body');
      const dataType = i.getAttribute('data-type');
      const messageSpan = i.querySelector('span');
      let message = i.querySelector('span').textContent;

      if (dataType === 'xml') {
        const htmlMsg = messageSpan.innerHTML;
        message = printXmlCode(htmlMsg, '  ');
        messageSpan.textContent = message;
        modalBody.classList.remove('wrapped');
      } else if (dataType === 'json') {
        const prop = JSON.parse(message);
        message = JSON.stringify(prop, null, 2);
        messageSpan.textContent = message;
        modalBody.classList.remove('wrapped');
      } else {
        modalBody.classList.add('wrapped');
      }

      modalBody.querySelector('pre').textContent = message;

      const modal = $('#messageModal');
      modal.modal('show');
      $('.stacktrace').netStack({
        prettyprint: true,
      });
    }),
  );
};

export const updateSearchResultInfo = (data: SearchResult) => {
  document.querySelector('#totalLogs').textContent = data.total.toString();
  document.querySelector('#showingItemsStart').textContent =
    data.currentPage.toString();
  document.querySelector('#showingItemsEnd').textContent =
    data.count.toString();
};

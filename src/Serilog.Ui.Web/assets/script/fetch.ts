import * as $ from 'jquery';
import { isAfter } from 'date-fns';
import { printPagination } from './pagination';
import {
  cleanHtmlTags,
  fixedLengthMessageWithModal,
  formatDate,
  formatXml,
  getBgLogLevel,
} from './util';
import { AuthPropertiesSingleton } from './authentication';
import { AuthType, LogLevel, SearchForm, SearchResult } from '../types/types';
import { setTimeout } from 'timers/promises';

// TODO convert to async
export const fetchKeys = () => {
  // TODO deduplicate auth logic into method
  const token = sessionStorage.getItem('serilogui_token');
  const isWindowsAuth = AuthPropertiesSingleton.authType !== AuthType.Windows;
  const headers: Headers = new Headers();
  if (isWindowsAuth) headers.set('Authorization', token);

  const host = ['development', 'test'].includes(process.env.NODE_ENV)
    ? ''
    : location.pathname.replace('/index.html', '');
  const url = `${host}/api/keys`;

  return fetch(url, {
    headers,
    credentials: isWindowsAuth ? 'include' : 'same-origin',
  })
    .then((req) => {
      if (req.ok) return req.json() as Promise<string[]>;
      return Promise.reject({
        status: req.status,
        message: 'Failed to fetch.',
      });
    })
    .catch((error) => {
      console.warn(error);
      if (error.status === 403) {
        alert(
          "You are not authorized you to access logs.\r\nYou are not logged in or you don't have enough permissions to perform the requested operation.",
        );
        return [] as string[];
      }
      alert(error.message);
      return [] as string[];
    });
};

export const fetchLogs = (values: SearchForm, page: number) => {
  console.log(values, page);

  const prepareUrl = prepareSearchUrl(values, page);
  if (!prepareUrl.areDatesAdmitted) return;

  const token = sessionStorage.getItem('serilogui_token');
  const isWindowsAuth = AuthPropertiesSingleton.authType !== AuthType.Windows;
  const headers: Headers = new Headers();
  if (isWindowsAuth) headers.set('Authorization', token);
  return (
    fetch(prepareUrl.url, {
      headers,
      credentials: isWindowsAuth ? 'include' : 'same-origin',
    })
      .then((req) => {
        if (req.ok) return req.json() as Promise<SearchResult>;
        return Promise.reject({
          status: req.status,
          message: 'Failed to fetch.',
        });
      })
      // .then(onFetchLogs)
      .catch((error) => {
        console.warn(error);
        if (error.status === 403) {
          alert(
            "You are not authorized you to access logs.\r\nYou are not logged in or you don't have enough permissions to perform the requested operation.",
          );
          return;
        }
        alert(error.message);
      })
  );
};

const prepareSearchUrl = (input: SearchForm, identifiedPage?: number) => {
  const {
    startDate,
    endDate,
    table: key,
    entriesPerPage: count,
    level,
    search: searchTerm,
  } = input;
  const page = identifiedPage ?? 1;

  if (startDate && endDate) {
    if (isAfter(startDate, endDate)) {
      alert('Start date cannot be greater than end date');
      return { areDatesAdmitted: false, url: '' };
    }
  }

  // TODO: review dates parsing
  const startAsString = startDate?.toISOString() || '';
  const endAsString = endDate?.toISOString() || '';
  const host = ['development', 'test'].includes(process.env.NODE_ENV)
    ? ''
    : location.pathname.replace('/index.html', '');
  const url = `${host}/api/logs?&key=${key}&page=${page}&count=${count}&level=${level}&search=${searchTerm}&startDate=${startAsString}&endDate=${endAsString}`;
  return { areDatesAdmitted: true, url };
};

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
            <td class="text-center">${formatDate(log.timestamp)}</td>
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

const exceptionLog = (exception?: string) =>
  !exception
    ? ''
    : `<a href="#" title="Click to view" class="modal-trigger" data-type="text">
        View <span style="display: none">${exception}
    </span></a>`;

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
        message = formatXml(htmlMsg, '  ');
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

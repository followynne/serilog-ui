import { isAfter } from 'date-fns';
import { type SearchResult, type SearchForm } from '../../types/types';
import { isDefinedGuard } from '../util/guards';
import { createAuthHeaders, determineHost } from '../util/queries';
import { AuthProperties } from '../Authorization/AuthProperties';

export const fetchLogs = async (values: SearchForm, page: number, bearerToken: string) => {
  console.log(values, page);

  const prepareUrl = prepareSearchUrl(values, page);
  if (!prepareUrl.areDatesAdmitted) return;

  const authProps = new AuthProperties();
  console.log(authProps);
  // const token = sessionStorage.getItem('serilogui_token');

  try {
    const req = await fetch(prepareUrl.url, createAuthHeaders(authProps));
    if (req.ok) return (await req.json()) as SearchResult;

    return await Promise.reject(new Error('Failed to fetch.'));

    // TODO: .then(onFetchLogs)
  } catch (error) {
    console.warn(error);
    if (error.status === 403) {
      alert(
        "You are not authorized you to access logs.\r\nYou are not logged in or you don't have enough permissions to perform the requested operation.",
      );
      return;
    }
    alert(error.message);
  }
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

  if (isDefinedGuard(startDate) && isDefinedGuard(endDate)) {
    if (isAfter(startDate, endDate)) {
      alert('Start date cannot be greater than end date');
      return { areDatesAdmitted: false, url: '' };
    }
  }

  // TODO: review dates parsing
  const startAsString = startDate?.toISOString() || '';
  const endAsString = endDate?.toISOString() || '';

  // TODO change url creation to include query params only if value defined...
  const url = `${determineHost}/api/logs?&key=${key}&page=${page}&count=${count}&level=${level}&search=${searchTerm}&startDate=${startAsString}&endDate=${endAsString}`;
  return { areDatesAdmitted: true, url };
};

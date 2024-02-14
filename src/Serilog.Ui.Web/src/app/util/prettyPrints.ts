import { MantineColorScheme, type MantineTheme } from '@mantine/core';
import { BundledTheme, CodeOptionsMultipleThemes, codeToHtml } from 'shiki';
import formatXml from 'xml-formatter';
import { LogLevel, LogType } from '../../types/types';
import {
  formatLocalDate,
  formatLocalSplitDate,
  formatUtcDate,
  formatUtcSplitDate,
} from './dates';

export const serilogUiUrl = 'https://github.com/serilog-contrib/serilog-ui';

export const getBgLogLevel = (
  theme: MantineTheme,
  colorScheme: MantineColorScheme,
  logLevel: LogLevel,
): string => {
  switch (logLevel) {
    case LogLevel.Verbose:
      return colorScheme === 'dark' ? theme.colors.green[9] : theme.colors.green[7];
    case LogLevel.Debug:
      return colorScheme === 'dark' ? theme.colors.blue[9] : theme.colors.blue[4];
    case LogLevel.Information:
      return colorScheme === 'dark' ? theme.colors.blue[6] : theme.colors.blue[3];
    case LogLevel.Warning:
      return colorScheme === 'dark' ? theme.colors.yellow[9] : theme.colors.yellow[5];
    case LogLevel.Error:
      return colorScheme === 'dark' ? theme.colors.red[6] : theme.colors.red[4];
    case LogLevel.Fatal:
      return colorScheme === 'dark' ? theme.colors.red[9] : theme.colors.red[8];
    default:
      return theme.colors.cyan[0];
  }
};

export const printDate = (date: string, utc?: boolean) =>
  utc ? formatUtcDate(date) : formatLocalDate(date);

export const splitPrintDate = (date: string, utc?: boolean) =>
  utc ? formatUtcSplitDate(date) : formatLocalSplitDate(date);

const shikijiThemes: CodeOptionsMultipleThemes<BundledTheme> = {
  themes: {
    light: 'tokyo-night',
    dark: 'night-owl',
  },
};
export const renderCodeContent = async (
  contentType: string = '',
  modalContent: string,
) => {
  if (!modalContent?.trim() || !Object.values(LogType).includes(contentType as LogType))
    return modalContent;

  try {
    if (contentType === LogType.Xml) {
      const xmlResult = formatXml(modalContent, { forceSelfClosingEmptyTag: true });
      return await codeToHtml(xmlResult, {
        lang: 'xml',
        ...shikijiThemes,
        mergeWhitespaces: true,
      });
    }

    if (contentType === LogType.Json) {
      const jsonResult = JSON.stringify(JSON.parse(modalContent), null, 4) ?? '{}';
      return await codeToHtml(jsonResult, { lang: 'json', ...shikijiThemes });
    }
  } catch {
    console.warn(`${modalContent} is not a valid json!`);
    return `Content could not be parsed, as per expected type: ${contentType}`;
  }
};

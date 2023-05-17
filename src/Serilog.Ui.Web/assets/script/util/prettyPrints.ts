import { parseJSON, format } from 'date-fns';

export const printDate = (date: string) =>
  format(parseJSON(date), 'PP H:mm:ss.SSS', { weekStartsOn: 1 });

export const printXmlCode = (xml: string, tab = '\t') => {
  let formatted = '';
  let indent = '';
  xml.split(/>\s*</).forEach((node) => {
    // decrease indent by one "tab"
    if (node.match(/^\/\w/) != null) indent = indent.substring(tab.length);
    formatted += indent + '<' + node + '>\r\n';
    // increase indent
    if (node.match(/^<?\w[^>]*[^/]$/) != null) indent += tab;
  });
  return formatted.substring(1, formatted.length - 3);
};

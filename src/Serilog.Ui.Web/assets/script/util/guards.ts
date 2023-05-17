// https://stackoverflow.com/a/64940749/15129749
export const isDefinedGuard = <T>(value?: T | null): value is T => value !== null;

export const isStringGuard = (value?: string | boolean): value is string =>
  (value ?? '') !== '';

export const isArrayGuard = <T>(value?: T[]): value is T[] => (value?.length ?? 0) > 0;

export const isObjectGuard = (value?: object): value is object => {
  throw new Error('TODO to be implemented with better type');
};

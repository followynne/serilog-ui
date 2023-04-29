import { createFormContext } from '@mantine/form';
import { type SearchForm } from '../../types/types.ts';

// You can give context variables any name
export const [SearchFormProvider, useSearchFormContext, useSearchForm] =
  createFormContext<SearchForm>();

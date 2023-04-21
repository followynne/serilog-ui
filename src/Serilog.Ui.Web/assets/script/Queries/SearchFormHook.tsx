import { createFormContext } from '@mantine/form';
import { SearchForm } from '../../types/types';

// You can give context variables any name
export const [SearchFormProvider, useSearchFormContext, useSearchForm] =
  createFormContext<SearchForm>();

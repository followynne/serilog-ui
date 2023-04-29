import { type SearchForm } from '../../types/types.ts';
import { SearchFormProvider, useSearchForm } from '../Hooks/SearchFormContext.tsx';
import Search from './Search/Search.tsx';
import SerilogResults from './Table/Table.tsx';

const formInitialValues: SearchForm = {
  table: '',
  entriesPerPage: 10,
  level: null,
  startDate: null,
  endDate: null,
  search: '',
};

const AppBody = () => {
  const methods = useSearchForm({
    initialValues: formInitialValues,
    validate: {},
  });
  return (
    <>
      <SearchFormProvider form={methods}>
        <Search />
        <SerilogResults />
      </SearchFormProvider>
    </>
  );
};

export default AppBody;

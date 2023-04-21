import { SearchForm } from '../../types/types';
import { SearchFormProvider, useSearchForm } from '../Queries/SearchFormHook';
import Search from './Search/Search';
import SerilogResults from './Table/Table';

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

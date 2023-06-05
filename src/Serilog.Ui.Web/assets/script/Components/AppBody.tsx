import { type SearchForm } from '../../types/types';
import { SearchFormProvider, useSearchForm } from '../Hooks/SearchFormContext';
import Paging from './Search/Paging';
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
    validate: {}, // TODO?
  });
  return (
    <>
      <SearchFormProvider form={methods}>
        <Search />
        <Paging />
        <SerilogResults />
        <Paging />
      </SearchFormProvider>
    </>
  );
};

export default AppBody;

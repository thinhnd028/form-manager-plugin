import { Page, } from '@strapi/strapi/admin';
import { Route, Routes } from 'react-router-dom';

import { HomePage } from './HomePage';
import { CreateSalesforceFormPage } from './SalesforceForm/CreateSalesforceFormPage';
import { EditSalesforceFormPage } from './SalesforceForm/EditSalesforceFormPage';
import { ViewFormSubmission } from './ViewFormSubmission';

const App = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="submission/:id" element={<ViewFormSubmission />} />
      <Route path="salesforce-form/create" element={<CreateSalesforceFormPage />} />
      <Route path="salesforce-form/edit/:id" element={<EditSalesforceFormPage />} />
      <Route path="*" element={<Page.Error />} />
    </Routes>
  );
};

export { App };

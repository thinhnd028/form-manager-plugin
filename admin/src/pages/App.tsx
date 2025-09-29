import { Box, Flex, Main, Typography } from '@strapi/design-system';
import { Page } from '@strapi/strapi/admin';
import { NavLink, Route, Routes } from 'react-router-dom';

import { HomePage } from './HomePage';
import SalesforceForm from './SalesforceForm';
import { CreateSalesforceFormPage } from './SalesforceForm/CreateSalesforceFormPage';
import { EditSalesforceFormPage } from './SalesforceForm/EditSalesforceFormPage';
import { ViewFormSubmission } from './ViewFormSubmission';

const App = () => {
  return (
    <Main>
      <Box
        background="neutral0"
        style={{
          borderBottom: '1px solid #e5e5e5',
          padding: '24px 36px'
        }}
      >
        <Box>
          <Typography variant="alpha" textColor="neutral800" marginBottom={2}>
            Form Manager
          </Typography>
        </Box>
        <Box marginBottom={2}>
          <Typography variant="pi" textColor="neutral600">
            Manage Salesforce forms and submissions
          </Typography>
        </Box>
        <Flex gap={4} wrap="wrap">
          <NavLink
            to="."
            end
            style={({ isActive }) => ({
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: isActive ? '#7b79ff' : 'transparent',
              color: isActive ? 'white' : '#32324d',
              textDecoration: 'none',
              fontWeight: isActive ? '600' : '500',
              border: '1px solid #dcdce4',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              minHeight: '36px'
            })}
          >
            <Typography variant="pi">Form Submissions</Typography>
          </NavLink>
          <NavLink
            to="forms"
            style={({ isActive }) => ({
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: isActive ? '#7b79ff' : 'transparent',
              color: isActive ? 'white' : '#32324d',
              textDecoration: 'none',
              fontWeight: isActive ? '600' : '500',
              border: '1px solid #dcdce4',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              minHeight: '36px'
            })}
          >
            <Typography variant="pi">Salesforce Forms</Typography>
          </NavLink>
        </Flex>
      </Box>

      <Box padding={8}>
        <Box style={{ width: '100%' }}>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="forms" element={<SalesforceForm />} />
            <Route path="submission/:id" element={<ViewFormSubmission />} />
            <Route path="salesforce-form/create" element={<CreateSalesforceFormPage />} />
            <Route path="salesforce-form/edit/:id" element={<EditSalesforceFormPage />} />
            <Route path="*" element={<Page.Error />} />
          </Routes>
        </Box>
      </Box>
    </Main>
  );
};

export { App };

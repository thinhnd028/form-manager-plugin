import { Box, Flex, Main, Tabs, Typography } from '@strapi/design-system';
import FormSubmission from './FormSubmission';
import SalesforceForm from './SalesforceForm';

const HomePage = () => {
  return (
    <Main>
      <Box padding={8} paddingBottom={0} margin={20}>
        <Flex justifyContent="space-between" alignItems="flex-start" marginBottom={4}>
          <Box>
            <Typography variant="alpha">Form Manager</Typography>
            <Box>
              <Typography variant="epsilon">Manage Salesforce Forms</Typography>
            </Box>
          </Box>
        </Flex>
        <Tabs.Root defaultValue="submissions" variant='simple'>
          <Tabs.List aria-label="Manage your attribute">
            <Tabs.Trigger value="submissions">Submissions</Tabs.Trigger>
            <Tabs.Trigger value="forms">Forms</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="submissions">
            <Box padding={4} style={{ backgroundColor: 'white' }}>
              <FormSubmission />
            </Box>
          </Tabs.Content>
          <Tabs.Content value="forms">
            <Box padding={4} style={{ backgroundColor: 'white' }}>
              <SalesforceForm />
            </Box>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Main>
  );
};

export { HomePage };

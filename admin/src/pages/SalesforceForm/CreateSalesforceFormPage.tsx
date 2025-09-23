import { Box, Button, Field, Flex, Grid, IconButton, JSONInput, Link, Main, Switch, Typography } from '@strapi/design-system';
import { ArrowLeft, Plus, Trash } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocaleSelector } from '../../components/LocaleSelector';

interface SalesforceFormData {
  id?: number;
  formName: string;
  endpointUrl: string;
  oid: string;
  retUrl: string;
  fieldMappings: Record<string, string>;
  fieldConfigs: Record<string, any>;
  active: boolean;
  locale?: string;
  submissions?: any[];
  createdAt?: string;
  updatedAt?: string;
}

const CreateSalesforceFormPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [selectedLocale, setSelectedLocale] = useState<string>('');
  const { post } = useFetchClient();

  const [formData, setFormData] = useState<SalesforceFormData>({
    formName: '',
    endpointUrl: '',
    oid: '',
    retUrl: '',
    fieldConfigs: {
      field_1: {
        type: 'text',
        label: 'Field 1',
        required: true,
        regex: '/^[a-zA-Z0-9]+$/',
      },
      field_2: {
        type: 'text',
        label: 'Field 2',
        required: true,
      },
    },
    fieldMappings: {
      field_1: 'field_1',
    },
    active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = selectedLocale
        ? `/form-manager-plugin/salesforce-forms?locale=${selectedLocale}`
        : '/form-manager-plugin/salesforce-forms';

      const response = await post(url, {
        data: formData
      });

      console.log('Form created successfully:', response.data);
      navigate(-1);
    } catch (err) {
      console.error('Error creating form:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create salesforce form'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const addFieldMapping = () => {
    if (newFieldKey && newFieldValue) {
      setFormData(prev => ({
        ...prev,
        fieldMappings: {
          ...prev.fieldMappings,
          [newFieldKey]: newFieldValue
        }
      }));
      setNewFieldKey('');
      setNewFieldValue('');
    }
  };

  const removeFieldMapping = (key: string) => {
    setFormData(prev => {
      const newMappings = { ...prev.fieldMappings };
      delete newMappings[key];
      return {
        ...prev,
        fieldMappings: newMappings
      };
    });
  };

  return (
    <Main padding={8}>
      <Box paddingBottom={4} margin={20}>
        <Link
          href='/admin/plugins/form-manager-plugin'
          startIcon={<ArrowLeft />}
          style={{ marginBottom: 16 }}
        >
          <Typography variant="epsilon">Back</Typography>
        </Link>
        <Flex justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="alpha">Create New Salesforce Form</Typography>
            <Box>
              <Typography variant="epsilon">Configure a new Salesforce form handler</Typography>
            </Box>
          </Box>
          <LocaleSelector
            onLocaleChange={setSelectedLocale}
            currentLocale={selectedLocale}
          />
        </Flex>
      </Box>
      <form onSubmit={handleSubmit}>
        <Flex gap={4} alignItems="flex-start">
          <Box padding={4} style={{ backgroundColor: 'white', flex: 1 }}>
            {error && (
              <Box paddingBottom={4}>
                <Typography textColor="danger600">Error: {error}</Typography>
              </Box>
            )}
            <Grid.Root gap={4} gridCols={12}>
              {/* Basic Information */}
              <Grid.Item col={12}>
                <Typography variant="beta">
                  Basic Information
                </Typography>
              </Grid.Item>

              <Grid.Item col={5}>
                <Field.Root name="formName" required style={{ width: '100%' }}>
                  <Field.Label>Form Name</Field.Label>
                  <Field.Input
                    value={formData.formName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, formName: e.target.value }))}
                    placeholder="e.g., sign-up-form"
                  />
                </Field.Root>
              </Grid.Item>

              <Grid.Item col={5}>
                <Field.Root name="active" style={{ width: '100%' }}>
                  <Field.Label>Active</Field.Label>
                  <Switch
                    checked={formData.active}
                    onCheckedChange={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                    onLabel="Form is active"
                    offLabel="Form is inactive"
                  />
                </Field.Root>
              </Grid.Item>

              {/* Salesforce Configuration */}
              <Grid.Item col={12} marginTop={3}>
                <Typography variant="beta">
                  Salesforce Configuration
                </Typography>
              </Grid.Item>

              <Grid.Item col={12}>
                <Field.Root name="endpointUrl" style={{ width: '100%' }}>
                  <Field.Label>Endpoint URL</Field.Label>
                  <Field.Input
                    value={formData.endpointUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, endpointUrl: e.target.value }))}
                    placeholder="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8"
                  />
                </Field.Root>
              </Grid.Item>

              <Grid.Item col={5}>
                <Field.Root name="oid" style={{ width: '100%' }}>
                  <Field.Label>Organization ID (OID)</Field.Label>
                  <Field.Input
                    value={formData.oid}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, oid: e.target.value }))}
                    placeholder="00D000000000000"
                  />
                </Field.Root>
              </Grid.Item>

              <Grid.Item col={5}>
                <Field.Root name="retUrl" style={{ width: '100%' }}>
                  <Field.Label>Return URL</Field.Label>
                  <Field.Input
                    value={formData.retUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, retUrl: e.target.value }))}
                    placeholder="https://yoursite.com/thank-you"
                  />
                </Field.Root>
              </Grid.Item>

              {/* Field Mappings */}
              <Grid.Item col={12}>
                <Flex direction="column" gap={2} alignItems={'flex-start'}>
                  <Typography variant="beta">
                    Field Mappings
                  </Typography>
                  <Typography variant="pi" textColor="neutral600">
                    Map your form fields to Salesforce fields
                  </Typography>
                </Flex>
              </Grid.Item>

              {Object.entries(formData.fieldMappings).map(([key, value]) => (
                <Grid.Item col={12} key={key}>
                  <Grid.Root gap={2} gridCols={12} style={{ width: '100%' }}>
                    <Grid.Item col={5}>
                      <Field.Root name="formFieldName" style={{ width: '100%' }}>
                        <Field.Label>Form field name</Field.Label>
                        <Field.Input
                          value={key}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newMappings = { ...formData.fieldMappings };
                            delete newMappings[key];
                            newMappings[e.target.value] = value;
                            setFormData(prev => ({ ...prev, fieldMappings: newMappings }));
                          }}
                          placeholder="Form field name"
                        />
                      </Field.Root>
                    </Grid.Item>
                    <Grid.Item col={5}>
                      <Field.Root name="salesforceFieldName" style={{ width: '100%' }}>
                        <Field.Label>Salesforce field name</Field.Label>
                        <Field.Input
                          value={value}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newMappings = { ...formData.fieldMappings };
                            delete newMappings[key];
                            newMappings[key] = e.target.value;
                            setFormData(prev => ({ ...prev, fieldMappings: newMappings }));
                          }}
                          placeholder="Salesforce field name"
                        />
                      </Field.Root>
                    </Grid.Item>
                    <Grid.Item col={2} paddingTop={5}>
                      <IconButton
                        withTooltip={false}
                        label='Remove field mapping'
                        onClick={() => removeFieldMapping(key)}
                        variant='danger'
                      >
                        <Trash />
                      </IconButton>
                    </Grid.Item>
                  </Grid.Root>
                </Grid.Item>
              ))}

              {/* Add New Field Mapping */}
              <Grid.Item col={12}>
                <Box style={{ width: '100%' }}>
                  <Typography variant="pi" textColor="neutral600" marginBottom={4}>
                    Add new field mapping:
                  </Typography>
                  <Grid.Root gap={2} gridCols={12} style={{ width: '100%' }}>
                    <Grid.Item col={5}>
                      <Field.Root name="formFieldName" style={{ width: '100%' }}>
                        <Field.Label>Form field name</Field.Label>
                        <Field.Input
                          value={newFieldKey}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFieldKey(e.target.value)}
                          placeholder="Form field name"
                        />
                      </Field.Root>
                    </Grid.Item>
                    <Grid.Item col={5}>
                      <Field.Root name="salesforceFieldName" style={{ width: '100%' }}>
                        <Field.Label>Salesforce field name</Field.Label>
                        <Field.Input
                          value={newFieldValue}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFieldValue(e.target.value)}
                          placeholder="Salesforce field name"
                        />
                      </Field.Root>
                    </Grid.Item>
                    <Grid.Item col={2} paddingTop={5}>
                      <IconButton
                        withTooltip={false}
                        label='Add field mapping'
                        onClick={addFieldMapping}
                        disabled={!newFieldKey || !newFieldValue}
                        variant='success'
                      >
                        <Plus />
                      </IconButton>
                    </Grid.Item>
                  </Grid.Root>
                </Box>
              </Grid.Item>

              <Grid.Item col={12} marginTop={3}>
                <Typography variant="beta">
                  Field Configuration
                </Typography>
              </Grid.Item>

              <Grid.Item col={12}>
                <Field.Root id="with_field" style={{ width: '100%' }}>
                  <Field.Label>Field Configuration</Field.Label>
                  <JSONInput
                    aria-label="JSON"
                    width="100%"
                    minHeight="235px"
                    value={JSON.stringify(formData.fieldConfigs, null, 2)}
                    onChange={(value) => setFormData(prev => ({ ...prev, fieldConfigs: JSON.parse(value) }))}
                  />
                  <Field.Error />
                  <Field.Hint />
                </Field.Root>
              </Grid.Item>
            </Grid.Root>
          </Box>
          <Flex padding={4} style={{ backgroundColor: 'white', width: '300px', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
            <Typography variant="delta">Entry</Typography>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              fullWidth
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </form>
    </Main>
  );
};

export { CreateSalesforceFormPage };

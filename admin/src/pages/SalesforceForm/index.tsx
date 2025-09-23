import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  SearchForm,
  Searchbar,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
} from '@strapi/design-system';
import { Pencil, Plus, Trash } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocaleSelector } from '../../components/LocaleSelector';

interface SalesforceForm {
  id: number;
  formName: string;
  endpointUrl: string;
  oid: string;
  retUrl?: string;
  fieldMappings: Record<string, string>;
  active: boolean;
  locale?: string;
}

export default function SalesforceForm() {
  const navigate = useNavigate();
  const [forms, setForms] = useState<SalesforceForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const { get, del } = useFetchClient();
  const [selectedLocale, setSelectedLocale] = useState<string>('');

  const handleLocaleChange = (locale: string) => {
    setSelectedLocale(locale);
  };

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await get(`/form-manager-plugin/salesforce-forms?locale=${selectedLocale}`);

      setForms(response.data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch salesforce forms');
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();

    if (!searchValue.trim()) {
      fetchForms();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const filteredForms = forms.filter(form =>
        form.formName.toLowerCase().includes(searchValue.toLowerCase()) ||
        form.endpointUrl.toLowerCase().includes(searchValue.toLowerCase()) ||
        form.oid.toLowerCase().includes(searchValue.toLowerCase())
      );

      setForms(filteredForms);
    } catch (err) {
      setError('Failed to search forms');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const form = forms.find(f => f.id === id);
    const formName = form?.formName || 'this form';

    if (!window.confirm(`Are you sure you want to delete "${formName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await del(`/form-manager-plugin/salesforce-forms/${id}`);

      await fetchForms();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete form');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    fetchForms();
  };

  useEffect(() => {
    fetchForms();
  }, [selectedLocale]);

  if (loading) {
    return (
      <Box padding={8} margin={20}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding={8} margin={20}>
        <Typography textColor="danger600">Error: {error}</Typography>
        <Button onClick={fetchForms} style={{ marginTop: 16 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justifyContent="space-between" marginBottom={4}>
        <SearchForm onSubmit={handleSearch}>
          <Searchbar
            size="S"
            name="searchbar"
            onClear={handleClearSearch}
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchValue(e.target.value)
            }
            clearLabel="Clearing the search"
            placeholder="e.g: form name, endpoint URL, OID"
          >
            Searching for Salesforce forms
          </Searchbar>
        </SearchForm>
        <Flex gap={2}>
          <LocaleSelector
            onLocaleChange={handleLocaleChange}
            currentLocale={selectedLocale}
          />
          <Button startIcon={<Plus />} onClick={() => navigate('/plugins/form-manager-plugin/salesforce-form/create')}>
            Create New Form
          </Button>
        </Flex>
      </Flex>
      <Table colCount={5} rowCount={forms.length}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma" textColor="neutral600">Form Name</Typography>
            </Th>
            <Th>
              <Typography variant="sigma" textColor="neutral600">Endpoint URL</Typography>
            </Th>
            <Th>
              <Typography variant="sigma" textColor="neutral600">OID</Typography>
            </Th>
            <Th>
              <Typography variant="sigma" textColor="neutral600">Status</Typography>
            </Th>
            <Th>
              <Typography variant="sigma" textColor="neutral600">Field Mappings</Typography>
            </Th>
            <Th>
              <Flex justifyContent="flex-end">
                <Typography variant="sigma" textColor="neutral600" textAlign="right">Actions</Typography>
              </Flex>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {forms.map((form) => (
            <Tr key={form.id}>
              <Td>
                <Typography fontWeight="semiBold">
                  {form.formName}
                </Typography>
              </Td>
              <Td>
                <Typography
                  textColor="neutral800"
                  style={{ wordBreak: 'break-all' }}
                >
                  {form.endpointUrl}
                </Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  {form.oid}
                </Typography>
              </Td>
              <Td>
                <Badge>
                  {form.active ? 'Active' : 'Inactive'}
                </Badge>
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  {Object.keys(form.fieldMappings || {}).length} fields
                </Typography>
              </Td>
              <Td>
                <Flex gap={2} justifyContent="flex-end">
                  <IconButton
                    label='Edit'
                    withTooltip={false}
                    onClick={() => navigate(`/plugins/form-manager-plugin/salesforce-form/edit/${form.id}`)}
                  >
                    <Pencil />
                  </IconButton>
                  <IconButton
                    label='Delete'
                    withTooltip={false}
                    onClick={() => handleDelete(form.id)}
                  >
                    <Trash />
                  </IconButton>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

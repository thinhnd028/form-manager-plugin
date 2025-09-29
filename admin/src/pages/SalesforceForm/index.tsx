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
  Typography
} from '@strapi/design-system';
import { Pencil, Plus, Trash } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocaleSelector } from '../../components/LocaleSelector';

export interface SalesforceForm {
  id: number;
  formName: string;
  endpointUrl: string;
  oid: string;
  retUrl?: string;
  fieldConfigs: { [key: string]: any }[];
  active: boolean;
  locale?: string;
}

export default function SalesforceForm() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<SalesforceForm[]>([]);
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

      setRows(response.data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch salesforce forms');
      setRows([]);
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

      const filteredForms = rows.filter(form =>
        form.formName.toLowerCase().includes(searchValue.toLowerCase()) ||
        form.endpointUrl.toLowerCase().includes(searchValue.toLowerCase()) ||
        form.oid.toLowerCase().includes(searchValue.toLowerCase())
      );

      setRows(filteredForms);
    } catch (err) {
      setError('Failed to search forms');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const form = rows.find(f => f.id === id);
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
      <Flex justifyContent="center" alignItems="center" padding={8}>
        <Typography textColor="neutral600">Loading Salesforce forms...</Typography>
      </Flex>
    );
  }

  if (error) {
    return (
      <Box padding={6} background="danger100" borderRadius="4px" style={{ border: '1px solid #f56565' }}>
        <Typography textColor="danger600" fontWeight="semiBold" marginBottom={3}>
          Error loading Salesforce forms
        </Typography>
        <Typography textColor="danger600" marginBottom={4}>
          {error}
        </Typography>
        <Button onClick={fetchForms} variant="secondary">
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Flex justifyContent="space-between" wrap="wrap" gap={4} marginBottom={4}>
        <Box flex="1" minWidth="200px" maxWidth="300px">
          <SearchForm onSubmit={handleSearch}>
            <Searchbar
              size="S"
              name="searchbar"
              onClear={handleClearSearch}
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchValue(e.target.value)
              }
              clearLabel="Clear search"
              placeholder="Search by form name, URL, or OID..."
            >
              Search Salesforce forms
            </Searchbar>
          </SearchForm>
        </Box>
        <Flex gap={4} alignItems="center" wrap="wrap">
          <Box>
            <LocaleSelector
              onLocaleChange={handleLocaleChange}
              currentLocale={selectedLocale}
            />
          </Box>
          <Button
            startIcon={<Plus />}
            onClick={() => navigate('/plugins/form-manager-plugin/salesforce-form/create')}
          >
            Create New Form
          </Button>
        </Flex>
      </Flex>
      <Table colCount={5} rowCount={rows.length}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma" textColor="neutral600">ID</Typography>
            </Th>
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
              <Typography variant="sigma" textColor="neutral600">Salesforce Active</Typography>
            </Th>
            <Th>
              <Typography variant="sigma" textColor="neutral600">Field Mappings</Typography>
            </Th>
            <Th>
              <Typography variant="sigma" textColor="neutral600">Locale</Typography>
            </Th>
            <Th>
              <Typography variant="sigma" textColor="neutral600" textAlign="right">Actions</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row) => (
            <Tr key={row.id}>
              <Td>
                <Typography fontWeight="semiBold">
                  {row.id}
                </Typography>
              </Td>
              <Td>
                <Typography fontWeight="semiBold">
                  {row.formName}
                </Typography>
              </Td>
              <Td>
                <Typography
                  textColor="neutral800"
                  style={{ wordBreak: 'break-all' }}
                >
                  {row.endpointUrl}
                </Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  {row.oid}
                </Typography>
              </Td>
              <Td>
                <Badge
                  size='S'
                  backgroundColor={row.active ? 'success100' : 'danger100'}
                  textColor={row.active ? 'success600' : 'danger600'}
                >
                  {row.active ? 'Active' : 'Inactive'}
                </Badge>
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  {Object.keys(row.fieldConfigs || {}).length} fields
                </Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  {row.locale}
                </Typography>
              </Td>
              <Td>
                <Flex gap={2} justifyContent="flex-end">
                  <IconButton
                    withTooltip={false}
                    label="Edit form"
                    onClick={() => navigate(`/plugins/form-manager-plugin/salesforce-form/edit/${row.id}`)}
                    variant="tertiary"
                  >
                    <Pencil />
                  </IconButton>
                  <IconButton
                    withTooltip={false}
                    label="Delete form"
                    onClick={() => handleDelete(row.id)}
                    variant="danger-light"
                  >
                    <Trash />
                  </IconButton>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}

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
import { Eye, Trash } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocaleSelector } from '../../components/LocaleSelector';

interface FormSubmission {
  id: number;
  form: {
    formName: string;
  };
  fullName: string;
  email: string;
  payload: Record<string, any>;
  salesforceResponse: Record<string, any>;
  status: string;
  errorMessage: string;
  createdAt: string;
  updatedAt: string;
  locale?: string;
}

export default function FormSubmission() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<FormSubmission[]>([]);
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

      const url = selectedLocale
        ? `/form-manager-plugin/form-submissions?locale=${selectedLocale}`
        : '/form-manager-plugin/form-submissions';

      const response = await get(url);

      setRows(response.data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch form submissions');
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

      // Filter forms based on search value
      const filteredForms = rows.filter(form =>
        form?.form?.formName?.toLowerCase().includes(searchValue.toLowerCase())
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

    if (!window.confirm(`Are you sure you want to delete "${form?.id}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await del(`/form-manager-plugin/form-submissions/${id}`);

      await fetchForms(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete form submission');
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
            placeholder="e.g: form name"
          >
            Searching for form submissions
          </Searchbar>
        </SearchForm>
        <LocaleSelector
          onLocaleChange={handleLocaleChange}
          currentLocale={selectedLocale}
        />
      </Flex>
      <Table colCount={7} rowCount={rows.length}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma" textColor="neutral600">ID</Typography>
            </Th>
            <Th>
              <Typography variant="sigma" textColor="neutral600">Form</Typography>
            </Th>
            <Th>
              <Typography variant="sigma" textColor="neutral600">Full Name</Typography>
            </Th>
            <Th>
              <Typography variant="sigma" textColor="neutral600">Email</Typography>
            </Th>
            <Th>
              <Typography variant="sigma" textColor="neutral600">Payload</Typography>
            </Th>
            <Th>
              <Typography variant="sigma" textColor="neutral600">Status</Typography>
            </Th>
            <Th>
              <Typography variant="sigma" textColor="neutral600">Created At</Typography>
            </Th>
            <Th>
              <Typography variant="sigma" textColor="neutral600" textAlign="right">Actions</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((form) => (
            <Tr key={form.id}>
              <Td>
                <Typography fontWeight="semiBold">
                  {form.id}
                </Typography>
              </Td>
              <Td>
                <Typography fontWeight="semiBold">
                  {form?.form?.formName || 'N/A'}
                </Typography>
              </Td>
              <Td>
                <Typography fontWeight="semiBold">
                  {form.fullName}
                </Typography>
              </Td>
              <Td>
                <Typography fontWeight="semiBold">
                  {form.email}
                </Typography>
              </Td>
              <Td>
                <Typography
                  textColor="neutral800"
                  style={{
                    fontFamily: 'monospace',
                    width: '300px',          // 👈 dùng width thay vì maxWidth
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',        // 👈 đảm bảo là block để text-overflow hoạt động
                  }}
                >
                  {JSON.stringify(form.payload)}
                </Typography>
              </Td>
              <Td>
                <Badge>
                  {form.status}
                </Badge>
              </Td>
              <Td>
                <Typography fontWeight="semiBold">
                  {new Date(form.createdAt).toLocaleString()}
                </Typography>
              </Td>
              <Td>
                <Flex gap={2}>
                  <IconButton
                    label='View'
                    withTooltip={false}
                    onClick={() => navigate(`submission/${form.id}`)}
                  >
                    <Eye />
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
};
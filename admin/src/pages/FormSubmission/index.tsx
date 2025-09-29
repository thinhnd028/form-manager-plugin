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
import { Eye, Trash } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatusVariant } from '../ViewFormSubmission';

interface FormSubmission {
  id: number;
  form: {
    formName: string;
  };
  fullName: string;
  email: string;
  payload: Record<string, any>;
  salesforceResponse: Record<string, any>;
  salesforceStatus: string;
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

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await get(`/form-manager-plugin/form-submissions`);

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

      await fetchForms();
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
  }, []);

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" padding={8}>
        <Typography textColor="neutral600">Loading form submissions...</Typography>
      </Flex>
    );
  }

  if (error) {
    return (
      <Box padding={6} background="danger100" borderRadius="4px" style={{ border: '1px solid #f56565' }}>
        <Typography textColor="danger600" fontWeight="semiBold" marginBottom={3}>
          Error loading form submissions
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
              placeholder="Search by form name..."
            >
              Search form submissions
            </Searchbar>
          </SearchForm>
        </Box>
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
              <Typography variant="sigma" textColor="neutral600"> Salesforce Status</Typography>
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
          {rows.map((row) => (
            <Tr key={row.id}>
              <Td>
                <Typography fontWeight="semiBold">
                  {row.id}
                </Typography>
              </Td>
              <Td>
                <Typography fontWeight="semiBold">
                  {row?.form?.formName || 'N/A'}
                </Typography>
              </Td>
              <Td>
                <Typography fontWeight="semiBold">
                  {row.fullName}
                </Typography>
              </Td>
              <Td>
                <Typography fontWeight="semiBold">
                  {row.email}
                </Typography>
              </Td>
              <Td>
                <Badge
                  size='S'
                  backgroundColor={getStatusVariant(row.salesforceStatus) + '100'}
                  textColor={getStatusVariant(row.salesforceStatus) + '600'}
                >
                  {row.salesforceStatus.toUpperCase()}
                </Badge>
              </Td>
              <Td>
                <Typography fontWeight="semiBold">
                  {new Date(row.createdAt).toLocaleString()}
                </Typography>
              </Td>
              <Td>
                <Flex gap={2} justifyContent="flex-end">
                  <IconButton
                    withTooltip={false}
                    label="View submission"
                    onClick={() => navigate(`/plugins/form-manager-plugin/submission/${row.id}`)}
                    variant="tertiary"
                  >
                    <Eye />
                  </IconButton>
                  <IconButton
                    withTooltip={false}
                    label="Delete submission"
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

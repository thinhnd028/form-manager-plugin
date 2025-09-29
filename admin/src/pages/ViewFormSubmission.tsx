import { Badge, Box, Button, Flex, Grid, Link, Main, Typography } from '@strapi/design-system';
import { ArrowLeft } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SalesforceForm } from './SalesforceForm';

export interface FormSubmission {
  id: number;
  form: SalesforceForm;
  payload: Record<string, any>;
  salesforceResponse: Record<string, any>;
  salesforceStatus: 'pending' | 'success' | 'error';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export const getStatusVariant = (status: string) => {
  switch (status) {
    case 'success':
      return 'success';
    case 'error':
      return 'danger';
    case 'pending':
      return 'warning';
    default:
      return 'secondary';
  }
};

const ViewFormSubmission = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const { get } = useFetchClient();

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!id) {
        setError('Submission ID is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await get(`/form-manager-plugin/form-submissions/${id}`);
        setSubmission(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch form submission.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id, get]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" padding={8}>
        <Typography textColor="neutral600">Loading form data...</Typography>
      </Flex>
    );
  }

  if (error || !submission) {
    return (
      <Main padding={5}>
        <Box paddingBottom={4} margin={20}>
          <Typography variant="alpha">Error</Typography>
          <Box paddingTop={2}>
            <Typography textColor="danger600">
              {error || 'Form submission not found'}
            </Typography>
            <Button
              onClick={() => navigate(-1)}
              startIcon={<ArrowLeft />}
              style={{ marginTop: 16 }}
            >
              Go Back
            </Button>
          </Box>
        </Box>
      </Main>
    );
  }

  return (
    <>
      <Flex direction="column" alignItems="start" marginBottom={4}>
        <Link
          href='/admin/plugins/form-manager-plugin'
          startIcon={<ArrowLeft />}
        >
          <Typography variant="epsilon">Back</Typography>
        </Link>
        <Flex justifyContent={'space-between'} alignItems="center" width={'100%'}>
          <Typography variant="alpha" textColor="neutral800">
            Submission ID: {submission.id}
          </Typography>
        </Flex>
      </Flex>

      <Grid.Root gap={4} gridCols={12}>
        {/* Status and Basic Info */}
        <Grid.Item col={12}>
          <Box background="neutral0" padding={4} shadow="table" borderRadius="0.25rem" style={{ width: '100%' }} >
            <Typography variant="beta">
              Status & Basic Information
            </Typography>

            <Grid.Root gap={4} marginTop={4}>
              <Grid.Item col={6}>
                <Flex gap={2} alignItems="center">
                  <Typography variant="pi" textColor="neutral600">
                    Status
                  </Typography>
                  <Badge
                    size='S'
                    backgroundColor={getStatusVariant(submission.salesforceStatus) + '100'}
                    textColor={getStatusVariant(submission.salesforceStatus) + '600'}
                  >
                    {submission.salesforceStatus.toUpperCase()}
                  </Badge>
                </Flex>
              </Grid.Item>

              <Grid.Item col={6}>
                <Flex gap={2} alignItems="center">
                  <Typography variant="pi" textColor="neutral600">
                    Form Name
                  </Typography>
                  <Typography variant='omega'>
                    {submission.form?.formName || 'N/A'}
                  </Typography>
                </Flex>
              </Grid.Item>

              <Grid.Item col={6}>
                <Flex gap={2} alignItems="center">
                  <Typography variant="pi" textColor="neutral600">
                    Created At
                  </Typography>
                  <Typography variant='omega'>
                    {formatDate(submission.createdAt)}
                  </Typography>
                </Flex>
              </Grid.Item>

              <Grid.Item col={6}>
                <Flex gap={2} alignItems="center">
                  <Typography variant="pi" textColor="neutral600">
                    Updated At
                  </Typography>
                  <Typography variant='omega'>
                    {formatDate(submission.updatedAt)}
                  </Typography>
                </Flex>
              </Grid.Item>
            </Grid.Root>
          </Box>
        </Grid.Item>

        {/* Form Configuration */}
        <Grid.Item col={12}>
          <Box background="neutral0" padding={4} shadow="table" borderRadius="0.25rem" style={{ width: '100%' }}>
            <Typography variant="beta">
              Form Configuration
            </Typography>

            <Grid.Root gap={4} marginTop={4}>
              <Grid.Item col={12}>
                <Flex gap={2} alignItems="center">
                  <Typography variant="pi" textColor="neutral600">
                    Endpoint URL
                  </Typography>
                  <Typography variant='omega'>
                    {submission.form?.endpointUrl || 'N/A'}
                  </Typography>
                </Flex>
              </Grid.Item>

              <Grid.Item col={6}>
                <Flex gap={2} alignItems="center">
                  <Typography variant="pi" textColor="neutral600">
                    Organization ID (OID)
                  </Typography>
                  <Typography variant='omega'>
                    {submission.form?.oid || 'N/A'}
                  </Typography>
                </Flex>
              </Grid.Item>
            </Grid.Root>
          </Box>
        </Grid.Item>

        {/* Form Payload */}
        <Grid.Item col={12}>
          <Box background="neutral0" padding={4} shadow="table" borderRadius="0.25rem" style={{ width: '100%' }}>
            <Typography variant="beta">
              Form Payload
            </Typography>

            <Box
              marginTop={4}
              background="neutral100"
              padding={3}
              borderRadius="0.25rem"
            >
              <Typography variant='omega'>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(submission.payload, null, 2)}
                </pre>
              </Typography>
            </Box>
          </Box>
        </Grid.Item>

        {/* Salesforce Response */}
        <Grid.Item col={12}>
          <Box background="neutral0" padding={4} shadow="table" borderRadius="0.25rem" style={{ width: '100%' }}>
            <Typography variant="beta">
              Salesforce Response
            </Typography>

            <Box
              marginTop={4}
              background="neutral100"
              padding={3}
              borderRadius="0.25rem"
            >
              <Typography variant='omega'>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(submission.salesforceResponse, null, 2)}
                </pre>
              </Typography>
            </Box>
          </Box>
        </Grid.Item>

        {/* Error Message (if any) */}
        {submission.salesforceStatus === 'error' && submission.errorMessage && (
          <Grid.Item col={12}>
            <Box
              marginTop={4}
              background="danger100"
              padding={4}
              shadow="table"
              borderRadius="0.25rem"
              borderColor="danger500"
            >
              <Typography variant="beta" textColor="danger600">
                Error Details
              </Typography>

              <Box
                marginTop={4}
                background="neutral0"
                padding={3}
                borderRadius="0.25rem"
              >
                <Typography variant='omega'>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {submission.errorMessage}
                  </pre>
                </Typography>
              </Box>
            </Box>
          </Grid.Item>
        )}
      </Grid.Root>
    </>
  );
};

export { ViewFormSubmission };

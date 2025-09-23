import { Badge, Box, Button, Grid, Main, Typography } from '@strapi/design-system';
import { ArrowLeft, Check, Clock } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface FormSubmission {
  id: number;
  form: {
    formName: string;
    endpointUrl: string;
    oid: string;
  };
  payload: Record<string, any>;
  salesforceResponse: Record<string, any>;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

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
        console.error('Error fetching form submission:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to fetch form submission.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id, get]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Check color="success600" />;
      case 'error':
        return <Clock color="danger600" />;
      case 'pending':
        return <Clock color="warning600" />;
      default:
        return <Clock color="neutral600" />;
    }
  };

  const getStatusVariant = (status: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Main padding={5}>
        <Box paddingBottom={4} margin={20}>
          <Typography variant="alpha">Loading Form Submission...</Typography>
        </Box>
      </Main>
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
    <Main padding={5}>
      <Box paddingBottom={4} margin={20}>
        <Box marginBottom={3}>
          <Button
            variant="tertiary"
            startIcon={<ArrowLeft />}
            onClick={() => navigate(-1)}
            style={{ marginBottom: 16 }}
          >
            Back to Submissions
          </Button>
        </Box>

        <Typography variant="alpha">Form Submission Details</Typography>
        <Box>
          <Typography variant="epsilon">
            Submission ID: {submission.id}
          </Typography>
        </Box>
      </Box>

      <Box padding={4}>
        <Grid.Root gap={4}>
          {/* Status and Basic Info */}
          <Grid.Item col={12}>
            <Box background="neutral0" padding={4} shadow="table" borderRadius="0.25rem">
              <Typography variant="beta" marginBottom={3}>
                Status & Basic Information
              </Typography>

              <Grid.Root gap={4}>
                <Grid.Item col={6}>
                  <Box marginBottom={2}>
                    <Typography variant="pi" textColor="neutral600" marginBottom={1}>
                      Status
                    </Typography>
                    <Badge
                      color={getStatusVariant(submission.status)}
                    >
                      {submission.status.toUpperCase()}
                    </Badge>
                  </Box>
                </Grid.Item>

                <Grid.Item col={6}>
                  <Box marginBottom={2}>
                    <Typography variant="pi" textColor="neutral600" marginBottom={1}>
                      Form Name
                    </Typography>
                    <Typography fontWeight="semiBold">
                      {submission.form?.formName || 'N/A'}
                    </Typography>
                  </Box>
                </Grid.Item>

                <Grid.Item col={6}>
                  <Box marginBottom={2}>
                    <Typography variant="pi" textColor="neutral600" marginBottom={1}>
                      Created At
                    </Typography>
                    <Typography>
                      {formatDate(submission.createdAt)}
                    </Typography>
                  </Box>
                </Grid.Item>

                <Grid.Item col={6}>
                  <Box marginBottom={2}>
                    <Typography variant="pi" textColor="neutral600" marginBottom={1}>
                      Updated At
                    </Typography>
                    <Typography>
                      {formatDate(submission.updatedAt)}
                    </Typography>
                  </Box>
                </Grid.Item>
              </Grid.Root>
            </Box>
          </Grid.Item>

          {/* Form Configuration */}
          <Grid.Item col={12}>
            <Box background="neutral0" padding={4} shadow="table" borderRadius="0.25rem">
              <Typography variant="beta" marginBottom={3}>
                Form Configuration
              </Typography>

              <Grid.Root gap={4}>
                <Grid.Item col={12}>
                  <Box marginBottom={2}>
                    <Typography variant="pi" textColor="neutral600" marginBottom={1}>
                      Endpoint URL
                    </Typography>
                    <Typography
                      style={{
                        wordBreak: 'break-all',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem'
                      }}
                    >
                      {submission.form?.endpointUrl || 'N/A'}
                    </Typography>
                  </Box>
                </Grid.Item>

                <Grid.Item col={6}>
                  <Box marginBottom={2}>
                    <Typography variant="pi" textColor="neutral600" marginBottom={1}>
                      Organization ID (OID)
                    </Typography>
                    <Typography
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.875rem'
                      }}
                    >
                      {submission.form?.oid || 'N/A'}
                    </Typography>
                  </Box>
                </Grid.Item>
              </Grid.Root>
            </Box>
          </Grid.Item>

          {/* Form Payload */}
          <Grid.Item col={12}>
            <Box background="neutral0" padding={4} shadow="table" borderRadius="0.25rem">
              <Typography variant="beta" marginBottom={3}>
                Form Payload
              </Typography>

              <Box
                background="neutral100"
                padding={3}
                borderRadius="0.25rem"
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  overflow: 'auto'
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(submission.payload, null, 2)}
                </pre>
              </Box>
            </Box>
          </Grid.Item>

          {/* Salesforce Response */}
          <Grid.Item col={12}>
            <Box background="neutral0" padding={4} shadow="table" borderRadius="0.25rem">
              <Typography variant="beta" marginBottom={3}>
                Salesforce Response
              </Typography>

              <Box
                background="neutral100"
                padding={3}
                borderRadius="0.25rem"
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  overflow: 'auto'
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(submission.salesforceResponse, null, 2)}
                </pre>
              </Box>
            </Box>
          </Grid.Item>

          {/* Error Message (if any) */}
          {submission.status === 'error' && submission.errorMessage && (
            <Grid.Item col={12}>
              <Box
                background="danger100"
                padding={4}
                shadow="table"
                borderRadius="0.25rem"
                borderColor="danger500"
              >
                <Typography variant="beta" marginBottom={3} textColor="danger600">
                  Error Details
                </Typography>

                <Box
                  background="neutral0"
                  padding={3}
                  borderRadius="0.25rem"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    overflow: 'auto'
                  }}
                >
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {submission.errorMessage}
                  </pre>
                </Box>
              </Box>
            </Grid.Item>
          )}
        </Grid.Root>
      </Box>
    </Main>
  );
};

export { ViewFormSubmission };

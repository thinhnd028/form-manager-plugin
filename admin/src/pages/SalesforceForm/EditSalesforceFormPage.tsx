import { Badge, Box, Button, Field, Flex, Grid, IconButton, Link, Switch, Typography } from '@strapi/design-system';
import { ArrowLeft, Hashtag, Pencil, Plus, Trash } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ModalAddField } from './ModalAddField';

interface SalesforceFormData {
  id?: number;
  formKey: string;
  formName: string;
  endpointUrl: string;
  oid: string;
  retUrl: string;
  fieldConfigs: Record<string, any>[];
  active: boolean;
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
}

const EditSalesforceFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editValues, setEditValues] = useState<{ [key: string]: any }>({});
  const { get, put } = useFetchClient();
  const [loadingData, setLoadingData] = useState(true);
  const [entryName, setEntryName] = useState<string>('');

  const [formData, setFormData] = useState<SalesforceFormData>({
    id: undefined,
    formKey: '',
    formName: '',
    endpointUrl: '',
    oid: '',
    retUrl: '',
    fieldConfigs: [],
    active: true,
    locale: undefined,
    createdAt: undefined,
    updatedAt: undefined
  });

  // Fetch form data on component mount
  useEffect(() => {
    const fetchFormData = async () => {
      if (!id) {
        setError('Form ID is required');
        setLoadingData(false);
        return;
      }

      try {
        setLoadingData(true);
        setError(null);

        const response = await get(`/form-manager-plugin/salesforce-forms/${id}`);
        const form = response.data.data;

        setFormData({
          formKey: form.formKey,
          formName: form.formName,
          endpointUrl: form.endpointUrl,
          oid: form.oid,
          retUrl: form.retUrl,
          fieldConfigs: form.fieldConfigs,
          active: form.active || false,
          createdAt: form.createdAt,
          updatedAt: form.updatedAt
        });
        setEntryName(form.formName);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch form data');
      } finally {
        setLoadingData(false);
      }
    };

    fetchFormData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.formName.trim() || !formData.formKey.trim()) {
      setError('Form name and key are required');
      setLoading(false);
      return;
    }

    try {
      await put(
        `/form-manager-plugin/salesforce-forms/${id}`,
        { data: formData }
      );
      alert('Form updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update form. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  const addFieldConfig = () => {
    setFormData(prev => ({ ...prev, fieldConfigs: [...prev.fieldConfigs, editValues] }));
    setEditValues({});
    setShowModal(false);
  };

  const removeFieldConfig = (name: string) => {
    setFormData(prev => {
      const newConfigs = [...prev.fieldConfigs.filter((config: any) => config.name !== name)];
      return {
        ...prev,
        fieldConfigs: newConfigs
      };
    });
  };

  if (loadingData) {
    return (
      <Flex justifyContent="center" alignItems="center" padding={8}>
        <Typography textColor="neutral600">Loading form data...</Typography>
      </Flex>
    );
  }

  if (error && !formData.formName) {
    return (
      <Box padding={6} background="danger100" borderRadius="4px" style={{ border: '1px solid #f56565' }}>
        <Typography textColor="danger600" fontWeight="semiBold" marginBottom={3}>
          Error loading form data
        </Typography>
        <Typography textColor="danger600" marginBottom={4}>
          {error}
        </Typography>
        <Button onClick={() => navigate(-1)} variant="secondary">
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Flex direction="column" alignItems="start" marginBottom={4}>
        <Link
          href='/admin/plugins/form-manager-plugin/forms'
          startIcon={<ArrowLeft />}
        >
          <Typography variant="epsilon">Back</Typography>
        </Link>
        <Flex justifyContent={'space-between'} alignItems="center" width={'100%'}>
          <Typography variant="alpha" textColor="neutral800">
            {entryName}
          </Typography>
        </Flex>
      </Flex>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Flex gap={6} alignItems="flex-start" justifyContent="center">
          <Box
            background="neutral0"
            padding={6}
            borderRadius="4px"
            style={{
              border: '1px solid #e5e5e5',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              flex: 1
            }}
          >
            {error && (
              <Box
                padding={4}
                background="danger100"
                borderRadius="4px"
                style={{
                  border: '1px solid #f56565',
                  marginBottom: 16
                }}
              >
                <Typography textColor="danger600" fontWeight="semiBold">
                  Error: {error}
                </Typography>
              </Box>
            )}
            <Grid.Root gap={4} gridCols={12}>
              {/* Basic Information */}
              <Grid.Item col={12}>
                <Typography variant="beta">
                  Basic Information
                </Typography>
              </Grid.Item>

              <Grid.Item col={6}>
                <Field.Root name="formKey" required style={{ width: '100%' }}>
                  <Field.Label>Form Key</Field.Label>
                  <Field.Input
                    value={formData.formKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, formKey: e.target.value }))}
                    placeholder="e.g., sign-up-form"
                  />
                </Field.Root>
              </Grid.Item>

              <Grid.Item col={6}>
                <Field.Root name="formName" required style={{ width: '100%' }}>
                  <Field.Label>Form Name</Field.Label>
                  <Field.Input
                    value={formData.formName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, formName: e.target.value }))}
                    placeholder="e.g., sign-up-form"
                  />
                </Field.Root>
              </Grid.Item>

              <Grid.Item col={6}>
                <Field.Root name="active" style={{ width: '100%' }}>
                  <Field.Label>Salesforce Active</Field.Label>
                  <Switch
                    checked={formData.active}
                    onCheckedChange={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                    onLabel="Form is Salesforce active"
                    offLabel="Form is Salesforce inactive"
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

              <Grid.Item col={6}>
                <Field.Root name="oid" style={{ width: '100%' }}>
                  <Field.Label>Organization ID (OID)</Field.Label>
                  <Field.Input
                    value={formData.oid}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, oid: e.target.value }))}
                    placeholder="00D000000000000"
                  />
                </Field.Root>
              </Grid.Item>

              <Grid.Item col={6}>
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
              <Grid.Item col={12} marginTop={3}>
                <Flex justifyContent={'space-between'} alignItems={'end'} style={{ width: '100%' }}>
                  <Flex direction="column" alignItems={'flex-start'}>
                    <Typography variant="beta">
                      Field Mappings
                    </Typography>
                    <Typography variant="pi" textColor="neutral600">
                      Map your form fields to Salesforce fields
                    </Typography>
                  </Flex>
                  <Button
                    type='button'
                    size='S'
                    startIcon={<Plus />}
                    onClick={() => setShowModal(true)}
                  >
                    Add Field
                  </Button>
                </Flex>
              </Grid.Item>

              {formData.fieldConfigs.map((value: any, index: number) => (
                <React.Fragment key={index}>
                  {Array.isArray(value.fields)
                    ? <React.Fragment>
                      <Grid.Item col={12}>
                        <FieldCardGroup
                          {...value}
                          onEdit={() => {
                            setEditValues(value)
                            setShowModal(true)
                          }}
                          onRemove={() => removeFieldConfig(value.name)}
                        />
                      </Grid.Item>
                      {value.fields.map((v: any, index2: number) => (
                        <Grid.Item col={12} key={index2} paddingLeft={4}>
                          <FieldCard
                            {...v}
                            onEdit={() => {
                              setEditValues(v)
                              setShowModal(true)
                            }}
                            onRemove={() => removeFieldConfig(v.name)}
                          />
                        </Grid.Item>
                      ))}
                    </React.Fragment>
                    : <Grid.Item col={12}>
                      <FieldCard
                        {...value}
                        onEdit={() => {
                          setEditValues(value)
                          setShowModal(true)
                        }}
                        onRemove={() => removeFieldConfig(value.name)}
                      />
                    </Grid.Item>}
                </React.Fragment>
              ))}
            </Grid.Root>
          </Box>
          <Box
            background="neutral0"
            padding={6}
            borderRadius="4px"
            style={{
              border: '1px solid #e5e5e5',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              width: '300px'
            }}
          >
            <Flex alignItems={'start'} direction="column" gap={2}>
              <Typography variant="beta" textColor="neutral800">
                Actions
              </Typography>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                fullWidth
              >
                Save
              </Button>
              <Box>
                <Typography variant="pi" textColor="neutral600">
                  Created at {new Date(formData.createdAt || '').toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="pi" textColor="neutral600">
                  Updated at {new Date(formData.updatedAt || '').toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="pi" textColor="neutral600">
                  Locale {formData.locale}
                </Typography>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </form>
      <ModalAddField
        showModal={showModal}
        setShowModal={setShowModal}
        editValues={editValues}
        setEditValues={setEditValues}
        addFieldConfig={addFieldConfig}
      />
    </>
  );
};

const FieldCardGroup = ({ label, onEdit, onRemove }: { label: string, onEdit: () => void, onRemove: () => void }) => {
  return (
    <React.Fragment>
      <Flex
        justifyContent={'space-between'}
        alignItems={'start'}
        paddingBottom={2}
        style={{
          border: '1px solid #e5e5e5',
          borderRadius: '4px',
          width: '100%',
          padding: '16px 12px'
        }}
      >
        <Flex direction="column" gap={2} alignItems={'flex-start'}>
          <Typography variant="pi" textColor={'neutral600'}>{label}</Typography>
        </Flex>
        <Flex gap={2} justifyContent="flex-end">
          <IconButton
            withTooltip={false}
            type='button'
            label="Edit form"
            onClick={onEdit}
            variant="tertiary"
          >
            <Pencil />
          </IconButton>
          <IconButton
            withTooltip={false}
            type='button'
            label="Delete form"
            onClick={onRemove}
            variant="danger-light"
          >
            <Trash />
          </IconButton>
        </Flex>
      </Flex>
    </React.Fragment>
  );
};

const types = {
  'text': { icon: <Hashtag />, color: 'neutral' },
  'number': { icon: <Hashtag />, color: 'secondary' },
  'email': { icon: <Hashtag />, color: 'alternative' },
  'phone': { icon: <Hashtag />, color: 'success' },
  'date': { icon: <Hashtag />, color: 'warning' },
  'choice': { icon: <Hashtag />, color: 'danger' },
  'currency': { icon: <Hashtag />, color: 'primary' },
};

interface FieldCardProps {
  name: string;
  label: string;
  dataFormat: keyof typeof types;
  required: boolean;
  onEdit: () => void;
  onRemove: () => void;
  options?: string[];
  optionSource?: {
    url: string;
    matchField?: string;
    headers?: Record<string, string>;
    labelField: string;
  };
  dropdown?: boolean;
  multiple?: boolean;
  longText?: boolean;
}

const FieldCard = ({ name, label, required, dataFormat, onEdit, onRemove, options, optionSource, dropdown, multiple, longText }: FieldCardProps) => {
  return (
    <Flex
      justifyContent={'space-between'}
      alignItems={'start'}
      paddingBottom={2}
      style={{
        border: '1px solid #e5e5e5',
        borderRadius: '4px',
        width: '100%',
        padding: '16px 12px'
      }}
    >
      <Flex direction="column" gap={2} alignItems={'flex-start'}>
        <Flex alignItems={'center'} gap={2}>
          {types[dataFormat].icon}
          <Typography variant="sigma" color={'neutral800'}>{name}</Typography>
          <Badge
            size='S'
            backgroundColor={types[dataFormat].color + '100'}
            textColor={types[dataFormat].color + '600'}
          >
            {dataFormat}
          </Badge>
          {dropdown && <Badge size='S' backgroundColor='neutral600' textColor='white'>Dropdown</Badge>}
          {multiple && <Badge size='S' backgroundColor='neutral600' textColor='white'>Multiple</Badge>}
          {longText && <Badge size='S' backgroundColor='neutral600' textColor='white'>Long Text</Badge>}
          {required && <Badge size='S' backgroundColor='danger600' textColor='white'>Required</Badge>}
        </Flex>
        <Typography variant="pi" textColor={'neutral600'}>{label}</Typography>
        {Array.isArray(options)
          && options.length > 0
          && <Flex gap={2} alignItems={'center'} style={{ flexWrap: 'wrap' }}>
            <Typography variant="pi" textColor={'neutral600'}>Options:</Typography>
            {options.map((option: string, index: number) => (
              <Badge
                key={index}
                size='S'
                backgroundColor={'neutral100'}
                textColor={'neutral600'}
              >
                {option}
              </Badge>
            ))}
          </Flex>}
        {optionSource && <Flex direction="column" gap={2} alignItems={'flex-start'} style={{ flexWrap: 'wrap' }}>
          <Typography variant="pi" textColor={'neutral600'}>Option Source: {optionSource.url}</Typography>
          <Typography variant="pi" textColor={'neutral600'}>Match Field: {optionSource.matchField}</Typography>
          <Typography variant="pi" textColor={'neutral600'}>Label Field: {optionSource.labelField}</Typography>
          <Typography variant="pi" textColor={'neutral600'}>Headers:</Typography>
          <Typography variant="pi" textColor={'neutral600'}>
            <pre>{JSON.stringify(optionSource.headers, null, 2)}</pre>
          </Typography>
        </Flex>}
      </Flex>
      <Flex gap={2} justifyContent="flex-end">
        <IconButton
          withTooltip={false}
          type='button'
          label="Edit form"
          onClick={onEdit}
          variant="tertiary"
        >
          <Pencil />
        </IconButton>
        <IconButton
          withTooltip={false}
          type='button'
          label="Delete form"
          onClick={onRemove}
          variant="danger-light"
        >
          <Trash />
        </IconButton>
      </Flex>
    </Flex>
  );
};

export { EditSalesforceFormPage };

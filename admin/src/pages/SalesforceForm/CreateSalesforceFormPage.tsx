import { Badge, Box, Button, Field, Flex, Grid, IconButton, Link, Modal, SingleSelect, SingleSelectOption, Switch, Typography } from '@strapi/design-system';
import { ArrowLeft, Hashtag, Pencil, Plus, Trash } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';
import { useState } from 'react';
import { LocaleSelector } from '../../components/LocaleSelector';

interface SalesforceFormData {
  id?: number;
  formKey: string;
  formName: string;
  endpointUrl: string;
  oid: string;
  retUrl: string;
  fieldConfigs: { [key: string]: any }[];
  active: boolean;
  locale?: string;
  submissions?: any[];
  createdAt?: string;
  updatedAt?: string;
}

const CreateSalesforceFormPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editValues, setEditValues] = useState<{ [key: string]: any }>({});
  const [selectedLocale, setSelectedLocale] = useState<string>('');
  const { post } = useFetchClient();

  const [formData, setFormData] = useState<SalesforceFormData>({
    formKey: '',
    formName: '',
    endpointUrl: '',
    oid: '',
    retUrl: '',
    fieldConfigs: [],
    active: true,
    locale: selectedLocale
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!formData.formName.trim() || !formData.formKey.trim()) {
      setError('Form name and key are required');
      setLoading(false);
      return;
    }

    try {
      await post(
        `/form-manager-plugin/salesforce-forms`,
        { data: formData }
      );
      alert('Form created successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to create salesforce form');
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
            Create an entry
          </Typography>
          <LocaleSelector
            onLocaleChange={setSelectedLocale}
            currentLocale={selectedLocale}
          />
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
                <Grid.Item col={12} key={index}>
                  <FieldCard
                    {...value}
                    onEdit={() => {
                      setEditValues(value)
                      setShowModal(true)
                    }}
                    onRemove={() => removeFieldConfig(value.name)}
                  />
                </Grid.Item>
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
            </Flex>
          </Box>
        </Flex>
      </form>
      <Modal.Root open={showModal} onOpenChange={setShowModal}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Add Advanced Field Mapping</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Grid.Root gap={4} gridCols={12}>
              <Grid.Item col={6}>
                <Field.Root name="formField" required style={{ width: '100%' }}>
                  <Field.Label>Form Field</Field.Label>
                  <Field.Input
                    value={editValues?.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setEditValues(prev => ({ ...prev, formField: e.target.value }))
                    }}
                  />
                </Field.Root>
              </Grid.Item>
              <Grid.Item col={6}>
                <Field.Root name="salesforceField" required style={{ width: '100%' }}>
                  <Field.Label>Salesforce Field</Field.Label>
                  <Field.Input
                    value={editValues?.salesforceField}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setEditValues(prev => ({ ...prev, salesforceField: e.target.value }))
                    }}
                  />
                </Field.Root>
              </Grid.Item>
              <Grid.Item col={6}>
                <Field.Root name="dataFormat" required style={{ width: '100%' }}>
                  <Field.Label>Data Format</Field.Label>
                  <SingleSelect
                    value={editValues?.dataFormat}
                    onChange={(value) => {
                      setEditValues(prev => ({ ...prev, dataFormat: value }))
                      if (editValues && editValues.dataFormat === 'choice') {
                        editValues['options'] = ['']
                      } else {
                        let temp = { ...editValues };
                        delete temp['options'];
                        setEditValues(temp);
                      }
                    }}
                  >
                    <SingleSelectOption value="text">Text</SingleSelectOption>
                    <SingleSelectOption value="number">Number</SingleSelectOption>
                    <SingleSelectOption value="email">Email</SingleSelectOption>
                    <SingleSelectOption value="phone">Phone</SingleSelectOption>
                    <SingleSelectOption value="date">Date</SingleSelectOption>
                    <SingleSelectOption value="choice">Choice</SingleSelectOption>
                    <SingleSelectOption value="currency">Currency</SingleSelectOption>
                  </SingleSelect>
                </Field.Root>
              </Grid.Item>
              <Grid.Item col={6}>
                <Field.Root name="dependentField" required style={{ width: '100%' }}>
                  <Field.Label>Dependent Field</Field.Label>
                  <Field.Input
                    value={editValues?.dependentField}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setEditValues(prev => ({ ...prev, dependentField: e.target.value }))
                    }}
                  />
                </Field.Root>
              </Grid.Item>
              <Grid.Item col={12}>
                <Field.Label>Options</Field.Label>
                {editValues?.dataFormat === 'choice'
                  && Array.isArray(editValues?.options)
                  && editValues?.options.map((op, index) => (
                    <Flex key={op} gap={2} alignItems={'center'}>
                      <Field.Root name="option" required style={{ width: '100%' }}>
                        <Field.Input
                          value={op}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEditValues(prev => ({
                              ...prev,
                              options: prev.options.map((o: string, index: number) => index === op ? e.target.value : o)
                            }))
                          }}
                        />
                      </Field.Root>
                      <IconButton
                        withTooltip={false}
                        type='button'
                        label="Add option"
                        onClick={() => setEditValues(prev => ({
                          ...prev,
                          options: [...prev.options, editValues?.options[index]]
                        }))}
                      >
                        <Plus />
                      </IconButton>
                    </Flex>
                  ))}
              </Grid.Item>
              <Grid.Item col={12}>
                <Flex alignItems={'center'} gap={2}>
                  <Switch
                    checked={editValues?.required}
                    onCheckedChange={(checked) => {
                      setEditValues({
                        ...editValues,
                        required: checked
                      })
                    }}
                  />
                  <Typography variant="sigma" textColor="neutral600">Required</Typography>
                </Flex>
              </Grid.Item>
            </Grid.Root>
          </Modal.Body>
          <Modal.Footer justifyContent={'flex-end'} gap={2}>
            <Modal.Close>
              <Button variant="tertiary" type='button'>Cancel</Button>
            </Modal.Close>
            <Button onClick={addFieldConfig} type='button'>Confirm</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
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
}

const FieldCard = ({ name, label, required, dataFormat, onEdit, onRemove, options }: FieldCardProps) => {
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
          <Hashtag />
          <Typography variant="sigma" color={'neutral800'}>{name}</Typography>
          <Badge
            size='S'
            backgroundColor={types[dataFormat].color + '100'}
            textColor={types[dataFormat].color + '600'}
          >
            {dataFormat}
          </Badge>
          {required && <Badge size='S' backgroundColor='danger600' textColor='white'>Required</Badge>}
        </Flex>
        <Typography variant="pi" textColor={'neutral600'}>{label}</Typography>
        {Array.isArray(options)
          && options.length > 0
          && <Flex gap={2} alignItems={'center'}>
            <Typography variant="pi" textColor={'neutral600'}>Options:</Typography>
            {options.map((option: string, index: number) => (
              <Badge
                size='S'
                backgroundColor={'neutral100'}
                textColor={'neutral600'}
              >
                {option}
              </Badge>
            ))}
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

export { CreateSalesforceFormPage };

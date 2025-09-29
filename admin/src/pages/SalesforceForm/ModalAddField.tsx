import { Button, Field, Flex, Grid, IconButton, Modal, SingleSelect, SingleSelectOption, Switch, Typography } from "@strapi/design-system";
import { Plus } from "@strapi/icons";

interface ModalAddFieldProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  editValues: any;
  setEditValues: (editValues: any) => void;
  addFieldConfig: () => void;
}

export const ModalAddField = ({ showModal, setShowModal, editValues, setEditValues, addFieldConfig }: ModalAddFieldProps) => {
  return (
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
                    setEditValues((prev: any) => ({ ...prev, formField: e.target.value }))
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
                    setEditValues((prev: any) => ({ ...prev, salesforceField: e.target.value }))
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
                    setEditValues((prev: any) => ({ ...prev, dataFormat: value }))
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
                    setEditValues((prev: any) => ({ ...prev, dependentField: e.target.value }))
                  }}
                />
              </Field.Root>
            </Grid.Item>
            <Grid.Item col={12}>
              <Field.Label>Options</Field.Label>
              {editValues?.dataFormat === 'choice'
                && Array.isArray(editValues?.options)
                && editValues?.options.map((op: string, index: number) => (
                  <Flex key={op} gap={2} alignItems={'center'}>
                    <Field.Root name="option" required style={{ width: '100%' }}>
                      <Field.Input
                        value={op}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setEditValues((prev: any) => ({
                            ...prev,
                            options: prev.options.map((o: string, index2: number) => index2 === index ? e.target.value : o)
                          }))
                        }}
                      />
                    </Field.Root>
                    <IconButton
                      withTooltip={false}
                      type='button'
                      label="Add option"
                      onClick={() => setEditValues((prev: any) => ({
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
  )
}

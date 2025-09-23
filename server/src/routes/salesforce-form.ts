export default [
  {
    method: 'GET',
    path: '/salesforce-forms',
    handler: 'salesforce-form.find',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/salesforce-forms/:id',
    handler: 'salesforce-form.findOne',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/salesforce-forms',
    handler: 'salesforce-form.create',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/salesforce-forms/:id',
    handler: 'salesforce-form.update',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/salesforce-forms/:id',
    handler: 'salesforce-form.delete',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/salesforce-forms/active',
    handler: 'salesforce-form.findActive',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/salesforce-forms/name/:formName',
    handler: 'salesforce-form.findByFormName',
    config: {
      policies: [],
    },
  },
];

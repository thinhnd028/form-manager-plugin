export default [
  {
    method: 'GET',
    path: '/salesforce-forms',
    handler: 'controller.getSalesforceForms',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/salesforce-forms/:id',
    handler: 'controller.getSalesforceForm',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/salesforce-forms',
    handler: 'controller.createSalesforceForm',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/salesforce-forms/:id',
    handler: 'controller.updateSalesforceForm',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/salesforce-forms/:id',
    handler: 'controller.deleteSalesforceForm',
    config: {
      policies: [],
    },
  },
  // form submissions
  {
    method: 'GET',
    path: '/form-submissions',
    handler: 'controller.getFormSubmissions',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/form-submissions/:id',
    handler: 'controller.getFormSubmission',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/form-submissions',
    handler: 'controller.createFormSubmission',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/form-submissions/:id',
    handler: 'controller.updateFormSubmission',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/form-submissions/:id',
    handler: 'controller.deleteFormSubmission',
    config: {
      policies: [],
    },
  }
];

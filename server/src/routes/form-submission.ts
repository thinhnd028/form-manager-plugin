export default [
    {
      method: 'GET',
      path: '/form-submissions',
      handler: 'form-submission.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/form-submissions/:id',
      handler: 'form-submission.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/form-submissions',
      handler: 'form-submission.create',
      config: {
        policies: [],
      },
    },
  ];
  
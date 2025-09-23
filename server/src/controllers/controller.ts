import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('form-manager-plugin')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },

  async getSalesforceForms(ctx) {
    try {
      const forms = await strapi.db.query('plugin::form-manager-plugin.salesforce-form').findMany();
      
      ctx.body = {
        data: forms,
        meta: {
          total: forms.length
        }
      };
    } catch (error) {
      console.error('Error fetching salesforce forms:', error);
      ctx.throw(500, 'Failed to fetch salesforce forms');
    }
  },

  async getSalesforceForm(ctx) {
    try {
      const { id } = ctx.params;
      const form = await strapi.db.query('plugin::form-manager-plugin.salesforce-form').findOne({
        where: {
          id: parseInt(id)
        }
      });

      if (!form) {
        return ctx.notFound('Salesforce form not found');
      }

      ctx.body = {
        data: form
      };
    } catch (error) {
      console.error('Error fetching salesforce form:', error);
      ctx.throw(500, 'Failed to fetch salesforce form');
    }
  },

  async createSalesforceForm(ctx) {
    try {
      const { data } = ctx.request.body;
      
      const form = await strapi.db.query('plugin::form-manager-plugin.salesforce-form').create({
        data: {
          ...data
        }
      });

      ctx.body = {
        data: form
      };
    } catch (error) {
      console.error('Error creating salesforce form:', error);
      ctx.throw(500, 'Failed to create salesforce form');
    }
  },

  async updateSalesforceForm(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      const form = await strapi.db.query('plugin::form-manager-plugin.salesforce-form').update({
        where: {
          id: parseInt(id)
        },
        data
      });

      if (!form) {
        return ctx.notFound('Salesforce form not found');
      }

      ctx.body = {
        data: form
      };
    } catch (error) {
      console.error('Error updating salesforce form:', error);
      ctx.throw(500, 'Failed to update salesforce form');
    }
  },

  async deleteSalesforceForm(ctx) {
    try {
      const { id } = ctx.params;

      const form = await strapi.db.query('plugin::form-manager-plugin.salesforce-form').delete({
        where: {
          id: parseInt(id)
        }
      });

      if (!form) {
        return ctx.notFound('Salesforce form not found');
      }

      ctx.status = 204;
    } catch (error) {
      console.error('Error deleting salesforce form:', error);
      ctx.throw(500, 'Failed to delete salesforce form');
    }
  },

  // form submissions
  async getFormSubmissions(ctx) {
    try {
      const submissions = await strapi.db.query('plugin::form-manager-plugin.form-submission').findMany({
        populate: {
          form: true
        }
      });
  
      ctx.body = {
        data: submissions,
        meta: { total: submissions.length }
      };
    } catch (error) {
      console.error('Error fetching form submissions:', error);
      ctx.throw(500, 'Failed to fetch form submissions');
    }
  },

  async getFormSubmission(ctx) {
    try {
      const { id } = ctx.params;
      const submission = await strapi.db.query('plugin::form-manager-plugin.form-submission').findOne({
        where: { id: parseInt(id) },
        populate: {
          form: true
        }
      });
  
      if (!submission) {
        return ctx.notFound('Form submission not found');
      }

      ctx.body = { data: submission };
    } catch (error) {
      console.error('Error fetching form submission:', error);
      ctx.throw(500, 'Failed to fetch form submission');
    }
  },

  async createFormSubmission(ctx) {
    try {
      const { data } = ctx.request.body;

      const submission = await strapi.db.query('plugin::form-manager-plugin.form-submission').create({
        data: {
          ...data
        }
      });

      ctx.body = { data: submission };
    } catch (error) {
      console.error('Error creating form submission:', error);
      ctx.throw(500, 'Failed to create form submission');
    }
  }
});

export default controller;

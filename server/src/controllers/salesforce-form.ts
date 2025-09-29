import { factories } from '@strapi/strapi';

export default factories.createCoreController('plugin::form-manager-plugin.salesforce-form', ({ strapi }) => ({
  // Override create method to add locale validation
  async create(ctx) {
    try {
      const { data } = ctx.request.body;

      // Validate formName uniqueness within the same locale
      if (data.formName) {
        const existingForms = await strapi.entityService.findMany('plugin::form-manager-plugin.salesforce-form', {
          filters: {
            formName: data.formName,
            locale: data.locale
          }
        });

        if (existingForms.length > 0) {
          return ctx.badRequest({
            message: `Form name "${data.formName}" already exists in locale "${data.locale}"`
          });
        }
      }

      // Call the service method
      return await strapi.service('plugin::form-manager-plugin.salesforce-form').create(data, { locale: data.locale });
    } catch (error) {
      console.error('Error creating salesforce form:', error);
      ctx.throw(500, 'Failed to create salesforce form');
    }
  },

  // Override update method to add locale validation
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;
      const locale = data.locale;

      delete data.locale;

      // Call the service method
      return await strapi.service('plugin::form-manager-plugin.salesforce-form').update(id, data, { locale: locale });
    } catch (error) {
      console.error('Error updating salesforce form:', error);
      ctx.throw(500, 'Failed to update salesforce form');
    }
  },
  // Custom methods for additional functionality
  async findActive(ctx) {
    try {
      const { locale } = ctx.query;
      const forms = await strapi.entityService.findMany('plugin::form-manager-plugin.salesforce-form', {
        filters: {
          active: true,
          publishedAt: { $notNull: true }
        },
        ...(locale && { locale: locale as string })
      });

      ctx.body = {
        data: forms,
        meta: {
          total: forms.length
        }
      };
    } catch (error) {
      console.error('Error fetching active salesforce forms:', error);
      ctx.throw(500, 'Failed to fetch active salesforce forms');
    }
  },

  async findByFormName(ctx) {
    try {
      const { formName } = ctx.params;
      const { locale } = ctx.query;

      if (!formName) {
        return ctx.badRequest('Missing formName parameter');
      }

      const forms = await strapi.entityService.findMany('plugin::form-manager-plugin.salesforce-form', {
        filters: {
          formName: formName,
          active: true,
          publishedAt: { $notNull: true }
        },
        ...(locale && { locale: locale as string })
      });

      const form = forms?.[0];

      if (!form) {
        return ctx.notFound('Salesforce form not found');
      }

      ctx.body = {
        data: form
      };
    } catch (error) {
      console.error('Error fetching salesforce form by name:', error);
      ctx.throw(500, 'Failed to fetch salesforce form by name');
    }
  }
}));

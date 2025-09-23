import { factories } from '@strapi/strapi';

export default factories.createCoreController('plugin::form-manager-plugin.salesforce-form', ({ strapi }) => ({
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

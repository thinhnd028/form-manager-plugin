import { factories } from '@strapi/strapi';

export default factories.createCoreService('plugin::form-manager-plugin.salesforce-form', ({ strapi }) => ({
  // Override create method to add locale validation
  async create(data, params) {
    const { locale } = params || {};

    // Validate formName uniqueness within the same locale
    if (data.formName) {
      const existingForms = await strapi.entityService.findMany('plugin::form-manager-plugin.salesforce-form', {
        filters: {
          formName: data.formName,
          locale: locale || 'en'
        }
      });

      if (existingForms.length > 0) {
        const error = new Error(`Form name "${data.formName}" already exists in locale "${locale || 'en'}"`) as any;
        error.status = 400;
        throw error;
      }
    }

    // Call the default create method
    return await strapi.entityService.create('plugin::form-manager-plugin.salesforce-form', {
      data: {
        ...data,
        locale: locale || 'en'
      }
    });
  },

  // Override update method to add locale validation
  async update(id, data, params) {
    const { locale } = params || {};

    // Validate formName uniqueness within the same locale (excluding current record)
    if (data.formName) {
      const existingForms = await strapi.entityService.findMany('plugin::form-manager-plugin.salesforce-form', {
        filters: {
          formName: data.formName,
          locale: locale || 'en',
          id: { $ne: parseInt(id) }
        }
      });

      if (existingForms.length > 0) {
        const error = new Error(`Form name "${data.formName}" already exists in locale "${locale || 'en'}"`) as any;
        error.status = 400;
        throw error;
      }
    }

    // Call the default update method
    return await strapi.entityService.update('plugin::form-manager-plugin.salesforce-form', id, {
      data: {
        ...data,
        locale: locale || 'en'
      }
    });
  }
}));

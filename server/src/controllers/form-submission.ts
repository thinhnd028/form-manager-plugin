import { factories } from '@strapi/strapi';

export default factories.createCoreController('plugin::form-manager-plugin.form-submission', ({ strapi }) => ({
  async find(ctx) {
    try {
      const forms = await strapi.db.query('plugin::form-manager-plugin.form-submission').findMany({
        populate: {
          form: true
        }
      });
      
      ctx.body = {
        data: forms,
        meta: {
          total: forms.length
        }
      };
    } catch (error) {
      console.error('Error fetching form submissions:', error);
      ctx.throw(500, 'Failed to fetch form submissions');
    }
  },

  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const form = await strapi.db.query('plugin::form-manager-plugin.form-submission').findOne({
        where: {
          id: parseInt(id)
        },
        populate: {
          form: true
        }
      });

      if (!form) {
        return ctx.notFound('Form submission not found');
      }

      ctx.body = {
        data: form
      };
    } catch (error) {
      console.error('Error fetching form submission:', error);
      ctx.throw(500, 'Failed to fetch form submission');
    }
  },

  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      
      const form = await strapi.db.query('plugin::form-manager-plugin.form-submission').create({
        data: {
          ...data,
        //   publishedAt: new Date().toISOString()
        }
      });

      ctx.body = {
        data: form
      };
    } catch (error) {
      console.error('Error creating form submission:', error);
      ctx.throw(500, 'Failed to create form submission');
    }
  }
}));

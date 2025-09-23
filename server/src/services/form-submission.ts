import { factories } from '@strapi/strapi';
import * as XLSX from 'xlsx';

export default factories.createCoreService('plugin::form-manager-plugin.form-submission', ({ strapi }) => ({
  async find(params) {
    const results = await strapi.db.query('plugin::form-manager-plugin.form-submission').findMany({
      where: {
        ...params.where,
        // publishedAt: { $notNull: true },
      },
      limit: params.limit ?? 10,
      offset: params.start ?? 0,
      orderBy: params.orderBy ?? { createdAt: 'desc' },
    });
  
    const total = await strapi.db.query('plugin::form-manager-plugin.form-submission').count({
      where: {
        ...params.where,
        // publishedAt: { $notNull: true },
      },
    });
  
    return {
      results,
      pagination: {
        total,
        page: Math.floor((params.start ?? 0) / (params.limit ?? 10)) + 1,
        pageSize: params.limit ?? 10,
        pageCount: Math.ceil(total / (params.limit ?? 10)),
      },
    };
  },

  async findOne(id, params) {
    const result = await strapi.db.query('plugin::form-manager-plugin.form-submission').findOne({
      where: {
        id: parseInt(id),
        // publishedAt: { $notNull: true }
      },
      ...params
    });
    return result;
  },

  async create(data) {
    const result = await strapi.db.query('plugin::form-manager-plugin.form-submission').create({
      data: {
        ...data,
        // publishedAt: new Date().toISOString()
      }
    });
    return result;
  },

  async export(params) {
    const { locale, formId, fromDate, toDate } = params;
    const result = await strapi.db.query('plugin::form-manager-plugin.form-submission').findMany({
      where: {
        locale,
        formId,
        createdAt: {
          $gte: fromDate,
          $lte: toDate
        }
      }
    });
    // export to xlsx
    const worksheet = XLSX.utils.json_to_sheet(result);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Form Submissions');
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return excelBuffer;
  }
}));

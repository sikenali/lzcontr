// 报价单服务：保存、读取、校验（调用真实后端）
import { request, requiredCheck } from './api';

export const quotationService = {
  // 保存报价单（服务端校验+持久化）
  save(payload) {
    return request({
      url: '/quotations',
      method: 'POST',
      data: payload,
      validate: (d) =>
        requiredCheck(d, {
          layout: '布局',
          project: '项目名称',
          company: '报价公司',
          customer: '客户名称',
        }),
    });
  },

  list() {
    return request({ url: '/quotations', method: 'GET' });
  },

  get(id) {
    return request({ url: '/quotations/' + id, method: 'GET' });
  },
};

// 合同服务：研发合同 / 销售合同 的保存、读取、校验（调用真实后端）
import { request, requiredCheck } from './api';

export const contractService = {
  // 保存合同（研发/销售），返回保存后的记录（服务端校验+持久化）
  save(payload) {
    return request({
      url: '/contracts',
      method: 'POST',
      data: payload,
      validate: (d) => {
        // 客户端快速校验（服务端同样校验）
        if (d.type === 'xiaoshou') {
          return requiredCheck(d, {
            type: '合同类型',
            name: '合同名称',
            buyer: '买方（甲方）',
            seller: '卖方（乙方）',
          });
        }
        return requiredCheck(d, {
          type: '合同类型',
          name: '合同名称',
          partyA: '甲方（委托方）',
          partyB: '乙方（开发方）',
        });
      },
    });
  },

  // 读取全部合同
  list() {
    return request({ url: '/contracts', method: 'GET' });
  },

  // 按 id 读取
  get(id) {
    return request({ url: '/contracts/' + id, method: 'GET' });
  },
};

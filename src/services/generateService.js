// 生成服务：合同文件生成记录（调用真实后端）
import { request, requiredCheck } from './api';

export const generateService = {
  /**
   * 生成合同文件（服务端校验+记录）
   * @param {Object} payload - { format, filename, version, archivePath, opts }
   * @param {Function} [onProgress] - 保留签名；真实后端返回记录，进度由 UI 加载态体现
   */
  generate(payload, onProgress) {
    return request({
      url: '/generations',
      method: 'POST',
      data: payload,
      validate: (d) =>
        requiredCheck(d, {
          format: '生成格式',
          filename: '文件名称',
          version: '版本号',
          archivePath: '归档目录',
        }),
    });
  },

  list() {
    return request({ url: '/generations', method: 'GET' });
  },
};

// ============================================================
// 服务端校验与业务错误
// 与前端 src/services/api.js 中的 requiredCheck / ApiError 保持契约一致
// ============================================================

export class ApiError extends Error {
  constructor(message, code = 'VALIDATION', details = null, status = 400) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

// 通用必填校验
export function requiredCheck(payload, rules) {
  const errors = {};
  for (const [field, label] of Object.entries(rules)) {
    const val = payload[field];
    if (val === undefined || val === null || String(val).trim() === '') {
      errors[field] = `${label}不能为空`;
    }
  }
  if (Object.keys(errors).length) {
    throw new ApiError('表单校验未通过', 'VALIDATION', errors, 400);
  }
}

// 包装异步路由，捕获异常转 JSON 错误响应
export function wrap(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (e) {
      if (e instanceof ApiError) {
        return res.status(e.status).json({
          success: false,
          code: e.code,
          message: e.message,
          details: e.details,
        });
      }
      console.error('[server error]', e);
      return res.status(500).json({
        success: false,
        code: 'INTERNAL',
        message: '服务器内部错误',
      });
    }
  };
}

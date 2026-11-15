// ============================================================
// 真实后端 API 基础设施
// request() 通过 fetch 调用真实后端（开发经 Vite 代理 /api → :3001，
// 生产同源托管）。服务端负责校验与持久化；此处保留客户端快速校验。
// ============================================================

// 业务错误（与服务端契约一致）
export class ApiError extends Error {
  constructor(message, code = 'VALIDATION', details = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

/**
 * 发起真实 HTTP API 请求。
 * @param {Object} opts
 * @param {string} opts.url - 端点路径（如 '/contracts'，会自动加 '/api' 前缀）
 * @param {string} [opts.method='POST']
 * @param {Object} [opts.data]
 * @param {Function} [opts.validate] - 客户端快速校验（可选，服务端同样校验）
 * @returns {Promise<{success:true, data}>} 服务端返回 data
 */
export async function request({ url, method = 'POST', data = null, validate }) {
  // 客户端快速校验（可选，与服务端双重校验）
  if (validate) {
    validate(data);
  }

  let res;
  try {
    res = await fetch('/api' + url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method === 'GET' ? undefined : JSON.stringify(data ?? {}),
    });
  } catch (e) {
    throw new ApiError('网络请求失败，请检查后端是否已启动', 'NETWORK', null);
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    throw new ApiError(
      body.message || `请求失败（HTTP ${res.status}）`,
      body.code || 'HTTP_ERROR',
      body.details || null
    );
  }
  return { success: true, data: body.data };
}

// 通用必填校验（客户端快速校验，与服务端一致）
export function requiredCheck(payload, rules) {
  const errors = {};
  for (const [field, label] of Object.entries(rules)) {
    const val = payload[field];
    if (val === undefined || val === null || String(val).trim() === '') {
      errors[field] = `${label}不能为空`;
    }
  }
  if (Object.keys(errors).length) {
    throw new ApiError('表单校验未通过', 'VALIDATION', errors);
  }
}

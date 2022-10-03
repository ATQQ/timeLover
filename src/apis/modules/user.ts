import ajax from '../ajax'

/**
 * 获取验证码
 * @param mobile 手机号
 */
function getCode(phone: string) {
  return ajax.get('user/code', {
    params: {
      phone
    }
  })
}

function login(phone: string, code: string) {
  return ajax.post('user/login', {
    phone,
    code
  })
}

export default {
  getCode,
  login
}

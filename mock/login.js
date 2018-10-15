export const LoginHandler = (req, res) => {
    const { accountName, passWord, CAPTCHA } = req.body
    if (accountName === 'admin' && passWord === '123456' && CAPTCHA) {
        res.json({
            status: '登录成功',
            code: 0
        })
    }else {
        res.json({
            status: '登录失败',
            massage: '密码错误',
            code: -1
        })
    }
    
}
export default LoginHandler
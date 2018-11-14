export const LoginHandler = (req, res) => {
    const { accountName, passWord, CAPTCHA } = req.body
    if(accountName==='admin'&&passWord==="123456" && CAPTCHA){
        res.send({
            status: '登录成功',
            message: '登录成功',
            ret: 1,
        })
        return;
    }
    res.send({
        status: '登录失败',
        message: '密码错误',
        ret: -1
    })
}
export default LoginHandler
// 开发环境
const ENVNet = 'http://192.168.30.127:88'
// 生产环境
// const ENVNet = 'http://192.168.30.127:88'
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  }
export {
    ENVNet,
    postOption
}
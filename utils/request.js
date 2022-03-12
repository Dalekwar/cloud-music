import config from './config'

//封装ajax请求
export default (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header:{
        cookie:wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !==-1):''
      },
      success: (res) => {
        if (data.isLogin) { //登陆请求
          //存储cookie
          wx.setStorage({
            key: 'cookies',
            data: res.cookies
          })
        }
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
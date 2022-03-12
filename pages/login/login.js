
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
// 表单数据发生改变
handleInput(event) {
  let type = event.currentTarget.id
  this.setData({
    [type]:event.detail.value
  })
},
//登录
async login(){
  let {phone,password} =this.data
  if(!phone){
    wx.showToast({
      title: '手机号不能为空',
      icon:'none'
    })
    return
  }
  let phoneReg = /^1[3456789]\d{9}$/
  if(!phoneReg.test(phone)){
    wx.showToast({
      title: '手机号格式错误',
      icon:'none'
    })
    return
  }
  if(!password){
    wx.showToast({
      title: '密码不能为空',
      icon:'none'
    })
  }
  //发送请求
  let result = await request('/login/cellphone',{phone,password,isLogin:true})
  if(result.code === 200){
    wx.showToast({
      title: '登录成功',
    })
    //将用户信息存储到本地
    wx.setStorageSync('userInfo',JSON.stringify(result.profile))
    //跳转个人中心
    wx.reLaunch({
      url: '/pages/personal/personal',
    })
  }
  else if(result.code === 400){
    wx.showToast({
      title: '手机号错误',
      icon:'none'
    })
  }
  else if(result.code === 200){
    wx.showToast({
      title: '密码错误',
      icon:'none'
    })
  }else{
    wx.showToast({
      title: '登录失败，请重新登陆',
      icon:'none'
    })
  }
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
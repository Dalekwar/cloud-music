import request from '../../utils/request'
let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'tranlateY(0)',
    coverTransition:'',
    userInfo:{},
    recentPlayList:[]//用户播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let userInfo = wx.getStorageSync('userInfo')
   if(userInfo){
     //更新userInfo
     this.setData({
      userInfo:JSON.parse(userInfo)
     })
     //获取用户播放记录
     this.getUserRecentPalyList(this.data.userInfo.userId)
   }
  },
  //获取用户播放记录的函数
  async getUserRecentPalyList(userId){
    let recentPlayListData = await request('/user/record',{uid:userId,type:0})
    let index =0
    let recentPlayList = recentPlayListData.allData.splice(0,10).map(item=> {
      item.id = index++
      return item
    }
    )
    this.setData({
      recentPlayList
    })
  },
  //滑动事件
  handleTouchStart(event){
    this.setData({
      coverTransition:''
    })
    startY = event.touches[0].clientY
  },
  handleTouchMove(event){
    moveY = event.touches[0].clientY
    moveDistance = moveY-startY
    if(moveDistance <= 0){
      return
    }
    if(moveDistance >= 80){
      moveDistance=80
    }
    this.setData({
      coverTransform:`translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd(){
    this.setData({
      coverTransform:`translateY(0rpx)`,
      coverTransition:'transform 1s linear'
    })
  },
  //跳转到登陆界面
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
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
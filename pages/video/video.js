import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],//导航标签数据
    navId:'',//导航标识
    videoList:[],//视频列表数据
    videoId:'',
    videoUpdateTime:[],//视频播放时长
    isTriggered:false,//标识下拉刷新是否触发
    arr:[],//数据分页数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.getVideoGroupListData()
  },
//获取导航数据
async getVideoGroupListData(){
  let VideoGroupListData = await request('/video/group/list')
  this.setData({
    videoGroupList:VideoGroupListData.data.slice(0,14),
    navId:VideoGroupListData.data[0].id
  })
  this.getVideoList(this.data.navId)
},
//获取视频列表数据
async getVideoList(navId){
  if(!navId){
    return
  }
  let videoListData = await request('/video/group',{id:navId})
  //关闭消息请求框
  wx.hideLoading()
  let index = 0
  let videoList = videoListData.datas.map(item => {
    item.id = index++
    return item
  })
  this.setData({
    videoList:videoList,
  //关闭下拉刷新
    isTriggered:false
  })
},
//点击切换导航的回调
changeNav(event){
  let navId = event.currentTarget.id
  this.setData({
    navId,
    videoList:[]
  })
  //显示正在加载
  wx.showLoading({
    title: '正在加载',
  })
  //动态获取当前导航的数据
  this.getVideoList(this.data.navId)
},  
//点击播放、继续播放的回调
handlePlay(event){
  let vid = event.currentTarget.id
  //关闭上一个播放视频
  // this.vid !== vid && this.videoContext && this.videoContext.stop()
  // this.vid = vid
  //更新videoId
  this.setData({
    videoId:vid
  })
  //创建控制video标签的实例对象
  this.videoContext = wx.createVideoContext(vid)
  //判断当前视频是否有播放记录
  let {videoUpdateTime} = this.data
  let videoItem = videoUpdateTime.find(item => item.vid === vid)
  if(videoItem){
    this.videoContext.seek(videoItem.currentTime)
  } 
  this.videoContext.play()
},
//监听视频播放进度
handleTimeUpdata(event){
  let videoTimeObj = {vid:event.currentTarget.id,currentTime:event.detail.currentTime}
  let {videoUpdateTime} = this.data
  let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
  if(videoItem){
    videoItem.currentTime = videoTimeObj.currentTime
  }else{
    videoUpdateTime.push(videoTimeObj)
  }
  //更新数据
  this.setData({
    videoUpdateTime
  })
},
//视频播放结束
handleEnded(event){
  //移除播放时长数组中当前视频id的对象
  let {videoUpdateTime} = this.data
  videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id),1)
  // 更新数组
  this.setData({
    videoUpdateTime
  })
},
//自定义下拉刷新
handleRefresh(){
  //发请求获取最新视频
  this.getVideoList(this.data.navId)
},
//自定义上拉加载
async handleToLower(){
  //数据分页
  let arr = this.data.arr
  let trigger = console.log('抛出记录点')
  arr.push(trigger)
  let start = 0
  for(let i = 0 ;i< arr.length; i++){
    start++
  }
  let navId = this.data.navId
  let getVideoMoreListData = await request('/video/group',{id:navId,offset:start})
  let index = 0+8*start
  let videoMoreList = getVideoMoreListData.datas.map(item => {
    item.id = index++ 
    return item
  })
  let videoList = this.data.videoList
  videoList.push(...videoMoreList)
  this.setData({
    videoList
  })
},
//跳转到video页面
toSearch(){
  wx.navigateTo({
    url: '/pages/search/search',
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
    if(from === 'button'){
      return{
        title:'来自button',
        page:"/pages/video/video",
        imageUrl:'/static/images/nvsheng.jpg'
      }
    }
  }
})
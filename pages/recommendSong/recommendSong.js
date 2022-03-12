import request from "../../utils/request";
import PubSub from "pubsub-js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    day: "", //日期
    month: "",
    recommendList: [], //每日推荐数据
    index: 0, //音乐下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断用户是否登录
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      wx.showToast({
        title: "请先登录",
        success: () => {
          //跳转到登陆界面
          wx.reLaunch({
            url: "/pages/login/login",
          });
        },
      });
    }
    //更新日期数据
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
    });
    //获取每日推荐数据
    this.getRecommendList();

    //订阅来自songDetail页面发布的消息
    PubSub.subscribe("switchMusic", (msg, type) => {
      let { recommendList, index } = this.data;
      if (type === "pre") {
        //上一首
        index === 0 && (index = recommendList.length);
        index -= 1;
      } else {
        //下一首
        index === recommendList.length - 1 && (index = -1);
        index += 1;
      }

      //更新下标
      this.setData({
        index: index,
      });

      let musicId = recommendList[index].id;
      //将音乐id回传给songDetail页面
      PubSub.publish("musicId", musicId);
    });
  },

  async getRecommendList() {
    //获取每日推荐数据
    let recommendListData = await request("/recommend/songs");
    this.setData({
      recommendList: recommendListData.recommend,
    });
  },
  //跳转到歌曲详情
  toSongDetail(event) {
    let { song, index } = event.currentTarget.dataset;
    this.setData({
      index: index,
    });
    wx.navigateTo({
      url: `/pages/songDetail/songDetail?ids=${song.id}`,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});

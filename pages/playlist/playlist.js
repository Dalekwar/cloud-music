import request from "../../utils/request";
import PubSub from "pubsub-js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listId: "", //歌单id
    name: "", //歌单名字
    playList: [], //歌单歌曲
    listImg: "", //歌单图片
    description: "", //歌单描述
    index: "", //音乐下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let listId = options.id;
    this.setData({
      listId,
    });
    this.getPlayList(listId);
    //订阅来自songDetail页面发布的消息
    PubSub.subscribe("switchMusic", (msg, type) => {
      let { playList, index } = this.data;
      if (type === "pre") {
        //上一首
        index === 0 && (index = playList.length);
        index -= 1;
      } else {
        //下一首
        index === playList.length - 1 && (index = -1);
        index += 1;
      }

      //更新下标
      this.setData({
        index: index,
      });

      let musicId = playList[index].id;
      //将音乐id回传给songDetail页面
      PubSub.publish("musicId", musicId);
    });
  },
  //根据listId获取歌单数据
  async getPlayList(listId) {
    let playListData = await request("/playlist/detail", { id: listId });
    this.setData({
      listImg: playListData.playlist.coverImgUrl,
      description: playListData.playlist.description,
      playList: playListData.playlist.tracks,
      name: playListData.playlist.name,
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

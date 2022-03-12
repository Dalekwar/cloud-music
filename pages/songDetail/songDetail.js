import request from "../../utils/request";
import PubSub from "pubsub-js";
const dayjs = require("./dayjs");
const appInstance = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //播放状态
    song: {}, //歌曲详情对象
    musicId: "", //当前歌曲ID
    musicLink: "", //当前播放地址
    currentTime: "00:00", //实时时长
    durationTime: "00:00", //总时长
    currentWidth: 0, //实时进度条宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.ids;
    this.setData({
      musicId,
    });
    this.getMusicInfo(musicId);
    //判断当前音乐播放状态
    if (
      appInstance.globalData.isMusicPlay &&
      appInstance.globalData.musicId == musicId
    ) {
      //修改当前页面的音乐播放状态
      this.setData({
        isPlay: true,
      });
    }
    //获取音乐播放实例
    this.musicContext = wx.getBackgroundAudioManager();
    //系统控制音乐播放状态
    this.musicContext.onPlay(() => {
      this.changePalyState(true);
      //修改全局音乐播放状态
      appInstance.globalData.musicId = musicId;
    });
    this.musicContext.onPause(() => {
      this.changePalyState(false);
    });
    this.musicContext.stop(() => {
      this.changePalyState(false);
    });
    //监听音乐自反播放结束
    this.musicContext.onEnded(() => {
      //自动播放下一首
      PubSub.publish("switchMusic", "next");
      //还原进度条长度
      this.setData({
        currentWidth: 0,
        currentTime: "00:00",
      });
    });
    //监听音乐实时播放的进度
    this.musicContext.onTimeUpdate(() => {
      //格式化实时播放时间
      let currentTime = dayjs(this.musicContext.currentTime * 1000).format(
        "mm:ss"
      );
      let currentWidth =
        (this.musicContext.currentTime / this.musicContext.duration) * 450;
      this.setData({
        currentTime,
        currentWidth,
      });
    });
  },
  //修改播放状态功能参数
  changePalyState(isPlay) {
    this.setData({
      isPlay,
    });
    appInstance.globalData.isMusicPlay = isPlay;
  },
  //根据id获取数据
  async getMusicInfo(musicId) {
    let songData = await request("/song/detail", { ids: musicId });
    let durationTime = dayjs(songData.songs[0].dt).format("mm:ss");
    this.setData({
      song: songData.songs[0],
      durationTime,
    });
    //动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    });
  },
  //播放处理
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    let { musicId, musicLink } = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },
  //控制音乐播放功能
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      if (!musicLink) {
        // 获取音乐播放链接
        let musicData = await request("/song/url", { id: musicId });
        musicLink = musicData.data[0].url;
        this.setData({
          musicLink: musicLink,
        });
      }
      this.musicContext.title = this.data.song.name;
      this.musicContext.src = musicLink;
    } else {
      this.musicContext.pause();
    }
  },
  //点击切歌的回调
  handleSwitch(event) {
    //切换类型
    let type = event.currentTarget.id;

    //关闭当前播放音乐
    this.musicContext.stop();

    //订阅来自recommendSong页面
    PubSub.subscribe("musicId", (msg, musicId) => {
      //获取歌曲
      this.getMusicInfo(musicId);
      //自动播放当前音乐
      this.musicControl(true, musicId);
      //取消订阅
      PubSub.unsubscribe("musicId");
    });
    //发布消息数据给recommendSong页面
    PubSub.publish("switchMusic", type);
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

import request from "../../utils/request";
let timer = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: "", //placeholder内容
    hotList: [], //热搜榜数据
    searchContent: "", //用户输入表单项数据
    searchList: [], //搜索关键字模糊列表
    historyList: [], //搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData();
    this.getSearchHistory();
  },
  // 获取placeholder初始化数据
  async getInitData() {
    let placeholderData = await request("/search/default");
    let hotListData = await request("/search/hot/detail");
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data,
    });
  },
  //表单数据变化的回调
  handleInputChange(event) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      this.setData({
        searchContent: event.detail.value.trim(),
      });
      this.getSearchList();
    }, 300);
  },
  //获取搜索列表
  async getSearchList() {
    let { searchContent, historyList } = this.data;
    if (!this.data.searchContent) {
      return;
    }
    //获取关键字模糊匹配数据
    let searchListData = await request("/search", {
      keywords: this.data.searchContent,
      limit: 10,
    });
    this.setData({
      searchList: searchListData.result.songs,
    });
    //添加搜索历史记录
    //判断内容是否一致
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1);
    }
    historyList.unshift(searchContent);
    this.setData({
      historyList,
    });
    //存储到本地
    wx.setStorageSync("searchHistory", historyList);
  },
  //获取本地搜索记录的方法
  getSearchHistory() {
    let historyList = wx.getStorageSync("searchHistory");
    if (historyList) {
      this.setData({
        historyList,
      });
    }
  },
  //清空搜索框
  clearSearchContent() {
    this.setData({
      searchContent: "",
    });
  },
  //删除历史记录回调
  deleteSearchHistory() {
    wx.showModal({
      content: "确认删除历史记录吗",
      success: (res) => {
        if (res.confirm) {
          this.setData({
            historyList: [],
          });
          //移除本地的storage
          wx.removeStorage({
            key: "searchHistory",
          });
        }
      },
    });
  },
  //点击历史记录进行搜索
  handleSearchHistory(event) {
    this.setData({
      searchContent: event.currentTarget.dataset.historyword,
    });
    this.getSearchList();
  },
  //跳转到video页面
  toVideo() {
    wx.navigateBack({
      delta: 1,
    });
  },
  //点击searchList跳转到歌曲详情页
  toSongDetail(event) {
    wx.navigateTo({
      url: "/pages/songDetail/songDetail?ids=" + event.currentTarget.id,
    });
  },
  //点击热搜榜进行搜索
  searchHotSong(event) {
    this.setData({
      searchContent: event.currentTarget.dataset.hotword,
    });
    this.getSearchList();
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

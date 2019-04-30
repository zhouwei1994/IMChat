import store from '@/config/store';
//创建WebSocket
var ws;

function openSocket(userInfo) {
  if (ws) {
    return;
  }
  //创建WebSocket
  if (window.WebSocket) {
    ws = new WebSocket('ws://localhost:8001');
    ws.onopen = function (e) {
      console.log("连接服务器成功", e);
      //在连接成功后给后台发送自身信息
      sendText({
        id: userInfo.id,
        username: userInfo.username,
        nickname: userInfo.nickname,
        type: 'first'
      });
    };
    ws.onclose = function (e) {
      console.log(e);
      console.log("服务器关闭");
    };
    ws.onerror = function () {
      console.log("连接出错");
    };
    ws.onmessage = function (e) {
      console.log(e);
      var chatInfo = JSON.parse(e.data);
      if (chatInfo.type !== "haveRead") {
        //接收的消息处理
        store.dispatch('chatUserInfo', chatInfo);
      }
      //往chat页面发送消息
      global.chatMessage && global.chatMessage(chatInfo);
    };
  }
}
//发送消息
function sendText(data) {
  if (ws && data) {
    let info = {
      headImg: store.state.userInfo.headImg,
      nickname: store.state.userInfo.nickname,
      fromUser: store.state.userInfo.id,
    };
    Object.keys(data).forEach(key => {
      info[key] = data[key];
    });
    ws.send(JSON.stringify(info));
  } else {
    console.log("数据出错");
  }
}

export {
  sendText
};
export default openSocket;

export class Webscoket {
  constructor(url, fn) {
    this.url = url
    this.fn = fn
    this.lockReconnect
    this.timerId
    // 重新连接时间
    this.connectTime = 2000
    this.heart = new heartCheck();
    this.createConnect()
  }

  createConnect() {
    this.ws = new WebSocket(this.url)
    // 连接成功
    this.ws.onopen = (e) => {
      console.log('websocket==>, 连接成功');
      this.heart.reset().start(this);
    }
    // 接收消息回调
    this.ws.onmessage = (event) => {
      const info = {}
      const { msg, opt } = JSON.parse(event.data)
      if (typeof msg == 'string') {
        info.msg = JSON.parse(msg)
      } else {
        info.msg = msg
      }
      info.opt = opt
      if(opt == 'HEALTH'){
        //接受心跳
        this.heart.reset().start(this);
      }
      this.fn(info)
    }

    // 关闭socket回调
    this.ws.onclose = () => {}
    // 出现错误回调
    this.ws.onerror = () => {
      this.reconnect()
    }
  }

  // 向服务器发送数据
  send(message) {
    this.ws.send(message)
  }

  // 关闭socket
  close() {
    this.heart.reset();
    this.ws.close()
  }

  // 重新连接socket
  reconnect() {
    if (this.lockReconnect) {
      return
    }
    this.lockReconnect = true
    this.timerId && clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      this.lockReconnect = false
      this.ws.close()
      this.createConnect()
    }, this.connectTime)
  }
}

/*心跳检测*/
class heartCheck {
  constructor() {
    //心跳检测时间
    this.timeout = 5000;
    this.timeoutObj = null;
    this.serverTimeoutObj = null;
  }

  reset() {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  }

  start(websock) {
    this.timeoutObj = setTimeout(() => {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      const data = { healthCheck:'Y'};
      websock.ws.send(JSON.stringify(data));
      this.serverTimeoutObj = setTimeout(() => {
        this.reset();
        console.warn('websocket连接断开，重新连接...');
        websock.reconnect();
      }, this.timeout);
    }, this.timeout);
  }
}


export default Webscoket

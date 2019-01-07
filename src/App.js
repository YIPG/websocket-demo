import React, { Component } from "react";
import socketIOClient from "socket.io-client";
class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      curPos: ""
    };
  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => this.setState({ response: data }));
    socket.on('get position', pos => this.setState({ curPos: pos}));
  }
  getCurrentPosition(options) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
  }
  send(posStr){
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('get position', posStr)
  }
  async handleClick(){
    try {
      let position = await this.getCurrentPosition()
      let posString = position.coords.latitude.toString() + ',' + position.coords.longitude.toString();
      console.log(posString);
      this.send(posString);
      console.log('ソケットを呼び出した.')
    }
    catch(error){
      console.log(error)
    }
  }
  render() {
    const { response, curPos } = this.state;

    return (
      <div style={{ textAlign: "center" }}>
      <button style={{ marginTop: 20}} onClick={()=> this.handleClick()}>現在地を取得</button>
        {response&&curPos
          ?<div> 
          <p>
          みんなの現在地の緯度経度は{curPos}です.
        </p>
        <p>
              新宿駅の現在の気温: {response} ℃
            </p></div>
          : <p>Loading...</p>}
      </div>
    );
  }
}
export default App;
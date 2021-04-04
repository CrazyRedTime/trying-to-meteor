import simpleDDP from "simpleddp";
import ws from "isomorphic-ws";

import "./App.css";

const App = () => {
  let opts = {
    endpoint: "ws://cloud.astrapos.ru:3000",
    SocketConstructor: ws,
    reconnectInterval: 5000,
  };

  const simpleDDPLogin = require("simpleddp-plugin-login").simpleDDPLogin;

  const server = new simpleDDP(opts, [simpleDDPLogin]);

  const username = '9049915511';
  const password = '1234'

  const userAuth = async () => await server.login({
    password,
    user: {
        username,
    }
  });

  userAuth();

  server.on('login',(m)=>{
    console.log('User logged in as', m);
  });

  return <div className="App"></div>;
};

export default App;

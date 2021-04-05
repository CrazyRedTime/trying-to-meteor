import simpleDDP from "simpleddp";
import ws from "isomorphic-ws";

import "./App.css";
import { useEffect, useState } from "react";

const App = () => {
  const [collection, changeCollection] = useState([]);

  useEffect(() => {
    console.log(collection);
  }, [collection]);

  const filterCollection = (array) => {
    return array.filter((item) => item.CategoryId === "tEiNBLhedXPWqqKfS");
  };

  useEffect(() => {
    let opts = {
      endpoint: "ws://cloud.astrapos.ru:3000/websocket",
      SocketConstructor: ws,
      reconnectInterval: 5000,
    };

    const simpleDDPLogin = require("simpleddp-plugin-login").simpleDDPLogin;

    const server = new simpleDDP(opts, [simpleDDPLogin]);

    const username = "9049915511";
    const password = "1234";

    const userAuth = async () =>
      await server.login({
        password,
        user: {
          username,
        },
      });

    userAuth();

    server.on("login", (m) => {
      console.log("User logged in as", m);
      (async () => {
        let participantsSub = server.subscribe("products");

        await participantsSub.ready();

        let reactiveCollection = server.collection("products").reactive();

        changeCollection(filterCollection(reactiveCollection._data));

        reactiveCollection.onChange(() => {
          changeCollection(filterCollection(reactiveCollection._data));
        });
      })();
    });
  }, []);

  return (
    <div className="App">
      <ul>{collection.map((item) => (
        <li key={item.id}><span>Название: {item.Name}</span><span>Стоимость: {item.Price? `${item.Price}р.` : 'не указана'}</span></li>
      ))}</ul>
    </div>
  );
};

export default App;

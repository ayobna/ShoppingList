import React, { useState, useEffect } from 'react';
import { View, Text,Button } from 'react-native';
import ShoppingListCard from '../components/ShoppingListCard';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';


const ChatScreen = (props) => {
  // props
  const { navigation, route } = props;

  // states
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      if (!connection) {
      }
    });
    return unsubscribe;
  }, [route]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
    });
    return unsubscribe;
  }, [route]);

  const joinChat = async () => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("https://shoppinglist20220211160436.azurewebsites.net/chat")
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("ReceiveMessages", (messages) => {
        setMessages(messages);
      });

      // connection.on("UsersInRoom", (users) => {
      //   setUsers(users);
      // });

      // connection.onclose(e => {
      //   setConnection();
      //   setMessages([]);
      //   setUsers([]);
      // });

      await connection.start();
      await connection.invoke("JoinChat", { ListID: route.params.shoppingListID });
      setConnection("stam");
    } catch (e) {
      console.log(e);
    }
  }

  console.log("Messages", messages);

  return (
    <View>
      <Text>List Screen {route.params.shoppingListID}</Text>
      <Button title='click' onPress={joinChat} />
      </View>
  );
}

export default ChatScreen;



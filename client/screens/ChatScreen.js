import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ShoppingListCard from "../components/ShoppingListCard";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import ChatCard from "../components/ChatCard";
import {
  TextInput,
  IconButton,
  Button,
  Text,
  Avatar,
} from "react-native-paper";
import { User } from "../User";
import { chatApi } from "../api/api";

// Test branch tal
const ChatScreen = (props) => {
  // props
  const { navigation, route } = props;

  // states
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(User);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      joinChat();
      getMessages();
    });
    return unsubscribe;
  }, [route]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
      closeConnection();
      setMessage("");
      setMessages("");
    });
    return unsubscribe;
  }, [route, navigation]);

  const getMessages = async () => {
    let res = await chatApi.apiShoppingListChatMessagesIdGet(route.params.shoppingListID);
    setMessages(res.data);
  };
  const joinChat = async () => {
    let tempUser = user.FirstName;
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:44632/chat")
        .withAutomaticReconnect()
        .build();

      connection.on("ReceiveMessage", (chatMessageCard) => {
        console.log("chatMessageCard", chatMessageCard)
        const tempMessages = [...messages];
        tempMessages = [tempMessages, chatMessageCard];
        setMessages(tempMessages);
        // setFirstJoin(false)
      });

      // connection.on("Messages", (chatMessageCard) => {
      //   setTempMessages(chatMessageCard);
      //   console.log("Messages", chatMessageCard);

      //   chatMessageCard.forEach((chatMessageCard) => {
      //     let tempUser = chatMessageCard.firstName;
      //     let message = chatMessageCard.message;
      //     setMessages((messages) => [...messages, { tempUser, message }]);
      //   });
      // });

      connection.onclose((e) => {
        setConnection();
        setMessages([]);
      });

      await connection.start();
      let listID = route.params.shoppingListID;
      let userID = user.UserID;
      await connection.invoke("JoinRoom", { listID, userID });

      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  const sendMessage = async () => {
    console.log("sendMessage")
    let chatMessageCard = {
      ListID: route.params.shoppingListID,
      UserID: user.UserID,
      Message: message,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Img: user.Img
    }
    try {
      await connection.invoke("SendMessage", chatMessageCard);
      setMessage("")
    } catch (e) {
      console.log(e);
    }
  };


  const closeConnection = async () => {
    console.log("closeConnection")
    try {
      await connection.stop();
    } catch (e) {
      console.log(e);
    }
  };

  const renderListItem = (itemData) => (
    <ChatCard data={itemData.item} navigation={navigation} />
  );
  const handleListEmptyComponent = () => {
    return (
      <View
        style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>אין מוצרים</Text>
      </View>
    );
  };

  const renderFooter = () => {
    return <View />;
  };
  return (
    <View style={styles.container}>
      {/* <Text>List Screen {route.params.shoppingListID}</Text> */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={messages}
        renderItem={(item) => renderListItem(item)}
        keyExtractor={(item, index) => String(index)}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={handleListEmptyComponent}
        ListFooterComponent={renderFooter}
      // refreshing={isFetching}
      // onRefresh={() => handleRefresh()}
      />

      <View
        style={{
          width: "100%",
          alignItems: "flex-end",
          flexDirection: "row",
          justifyContent: "space-around",
          bottom: 5,
        }}
      >
        <View
          style={{
            width: "75%",
          }}
        >
          <TextInput
            label="הודעה"
            value={message}
            onChangeText={(txt) => setMessage(txt)}
            //  dense={true}
            mode="outlined"
          //   error={null}
          />
        </View>
        <View
          style={{
            width: "20%",
          }}
        ></View>
        <Button
          //  contentStyle={{ width: "50%" }}
          //   mode="contained"
          onPress={sendMessage}
        >
          הוספה
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;

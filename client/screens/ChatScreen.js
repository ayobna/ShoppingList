import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, StyleSheet, Keyboard, TextInput } from "react-native";


import ShoppingListCard from "../components/ShoppingListCard";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import ChatCard from "../components/ChatCard";
import {
  IconButton,
  Button,
  Text,
  Avatar,
  Divider,
} from "react-native-paper";
import { User } from "../User";
import { API, chatApi } from "../api/api";

const ChatScreen = (props) => {
  // props
  const { navigation, route } = props;

  // states
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(User);

  const flatListRef = useRef();


  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      joinChat();
      getMessages();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
      closeConnection();
      setMessage("");
      setMessages("");
    });
    return unsubscribe;
  }, [navigation]);

  const getMessages = async () => {
    let res = await chatApi.apiShoppingListChatMessagesIdGet(
      route.params.shoppingListID
    );
    let data = res.data

    setMessages(data);
  };
  const joinChat = async () => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl(API + "/chat")
        .withAutomaticReconnect()
        .build();

      connection.on("ReceiveMessage", (chatMessageCard) => {

        setMessages((messages) => [chatMessageCard, ...messages]);
        // setFirstJoin(false)

      });
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
    console.log("sendMessage");
    let chatMessageCard = {
      ListID: route.params.shoppingListID,
      UserID: user.UserID,
      Message: message,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Img: user.Img,
    };
    try {
      await connection.invoke("SendMessage", chatMessageCard);
      setMessage("");
    } catch (e) {
      console.log(e);
    }
  };

  const closeConnection = async () => {
    console.log("closeConnection");
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

  const handleSeparatorComponent = () => {
    return (
      <Divider inset />
    );
  };

  const renderFooter = () => {
    return <View />;
  };

  console.log("messages", messages)
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        // onContentSizeChange={() => flatListRef.current.scrollToEnd()}
        showsVerticalScrollIndicator={false}
        inverted

        data={messages}
        renderItem={(item) => renderListItem(item)}
        keyExtractor={(item, index) => String(index)}
        contentContainerStyle={{ flexGrow: 1 }}
        // ListEmptyComponent={handleListEmptyComponent}
        ListFooterComponent={renderFooter}

        ItemSeparatorComponent={handleSeparatorComponent}
      // refreshing={isFetching}
      // onRefresh={() => handleRefresh()}

      />
      <View style={{ flexDirection: "row", backgroundColor: "#f1f1f1", justifyContent: "center", alignItems: "flex-end", paddingVertical: 10, paddingLeft: 10, borderTopColor: "#e1e1e1", borderTopWidth: 1, maxHeight: 150 }}>
        <View style={{ flex: 1, backgroundColor: "white", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 2 }}>
          <TextInput value={message} onChangeText={(txt) => setMessage(txt)} selectionColor="black" placeholder="תרשום תרשום.." style={{ fontFamily: "our-font-regular" }} numberOfLines={2} multiline />
        </View>
        <IconButton
          icon="send"
          size={20}
          onPress={() => sendMessage()}
          style={{ transform: [{ rotateY: '180deg' }] }}
          disabled={message.length === 0}
        />
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

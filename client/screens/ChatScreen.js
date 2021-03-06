import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, StyleSheet, TextInput } from "react-native";
import { HubConnectionBuilder } from "@microsoft/signalr";
import ChatCard from "../components/ChatCard";
import { IconButton, Divider } from "react-native-paper";
import { API, chatApi } from "../api/api";
import Spinner from "../components/Spinner";
import { _getData } from "../utils/Functions";
import withCommonScreen from "../hoc/withCommonScreen";
import Colors from "../utils/Colors";

const ChatScreen = (props) => {
  // props
  const { navigation, route, isPageLoaded, setIsPageLoadedTrue } = props;

  // states
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      console.log("enter chat")
      const data = await getMessages();
      setMessages(data);
      const u = await loadUser();
      if (u != null) {
        await joinChat(u.userID);
        setIsPageLoadedTrue();
      }
    });
    return unsubscribe;
  }, [navigation, route]);


  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
      console.log("leave chat")
      setMessages([]);
    });
    return unsubscribe;
  }, [navigation, route]);


  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      if (connection) {
        closeConnection(e);
      }
    });
    return unsubscribe;
  }, [navigation, connection]);



  const loadUser = async () => {
    let u = await _getData("User");
    setUser(u)
    console.log(u)
    return u
  };

  const getMessages = async () => {
    try {
      let res = await chatApi.apiShoppingListChatMessagesIdGet(
        route.params.shoppingListID
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const joinChat = async (userID) => {
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
        setMessages([]);
      });

      await connection.start();
      let listID = route.params.shoppingListID;
      let userID = userID;
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
      UserID: user.userID,
      Message: message,
      FirstName: user.firstName,
      LastName: user.lastName,
      Img: user.img,
      CreatedOn: new Date()
    };
    try {
      await connection.invoke("SendMessage", chatMessageCard);
      setMessage("");
    } catch (e) {
      console.log(e);
    }
  };

  const closeConnection = async (e) => {
    try {
      await connection.stop();
      console.log("closeConnection");
      navigation.dispatch(e.data.action);
    } catch (e) {
      console.log(e);
    }
  };

  const renderListItem = (itemData) => (
    <ChatCard data={itemData.item} navigation={navigation} />
  );

  const handleSeparatorComponent = () => {
    return (
      <Divider inset />
    );
  };

  const renderFooter = () => {
    return <View />;
  };

  return (
    isPageLoaded ?
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          inverted
          data={messages}
          renderItem={(item) => renderListItem(item)}
          keyExtractor={(item, index) => String(index)}
          contentContainerStyle={{ flexGrow: 1 }}
          ListFooterComponent={renderFooter}
          ItemSeparatorComponent={handleSeparatorComponent}
        />

        <View style={styles.createMessageArea}>
          <View style={styles.inputWrapper}>
            <TextInput value={message} onChangeText={(txt) => setMessage(txt)} selectionColor="black" placeholder="?????????? ??????????.." style={styles.textInput} numberOfLines={2} multiline />
          </View>
          <IconButton
            icon="send"
            size={20}
            onPress={() => sendMessage()}
            color={Colors.our_dark_blue}
            style={styles.iconBtn}
            disabled={message.length === 0}
          />
        </View>
      </View>
      :
      <Spinner />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createMessageArea: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingVertical: 10,
    paddingLeft: 10,
    borderTopColor: "#e1e1e1",
    borderTopWidth: 1,
    maxHeight: 150
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2
  },
  textInput: {
    fontFamily: "our-font-regular"
  },
  iconBtn: {
    transform: [{ rotateY: '180deg' }]
  }
});

export default withCommonScreen(ChatScreen, 'ChatScreen');

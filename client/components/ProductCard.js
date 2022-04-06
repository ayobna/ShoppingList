import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
} from "react-native";
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  Menu,
  Divider,
  IconButton,
  Checkbox,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API, shoppingListApi } from "../api/api";
const ProductCard = (props) => {
  const {
    data,
    handleDeleteProduct,
    handleEditProduct,
    ScreenName,
    user,
    listCreatorId,
    checkProduct,
  } = props;

  //states
  const [visibleMenu, setVisibleMenu] = useState(false);
  const openMenu = () => setVisibleMenu(true);
  const closeMenu = () => setVisibleMenu(false);
  const [checked, setChecked] = useState();

  const [leftStyleMarginRight, setLeftStyleMarginRight] = useState("15%");

  useEffect(() => {
    // console.log("product: ", data);
    setChecked(data.isChecked);
    if (ScreenName === "CreateList") {
      setLeftStyleMarginRight("5%");
    }
  }, []);

  useEffect(() => {
    // console.log("product: ", data);
    setChecked(data.isChecked);
  }, [data]);

  const ImgName = () => {
    let imgArray = ["0"];
    if (ScreenName === "CreateList") {
      imgArray = data.img.split(":/");
    }
    let img = data.img;
    if (ScreenName !== "CreateList") {
      if (data.productID !== 0) {
        img =
          imgArray[0] === "file"
            ? data.img
            : API + `/uploads/shoppingLists/` + data.img;
      }
    }
    return img;
  };

  const onChecked = async () => {
    setChecked(!checked);``
    await checkProduct(data.productID, !data.isChecked);
    console.log("after checkProduct ", data.isChecked);
   
  };

  const leftContent = (props) => {
    if (ScreenName === "CreateList")
      return <Avatar.Image size={60} source={{ uri: ImgName() }} />;
    else {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={onChecked}
          />
          <Avatar.Image size={60} source={{ uri: ImgName() }} />
        </View>
      );
    }
  };

  const rightContent = (props) => {
    if (ScreenName === "CreateList") {
      return (
        <Menu
          visible={visibleMenu}
          onDismiss={closeMenu}
          anchor={
            <IconButton {...props} icon="dots-vertical" onPress={openMenu} />
          }
        >
          <Menu.Item icon="redo" onPress={editProduct} title="ערוך" />

          <Divider style={styles.menuDivider} />

          <Menu.Item
            icon="delete"
            onPress={() => handleDeleteProduct(data.productID)}
            title="מחק"
          />
        </Menu>
      );
    } else {
      if (data.creatorID === user.userID || listCreatorId === user.userID)
        return (
          <Menu
            visible={visibleMenu}
            onDismiss={closeMenu}
            anchor={
              <IconButton {...props} icon="dots-vertical" onPress={openMenu} />
            }
          >
            <Menu.Item icon="redo" onPress={editProduct} title="ערוך" />
            <Divider style={styles.menuDivider} />
            <Menu.Item
              icon="delete"
              onPress={() => handleDeleteProduct(data.productID)}
              title="מחק"
            />
          </Menu>
        );
    }
  };

  const editProduct = () => {
    closeMenu();
    handleEditProduct(data);
  };
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <TouchableHighlight
        style={styles.touchableHighLight}
        underlayColor="red"
        onPress={null}
      >
        <Card style={{ flex: 1 }}>
          <Card.Title
            titleNumberOfLines={3}
            title={data.name}
            subtitle={`כמות: ${data.amount}`}
            left={leftContent}
            right={rightContent}
            leftStyle={{ marginRight: leftStyleMarginRight }}
          />
          {/* <Card.Content>
                        <Paragraph>מספר מזהה: {data.ProductID}</Paragraph>
                    </Card.Content>  */}
        </Card>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },
});

export default ProductCard;

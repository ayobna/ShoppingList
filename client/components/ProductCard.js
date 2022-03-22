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
  } = props;
  //states
  const [visibleMenu, setVisibleMenu] = useState(false);
  const openMenu = () => setVisibleMenu(true);
  const closeMenu = () => setVisibleMenu(false);
  const [checked, setChecked] = useState(data.isChecked);

  const ImgName = () => {
    const imgArray = data.img.split(":/");
    let img = data.img;

    useEffect(() => {
      console.log("product: ", data);
    }, []);

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
  // מרנדר תמונה של מוצר
  const leftContent = (props) => {
    if (ScreenName === "CreateList")
      return <Avatar.Image size={60} source={{ uri: ImgName() }} />;
    else {
      return (
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => {
              setChecked(!checked);
            }}
          />
          <Avatar.Image size={60} source={{ uri: ImgName() }} />
        </View>
      );
    }
  };

  // מרנדר אייקון שלוש נקודות לאופציות שניתן לבצע בכרטיס מוצר
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
      if (data.creatorID === user.UserID || listCreatorId === user.UserID)
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
        <Card>
          <Card.Title
            titleNumberOfLines={3}
            title={data.name}
            subtitle={`כמות: ${data.amount}`}
            left={leftContent}
            right={rightContent}
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
    left:10
  },
});

export default ProductCard;

import React, { useState } from "react";
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
  Checkbox
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API } from "../api/api";
const ProductCard = (props) => {
  const { data, handleDeleteProduct, handleEditProduct, ScreenName, user } =
    props;
  //states
  const [visibleMenu, setVisibleMenu] = useState(false);
  const openMenu = () => setVisibleMenu(true);
  const closeMenu = () => setVisibleMenu(false);
  const [checked, setChecked] = useState(false);

  console.log(user);
  const ImgName = () => {
    const imgArray = data.img.split(":/");
    let img = data.img;

    if (ScreenName !== "CreateList") {
      img =
        imgArray[0] === "file"
          ? data.img
          : API + `/uploads/shoppingLists/` + data.img;
    }
    return img;
  };
  // מרנדר תמונה של מוצר
  const leftContent = (props) => (
    <Avatar.Image size={60} source={{ uri: ImgName() }} />
  );

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
      if (data.creatorID === user.UserID)
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
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => {
              setChecked(!checked);
            }}
          />
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
  },
});

export default ProductCard;

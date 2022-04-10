import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import {
  Card,
  Menu,
  Divider,
  IconButton,
} from "react-native-paper";

// veribles
const myShoppingLists = 1;

const ShoppingListCard = (props) => {
  // props
  const { navigation, data, handleChoice, extraDataForTabs } = props;

  //states
  const [visibleMenu, setVisibleMenu] = useState(false);
  const openMenu = () => setVisibleMenu(true);
  const closeMenu = () => setVisibleMenu(false);

  // מרנדר אייקון שלוש נקודות לאופציות שניתן לבצע בכרטיס מוצר
  const rightContent = (props) => (
    <Menu
      visible={visibleMenu}
      onDismiss={closeMenu}
      anchor={<IconButton {...props} icon="dots-vertical" onPress={openMenu} />}
    >
      {extraDataForTabs === myShoppingLists ? (
        <View>
          <Menu.Item
            icon="redo"
            title="עריכה"
            onPress={() => checkChoice("edit")}
          />
          <Divider style={styles.menuDivider} />

          <Menu.Item
            icon="content-copy"
            title="העתקה"
            onPress={() => checkChoice("copy")}
          />
          <Divider style={styles.menuDivider} />
          <Menu.Item
            icon="delete"
            title="מחיקה"
            onPress={() => checkChoice("delete")}
          />
        </View>
      ) : (
        <View>
          <Menu.Item
            icon="content-copy"
            title="העתקה"
            onPress={() => checkChoice("copy")}
          />
          <Divider style={styles.menuDivider} />
          <Menu.Item
            icon="exit-to-app"
            title="יציאה"
            onPress={() => checkChoice("exit")}
          />
        </View>
      )}
    </Menu>
  );

  const checkChoice = (choiceMethod) => {
    closeMenu();
    handleChoice(data, choiceMethod);
  };

  const openList = () => {
    navigation.navigate("ShoppingListTabs", { shoppingListID: data.listID, shoppingListTitle: data.title });
  };

  const handleDateFormat = () => {
    let date = data.createdOn.split("T")[0];
    return `${date.split("-")[2]}/${date.split("-")[1]}/${date.split("-")[0]}`;
  };

  return (
    <View style={{ ...styles.container, ...props.style }}>
      <TouchableHighlight
        style={styles.touchableHighLight}
        underlayColor="black"
        onPress={openList}
      >
        <Card>
          <Card.Title
            titleNumberOfLines={3}
            title={data.title}
            subtitle={`נוצר ע"י: ${data.firstName + " " + data.lastName
              }\nנוצר ב: ${handleDateFormat()}\n`}
            subtitleNumberOfLines={3}
            right={rightContent}
          />
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
  touchableHighLight: {
    borderRadius: 5
  }
});

export default ShoppingListCard;

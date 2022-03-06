import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { Avatar, Card, Title, Paragraph, Menu, Divider, IconButton, Caption } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ShoppingListCard = (props) => {
    // props
    const { navigation, data, handleChoise } = props;

    //states 
    const [visibleMenu, setVisibleMenu] = useState(false);
    const openMenu = () => setVisibleMenu(true);
    const closeMenu = () => setVisibleMenu(false);

    // מרנדר אייקון שלוש נקודות לאופציות שניתן לבצע בכרטיס מוצר
    const rightContent = props => <Menu
        visible={visibleMenu}
        onDismiss={closeMenu}
        anchor={<IconButton {...props} icon="dots-vertical" onPress={openMenu} />}>
        <Menu.Item icon="redo" title="עריכה" onPress={() => checkChoise("edit")} />
        <Divider style={styles.menuDivider} />
        <Menu.Item icon="content-copy" title="העתקה" onPress={() => checkChoise("copy")} />
        <Divider style={styles.menuDivider} />
        <Menu.Item icon="delete" title="מחיקה" onPress={() => checkChoise("delete")}/>

    </Menu>

    const checkChoise = (choiseMethod) => {
        closeMenu();
        handleChoise(data, choiseMethod);
    };

    const OpenList = () => {
        navigation.navigate("ShoppingListTabs");
    }

    const handleDateFormat = () => {
        let date = data.createdOn.split("T")[0];
        return `${date.split("-")[2]}/${date.split("-")[1]}/${date.split("-")[0]}`;
    };

    return (
        <View style={{ ...styles.container, ...props.style }}>
            <TouchableHighlight style={styles.touchableHighLight} underlayColor="red" onPress={null}>
                <Card>
                    <Card.Title titleNumberOfLines={3} title={data.title} subtitle={`נוצר ע"י: ${data.firstName + " " + data.lastName}\nנוצר ב: ${handleDateFormat()}\n`} subtitleNumberOfLines={3} right={rightContent} />
                </Card>
            </TouchableHighlight>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
        marginTop: 10
    },
});

export default ShoppingListCard;
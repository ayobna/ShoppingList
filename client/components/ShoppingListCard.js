import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { Avatar, Card, Title, Paragraph, Menu, Divider, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ShoppingListCard = (props) => {
    // props
    const { navigation,data} = props;

    //states 
    const [visibleMenu, setVisibleMenu] = useState(false);
    const openMenu = () => setVisibleMenu(true);
    const closeMenu = () => setVisibleMenu(false);

    // מרנדר תמונה של מוצר
    const leftContent = props => <Avatar.Image size={60} source={null} />

    // מרנדר אייקון שלוש נקודות לאופציות שניתן לבצע בכרטיס מוצר
    const rightContent = props => <Menu
        visible={visibleMenu}
        onDismiss={closeMenu}
        anchor={<IconButton {...props} icon="dots-vertical" onPress={openMenu} />}>
        <Menu.Item icon="redo" title="ערוך" />


        <Divider style={styles.menuDivider} />

        <Menu.Item icon="delete"  title="מחק" />

    </Menu>

    const editProduct = () => {
        closeMenu();
        handleEditProduct(data);
    };

    const OpenList=()=>{
        navigation.navigate("ShoppingListTabs");
      }

    return (
        <View style={{ ...styles.container, ...props.style }}>
            <TouchableHighlight style={styles.touchableHighLight} underlayColor="red" onPress={null}>
                <Card>
                    <Card.Title titleNumberOfLines={3} title={data.title} subtitle={`כמות: 2`} right={rightContent} />
                    {/* <Card.Content>
                        <Paragraph>מספר מזהה: {data.ProductID}</Paragraph>
                    </Card.Content>  */}
                </Card>
            </TouchableHighlight>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal:10,
        marginTop:10
    },
});

export default ShoppingListCard;
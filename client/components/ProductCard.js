import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { Avatar, Card, Title, Paragraph, Menu, Divider, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProductCard = (props) => {
    // props
    const { data, handleDeleteProduct } = props;

    //states 
    const [visibleMenu, setVisibleMenu] = useState(false);
    const openMenu = () => setVisibleMenu(true);
    const closeMenu = () => setVisibleMenu(false);

    // מרנדר תמונה של מוצר
    const LeftContent = props => <Avatar.Image size={60} source={{ uri: `${data.ImgUri}` }} />

    // מרנדר אייקון שלוש נקודות לאופציות שניתן לבצע בכרטיס מוצר
    const RightContent = props => <Menu
        visible={visibleMenu}
        onDismiss={closeMenu}
        anchor={<IconButton {...props} icon="dots-vertical" onPress={openMenu} />}>
        <Menu.Item icon="redo" onPress={null} title="ערוך" />


        <Divider style={styles.menuDivider} />

        <Menu.Item icon="delete" onPress={deleteProducts} title="מחק" />

    </Menu>

    const deleteProducts = () => {
        handleDeleteProduct(data.ProductID);
    };


    return (
        <View style={{ ...styles.container, ...props.style }}>
            <TouchableHighlight style={styles.touchableHighLight} underlayColor="red" onPress={null}>
                <Card>
                    <Card.Title titleNumberOfLines={3} title={data.Name} subtitle={`כמות: ${data.Amount}`} left={LeftContent} right={RightContent} />
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

export default ProductCard;
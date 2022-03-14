import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { Avatar, Card, Title, Paragraph, Menu, Divider, IconButton, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatCard = (props) => {
    // props
    const { data } = props;

    //states 

    console.log(data)
    const leftContent = props => <Avatar.Image style={{alignSelf:"center"}} size={40} source={{ uri: `https://media.istockphoto.com/vectors/no-image-available-sign-vector-id922962354?k=20&m=922962354&s=612x612&w=0&h=f-9tPXlFXtz9vg_-WonCXKCdBuPUevOBkp3DQ-i0xqo=` }} />



    return (
        <View style={{ ...styles.container, ...props.style }}>
            {/* <TouchableHighlight style={styles.touchableHighLight} underlayColor="red" onPress={null}>
                <Card>
                    <Card.Title titleNumberOfLines={3} subtitle={data.firstName + " " + data.lastName} title={data.message} />

                </Card>
            </TouchableHighlight> */}
            <List.Item
                title={data.firstName + " " + data.lastName}
                description={data.message}
                left={leftContent}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});

export default ChatCard;
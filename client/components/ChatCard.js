import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { Avatar, Card, Title, Paragraph, Menu, Divider, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatCard = (props) => {
    // props
    const { data } = props;

    //states 
    console.log(data)


    return (
        <View style={{ ...styles.container, ...props.style }}>
            <TouchableHighlight style={styles.touchableHighLight} underlayColor="red" onPress={null}>
                <Card>
                    <Card.Title titleNumberOfLines={3} subtitle={data.firstName + " " + data.lastName} title={data.message} />

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

export default ChatCard;
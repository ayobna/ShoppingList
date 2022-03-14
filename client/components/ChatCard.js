import moment from 'moment';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { Avatar, Card, Title, Paragraph, Menu, Divider, IconButton, List, Caption } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API } from '../api/api';

const ChatCard = (props) => {
    // props
    const { data } = props;

    //states 

    const leftContent = props => <Avatar.Image style={{ alignSelf: "center" }} size={40} source={{ uri: `${API}/uploads/users/${data.img}` }} />



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
                style={{ paddingBottom: 0 }}
                titleStyle={{ marginLeft: 10 }}
                descriptionStyle={{ marginLeft: 10 }}
                descriptionNumberOfLines={10}
            />
            <View style={{ alignItems: "flex-end", paddingHorizontal: 5 }}>
                <Caption>{moment(data.createdOn).fromNow()}</Caption>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});

export default ChatCard;
import moment from 'moment';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, List, Caption } from 'react-native-paper';
import { API } from '../api/api';

const ChatCard = (props) => {
    // props
    const { data } = props;

    const leftContent = props => <Avatar.Image style={{ alignSelf: "center" }} size={40} source={{ uri: `${API}/uploads/users/${data.img}` }} />



    return (
        <View style={{ ...styles.container, ...props.style }}>
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
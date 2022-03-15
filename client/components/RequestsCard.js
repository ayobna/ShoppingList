import moment from 'moment';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { Avatar, Card, Title, Paragraph, Menu, Divider, IconButton, List, Caption, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API } from '../api/api';

const RequestsCard = (props) => {
    // props
    const { data, handleConfirmRequest, handleDeclineRequest } = props;

    const rightContent = props => <View style={styles.buttonContainer}>
        <IconButton
            icon="close-thick"
            color='white'
            style={{ backgroundColor: "#990f02" }}
            size={20}
            onPress={() => handleDeclineRequest(data.listID)}
        />
        <IconButton
            icon="check-bold"
            color='white'
            style={{ backgroundColor: "green" }}
            size={20}
            onPress={() => handleConfirmRequest(data.listID)}
        />
    </View>


    return (
        <View style={{ ...styles.container, ...props.style }}>
            <List.Item
                title={"הצטרפות ל: " + data.title}
                description={'הוזמנת ע"י: ' + data.firstName + " " + data.lastName}
                right={rightContent}
                // style={{ paddingBottom: 0 }}
                titleStyle={{ marginLeft: 10 }}
                descriptionStyle={{ marginLeft: 10 }}
            // descriptionNumberOfLines={10}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 5
    }
});

export default RequestsCard;
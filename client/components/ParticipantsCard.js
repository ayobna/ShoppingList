import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { Avatar, Card, Title, Paragraph, Menu, Divider, IconButton, List, Caption } from 'react-native-paper';
import { API } from '../api/api';

const ParticipantsCard = (props) => {
  // props
  const { data, listCreatorId, deleteParticipant, currentUser } = props;

  const rightContent = props => (
    <View style={styles.buttonContainer}>
      {listCreatorId !== data.userID && <IconButton
        icon="delete"
        color='red'
        size={20}
        onPress={() => deleteParticipant(data.userID)}
      />}
    </View>
  )

  const leftContent = (props) => (
    <Avatar.Image size={60} source={{ uri: API + '/uploads/users/' + data.img }} />
  );


  return (
    <View style={{ ...styles.container, ...props.style }}>
      {currentUser.userID === listCreatorId ?
        <Card>
          <Card.Title
            titleNumberOfLines={3}
            title={data.firstName + ' ' + data.lastName}
            subtitle={data.userID === listCreatorId ? 'יוצר' : ''}
            subtitleStyle={{ color: 'green' }}
            right={rightContent}
            left={leftContent}
          />
        </Card> :
        <Card>
          <Card.Title
            titleNumberOfLines={3}
            title={data.firstName + ' ' + data.lastName}
            subtitle={data.userID === listCreatorId ? 'יוצר' : ''}
            subtitleStyle={{ color: 'green' }}
            left={leftContent}
          />
        </Card>}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },

});

export default ParticipantsCard;

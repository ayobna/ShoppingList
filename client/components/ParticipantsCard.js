import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { Avatar, Card, Title, Paragraph, Menu, Divider, IconButton, List, Caption } from 'react-native-paper';
import { API } from '../api/api';

const ParticipantsCard = (props) => {
  // props
  const { data, listCreatorId } = props;

  const leftContent = (props) => (
    <Avatar.Image size={60} source={{ uri:API+'/uploads/users/'+data.img }} />
  );


  return (
    <View style={{ ...styles.container, ...props.style }}>

        <Card>
        <Card.Title
            titleNumberOfLines={3}
            title={`שם:${data.firstName+' '+data.lastName}`}
           subtitle={ data.userID===listCreatorId? 'יוצר':''}
           subtitleStyle={{color:'green'}}
          left={leftContent}
          />
</Card>

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

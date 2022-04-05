import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { Avatar, Card, List, IconButton } from 'react-native-paper';
import { API } from '../api/api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const SearchUserCard = (props) => {
  // props
  const { data, confirm } = props;



  const leftContent = (props) => (
    <Avatar.Image size={45} style={{ alignSelf: "center" }} source={{ uri: `${API}/uploads/users/${data.img}` }} theme={{ colors: { primary: "white" } }} />
  );

  const rightContent = props => <View style={styles.buttonContainer}>
    <IconButton
      icon={() => <MaterialIcons name={data.isApproved === 0 ? "person-add-disabled" : "person-add"} color="black" size={24} />}
      onPress={confirm}
      disabled={data.isApproved === 0}
    />
  </View>

  console.log(data)
  return (
    <View style={{ ...styles.container, ...props.styles }}>

      <List.Item
        title={data.firstName + ' ' + data.lastName}
        left={leftContent}
        right={rightContent}
        titleStyle={{ marginLeft: 10 }}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  titleStyle: {
    fontSize: 14,
  }

});

export default SearchUserCard;

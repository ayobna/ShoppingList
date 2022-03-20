import React, { useState } from "react";
import {View, Text, StyleSheet, TextInput, TouchableHighlight,} from "react-native";
import {Avatar, Card, Title, Paragraph, Menu, Divider, IconButton, Caption} from "react-native-paper";


const PraticipantsCard = (props) => {
  // props
  const { data } = props;
console.log(data)
  return (
    <View style={styles.container }>    
        <Card>
           <Card.Item
    titleNumberOfLines={3}
    // title={`${data.firstName} ${data.lastName}`}
    subtitle={`כמות:`}
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
  touchableHighLight: {
    borderRadius: 5
  }
});

export default PraticipantsCard;

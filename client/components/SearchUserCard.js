import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import { API } from '../api/api';

const SearchUserCard = (props) => {
  // props
  const { data } = props;



  const leftContent = (props) => (
    <Avatar.Image size={45}  source={{ uri:API+'/uploads/users/'+data.img }} />
  );


  return (
<View style={{ ...styles.container, ...props.style }}>
<Card style={{flex:1}}>
          <Card.Title
                title={data.firstName+' '+data.lastName}
                titleStyle={styles.titleStyle}
                subtitle={data.email}
                subtitleStyle={styles.titleStyle}
                left={leftContent}         
                descriptionStyle={{ marginLeft: 10 }}
            />
            </Card>
        </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom:20,
    right:16

    
  },
  titleStyle:{
      fontSize:14,         
    }

});

export default SearchUserCard;

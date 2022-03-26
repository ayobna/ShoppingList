import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import { API } from '../api/api';

const SearchUserCard = (props) => {
  // props
  const { data } = props;



  const leftContent = (props) => (
    <Avatar.Image size={50}  source={{ uri:API+'/uploads/users/'+data.img }} />
  );


  return (
<View style={{ ...styles.container, ...props.style }}>
            <List.Item
                title={data.firstName+' '+data.lastName}
                description={data.email}
                left={leftContent}
                titleStyle={{ marginLeft: 10 }}
                descriptionStyle={{ marginLeft: 10 }}
            />
        </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'blue'
    
  },
//   titleStyle:{
//       color:'red',
//       fontSize:14  ,
//       backgroundColor:'blue'
         
//     }

});

export default SearchUserCard;

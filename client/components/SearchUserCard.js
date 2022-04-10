import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, List, IconButton } from 'react-native-paper';
import { API } from '../api/api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

// varibles
const wwaitingForApprovement = 0;

const SearchUserCard = (props) => {
  // props
  const { data, confirm } = props;

  const leftContent = (props) => (
    <Avatar.Image size={45} style={{ alignSelf: "center" }} source={{ uri: `${API}/uploads/users/${data.img}` }} theme={{ colors: { primary: "white" } }} />
  );

  const rightContent = props => <View style={styles.buttonContainer}>
    <IconButton
      icon={() => <MaterialIcons name={data.isApproved === wwaitingForApprovement ? "person-add-disabled" : "person-add"} color="black" size={24} />}
      onPress={confirm}
      disabled={data.isApproved === wwaitingForApprovement}
    />
  </View>

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

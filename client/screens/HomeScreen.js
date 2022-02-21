import * as React from "react";
import { View, Text,StyleSheet, Button} from "react-native";

const HomeScreen =({ route, navigation })=> {
  const CreateList = () => {
    navigation.navigate("CreateList");
  };

  const OpenList=()=>{
    navigation.navigate("ShoppingListTabs");
  }
  return (
    <View style={styles.container}>


 
      <Button
  onPress={CreateList}
  title=" Create List"
  color="#841584"
  accessibilityLabel="CreateList"
/>
<Button
  onPress={OpenList}
  title="Open List"
  color="#841584"
  accessibilityLabel="OpenList"
/>


    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
      flex:1,
     
     justifyContent: 'center',
     alignItems:'center'
  },
})
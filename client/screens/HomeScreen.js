import react,{useEffect, useState} from "react";
import { View, Text,StyleSheet, FlatList} from "react-native";
import { FAB } from 'react-native-paper';
import { clockRunning } from "react-native-reanimated";
import { shoppingListApi ,userApi } from "../api/api";
import ShoppingListCard from "../components/ShoppingListCard";
const HomeScreen =(props)=> {
  const {navigation ,shoppingListData} = props;

  const [shoppingList, setShoppingList] = useState(shoppingListData);
  const CreateList = async() => {

  navigation.navigate("CreateList");


  };

  useEffect(() => {
    ShoppingListCreatedByUserIdGet()
  }, [])

  const ShoppingListCreatedByUserIdGet= async()=>{
    try {
      let res= await shoppingListApi.apiShoppingListCreatedByUserIdGet(1)
    // console.log(res.data)
    setShoppingList(res.data)
     console.log("this is my data", res.data);
    } catch (error) {
      console.warn(error)
    }
  }

  const renderListItem = (itemData) => (
    <ShoppingListCard
      data={itemData.item}
      navigation={navigation}
      // handleDeleteProduct={handleDeleteProduct}
      // handleEditProduct={handleEditProduct}
    />
  );

  const handleListEmptyComponent = () => {
    return (
      <View
        style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>אין מוצרים</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>

 <FlatList
        showsVerticalScrollIndicator={false}
        data={shoppingList}
        renderItem={(item) => renderListItem(item)}
        keyExtractor={(item) => String(item.listID)}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={handleListEmptyComponent}
        // ListFooterComponent={renderFooter}
        // refreshing={isFetching}
        // onRefresh={() => handleRefresh()}
      />
<FAB
    style={styles.fab}
    small
    color="white"   
    icon="plus"
    onPress={CreateList}
  />
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
      flex:1,
  },
  fab: {
    backgroundColor: 'black',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})


  
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  Pressable,
} from "react-native";
import {
  TextInput,
  IconButton,
  Button,
  Text,
  Avatar,
} from "react-native-paper";

const RegisterScreen = (props) => {
  const { navigation, route } = props;
  const [user, SetUser] = useState({ First: '', Last: '', Phone: '', fileName: '', base64: '' })
  useEffect(() => {
  
  },[]);



  return (
    <View style={styles.container}>
   <View style={styles.TextInputViews}>
   <View style={styles.TextInputView}>
                    <TextInput
                        theme={{ colors: { primary: `green` } }}
                        label="שם פרטי"
                        mode="outlined"
                        dense={true}
                        selectionColor="green"
                        onChangeText={(text) =>
                            SetUser(prevState => ({
                                ...prevState,
                                FirstName: text
                            }))
                                                }
                    />
                </View>

                <View style={styles.TextInputView}>
                    <TextInput
                        theme={{ colors: { primary: `green` } }}
                        label="שם משפחה"
                        mode="outlined"
                        dense={true}
                        selectionColor="green"
                        onChangeText={(text) =>
                            SetUser(prevState => ({
                                ...prevState,
                                LastName: text
                            }))
                        }   />
                </View>
                <View style={styles.TextInputView}>
                    <TextInput
                        theme={{ colors: { primary: `green` } }}
                        label="מייל"
                        mode="outlined"
                        dense={true}
                        selectionColor="green"
                        onChangeText={(text) =>
                            SetUser(prevState => ({
                                ...prevState,
                                Email: text
                            }))
                        } />
                </View>
                <View style={styles.TextInputView}>
                    <TextInput
                        theme={{ colors: { primary: `green` } }}
                        label="סיסמה"
                        mode="outlined"
                        secureTextEntry={true}
                        dense={true}
                        selectionColor="green"
                        onChangeText={(text) =>
                            SetUser(prevState => ({
                                ...prevState,
                                First: text
                            }))
                        }
                    />
                </View>
                <View style={styles.TextInputView}>
                    <TextInput
                        theme={{ colors: { primary: `green` } }}
                        label="אימות סיסמה"
                        mode="outlined"                
                        dense={true}
                        secureTextEntry={true}
                        selectionColor="green"
                        onChangeText={(text) =>
                            SetUser(prevState => ({
                                ...prevState,
                                ConfirmPassword: text
                            }))
                        }                
                    />
                </View>

            </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems:'center',
      backgroundColor:'white',
     //justifyContent:'center'
    
    },
    TextInputViews:{
        top:"20%",
        width:"100%",
       
        alignItems:'center',
  
    },
    TextInputView:{    
        width: "70%",  
    }
  });

export default RegisterScreen;
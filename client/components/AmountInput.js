import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { IconButton } from 'react-native-paper';


const AmountInput = (props) => {
    // props
    const { amount, handlePlusMinusAmount, handleOnChangeAmount, edit, isError } = props;


    return (
        <View style={[styles.container, isError && { borderColor: "red" }]}>
            <IconButton
                icon="plus"
                style={{ margin: 0 }}
                size={18}
                onPress={() => handlePlusMinusAmount("+", edit)}
            />

            <TextInput
                value={amount}
                width={50}
                onChangeText={(txt) => handleOnChangeAmount(txt, edit)}
                dense
                mode="outlined"
                keyboardType='numeric'

                style={{ fontSize: 12, paddingHorizontal: 2, textAlign: "center" }}
            />
            <IconButton
                style={{ margin: 0 }}
                icon="minus"
                size={18}
                onPress={() => handlePlusMinusAmount("-", edit)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "black",
        justifyContent: "center",
        padding: 5
    },
});

export default AmountInput;
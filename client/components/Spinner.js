import Reacr from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const Spinner = (props) => {
    return(
        <View style={styles.container}>
            <ActivityIndicator size="large" animating={true} color="black"/>
        </View>
    );
 };


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Spinner;
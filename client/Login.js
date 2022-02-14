import * as AuthSession from 'expo-auth-session';
import jwtDecode from 'jwt-decode';
import { Alert, Platform, StyleSheet, Image, Button } from 'react-native';
import { View } from 'react-native-web';

// you need to swap out these details with your auth0 credientals
const auth0ClientId = "";
const authorizationEndpoint = "https://yourtennant.auth0.com/authorize";


const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

console.log(redirectUri)  // <-- you will need to add this to your auth0 callbacks / logout configs

export default function Login() {
    const [request, result, promptAsync] = AuthSession.useAuthRequest(
        {
            redirectUri,
            clientId: auth0ClientId,
            // id_token will return a JWT token
            responseType: 'id_token',
            // retrieve the user's profile
            scopes: ['openid', 'profile', 'email'],
            extraParams: {
                // ideally, this will be a random value
                nonce: 'nonce',
            },
        },
        { authorizationEndpoint }
    );

    return (
        <View>
            <Button
                onPress={() => promptAsync({ useProxy })} // <-- will open the universal login 
            >
                Login
            </Button>
        </View>
    );
}
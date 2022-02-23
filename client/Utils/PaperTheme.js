import { configureFonts, DefaultTheme } from 'react-native-paper';

const fontConfig = {
    web: {
        thin: {
            fontFamily: 'our-font-thin',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'our-font-light',
            fontWeight: 'normal',
        },
        regular: {
            fontFamily: 'our-font-regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'our-font-medium',
            fontWeight: 'normal',
        },
        bold: {
            fontFamily: 'our-font-bold',
            fontWeight: 'normal'
        }
    },
    ios: {
        thin: {
            fontFamily: 'our-font-thin',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'our-font-light',
            fontWeight: 'normal',
        },
        regular: {
            fontFamily: 'our-font-regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'our-font-medium',
            fontWeight: 'normal',
        },
        bold: {
            fontFamily: 'our-font-bold',
            fontWeight: 'normal'
        }
    },
    android: {
        thin: {
            fontFamily: 'our-font-thin',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'our-font-light',
            fontWeight: 'normal',
        },
        regular: {
            fontFamily: 'our-font-regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'our-font-medium',
            fontWeight: 'normal',
        },
        bold: {
            fontFamily: 'our-font-bold',
            fontWeight: 'normal'
        }
    }
};

const theme = {
    ...DefaultTheme,
    fonts: configureFonts(fontConfig),
};

export default theme;
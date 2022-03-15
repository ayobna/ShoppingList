import 'react-native-url-polyfill/auto';
import { ShoppinglistApi, ProductApi, UserApi, Configuration, ChatApi, RequestsApi } from '../generated';

let config = new Configuration({
  basePath: "https://shoppinglist20220314080115.azurewebsites.net"
});

const chatApi = new ChatApi(config);

const shoppingListApi = new ShoppinglistApi(config);
const productApi = new ProductApi(config);
const userApi = new UserApi(config);
const requestApi = new RequestsApi(config);
const API = 'https://shoppinglist20220314080115.azurewebsites.net'
export { userApi, shoppingListApi, productApi, chatApi,requestApi, API };
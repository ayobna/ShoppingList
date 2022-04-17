import { API_ShoppingList } from '@env';
import 'react-native-url-polyfill/auto';
import { ShoppinglistApi, ProductApi, UserApi, Configuration, ChatApi, RequestsApi, ListUsersApi, LoginApi } from '../generated';
let config = new Configuration({
  basePath : API_ShoppingList.toString()
});

const chatApi = new ChatApi(config);

const shoppingListApi = new ShoppinglistApi(config);
const productApi = new ProductApi(config);
const userApi = new UserApi(config);
const requestApi = new RequestsApi(config);
const listUsersApi = new ListUsersApi(config);
const loginApi = new LoginApi(config);
const API = API_ShoppingList.toString()
export { userApi, shoppingListApi, productApi, chatApi, requestApi, listUsersApi, loginApi, API };
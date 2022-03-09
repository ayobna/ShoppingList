import 'react-native-url-polyfill/auto';
import {ShoppinglistApi,ProductApi, UserApi,Configuration ,ChatApi} from '../generated';

    let config = new Configuration({
        basePath: "https://shoppinglist20220211160436.azurewebsites.net"
    });

    const chatApi= new ChatApi(config);

  const shoppingListApi = new ShoppinglistApi(config);
  const productApi = new ProductApi(config);
  const userApi = new UserApi(config);
export { userApi,shoppingListApi ,productApi ,chatApi};
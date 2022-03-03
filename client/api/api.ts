import 'react-native-url-polyfill/auto';
import { ProductApi, ShoppinglistApi, UserApi} from '../generated';


const userApi = new UserApi();
const shoppingListApi = new ShoppinglistApi();
const  productApi= new ProductApi();
export { userApi,shoppingListApi ,productApi};
/* tslint:disable */
/* eslint-disable */
/**
 * ShoppingList
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Configuration } from './configuration';
import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from './base';

/**
 * 
 * @export
 * @interface Product
 */
export interface Product {
    /**
     * 
     * @type {number}
     * @memberof Product
     */
    'productID'?: number;
    /**
     * 
     * @type {number}
     * @memberof Product
     */
    'listID'?: number;
    /**
     * 
     * @type {number}
     * @memberof Product
     */
    'creatorID'?: number;
    /**
     * 
     * @type {string}
     * @memberof Product
     */
    'name'?: string | null;
    /**
     * 
     * @type {number}
     * @memberof Product
     */
    'amount'?: number;
    /**
     * 
     * @type {string}
     * @memberof Product
     */
    'img'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Product
     */
    'createdOn'?: string;
    /**
     * 
     * @type {boolean}
     * @memberof Product
     */
    'isActive'?: boolean;
}
/**
 * 
 * @export
 * @interface ShoppingListCard
 */
export interface ShoppingListCard {
    /**
     * 
     * @type {number}
     * @memberof ShoppingListCard
     */
    'listID'?: number;
    /**
     * 
     * @type {string}
     * @memberof ShoppingListCard
     */
    'title'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ShoppingListCard
     */
    'createdOn'?: string;
    /**
     * 
     * @type {string}
     * @memberof ShoppingListCard
     */
    'firstName'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ShoppingListCard
     */
    'lastName'?: string | null;
}
/**
 * 
 * @export
 * @interface Shoppinglist
 */
export interface Shoppinglist {
    /**
     * 
     * @type {number}
     * @memberof Shoppinglist
     */
    'listID'?: number;
    /**
     * 
     * @type {number}
     * @memberof Shoppinglist
     */
    'creatorID'?: number;
    /**
     * 
     * @type {string}
     * @memberof Shoppinglist
     */
    'title'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Shoppinglist
     */
    'createdOn'?: string;
    /**
     * 
     * @type {boolean}
     * @memberof Shoppinglist
     */
    'isActive'?: boolean;
}
/**
 * 
 * @export
 * @interface User
 */
export interface User {
    /**
     * 
     * @type {number}
     * @memberof User
     */
    'userID'?: number;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'email'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'firstName'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'lastName'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'password'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'phoneNumber'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'img'?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof User
     */
    'isActive'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'notificationToken'?: string | null;
}

/**
 * ProductApi - axios parameter creator
 * @export
 */
export const ProductApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {Array<Product>} [product] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiProductAddProductsToShoppingListPost: async (product?: Array<Product>, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/Product/AddProductsToShoppingList`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(product, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * ProductApi - functional programming interface
 * @export
 */
export const ProductApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ProductApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {Array<Product>} [product] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiProductAddProductsToShoppingListPost(product?: Array<Product>, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiProductAddProductsToShoppingListPost(product, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * ProductApi - factory interface
 * @export
 */
export const ProductApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ProductApiFp(configuration)
    return {
        /**
         * 
         * @param {Array<Product>} [product] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiProductAddProductsToShoppingListPost(product?: Array<Product>, options?: any): AxiosPromise<void> {
            return localVarFp.apiProductAddProductsToShoppingListPost(product, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ProductApi - object-oriented interface
 * @export
 * @class ProductApi
 * @extends {BaseAPI}
 */
export class ProductApi extends BaseAPI {
    /**
     * 
     * @param {Array<Product>} [product] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProductApi
     */
    public apiProductAddProductsToShoppingListPost(product?: Array<Product>, options?: AxiosRequestConfig) {
        return ProductApiFp(this.configuration).apiProductAddProductsToShoppingListPost(product, options).then((request) => request(this.axios, this.basePath));
    }
}


/**
 * ShoppinglistApi - axios parameter creator
 * @export
 */
export const ShoppinglistApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {Shoppinglist} [shoppinglist] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiShoppingListCopyShoppingListPost: async (shoppinglist?: Shoppinglist, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/shoppingList/CopyShoppingList`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(shoppinglist, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {Shoppinglist} [shoppinglist] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiShoppingListCreateShoppingListPost: async (shoppinglist?: Shoppinglist, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/shoppingList/CreateShoppingList`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(shoppinglist, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiShoppingListCreatedByUserIdGet: async (id: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('apiShoppingListCreatedByUserIdGet', 'id', id)
            const localVarPath = `/api/shoppingList/CreatedByUser/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} [id] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiShoppingListDeleteShoppinglistPost: async (id?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/shoppingList/DeleteShoppinglist`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (id !== undefined) {
                localVarQueryParameter['id'] = id;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {ShoppingListCard} [shoppingListCard] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiShoppingListUpdateShoppinglistPost: async (shoppingListCard?: ShoppingListCard, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/shoppingList/UpdateShoppinglist`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(shoppingListCard, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiShoppingListUserIsAParticipantIdGet: async (id: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('apiShoppingListUserIsAParticipantIdGet', 'id', id)
            const localVarPath = `/api/shoppingList/UserIsAParticipant/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * ShoppinglistApi - functional programming interface
 * @export
 */
export const ShoppinglistApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ShoppinglistApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {Shoppinglist} [shoppinglist] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiShoppingListCopyShoppingListPost(shoppinglist?: Shoppinglist, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiShoppingListCopyShoppingListPost(shoppinglist, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {Shoppinglist} [shoppinglist] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiShoppingListCreateShoppingListPost(shoppinglist?: Shoppinglist, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiShoppingListCreateShoppingListPost(shoppinglist, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiShoppingListCreatedByUserIdGet(id: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiShoppingListCreatedByUserIdGet(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {number} [id] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiShoppingListDeleteShoppinglistPost(id?: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiShoppingListDeleteShoppinglistPost(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {ShoppingListCard} [shoppingListCard] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiShoppingListUpdateShoppinglistPost(shoppingListCard?: ShoppingListCard, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiShoppingListUpdateShoppinglistPost(shoppingListCard, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiShoppingListUserIsAParticipantIdGet(id: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiShoppingListUserIsAParticipantIdGet(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * ShoppinglistApi - factory interface
 * @export
 */
export const ShoppinglistApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ShoppinglistApiFp(configuration)
    return {
        /**
         * 
         * @param {Shoppinglist} [shoppinglist] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiShoppingListCopyShoppingListPost(shoppinglist?: Shoppinglist, options?: any): AxiosPromise<void> {
            return localVarFp.apiShoppingListCopyShoppingListPost(shoppinglist, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {Shoppinglist} [shoppinglist] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiShoppingListCreateShoppingListPost(shoppinglist?: Shoppinglist, options?: any): AxiosPromise<void> {
            return localVarFp.apiShoppingListCreateShoppingListPost(shoppinglist, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiShoppingListCreatedByUserIdGet(id: number, options?: any): AxiosPromise<void> {
            return localVarFp.apiShoppingListCreatedByUserIdGet(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} [id] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiShoppingListDeleteShoppinglistPost(id?: number, options?: any): AxiosPromise<void> {
            return localVarFp.apiShoppingListDeleteShoppinglistPost(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {ShoppingListCard} [shoppingListCard] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiShoppingListUpdateShoppinglistPost(shoppingListCard?: ShoppingListCard, options?: any): AxiosPromise<void> {
            return localVarFp.apiShoppingListUpdateShoppinglistPost(shoppingListCard, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiShoppingListUserIsAParticipantIdGet(id: number, options?: any): AxiosPromise<void> {
            return localVarFp.apiShoppingListUserIsAParticipantIdGet(id, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ShoppinglistApi - object-oriented interface
 * @export
 * @class ShoppinglistApi
 * @extends {BaseAPI}
 */
export class ShoppinglistApi extends BaseAPI {
    /**
     * 
     * @param {Shoppinglist} [shoppinglist] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ShoppinglistApi
     */
    public apiShoppingListCopyShoppingListPost(shoppinglist?: Shoppinglist, options?: AxiosRequestConfig) {
        return ShoppinglistApiFp(this.configuration).apiShoppingListCopyShoppingListPost(shoppinglist, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {Shoppinglist} [shoppinglist] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ShoppinglistApi
     */
    public apiShoppingListCreateShoppingListPost(shoppinglist?: Shoppinglist, options?: AxiosRequestConfig) {
        return ShoppinglistApiFp(this.configuration).apiShoppingListCreateShoppingListPost(shoppinglist, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ShoppinglistApi
     */
    public apiShoppingListCreatedByUserIdGet(id: number, options?: AxiosRequestConfig) {
        return ShoppinglistApiFp(this.configuration).apiShoppingListCreatedByUserIdGet(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} [id] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ShoppinglistApi
     */
    public apiShoppingListDeleteShoppinglistPost(id?: number, options?: AxiosRequestConfig) {
        return ShoppinglistApiFp(this.configuration).apiShoppingListDeleteShoppinglistPost(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {ShoppingListCard} [shoppingListCard] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ShoppinglistApi
     */
    public apiShoppingListUpdateShoppinglistPost(shoppingListCard?: ShoppingListCard, options?: AxiosRequestConfig) {
        return ShoppinglistApiFp(this.configuration).apiShoppingListUpdateShoppinglistPost(shoppingListCard, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ShoppinglistApi
     */
    public apiShoppingListUserIsAParticipantIdGet(id: number, options?: AxiosRequestConfig) {
        return ShoppinglistApiFp(this.configuration).apiShoppingListUserIsAParticipantIdGet(id, options).then((request) => request(this.axios, this.basePath));
    }
}


/**
 * UserApi - axios parameter creator
 * @export
 */
export const UserApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiGetUserByIdIdGet: async (id: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('apiGetUserByIdIdGet', 'id', id)
            const localVarPath = `/Api/GetUserById/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {User} [user] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiUsersCreateUserPost: async (user?: User, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/Api/Users/CreateUser`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(user, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiUsersGetGet: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/usersGet`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * UserApi - functional programming interface
 * @export
 */
export const UserApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = UserApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiGetUserByIdIdGet(id: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiGetUserByIdIdGet(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {User} [user] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiUsersCreateUserPost(user?: User, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiUsersCreateUserPost(user, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiUsersGetGet(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiUsersGetGet(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * UserApi - factory interface
 * @export
 */
export const UserApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = UserApiFp(configuration)
    return {
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiGetUserByIdIdGet(id: number, options?: any): AxiosPromise<void> {
            return localVarFp.apiGetUserByIdIdGet(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {User} [user] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiUsersCreateUserPost(user?: User, options?: any): AxiosPromise<void> {
            return localVarFp.apiUsersCreateUserPost(user, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiUsersGetGet(options?: any): AxiosPromise<void> {
            return localVarFp.apiUsersGetGet(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UserApi - object-oriented interface
 * @export
 * @class UserApi
 * @extends {BaseAPI}
 */
export class UserApi extends BaseAPI {
    /**
     * 
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public apiGetUserByIdIdGet(id: number, options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).apiGetUserByIdIdGet(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {User} [user] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public apiUsersCreateUserPost(user?: User, options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).apiUsersCreateUserPost(user, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public apiUsersGetGet(options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).apiUsersGetGet(options).then((request) => request(this.axios, this.basePath));
    }
}



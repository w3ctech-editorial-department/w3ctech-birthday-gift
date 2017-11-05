/**
 * @file HTTP wrapper of fetch
 * @author chris<wfsr@foxmail.com>
 */
import Cookie from './Cookie';

const TIMEOUT = 30000;
// 返回数据错误，请稍后重试(-500)
const DATA_ERROR_MESSAGE = 'Failed to load data, please contact us.';
//  服务器错误，请稍后重试(-500)
const SERVER_ERROR_MESSAGE = 'Our server is taking too long to respond because of a server error. '
    + 'Please contact us or try again later.';
// 网络错误，请稍后重试(-1)
const NETWORK_ERROR_MESSAGE = 'Looks like you have an unstable network at the moment, '
    + 'please try again when network stabilizes.';
// 网络超时，请稍后重试(408)
const NETWORK_TIMEOUT_MESSAGE = 'Looks like the server is taking too long to respond '
    + 'because of poor connectivity or a server error. '
    + 'Please contact us or try again later.';
const csrfPolyfill = data => data.csrfmiddlewaretoken = Cookie.get('csrftoken');

/**
 * 响应处理
 *
 * @param {string} url  请求的 URL 地址
 * @param {Object} options 请求配置项
 * @param {?function(JSON)} callback 回调函数
 * @return {JSON} 接口响应结果
 */
export async function request(url, options, callback) {
    let res;
    try {
        res = await fetch(url, options);
    }
    catch (e) {
        const isNetError = ('Network request failed' === e.message);
        return {
            status: isNetError ? -1 : -500,
            data: isNetError ? NETWORK_ERROR_MESSAGE : SERVER_ERROR_MESSAGE
        };
    }

    if (res.ok) {
        let json;
        try {
            json = await res.json();
        }
        catch (e) {
            return {
                status: -500,
                data: DATA_ERROR_MESSAGE
            };
        }
        if (typeof callback === 'function') {
            callback(json);
        }

        return json;
    }

    return {
        status: res.status,
        data: SERVER_ERROR_MESSAGE
    };
}

function delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function timeout(delay = TIMEOUT) {
    return new Promise(resolve => {
        setTimeout(() => resolve({
            status: 408,
            data: NETWORK_TIMEOUT_MESSAGE
        }), delay);
    });
}

/**
 * HTTP POST
 *
 * @param {string} url POST 地址
 * @param {JSON} data POST 的数据
 * @param {?function(JSON)} callback 回调函数
 * @return {JSON} 请求返回的数据
 */
export async function post(url, data, callback) {
    csrfPolyfill(data);

    const body = Object.entries(data).map(([key, value]) => key + '=' + encodeURIComponent(value)).join('&');

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'include',
        body: body
    };

    return await Promise.race([
        request(url, options, callback),
        timeout()
    ]);
}

const cache = new Map();

/**
 * HTTP GET
 *
 * @param {string} url GET 地址
 * @param {JSON} params Query 数据
 * @param {?function(JSON)} callback 回调函数
 * @return {JSON} 请求返回的数据
 */
export async function get(url, params, callback) {
    const options = {
        method: 'GET',
        credentials: 'include'
    };

    if (params) {
        const query = Object.entries(params)
            .map(([key, value]) => key + '=' + encodeURIComponent(value))
            .join('&');

        if (url.indexOf('?') < 0) {
            url += '?';
        }

        url += query;

    }

    const cached = cache.get(url);
    if (cached) {
        await delay(200);
        return Promise.resolve(cached);
    }

    const newCallback = json => {
        if (json.status === 0) {
            cache.set(url, json);
        }

        if (typeof callback === 'function') {
            callback(json);
        }
    };

    return await Promise.race([
        request(url, options, newCallback),
        timeout()
    ]);
}

/**
 * @file Cookie 读写模块
 * @author chris(wfsr@foxmail.com)
 */


/**
 * 转义正则关键字字符
 *
 * @param {string} str 需要转义的字符
 * @return {string} 转义后的字符
 * @inner
 */
const escapeRegExp = function (str) {
    return String(str).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
};

/**
 * Cookie 模块
 *
 * @exports Cookie
 * @example
 * let cookie = new Cookie('foo', {
 *     duration: 1, // 1 天
 *     domain: 'foo.com',
 *      path: '/'
 *  });
 * cookie.set('bar');
 * cookie.get(); // 'bar'
 *
 * 或者使用静态方法：
 *
 * Cookie.set('foo', 'bar');
 * Cookie.get('foo');   // 'bar'
 */
export default class Cookie {

    /**
     * 读取指定键名的 Cookie 值
     *
     * @see Cookie#get
     * @param {string} key 指定新的键名
     * @return {string} Cookie 中键名为 `key` 的值，无值返回空字符
     * @public
     */
    static get(key) {
        return new Cookie(key).get();
    }

    /**
     * 设置指定键的 Cookie 值
     *
     * @see Cookie#set
     * @public
     * @param {string} key 指定的 Cookie 键名
     * @param {string} value 要设置的 Cookie 值
     * @param {Object} options Cookie 配置项
     *        @see Cookie#options
     * @return {Cookie} 当前 Cookie 实例
     */
    static set(key, value, options) {
        return new Cookie(key, options).set(value);
    }

    /**
     * 移除指定键名的 Cookie
     *
     * @see Cookie#remove
     * @public
     * @param {string} key 要移除的 Cookie 键名
     * @param {Object} options Cookie 配置项
     * @return {Cookie} 当前 Cookie 实例
     */
    static remove(key, options) {
        return new Cookie(key, options).remove();
    }


    /**
     * 控件配置项
     *
     * @private
     * @property {string} path Cookie 的存储路径
     * @property {string} domain Cookie 的存取域
     * @property {number} duration Cookie 的有效天数
     * @property {boolean} secure 是否安全连接 (https)
     */
    options = {
        path: '/',
        domain: '',
        duration: 0,
        secure: false
    }

    /**
     * 初始化
     *
     * @private
     * @param {string} key Cookie 键名
     * @param {?Object=} options 配置项 @see Cookie#options
     */
    constructor(key, options) {
        options = Object.assign(this.options, options);

        this.key = key;

        this.value = [
            options.domain ? 'domain=' + options.domain : '',
            options.path ? 'path=' + options.path : '',
            options.secure ? 'secure' : ''
        ].join('; ');
    }

    /**
     * 读取指定键名的 Cookie 值
     *
     * @public
     * @param {?string} key 指定新的键名
     * @return {string} Cookie 中键名为 `key` 的值，无值返回空字符
     */
    get(key) {
        const value = document.cookie.match(
            '(?:^|;)\\s*' + escapeRegExp(key || this.key) + '=([^;]*)'
        );
        return value ? decodeURIComponent(value[1]) : '';
    }

    /**
     * 设置指定键的 Cookie 值
     *
     * @public
     * @param {?string} key 指定的 Cookie 键名
     * @param {string} value 要设置的 Cookie 值
     * @return {Cookie} 当前 Cookie 实例
     */
    set(key, value) {
        if (arguments.length < 2) {
            value = key;
            key = this.key;
        }

        const options = this.options;
        value = encodeURIComponent(value) + this.value;

        if (options.duration) {
            value += ''
                + '; expires='
                + new Date(
                    options.duration * 86400000 + (+new Date())
                ).toUTCString();
        }

        document.cookie = key + '=' + value;
        return this;
    }

    /**
     * 移除指定键名的 Cookie
     *
     * @public
     * @param {?string} key 要移除的 Cookie 键名
     * @return {Cookie} 当前 Cookie 实例
     */
    remove(key) {
        const options = this.options;
        const duration = options.duration;
        options.duration = -1;
        this.set(key || this.key);
        options.duration = duration;

        return this;
    }
}

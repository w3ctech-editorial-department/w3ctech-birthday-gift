# ThinkJS 3.0 Documentation

# 快速入门

## 介绍

ThinkJS 是一款面向未来开发的 Node.js 框架，整合了大量的项目最佳实践，让企业级开发变得如此简单、高效。从 3.0 开始，框架底层基于 Koa 2.x 实现，兼容 Koa 的所有功能。

### 特性

* 基于 Koa 2.x，兼容 middleware
* 内核小巧，支持 Extend、Adapter 等插件方式
* 性能优异，单元测试覆盖程度高
* 内置自动编译、自动更新机制，方便快速开发
* 使用更优雅的 `async/await` 处理异步问题，不再支持 `*/yield`

### 架构

[![](https://p5.ssl.qhimg.com/t0127dc46905fdcef9c.jpg)](https://p5.ssl.qhimg.com/t0127dc46905fdcef9c.jpg)


## 快速入门

借助 ThinkJS 提供的脚手架，可以快速的创建一个项目。为了可以使用更多的 ES6 特性，框架要求 Node.js 的版本至少是 `6.x`，建议使用 [LTS 版本](https://nodejs.org/en/download/)。

### 安装 ThinkJS 命令


```sh
$ npm install -g think-cli
```

安装完成后，系统中会有 `thinkjs` 命令（可以通过 `thinkjs -v` 查看 think-cli 的版本号，此版本号非 thinkjs 的版本号）。如果找不到这个命令，请确认环境变量是否正确。

如果是从 `2.x` 升级，需要将之前的命令删除，然后重新安装。

### 卸载旧版本命令

```sh
$ npm uninstall -g thinkjs
```

### 创建项目

执行 `thinkjs new [project_name]` 来创建项目，如：

```
$ thinkjs new demo;
$ cd demo;
$ npm install; 
$ npm start; 
```

执行完成后，控制台下会看到类似下面的日志：

```
[2017-06-25 15:21:35.408] [INFO] - Server running at http://127.0.0.1:8360
[2017-06-25 15:21:35.412] [INFO] - ThinkJS version: 3.0.0-beta1
[2017-06-25 15:21:35.413] [INFO] - Enviroment: development
[2017-06-25 15:21:35.413] [INFO] - Workers: 8
```

打开浏览器访问 `http://127.0.0.1:8360/`，如果是在远程机器上创建的项目，需要把 IP 换成对应的地址。

### 项目结构

默认创建的项目结构如下：

```text
|--- development.js   //开发环境下的入口文件
|--- nginx.conf  //nginx 配置文件
|--- package.json
|--- pm2.json //pm2 配置文件
|--- production.js //生产环境下的入口文件
|--- README.md
|--- src
| |--- bootstrap  //启动自动执行目录 
| | |--- master.js //Master 进程下自动执行
| | |--- worker.js //Worker 进程下自动执行
| |--- config  //配置文件目录
| | |--- adapter.js  // adapter 配置文件 
| | |--- config.js  // 默认配置文件 
| | |--- config.production.js  //生产环境下的默认配置文件，和 config.js 合并 
| | |--- extend.js  //extend 配置文件 
| | |--- middleware.js //middleware 配置文件 
| | |--- router.js //自定义路由配置文件
| |--- controller  //控制器目录 
| | |--- base.js
| | |--- index.js
| |--- logic //logic 目录
| | |--- index.js
| |--- model //模型目录
| | |--- index.js
|--- view  //模板目录
| |--- index_index.html
|--- www
| |--- static  //静态资源目录
| | |--- css
| | |--- img
| | |--- js
```


## 升级指南

本文档为 2.x 升级到 3.x 的文档，由于本次升级接口改动较大，所以无法平滑升级。本文档更多的是介绍接口变化指南。

### 变化列表
#### 核心变化

3.0 抛弃了 2.x 的核心架构，基于 Koa 2.x 版本构建，兼容 Koa 里的所有功能。主要变化为：

* 之前的 `http` 对象改为 `ctx` 对象
* 执行完全改为调用 `middleware` 来完成
* 框架内置的很多功能不再默认内置，可以通过扩展来支持

#### 项目启动

2.x 中项目启动时，会自动加载 `src/bootstrap/` 目录下的所有文件。3.0 中不再自动加载所有的文件，而是改为：

* 在 Master 进程中加载 `src/boostrap/master.js` 文件
* 在 Worker 进程中加载 `src/boostrap/worker.js` 文件

如果还要加载其他的文件，那么可以在对应的文件中使用 `require` 方式引入进去。

#### 配置

2.x 中会自动加载 `src/config/` 目录下的所有文件，3.0 中改为根据功能加载对应的文件。

#### hook 和 middleware

移除 2.x 里的 hook 和 middleware，改为 Koa 里的 middleware，middleware 的管理放在 `src/config/middleware.js` 配置文件中。

2.x 下的 middleware 类无法在 3.0 下使用，3.0 下可以直接使用 Koa 的 middleware。

#### Controller

将基类 `think.controller.base` 改为 `think.Controller`，并移除 `think.controller.rest` 类。

#### Model

将基类 `think.model.base` 改为 `think.Model`。

#### View

模板的配置由原来的 `src/common/config/view.js` 迁移至 `src/config/config.js` 中，配置方法和之前基本一致。

其中老版本的 `preRender()` 方法已经废弃，新方法名为 `beforeRender()`。`nunjucks` 模板引擎的参数顺序由原来的 `preRender(nunjucks, env, config)` 修改为 `beforeRender(env, nunjucks, config)`。

#### 阻止后续执行

移除了 `think.prevent` 等阻止后续执行的方法，替换为在 `__before`、`xxxAction`、`__after` 中返回 `false` 来阻止后续代码继续执行。 

#### 错误处理

2.x 创建项目时，会创建对应的 error.js 文件用来处理错误。3.0 里改为使用中间件 [think-trace](https://github.com/thinkjs/think-trace) 处理。

### 升级建议

由于 3.0 改动了很多东西，所以不太容易基于原有项目代码简单修改来升级。建议使用新的脚手架工具创建项目，然后一一将之前的代码拷贝到新项目中进行修改。



# 基础功能

## 运行流程

Node.js 提供了 [http](https://nodejs.org/api/http.html) 模块直接创建 HTTP 服务，用来响应用户的请求，比如 Node.js 官网提供的创建 HTTP 服务的例子：

```js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
 ThinkJS 也是调用 `http.createServer` 的方式来创建服务的，所以整个运行流程包含了启动服务和响应用户请求二个部分。

### 系统服务启动

* 执行 `npm start` 或者 `node development.js`
* 实例化 ThinkJS 里的 [Application](https://github.com/thinkjs/thinkjs/blob/3.0/lib/application.js) 类，执行 `run` 方法。
* 根据不同的环境（Master 进程、Worker 进程、命令行调用）处理不同的逻辑
* 如果是 Master 进程
    - 加载配置文件，生成 `think.config` 和 `think.logger` 对象。
    - 加载文件 `src/bootstrap/master.js` 文件
    - 如果配置文件监听服务，那么开始监听文件的变化，目录为 `src/`。
    - 文件修改后，如果配置文件编译服务，那么会对文件进行编译，编译到 `app/` 目录下。
    - 根据配置 `workers` 来 fork 对应数目的 Worker。Worker 进程启动完成后，触发 `appReady` 事件。（可以通过 `think.app.on("appReady")` 来捕获）
    - 如果文件发生了新的修改，那么会触发编译，然后杀掉所有的 Worker 进程并重新 fork。
* 如果是 Worker 进程
    - 加载配置文件，生成 `think.config` 和 `think.logger` 对象。
    - 加载 Extend，为框架提供更多的功能，配置文件为 `src/config/extend.js`。
    - 获取当前项目的模块列表，放在 `think.app.modules` 上，如果为单模块，那么值为空数组。
    - 加载项目里的 controller 文件（`src/controller/*.js`），放在 `think.app.controllers` 对象上。
    - 加载项目里的 logic 文件（`src/logic/*.js`），放在 `think.app.logics` 对象上。
    - 加载项目里的 model 文件（`src/model/*.js`），放在 `think.app.models` 对象上。
    - 加载项目里的 service 文件（`src/service/*.js`），放在 `think.app.services` 对象上。
    - 加载路由配置文件 `src/config/router.js`，放在 `think.app.routers` 对象上。
    - 加载校验配置文件 `src/config/validator.js`，放在 `think.app.validators` 对象上。
    - 加载 middleware 配置文件 `src/config/middleware.js`，并通过 `think.app.use` 方法注册。
    - 加载定时任务配置文件 `src/config/crontab.js`，并注册定时任务服务。
    - 加载 `src/bootstrap/worker.js` 启动文件。
    - 监听 process 里的 `onUncaughtException` 和 `onUnhandledRejection` 错误事件，并进行处理。可以在配置 `src/config.js` 自定义这二个错误的处理函数。
    - 等待 `think.beforeStartServer` 注册的启动前处理函数执行，这里可以注册一些服务启动前的事务处理。
    - 如果自定义了创建服务配置 `createServer`，那么执行这个函数 `createServer(port, host, callback)` 来创建服务。
    - 如果没有自定义，则通过 `think.app.listen` 来启动服务。
    - 服务启动完成时，触发 `appReady` 事件，其他地方可以通过 `think.app.on("appReady")` 监听。
    - 创建的服务赋值给 `think.app.server` 对象。

服务启动后，会打印下面的日志：

```sh
[2017-07-02 13:36:40.646] [INFO] - Server running at http://127.0.0.1:8360
[2017-07-02 13:36:40.649] [INFO] - ThinkJS version: 3.0.0-beta1
[2017-07-02 13:36:40.649] [INFO] - Enviroment: development  #当前运行的环境
[2017-07-02 13:36:40.649] [INFO] - Workers: 8   #子进程数量
```

### 用户请求处理

当用户请求服务时，会经过下面的步骤进行处理。

* 请求到达 webserver（如：nginx），通过反向代理将请求转发给 node 服务。如果直接通过端口访问 node 服务，那么就没有这一步了。
* node 服务接收用户请求，Master 进程将请求转发给对应的 Worker 进程。
* Worker 进程通过注册的 middleware 来处理用户的请求：
    - [meta](https://github.com/thinkjs/think-meta) 来处理一些通用的信息，如：设置请求的超时时间、是否发送 ThinkJS 版本号、是否发送处理的时间等。
    - [resource](https://github.com/thinkjs/think-resource) 处理静态资源请求，静态资源都放在 `www/static/` 下，如果命中当前请求是个静态资源，那么这个 middleware 处理完后提前结束，不再执行后面的 middleware。
    - [trace](https://github.com/thinkjs/think-trace) 处理一些错误信息，开发环境下打印详细的错误信息，生产环境只是报一个通用的错误。
    - [payload](https://github.com/thinkjs/think-payload) 处理用户上传的数据，包含：表单数据、文件等。解析完成后将数据放在 `request.body` 对象上，方便后续读取。
    - [router](https://github.com/thinkjs/think-router) 解析路由，解析出请求处理对应的 Controller 和 Action，放在 `ctx.controller` 和 `ctx.action` 上，方便后续处理。如果项目是多模块结构，那么还有 `ctx.module`。
    - [logic](https://github.com/thinkjs/think-logic) 根据解析出来的 controller 和 action，调用 logic 里对应的方法。
        - 实例化 logic 类，并将 `ctx` 传递进去。如果不存在则直接跳过
        - 执行 `__before` 方法，如果返回 `false` 则不再执行后续所有的逻辑（提前结束处理）
        - 如果 `xxxAction` 方法存在则执行，结果返回 `false` 则不再执行后续所有的逻辑
        - 如果 `xxxAction` 方法不存在，则试图执行 `__call` 方法
        - 执行 `__after` 方法，如果返回 `false` 则不再执行后续所有的逻辑
        - 通过方法返回 `false` 来阻断后续逻辑的执行
    - [controller](https://github.com/thinkjs/think-controller) 根据解析出来的 controller 和 action，调用 controller 里的对应的方法。
        - 具体的调用策略和 logic 完全一致
        - 如果不存在，那么当前请求返回 404
        - action 执行完成时，可以将结果放在 `this.body` 属性上然后返回给用户。
* 当 Worker 报错，触发 `onUncaughtException` 或者 `onUnhandledRejection` 事件，或者 Worker 异常退出时，Master 会捕获到错误，重新 fork 一个新的 Worker 进程，并杀掉当前的进程。

可以看到，所有的用户请求处理都是通过 middleware 来完成的。具体的项目中，可以根据需求，组装更多的 middleware 来处理用户的请求。




## Config / 配置

实际项目中，肯定需要各种配置，包括：框架需要的配置以及项目自定义的配置。ThinkJS 将所有的配置都统一管理，文件都放在 `src/config/` 目录下（多模块项目放在 `src/common/config/`），并根据不同的功能划分为不同的配置文件。

* `config.js` 通用的一些配置
* `adapter.js` adapter 配置
* `router.js` 自定义路由配置
* `middleware.js` middlware 配置
* `validator.js` 数据校验配置
* `extend.js` extend 配置

### 配置格式


```js
// src/config.js

module.exports = {
  port: 1234,
  redis: {
    host: '192.168.1.2',
    port: 2456,
    password: ''
  }
}
```

配置值即可以是一个简单的字符串，也可以是一个复杂的对象，具体是什么类型根据具体的需求来决定。

### 多环境配置

有些配置需要在不同的环境下配置不同的值，如：数据库的配置在开发环境和生产环境是不一样的，此时可以通过环境下对应不同的配置文件来完成。

多环境配置文件格式为：`[name].[env].js`，如：`config.development.js`，`config.production.js`

在以上的配置文件中，目前只有 `config.js` 和 `adapter.js` 是支持不同环境配置文件的。

### 系统默认配置

系统内置一些默认配置，方便项目里直接使用，具体有：

* [config.js](https://github.com/thinkjs/thinkjs/blob/3.0/lib/config/config.js) 通用的默认配置

  ```js
  {
    port: 8360, // server port
    // host: '127.0.0.1', // server host, removed from 3.1.0
    workers: 0, // server workers num, if value is 0 then get cpus num
    createServer: undefined, // create server function
    startServerTimeout: 3000, // before start server time
    reloadSignal: 'SIGUSR2', // reload process signal
    stickyCluster: false, // sticky cluster, add from 3.1.0
    onUnhandledRejection: err => think.logger.error(err), // unhandledRejection handle
    onUncaughtException: err => think.logger.error(err), // uncaughtException handle
    processKillTimeout: 10 * 1000, // process kill timeout, default is 10s
    jsonpCallbackField: 'callback', // jsonp callback field
    jsonContentType: 'application/json', // json content type
    errnoField: 'errno', // errno field
    errmsgField: 'errmsg', // errmsg field
    defaultErrno: 1000, // default errno
    validateDefaultErrno: 1001 // validate default errno
  };
  ```

### 配置合并方式

系统启动时，会对配置合并，最终提供给开发者使用。具体流程为：

* 加载 `[ThinkJS]/lib/config.js`
* 加载 `[ThinkJS]/lib/config.[env].js`
* 加载 `src/config/config.js`
* 加载 `src/config/config.[env].js`
* 加载 `[ThinkJS]/lib/adapter.js`
* 加载 `[ThinkJS]/lib/adapter.[env].js`
* 加载 `src/config/adapter.js`
* 加载 `src/config/adapter.[env].js`

`[env]` 为当前环境名称。最终会将这些配置按顺序合并在一起，同名的 key 后面会覆盖前面的。

配置加载是通过 [think-loader](https://github.com/thinkjs/think-loader/) 模块实现的，获取到合并后的配置后，通过 [think-config](https://github.com/thinkjs/think-config/) 模块实例化后放在 `think.config` 上，后续通过 `think.config` 来获取或者设置配置。

### 使用配置

框架提供了在不同的环境下不同的方式快速获取配置：

* 在 ctx 中，可以通过 `ctx.config(key)` 来获取配置
* 在 controller 中，可以通过 `controller.config(key)` 来获取配置
* 其他情况下，可以通过 `think.config(key)` 来获取配置

实际上，`ctx.config` 和 `controller.config` 是基于 [think.config](/doc/3.0/think.html#toc-929) 包装的一种更方便的获取配置的方式。

```js
const redis = ctx.config('redis'); //获取 redis 配置
```

```js
module.exports = class extends think.Controller {
  indexAction() {
    const redis = this.config('redis'); // 在 controller 中通过 this.config 获取配置
  }
}
```

### 动态设置配置

除了获取配置，有时候需要动态设置配置，如：将有些配置保存在数据库中，项目启动时将配置从数据库中读取出来，然后设置上去。

框架也提供了动态设置配置的方式，如：`think.config(key, value)`

```
// src/bootstrap/worker.js

//HTTP 服务启动前执行
think.beforeStartServer(async () => {
  const config = await think.model('config').select();
  think.config('userConfig', config); //从数据库中将配置读取出来，然后设置
})
```

### 常见问题

#### 能否将请求中跟用户相关的值设置到配置中？

`不能`。配置设置是全局的，会在所有请求中生效。如果将请求中跟用户相关的值设置到配置中，那么多个用户同时请求时会相互干扰。

#### config.js 和 adapter.js 中的 key 能否重名？

`不能`。由于 config.js 和 adapter.js 是合并在一起的，所以要注意这二个配置不能有相同的 key，否则会被覆盖。

#### 怎么查看合并后的所有配置？

系统启动时，会合并 config.js 和 adapter.js 的配置，最终会将配置写到文件 `runtime/config/[env].json` 文件中，如：当前 env 是 `development`，那么写入的文件为 `runtime/config/development.json`。

配置写入文件时，是通过 `JSON.stringify` 将配置转化为字符串，由于 JSON.stringify 不支持正则、函数等之类的转换，所以配置中由于字段的值是正则或者函数时，生成的配置文件中将看不到这些字段对应的值。


#### 多模块项目配置文件存放位置？

以上文档中描述的配置文件路径都是单模块项目下的，多模块项目下配置文件的路径为 `src/common/config/`，配置文件名称以及格式和单模块相同，如：`src/common/config/config.js`、`src/common/config/adapter.js`、`src/common/config/middleware.js` 等。

多模块项目下有些配置可以放在模块目录下，路径为：`/src/[module]/config/`，`[module]` 为具体的模块名称。

#### 如何查看配置文件的详细加载情况？

有时候希望查看配置文件的详细加载情况，这时候可以通过 `DEBUG=think-loader-config-* npm start` 来启动项目查看。

```text
think-loader-config-40322 load file: //demo/app/config/adapter.js +3ms
think-loader-config-40323 load file: /demo/node_modules/thinkjs/lib/config/adapter.js +5ms
think-loader-config-40320 load file: /demo/app/config/adapter.js +4ms
think-loader-config-40323 load file: /demo/app/config/adapter.js +3ms
think-loader-config-40325 load file: /demo/app/config/config.js +0ms
think-loader-config-40325 load file: /demo/node_modules/thinkjs/lib/config/adapter.js +5ms
think-loader-config-40325 load file: /demo/app/config/adapter.js +3ms
think-loader-config-40321 load file: /demo/app/config/config.js +0ms
think-loader-config-40321 load file: /demo/node_modules/thinkjs/lib/config/adapter.js +5ms
think-loader-config-40321 load file: /demo/app/config/adapter.js +3ms
think-loader-config-40324 load file: /demo/app/config/config.js +0ms
think-loader-config-40319 load file: /demo/app/config/config.js +0ms
think-loader-config-40319 load file: /demo/node_modules/thinkjs/lib/config/adapter.js +6ms
think-loader-config-40324 load file: /demo/node_modules/thinkjs/lib/config/adapter.js +5ms
think-loader-config-40319 load file: /demo/app/config/adapter.js +7ms
think-loader-config-40324 load file: /demo/app/config/adapter.js +8ms
```
由于服务是通过 Master + 多个 Worker 启动的，debug 信息会打印多遍，这里为了区分加上了进程的 pid 值，如：`think-loader-config-40322` 为进程 pid 为 `40322` 下的配置文件加载情况。


## Context / 上下文

Context 是 Koa 中处理用户请求中的一个对象，贯穿整个请求生命周期。一般在 middleware、controller、logic 中使用，简称为 `ctx`。

```js
// 在 middleware 中使用 ctx 对象
module.exports = options => {
  // 调用时 ctx 会作为第一个参数传递进来
  return (ctx, next) => {
    ...
  }
}
```

```js
// 在 controller 中使用 ctx 对象
module.exports = class extends think.Controller {
  indexAction() {
    // controller 中 ctx 作为类的属性存在，属性名为 ctx
    // controller 实例化时会自动把 ctx 传递进来
    const ip = this.ctx.ip;
  }
}
```

框架里继承了该对象，并通过 Extend 机制扩展了很多非常有用的属性和方法。

### Koa 内置 API

#### ctx.req

Node 的 [request](https://nodejs.org/api/http.html#http_class_http_incomingmessage) 对象。

#### ctx.res

Node 的 [response](https://nodejs.org/api/http.html#http_class_http_serverresponse) 对象。

**不支持** 绕开 Koa 对 response 的处理。 避免使用如下 node 属性:

- `res.statusCode`
- `res.writeHead()`
- `res.write()`
- `res.end()`

#### ctx.request

Koa 的 [Request](http://koajs.com/#request) 对象。

#### ctx.response

Koa 的 [Response](http://koajs.com/#response) 对象。

#### ctx.state

在中间件之间传递信息以及将信息发送给模板时，推荐的命名空间。避免直接在 ctx 上加属性，这样可能会覆盖掉已有的属性，导致出现奇怪的问题。

```js
ctx.state.user = await User.find(id);
```

这样后续在 controller 里可以通过 `this.ctx.state.user` 来获取对应的值。

```js
module.exports = class extends think.Controller {
  indexAction() {
    const user = this.ctx.state.user;
  }
}
```

#### ctx.app

应用实例引用，等同于 `think.app`。

#### ~~ctx.cookies.get(name, [options])~~

获取 cookie，不建议使用，推荐 [ctx.cookie(name)](#toc-a67)

#### ~~ctx.cookies.set(name, value, [options])~~

设置 cookie，不建议使用，推荐 [ctx.cookie(name, value, options)](#toc-a67)

#### ctx.throw([msg], [status], [properties])

辅助方法，抛出包含 `.status` 属性的错误，默认为 `500`。该方法让 Koa 能够根据实际情况响应。并且支持如下组合：

```js
ctx.throw(403)
ctx.throw('name required', 400)
ctx.throw(400, 'name required')
ctx.throw('something exploded')
```

例如 `this.throw('name required', 400)` 等价于：

```js
let err = new Error('name required');
err.status = 400;
throw err;
```

注意，这些是用户级别的错误，被标记了 `err.expose`，即这些消息可以用于响应客户端。显然，当你不想泄露失败细节的时候，不能用它来传递错误消息。

你可以传递一个 `properties` 对象，该对象会被合并到 error 中，有助于修改传递给上游中间件的机器友好的错误。

```js
ctx.throw(401, 'access_denied', { user: user });
ctx.throw('access_denied', { user: user });
```

Koa 使用 [http-errors](https://github.com/jshttp/http-errors) 创建错误对象。

#### ctx.assert(value, [msg], [status], [properties])

当 `!value`为真时抛出错误的辅助方法，与 `.throw()` 相似。类似于 node 的 [assert()](http://nodejs.org/api/assert.html) 方法。

```
this.assert(this.user, 401, 'User not found. Please login!');
```

Koa 使用 [http-assert](https://github.com/jshttp/http-assert) 实现断言.

#### ctx.respond

如不想使用 Koa 内置的 response 处理方法，可以设置 `ctx.respond = false;`。这时你可以自己设置原始的 `res` 对象来处理响应。

注意这样使用是 __不__被 Koa 支持的，因为这样有可能会破坏 Koa 的中间件和 Koa 本身提供的功能。这种用法只是作为一种 hack ，为那些想要在Koa中使用传统的`fn(req, res)`的方法和中间件的人提供一种便捷方式。

#### ctx.header

获取所有的 header 信息，等同于 `ctx.request.header`。

```js
const headers = ctx.headers;
```

#### ctx.headers

获取所有的 header 信息，等同于 `ctx.header`。

#### ctx.method

获取请求类型，大写。如：`GET`、`POST`、`DELETE`。

```js
const method = ctx.method;
```

#### ctx.method=

设置请求类型（并不会修改当前 HTTP 请求的真实类型），对有些中间件的场景下可能有用，如：`methodOverride()`。

```js
ctx.method = 'COMMAND';
```

#### ctx.url

获取请求地址。

#### ctx.url=

设置请求地址，对 URL rewrite 有用。

#### ctx.originalUrl

获取原始的请求 URL

#### ctx.origin

Get origin of URL, include protocol and host.

```js
ctx.origin
// => http://example.com
```


#### ctx.href

Get full request URL, include protocol, host and url.

```js
ctx.href
// => http://example.com/foo/bar?q=1
```

#### ctx.path

Get request pathname.

#### ctx.path=

Set request pathname and retain query-string when present.

#### ctx.query

Get parsed query-string, returning an empty object when no query-string is present. Note that this getter does not support nested parsing.

For example "color=blue&size=small":

```js
{
  color: 'blue',
  size: 'small'
}
```
#### ctx.query=

Set query-string to the given object. Note that this setter does not support nested objects.

```js
ctx.query = { next: '/login' }
```
#### ctx.querystring

Get raw query string void of ?.

#### ctx.querystring=

Set raw query string.

#### ctx.search

Get raw query string with the ?.

#### ctx.search=

Set raw query string.

#### ctx.host

Get host (hostname:port) when present. Supports X-Forwarded-Host when app.proxy is true, otherwise Host is used.

#### ctx.hostname

Get hostname when present. Supports X-Forwarded-Host when app.proxy is true, otherwise Host is used.

#### ctx.type

Get request Content-Type void of parameters such as "charset".

```js
const ct = ctx.type
// => "image/png"
```

#### ctx.charset

Get request charset when present, or undefined:

```js
ctx.charset
// => "utf-8"
```
#### ctx.fresh

Check if a request cache is "fresh", aka the contents have not changed. This method is for cache negotiation between If-None-Match / ETag, and If-Modified-Since and Last-Modified. It should be referenced after setting one or more of these response headers.

```js
// freshness check requires status 20x or 304
ctx.status = 200;
ctx.set('ETag', '123');

// cache is ok
if (ctx.fresh) {
  ctx.status = 304;
  return;
}

// cache is stale
// fetch new data
ctx.body = await db.find('something');
```
#### ctx.stale

Inverse of ctx.fresh.

#### ctx.socket

Return the request socket.

#### ctx.protocol

获取请求的协议类型，值为 `https` 或者 `http`，当 `app.proxy` 配置为 true 值支持从 `X-Forwarded-Proto` header 里获取。

具体的判断策略为：如果 `req.socket.encrypted` 为真，那么直接返回 `https`，否则如果配置了 `app.proxy` 为 true，那么从 `X-Forwarded-Proto` header 里获取，默认值为 `http`。

这么做是因为有时候并不会让 Node.js 直接对外提供服务，而是在前面用 web server（如：nginx）挡一层，由 web server 来提供 HTTP(S) 服务，web server 与 Node.js 之间始终用 HTTP 交互。

这时候 Node.js 拿到的协议始终都是 `http`，真实的协议只有 web server 知道，所以要让 Node.js 拿到真实的协议时，就需要 webserver 与 Node.js 定义特殊的字段来获取，推荐的自定义 header 为 `X-Forwarded-Proto`。为了安全性，只有设置了 `app.proxy` 为 true 是才会这样获取（`production.js` 里默认配置了为 true）。

```sh
ssl on;
# SSL certificate
ssl_certificate /usr/local/nginx/ssl/domain.crt;
ssl_certificate_key /usr/local/nginx/ssl/domain.key;

location = /index.js {
  proxy_http_version 1.1;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header Host $http_host;
  proxy_set_header X-Forwarded-Proto "https"; # 这里告知 Node.js 当前协议是 https
  proxy_set_header X-NginX-Proxy true;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_pass http://127.0.0.1:$node_port$request_uri;
  proxy_redirect off;
}
```

#### ctx.secure

Shorthand for ctx.protocol == "https" to check if a request was issued via TLS.


#### ctx.ip

Request remote address. Supports X-Forwarded-For when app.proxy is true.


#### ctx.ips

When X-Forwarded-For is present and app.proxy is enabled an array of these ips is returned, ordered from upstream -> downstream. When disabled an empty array is returned.


#### ctx.subdomains

Return subdomains as an array.

Subdomains are the dot-separated parts of the host before the main domain of the app. By default, the domain of the app is assumed to be the last two parts of the host. This can be changed by setting app.subdomainOffset.

For example, if the domain is "tobi.ferrets.example.com": If app.subdomainOffset is not set, ctx.subdomains is ["ferrets", "tobi"]. If app.subdomainOffset is 3, ctx.subdomains is ["tobi"].


#### ctx.is(...types)

Check if the incoming request contains the "Content-Type" header field, and it contains any of the give mime types. If there is no request body, null is returned. If there is no content type, or the match fails false is returned. Otherwise, it returns the matching content-type.

```js
// With Content-Type: text/html; charset=utf-8
ctx.is('html'); // => 'html'
ctx.is('text/html'); // => 'text/html'
ctx.is('text/*', 'text/html'); // => 'text/html'

// When Content-Type is application/json
ctx.is('json', 'urlencoded'); // => 'json'
ctx.is('application/json'); // => 'application/json'
ctx.is('html', 'application/*'); // => 'application/json'

ctx.is('html'); // => false
```

For example if you want to ensure that only images are sent to a given route:

```js
if (ctx.is('image/*')) {
  // process
} else {
  ctx.throw(415, 'images only!');
}
```
#### ctx.accepts(types)

Check if the given type(s) is acceptable, returning the best match when true, otherwise false. The type value may be one or more mime type string such as "application/json", the extension name such as "json", or an array ["json", "html", "text/plain"].

```js
// Accept: text/html
ctx.accepts('html');
// => "html"

// Accept: text/*, application/json
ctx.accepts('html');
// => "html"
ctx.accepts('text/html');
// => "text/html"
ctx.accepts('json', 'text');
// => "json"
ctx.accepts('application/json');
// => "application/json"

// Accept: text/*, application/json
ctx.accepts('image/png');
ctx.accepts('png');
// => false

// Accept: text/*;q=.5, application/json
ctx.accepts(['html', 'json']);
ctx.accepts('html', 'json');
// => "json"

// No Accept header
ctx.accepts('html', 'json');
// => "html"
ctx.accepts('json', 'html');
// => "json"
```

You may call ctx.accepts() as many times as you like, or use a switch:

```js
switch (ctx.accepts('json', 'html', 'text')) {
  case 'json': break;
  case 'html': break;
  case 'text': break;
  default: ctx.throw(406, 'json, html, or text only');
}
```
#### ctx.acceptsEncodings(encodings)

Check if encodings are acceptable, returning the best match when true, otherwise false. Note that you should include identity as one of the encodings!

```js
// Accept-Encoding: gzip
ctx.acceptsEncodings('gzip', 'deflate', 'identity');
// => "gzip"

ctx.acceptsEncodings(['gzip', 'deflate', 'identity']);
// => "gzip"
```

When no arguments are given all accepted encodings are returned as an array:

```js
// Accept-Encoding: gzip, deflate
ctx.acceptsEncodings();
// => ["gzip", "deflate", "identity"]
```
Note that the identity encoding (which means no encoding) could be unacceptable if the client explicitly sends identity;q=0. Although this is an edge case, you should still handle the case where this method returns false.

#### ctx.acceptsCharsets(charsets)

Check if charsets are acceptable, returning the best match when true, otherwise false.

```js
// Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5
ctx.acceptsCharsets('utf-8', 'utf-7');
// => "utf-8"

ctx.acceptsCharsets(['utf-7', 'utf-8']);
// => "utf-8"
```

When no arguments are given all accepted charsets are returned as an array:

```js
// Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5
ctx.acceptsCharsets();
// => ["utf-8", "utf-7", "iso-8859-1"]
```
#### ctx.acceptsLanguages(langs)

Check if langs are acceptable, returning the best match when true, otherwise false.

```js
// Accept-Language: en;q=0.8, es, pt
ctx.acceptsLanguages('es', 'en');
// => "es"

ctx.acceptsLanguages(['en', 'es']);
// => "es"
```

When no arguments are given all accepted languages are returned as an array:

```js
// Accept-Language: en;q=0.8, es, pt
ctx.acceptsLanguages();
// => ["es", "pt", "en"]
```

#### ctx.get(field)

Return request header.

```js
const host = ctx.get('host');
```

#### ctx.body

Get response body.

#### ctx.body=

Set response body to one of the following:

* string written

  The Content-Type is defaulted to text/html or text/plain, both with a default charset of utf-8. The Content-Length field is also set.

* Buffer written

  The Content-Type is defaulted to application/octet-stream, and Content-Length is also set.

* Stream piped

  The Content-Type is defaulted to application/octet-stream.

  Whenever a stream is set as the response body, .onerror is automatically added as a listener to the error event to catch any errors. In addition, whenever the request is closed (even prematurely), the stream is destroyed. If you do not want these two features, do not set the stream as the body directly. For example, you may not want this when setting the body as an HTTP stream in a proxy as it would destroy the underlying connection.

  See: https://github.com/koajs/koa/pull/612 for more information.

  Here's an example of stream error handling without automatically destroying the stream:

  ```js
  const PassThrough = require('stream').PassThrough;

  app.use(function * (next) {
    ctx.body = someHTTPStream.on('error', ctx.onerror).pipe(PassThrough());
  });
  ```

* Object || Array json-stringified

  The Content-Type is defaulted to application/json. This includes plain objects { foo: 'bar' } and arrays ['foo', 'bar'].

* null no content response

If ctx.status has not been set, Koa will automatically set the status to 200 or 204.

#### ctx.status

Get response status. By default, response.status is set to 404 unlike node's res.statusCode which defaults to 200.

#### ctx.status=

Set response status via numeric code:

* 100 "continue"
* 101 "switching protocols"
* 102 "processing"
* 200 "ok"
* 201 "created"
* 202 "accepted"
* 203 "non-authoritative information"
* 204 "no content"
* 205 "reset content"
* 206 "partial content"
* 207 "multi-status"
* 208 "already reported"
* 226 "im used"
* 300 "multiple choices"
* 301 "moved permanently"
* 302 "found"
* 303 "see other"
* 304 "not modified"
* 305 "use proxy"
* 307 "temporary redirect"
* 308 "permanent redirect"
* 400 "bad request"
* 401 "unauthorized"
* 402 "payment required"
* 403 "forbidden"
* 404 "not found"
* 405 "method not allowed"
* 406 "not acceptable"
* 407 "proxy authentication required"
* 408 "request timeout"
* 409 "conflict"
* 410 "gone"
* 411 "length required"
* 412 "precondition failed"
* 413 "payload too large"
* 414 "uri too long"
* 415 "unsupported media type"
* 416 "range not satisfiable"
* 417 "expectation failed"
* 422 "unprocessable entity"
* 423 "locked"
* 424 "failed dependency"
* 426 "upgrade required"
* 428 "precondition required"
* 429 "too many requests"
* 431 "request header fields too large"
* 500 "internal server error"
* 501 "not implemented"
* 502 "bad gateway"
* 503 "service unavailable"
* 504 "gateway timeout"
* 505 "http version not supported"
* 506 "variant also negotiates"
* 507 "insufficient storage"
* 508 "loop detected"
* 510 "not extended"
* 511 "network authentication required"

NOTE: don't worry too much about memorizing these strings, if you have a typo an error will be thrown, displaying this list so you can make a correction.


#### ctx.message

Get response status message. By default, response.message is associated with response.status.

#### ctx.message=

Set response status message to the given value.

#### ctx.length=

Set response Content-Length to the given value.

#### ctx.length

Return response Content-Length as a number when present, or deduce from ctx.body when possible, or undefined.


#### ctx.type

Get response Content-Type void of parameters such as "charset".

```js
const ct = ctx.type;
// => "image/png"
```

#### ctx.type=

Set response Content-Type via mime string or file extension.

```js
ctx.type = 'text/plain; charset=utf-8';
ctx.type = 'image/png';
ctx.type = '.png';
ctx.type = 'png';
```

Note: when appropriate a charset is selected for you, for example response.type = 'html' will default to "utf-8", however when explicitly defined in full as response.type = 'text/html' no charset is assigned.

#### ctx.headerSent

Check if a response header has already been sent. Useful for seeing if the client may be notified on error.


#### ctx.redirect(url, [alt])

Perform a [302] redirect to url.

The string "back" is special-cased to provide Referrer support, when Referrer is not present alt or "/" is used.

```js
ctx.redirect('back');
ctx.redirect('back', '/index.html');
ctx.redirect('/login');
ctx.redirect('http://google.com');
```

To alter the default status of 302, simply assign the status before or after this call. To alter the body, assign it after this call:

```js
ctx.status = 301;
ctx.redirect('/cart');
ctx.body = 'Redirecting to shopping cart';
```
#### ctx.attachment([filename])
Set Content-Disposition to "attachment" to signal the client to prompt for download. Optionally specify the filename of the download.

#### ctx.set(fields)

Set several response header fields with an object:

```js
ctx.set({
  'Etag': '1234',
  'Last-Modified': date
});
```

#### ctx.append(field, value)

Append additional header field with value val.

```js
ctx.append('Link', '<http://127.0.0.1/>');
```

#### ctx.remove(field)

Remove header field.

#### ctx.lastModified=

Set the Last-Modified header as an appropriate UTC string. You can either set it as a Date or date string.

```js
ctx.lastModified = new Date();
```
#### ctx.etag=

Set the ETag of a response including the wrapped "s. Note that there is no corresponding response.etag getter.

```js
ctx.etag = crypto.createHash('md5').update(ctx.body).digest('hex');
```
### 框架扩展 API

#### ctx.module

路由解析后的模块名，单模块项目下该属性值始终为空。默认是通过 [think-router](https://github.com/thinkjs/think-router) 模块解析。

```js
module.exports = class extends think.Controller {
  __before() {
    // 获取解析后的 module
    // 由于 module 已经被 node 使用，所以这里建议变量名不要为 module
    const m = this.ctx.module;
  }
}
```

#### ctx.controller

路由解析后的控制器名，默认是通过 [think-router](https://github.com/thinkjs/think-router) 模块解析。

```js
module.exports = class extends think.Controller {
  __before() {
    // 获取解析后的 controller
    const controller = this.ctx.controller;
  }
}
```

#### ctx.action

路由解析后的操作名，默认是通过 [think-router](https://github.com/thinkjs/think-router) 模块解析。

```js
module.exports = class extends think.Controller {
  __before() {
    // 获取解析后的 action
    const action = this.ctx.action;
  }
}
```

#### ctx.userAgent

可以通过 `ctx.userAgent` 属性获取用户的 userAgent。

```js
const userAgent = ctx.userAgent;
if(userAgent.indexOf('spider')){
  ...
}
```

#### ctx.isGet

可以通过 `ctx.isGet` 判断当前请求类型是否是 `GET`。

```js
const isGet = ctx.isGet;
if(isGet){
  ...
}
```

#### ctx.isPost

可以通过 `ctx.isPost` 判断当前请求类型是否是 `POST`。

```js
const isPost = ctx.isPost;
if(isPost){
  ...
}
```

#### ctx.isCli

可以通过 `ctx.isCli` 判断当前请求类型是否是 `CLI`（命令行调用）。

```js
const isCli = ctx.isCli;
if(isCli){
  ...
}
```

#### ctx.referer(onlyHost)

* `onlyHost` {Boolean} 是否只返回 host
* `return` {String}

获取请求的 referer。

```
const referer1 = ctx.referer(); // http://www.thinkjs.org/doc.html
const referer2 = ctx.referer(true); // www.thinkjs.org
```

#### ctx.referrer(onlyHost)

等同于 `referer` 方法。

#### ctx.isMethod(method)

* `method` {String} 请求类型
* `return` {Boolean}

判断当前请求类型与 method 是否相同。

```js
const isPut = ctx.isMethod('PUT');
```

#### ctx.isAjax(method)

* `method` {String} 请求类型
* `return` {Boolean}

判断是否是 ajax 请求（通过 header 中 `x-requested-with` 值是否为 `XMLHttpRequest` 判断），如果执行了 method，那么也会判断请求类型是否一致。

```js
const isAjax = ctx.isAjax();
const isPostAjax = ctx.isAjax('POST');
```

#### ctx.isJsonp(callbackField)

* `callbackField` {String} callback 字段名，默认值为 `this.config('jsonpCallbackField')`
* `return` {Boolean}

判断是否是 jsonp 请求。

```js
const isJsonp = ctx.isJson('callback');
if(isJsonp){
  ctx.jsonp(data);
}
```

#### ctx.jsonp(data, callbackField)

* `data` {Mixed} 要输出的数据
* `callbackField` {String} callback 字段名，默认值为 `this.config('jsonpCallbackField')`
* `return` {Boolean} false

输出 jsonp 格式的数据，返回值为 false。可以通过配置 `jsonContentType` 指定返回的 `Content-Type`。

```js
ctx.jsonp({name: 'test'});

//output
jsonp111({
  name: 'test'
})
```

#### ctx.json(data)

* `data` {Mixed} 要输出的数据
* `return` {Boolean} false

输出 json 格式的数据，返回值为 false。可以通过配置 `jsonContentType` 指定返回的 `Content-Type`。

```js
ctx.json({name: 'test'});

//output
{
  name: 'test'
}
```

#### ctx.success(data, message)

* `data` {Mixed} 要输出的数据
* `message` {String} errmsg 字段的数据
* `return` {Boolean} false

输出带有 `errno` 和 `errmsg` 格式的数据。其中 `errno` 值为 0，`errmsg` 值为 message。

```js
{
  errno: 0,
  errmsg: '',
  data: ...
}
```

字段名 `errno` 和 `errmsg` 可以通过配置 `errnoField` 和 `errmsgField` 来修改。

#### ctx.fail(errno, errmsg, data)

* `errno` {Number} 错误号
* `errmsg` {String} 错误信息
* `data` {Mixed} 额外的错误数据
* `return` {Boolean} false

```js
{
  errno: 1000,
  errmsg: 'no permission',
  data: ''
}
```

字段名 `errno` 和 `errmsg` 可以通过配置 `errnoField` 和 `errmsgField` 来修改。

#### ctx.expires(time)

* `time` {Number} 缓存的时间，单位是毫秒。可以 `1s`，`1m` 这样的时间
* `return` {undefined}

设置 `Cache-Control` 和 `Expires` 缓存头。

```js
ctx.expires('1h'); //缓存一小时
```

#### ctx.config(name, value, m)

* `name` {Mixed} 配置名
* `value` {Mixed} 配置值
* `m` {String} 模块名，多模块项目下生效
* `return` {Mixed}

获取、设置配置项，内部调用 `think.config` 方法。

```js
ctx.config('name'); //获取配置
ctx.config('name', value); //设置配置值
ctx.config('name', undefined, 'admin'); //获取 admin 模块下配置值，多模块项目下生效
```

#### ctx.param(name, value)

* `name` {String} 参数名
* `value` {Mixed} 参数值
* `return` {Mixed}

获取、设置 URL 上的参数值。由于 `get`、`query` 等名称已经被 Koa 使用，所以这里只能使用 param。

```js
ctx.param('name'); //获取参数值，如果不存在则返回 undefined
ctx.param(); //获取所有的参数值，包含动态添加的参数
ctx.param('name1,name2'); //获取指定的多个参数值，中间用逗号隔开
ctx.param('name', value); //重新设置参数值
ctx.param({name: 'value', name2: 'value2'}); //重新设置多个参数值
```

#### ctx.post(name, value)

* `name` {String} 参数名
* `value` {Mixed} 参数值
* `return` {Mixed}

获取、设置 POST 数据。

```js
ctx.post('name'); //获取 POST 值，如果不存在则返回 undefined
ctx.post(); //获取所有的 POST 值，包含动态添加的数据
ctx.post('name1,name2'); //获取指定的多个 POST 值，中间用逗号隔开
ctx.post('name', value); //重新设置 POST 值
ctx.post({name: 'value', name2: 'value2'}); //重新设置多个 POST 值
```

#### ctx.file(name, value)

* `name` {String} 参数名
* `value` {Mixed} 参数值
* `return` {Mixed}

获取、设置文件数据，文件会保存在临时目录下，为了安全，请求结束后会删除。如果需要使用对应的文件，可以通过 `fs.rename` 方法移动到其他地方。

```js
ctx.file('name'); //获取 FILE 值，如果不存在则返回 undefined
ctx.file(); //获取所有的 FILE 值，包含动态添加的数据
ctx.file('name', value); //重新设置 FILE 值
ctx.file({name: 'value', name2: 'value2'}); //重新设置多个 FILE 值
```

文件的数据格式为：

```js
{
  "size": 287313, //文件大小
  "path": "/var/folders/4j/g57qvmmd1lb_9h605w_d38_r0000gn/T/upload_fa6bf8c44179851f1cfec99544b4ef22", //临时存放的位置
  "name": "An Introduction to libuv.pdf", //文件名
  "type": "application/pdf", //类型
  "mtime": "2017-07-02T07:55:23.763Z" //最后修改时间
}
```

文件上传是通过 [think-payload](https://github.com/thinkjs/think-payload) 模块解析的，可以配置限制文件大小之类的参数。

```js
const fs = require('fs');
const path = require('path');
const rename = think.promisify(fs.rename, fs); // 通过 promisify 方法把 rename 方法包装成 Promise 接口
module.exports = class extends think.Controller {
  async indexAction(){
    const file = this.file('image');
    // 如果上传的是 png 格式的图片文件，则移动到其他目录
    if(file && file.type === 'image/png') {
      const filepath = path.join(think.ROOT_PATH, 'runtime/upload/a.png');
      think.mkdir(path.dirname(filepath));
      await rename(file.path, filepath)
    }
  }
}
```



#### ctx.cookie(name, value, options)

* `name` {String} Cookie 名
* `value` {mixed} Cookie 值
* `options` {Object} Cookie 配置项
* `return` {Mixed}

获取、设置 Cookie 值。

```js
ctx.cookie('name'); //获取 Cookie
ctx.cookie('name', value); //设置 Cookie
ctx.cookie(name, null); //删除 Cookie
ctx.cookie(name, null, {
  path: '/'
})
```

设置 Cookie 时，如果 value 的长度大于 4094，则触发 `cookieLimit` 事件，该事件可以通过 `think.app.on("cookieLimit")` 来捕获。

删除 Cookie 时，必须要设置 `domain`、`path` 等参数和设置的时候相同，否则因为浏览器的同源策略无法删除。

#### ctx.service(name, m, ...args)

* `name` {String} 要调用的 service 名称
* `m` {String} 模块名，多模块项目下生效
* `return` {Mixed}

获取 service，如果是类则实例化，否则直接返回。等同于 [think.service](/doc/3.0/think.html#toc-014)。

```js
// 获取 src/service/github.js 模块
const github = ctx.service('github');
```

#### ctx.download(filepath, filename)

* `filepath` {String} 下载文件的路径
* `filename` {String} 下载的文件名，如果没有则从 `filepath` 中获取。

下载文件，会通过 [content-disposition](https://github.com/jshttp/content-disposition) 模块设置 `Content-Disposition` 头信息。

```js
const filepath = path.join(think.ROOT_PATH, 'a.txt');
ctx.download(filepath);
```

如果文件名中含有中文导致乱码，那么可以自己手工指定 `Content-Disposition` 头信息，如：

```js
const userAgent = this.userAgent().toLowerCase();
let hfilename = '';
if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
  hfilename = `=${encodeURIComponent(filename)}`;
} else if(userAgent.indexOf('firefox') >= 0) {
  hfilename = `*="utf8''${encodeURIComponent(filename)}"`;
} else {
  hfilename = `=${new Buffer(filename).toString('binary')}`;
}
ctx.set('Content-Disposition', `attachment; filename${hfilename}`)
ctx.download(filepath)
```


## Middleware / 中间件

Middleware 称之为中间件，是 Koa 中一个非常重要的概念，利用中间件，可以很方便的处理用户的请求。由于 ThinkJS 3.0 是基于 Koa@2 版本之上构建的，所以完全兼容 Koa 里的中间件。


### 中间件格式

```js
module.exports = options => {
  return (ctx, next) => {
    // do something
  }
}
```
中间件格式为一个高阶函数，外部的函数接收一个 `options` 参数，这样方便中间件提供一些配置信息，用来开启/关闭一些功能。执行后返回另一个函数，这个函数接收 `ctx`, `next` 参数，其中 `ctx` 为 `context` 的简写，是当前请求生命周期的一个对象，存储了当前请求的一些相关信息，`next` 为调用后续的中间件，返回值是 Promise，这样可以很方便的处理后置逻辑。

整个中间件执行过程是个洋葱模型，类似下面这张图：

![](https://p0.ssl.qhimg.com/t014260f4c3e6e64daa.png)

假如要实现一个打印当前请求执行时间的 middleware，可以用类似下面的方式：

```js
const defaultOptions = {
  consoleExecTime: true // 是否打印执行时间的配置
}
module.exports = (options = {}) => {
  // 合并传递进来的配置
  options = Object.assign({}, defaultOptions, options);
  return (ctx, next) => {
    if(!options.consoleExecTime) {
      return next(); // 如果不需要打印执行时间，直接调用后续执行逻辑
    }
    const startTime = Date.now();
    let err = null;
    // 调用 next 统计后续执行逻辑的所有时间
    return next().catch(e => {
      err = e; // 这里先将错误保存在一个错误对象上，方便统计出错情况下的执行时间
    }).then(() => {
      const endTime = Date.now();
      console.log(`request exec time: ${endTime - startTime}ms`);
      if(err) return Promise.reject(err); // 如果后续执行逻辑有错误，则将错误返回
    })
  }
}
```


在 Koa 中，可以通过调用 `app.use` 的方式来使用中间件，如：

```js
const app = new Koa();
const execTime = require('koa-execTime'); // 引入统计执行时间的模块
app.use(execTime({}));  // 需要将这个中间件第一个注册，如果还有其他中间件放在后面注册
```

通过 `app.use` 的方式使用中间件，不利于中间件的统一维护。

#### 扩展 app 参数

默认的中间件外层一般只是传递了 `options` 参数，有的中间件需要读取 app 相关的信息，框架在这块做了扩展，自动将 app 对象传递到中间件中。

```js
module.exports = (options, app) => {
  // 这里的 app 为 think.app 对象
  return (ctx, next) => {

  }
}
```

如果在中间件中需要用到 think 对象上的一些属性或者方法，那么可以通过 `app.think.xxx` 来获取。

### 配置格式

为了方便管理和使用中间件，框架使用统一的配置文件来管理中间件，配置文件为 `src/config/middleware.js`（多模块项目配置文件为 `sr/common/config/middleware.js`）。

```js
const path = require('path')
const isDev = think.env === 'development'

module.exports = [
  {
    handle: 'meta', // 中间件处理函数
    options: {   // 当前中间件需要的配置
      logRequest: isDev,
      sendResponseTime: isDev,
    },
  },
  {
    handle: 'resource',
    enable: isDev, // 是否开启当前中间件
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/,
    },
  }
]
```

配置项为项目中要使用的中间件列表，每一项支持 `handle`，`enable`，`options`，`match` 等属性。

#### handle

中间件的处理函数，可以用系统内置的，也可以是引入外部的，也可以是项目里的中间件。

handle 的函数格式为：

```js
module.exports = (options, app) => {
  return (ctx, next) => {

  }
}
```

这里中间件接收的参数除了 options 外，还多了个 `app` 对象，该对象为 Koa Application 的实例。

#### enable

是否开启当前的中间件，比如：某个中间件只在开发环境下才生效。

```js
{
  handle: 'resouce',
  enable: think.env === 'development' //这个中间件只在开发环境下生效
}
```

#### options

传递给中间件的配置项，格式为一个对象，中间件里获取到这个配置。

```js
module.exports = [
  {
    options: {
      key: value
    } 
  }
]
```

有时候需要的配置项需要从远程获取，如：配置值保存在数据库中，这时候就要异步从数据库中获取，这时候可以将 options 定义为一个函数来完成：

```js
module.exports = [
  {
    // 将 options 定义为一个异步函数，将获取到的配置返回
    options: async () => {
      const config = await getConfigFromDb();
      return {
        key: config.key,
        value: config.value
      }
    }
  }
]
```

#### match

匹配特定的规则后才执行该中间件，支持二种方式，一种是路径匹配，一种是自定义函数匹配。如：

```js
module.exports = [
  {
    handle: 'xxx-middleware',
    match: '/resource' //请求的 URL 是 /resource 打头时才生效这个 middleware
  }
]
```

```js
module.exports = [
  {
    handle: 'xxx-middleware',
    match: ctx => { // match 为一个函数，将 ctx 传递给这个函数，如果返回结果为 true，则启用该 middleware
      return true;
    }
  }
]
```

### 框架内置的中间件

框架内置了几个中间件，可以通过字符串的方式直接引用。

```js
module.exports = [
  {
    handle: 'meta', // 内置的中间件不用手工 require 进来，直接通过字符串的方式引用
    options: {}
  }
]
```

* [meta](https://github.com/thinkjs/think-meta) 显示一些 meta 信息，如：发送 ThinkJS 的版本号，接口的处理时间等等
* [resource](https://github.com/thinkjs/think-resource) 处理静态资源，生产环境建议关闭，直接用 webserver 处理即可。
* [trace](https://github.com/thinkjs/think-trace) 处理报错，开发环境将详细的报错信息显示处理，也可以自定义显示错误页面。
* [payload](https://github.com/thinkjs/think-payload) 处理表单提交和文件上传，类似于 koa-bodyparser 等 middleware
* [router](https://github.com/thinkjs/think-router) 路由解析，包含自定义路由解析
* [logic](https://github.com/thinkjs/think-logic) logic 调用，数据校验
* [controller](https://github.com/thinkjs/think-controller) controller 和 action 调用

### 项目中自定义的中间件

有时候项目中根据一些特定需要添加中间件，那么可以放在 `src/middleware` 目录下，然后就可以直接通过字符串的方式引用了。

如：添加了 `src/middleware/csrf.js`，那么就可以直接通过 `csrf` 字符串引用这个中间件。

```js
module.exports = [
  {
    handle: 'csrf',
    options: {}
  }
]
```


### 引入外部的中间件

引入外部的中间件非常简单，只需要 require 进来即可。

```js
const csrf = require('csrf'); 
module.exports = [
  ...,
  {
    handle: csrf,
    options: {}
  },
  ...
]
```

### 常见问题

#### 中间件配置是否需要考虑顺序？

中间件执行是按照配置的排列顺序执行的，所以需要开发者考虑配置的顺序。

#### 怎么看当前环境下哪些中间件生效？

可以通过 `DEBUG=koa:application node development.js` 来启动项目，这样控制台下会看到 `koa:application use ...` 相关的信息。

注意：如果启动了多个 worker，那么会打印多遍。

#### 怎么透传数据到 Logic、Controller 中？

有时候需要在中间件里设置一些数据，然后在后续的 Logic、Controller 中获取，此时可以通过 `ctx.state` 完成，具体请见 [透传数据](/doc/3.0/controller.html#toc-247)。

#### 怎么设置数据到 GET/POST 数据中？

在中间件里可以通过 `ctx.param`、`ctx.post` 等方法来获取 query 参数或者表单提交上来的数据，但有些中间件里希望设置一些参数值、表单值以便在后续的 Logic、Controller 中获取，这时候可以通过 `ctx.param`、`ctx.post` 设置：

```js
// 设置参数 name=value，后续在 Logic、Controller 中可以通过 this.get('name') 获取该值
// 如果原本已经有该参数，那么会覆盖
ctx.param('name', 'value');

// 设置 post 值，后续 Logic、Controller 中可以通过 this.post('name2') 获取该值
ctx.post('name2', 'value');
```

#### 中间件的配置是否可以放在 config.js 中？

`不合适`，中间件提供了 `options` 参数用来设置配置，不需要把额外的参数配置放在 config.js 中。

```js
module.exports = [
  {
    handle: xxxMiddleware,
    options: { // 传递给中间件的配置
      key1: value1,
      key2: think.env === 'development' ? value2 : value3
    }
  }
]
```

如果有些配置根 `env` 相关，那么可以在此进行判断。

## Logic

当在 Action 里处理用户的请求时，经常要先获取用户提交过来的数据，然后对其校验，如果校验没问题后才能进行后续的操作；当参数校验完成后，有时候还要进行权限判断等，这些都判断无误后才能进行真正的逻辑处理。如果将这些代码都放在一个 Action 里，势必让 Action 的代码非常复杂且冗长。

为了解决这个问题， ThinkJS 在控制器前面增加了一层 `Logic`，Logic 里的 Action 和控制器里的 Action 一一对应，系统在调用控制器里的 Action 之前会自动调用 Logic 里的 Action。

### Logic 层

Logic 目录在 `src/[module]/logic`，在项目根目录通过命令 `thinkjs controller test` 会创建名为 test 的 Controller 同时会自动创建对应的 Logic。

Logic 代码类似如下：

```js
module.exports = class extends think.Logic {
 __before() {
    // todo
 }
 indexAction() {
    // todo
 }
 __after() {
    // todo
 }
}
```

注：若自己手工创建时，Logic 文件名和 Controller 文件名要相同

其中，Logic 里的 Action 和 Controller 里的 Action 一一对应。Logic 里也支持 `__before` 和 `__after` 魔术方法。

#### 请求类型校验

对应一个特定的 Action，有时候需要限定为某些请求类型，其他类型的请求给拒绝掉。可以通过配置特定的请求类型来完成对请求的过滤。

```js
module.exports = class extends think.Logic {
 indexAction() {
    this.allowMethods = 'post'; //  只允许 POST 请求类型
 }
 detailAction() {
    this.allowMethods = 'get,post'; // 允许 GET、POST 请求类型
 }
}
```

#### 校验规则格式

数据校验的配置格式为 `字段名` : `JSON 配置对象` ，如下：

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      username: {
        string: true,       // 字段类型为 String 类型
        required: true,     // 字段必填
        default: 'thinkjs', // 字段默认值为 'thinkjs'
        trim: true,         // 字段需要trim处理
        method: 'GET'       // 指定获取数据的方式
      },
      age: {
        int: {min: 20, max: 60} // 20到60之间的整数
      }
    }
    let flag = this.validate(rules);
  }
}
```

#### 基本数据类型

支持的数据类型有：`boolean`、`string`、`int`、`float`、`array`、`object`，对于一个字段只允许指定为一种基本数据类型，默认为 `string` 类型。

#### 手动设置数据值

如果有时候不能自动获取值的话（如：从 header 里取值），那么可以手动获取值后配置进去。如：

```js
module.exports = class extends think.Logic {
  saveAction(){
    let rules = {
      username: {
        value: this.header('x-name') // 从 header 中获取值
      }
    }
  }
}
```

#### 指定获取数据来源

如果校验 `version` 参数， 默认情况下会根据当前请求的类型来获取字段对应的值，如果当前请求类型是 `GET`，那么会通过 `this.param('version')` 来获取 `version` 字段的值；如果请求类型是 `POST`，那么会通过 `this.post('version')` 来获取字段的值， 如果当前请求类型是 `FILE`，那么会通过 `this.file('version')` 来获取 `verison` 字段的值。

有时候在 `POST` 类型下，可能会获取上传的文件或者获取 URL 上的参数，这时候就需要指定获取数据的方式了。支持的获取数据方式为 `GET`，`POST` 和 `FILE`。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      username: {
        required: true,
        method: 'GET'       // 指定获取数据的方式
      }
    }
    let flag = this.validate(rules);
  }
}
```

#### 字段默认值

使用 `default:value` 来指定字段的默认值，如果当前字段值为空，会把默认值赋值给该字段，然后执行后续的规则校验。

#### 消除前后空格

使用 `trim:true` 如果当前字段支持 `trim` 操作，会对该字段首先执行 `trim` 操作，然后再执行后续的规则校验。

#### 数据校验方法

配置好校验规则后，可以通过 `this.validate` 方法进行校验。如：

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      username: {
        required: true
      }
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('validate error', this.validateErrors);
      // 如果校验失败，返回
      // {"errno":1000,"errmsg":"validate error","data":{"username":"username can not be blank"}}
    }
  }
}
```

如果你在controller的action中使用了`this.isGet` 或者 `this.isPost` 来判断请求的话，在上面的代码中也需要加入对应的 `this.isGet` 或者 `this.isPost`，如：

```js
module.exports = class extends think.Logic {
  indexAction(){
    if(this.isPost) {
      let rules = {
        username: {
          required: true
        }
      }
      let flag = this.validate(rules);
      if(!flag){
        return this.fail('validate error', this.validateErrors);
      }
    }

  }
}
```

如果返回值为 `false`，那么可以通过访问 `this.validateErrors` 属性获取详细的错误信息。拿到错误信息后，可以通过 `this.fail` 方法把错误信息以 JSON 格式输出，也可以通过 `this.display` 方法输出一个页面，Logic 继承了 Controller 可以调用 Controller 的 方法。

#### 自动调用校验方法

多数情况下都是校验失败后，输出一个 JSON 错误信息。如果不想每次都手动调用 `this.validate` 进行校验，可以通过将校验规则赋值给 `this.rules` 属性进行自动校验，如：

```js
module.exports = class extends think.Logic {
  indexAction(){
    this.rules = {
      username: {
        required: true
      }
    }
  }
}
```

相当于

``` js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      username: {
        required: true
      }
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail(this.config('validateDefaultErrno') , this.validateErrors);
    }
  }
}
```

将校验规则赋值给 `this.rules` 属性后，会在这个 Action 执行完成后自动校验，如果有错误则直接输出 JSON 格式的错误信息。

#### 多action复用校验规则

对于多个action有时我们想要复用一些校验规则，例如对于 `logic` 中的 `indexAction` 与 `homeAction` 都要校验 `app_id` 字段必填，可以将 `app_id` 的校验提到 `scope` 中：

```js
module.exports = class extends think.Logic {
  get scope() {
    return {
      app_id: {
        required: true
      }
    }
  }

  indexAction(){
    let rules = {
      email: {
        required: true
      }
    }

    // 自定义 app_id 的错误信息
    let msgs = {
      app_id: '{name} 不能为空(自定义错误)',
    }

    if(!this.validate(rules, msgs)) {
      return this.fail(this.validateErrors);
    }
  }

  homeAction() {
    // email 校验的简化写法
    // 此时 app_id 使用默认错误信息
    this.rules = {
      email: {
        required: true
      }
    }
  }

}
```

#### 数组校验

数据校验支持数组校验，但是数组校验只支持一级数组，不支持多层级嵌套的数组。`children` 为所有数组元素指定一个相同的校验规则。

``` js
module.exports = class extends think.Logic {
  let rules = {
    username: {
      array: true,
      children: {
        string: true,
        trim: true,
        default: 'thinkjs'
      },
      method: 'GET'
    }
  }
  this.validate(rules);
}

```

#### 对象校验

数据校验支持对象校验， 但是对象校验只支持一级对象，不支持多层级嵌套的对象。`children` 为所有对象属性指定一个相同的校验规则。


``` js
module.exports = class extends think.Logic {
  let rules = {
    username: {
      object: true,
      children: {
        string: true,
        trim: true,
        default: 'thinkjs'
      },
      method: 'GET'
    }
  }
  this.validate(rules);
}
```

#### 校验前数据的自动转换

对于指定为 `boolean` 类型的字段，`'yes'`， `'on'`， `'1'`， `'true'`， `true` 会被转换成 `true`， 其他情况转换成 `false`，然后再执行后续的规则校验；

对于指定为 `array` 类型的字段，如果字段本身是数组，不做处理； 如果该字段为字符串会进行 `split(',')` 处理，其他情况会直接转化为 `[字段值]`，然后再执行后续的规则校验。


#### 校验后数据的自动转换

对于指定为 `int`、`float` 数据类型的字段在校验之后，会自动对数据进行 `parseFloat` 转换。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      age: {
        int: true,
        method: 'GET'
      }
    }
    let flag = this.validate(rules);
  }
}
```
如果 url 中存在参数 `age=26`， 在经过 Logic 层校验之后，typeof this.param('age') 为 `number` 类型。

#### 自定义错误中的规则名称

```js
module.exports = class extends think.Logic {
  indexAction(){
    this.rules = {
      username: {
        required: true
      }
    }
  }
}
```
对于上述规则，在验证失败的情况下 this.validateErrors 将为 {username: 'username can not be blank'}。但是有时想让错误自定义为 '用户名不能为空'。需要如下操作：

首先在 `src/config/validator.js` 中复写掉默认的 `required` 错误信息：

```js
module.exports = {
  messages: {
    required: '{name} 不能为空',
  }
}

```

然后要将 `username` 替换成别名 `用户名`，需要为校验规则添加 `aliasName` :

```js
module.exports = class extends think.Logic {
  indexAction(){
    this.rules = {
      username: {
        required: true,
        aliasName: '用户名'
      }
    }
  }
}
```


#### 全局定义校验规则

在单模块下项目下的 `config` 目录下建立 `validator.js` 文件；在多模块项目下的 `common/config` 目录下建立 `validator.js`。在 `validator.js` 中添加自定义的校验方法：

例如, 我们想要验证 `GET` 请求中的 `name1` 参数是否等于字符串 `lucy` 可以如下添加校验规则; 访问你的服务器地址/index/?name1=jack

```js
// logic index.js
module.exports = class extends think.Logic {
  indexAction() {
    let rules = {
      name1: {
        eqLucy: 'lucy',
        method: 'GET'
      }
    }
    let flag = this.validate(rules);
    if(!flag) {
      console.log(this.validateErrors); // name1 shoud eq lucy
    }
  }
  }
}

// src/config/validator.js
module.exports = {
  rules: {
    eqLucy(value, { validName, validValue, ctx, currentQuery, rule, rules, parsedValidValue }) {
      return value === validValue;
    }
  },
  messages: {
    eqLucy: '{name} should eq {args}'
  }
}

```

自定义的校验方法会被注入以下参数，对于上述例子来说
```js
(
  value: ,                // 参数在相应的请求中的值，此处为 ctx['param']['name1']
  {
    validName,            // 校验方法名，此处为 'eqLucy'
    validValue,           // 校验方法名对应的值，此处为 'lucy'
    currentQuery,         // 当前请求类型的值，此处为 ctx['param'] （表示从 ctx 中获取到 get 类型的参数）
    ctx,                  // ctx 对象
    rule,                 // 校验规则内容，此处为 {eqLucy: 'lucy', method: 'GET'}
    rules,                // 所有的校验规则内容，此处为 let rules 的值
    parsedValidValue      // _eqLucy 方法解析返回的结果, 如果没有 _eqLucy 方法，则为 validValue
  }
)
```


#### 解析校验规则参数

有时我们想对校验规则的参数进行解析，只需要建立一个下划线开头的同名方法在其中执行相应的解析，并将解析后的结果返回即可。

例如我们要验证 `GET` 请求中的 `name1` 参数是否等于 `name2` 参数， 可以如下添加校验方法：访问  你的服务器地址/index/?name1=tom&name2=lily

```js
// logic index.js
module.exports = class extends think.Logic {
  indexAction() {
    let rules = {
      name1: {
        eqLucy: 'name2',
        method: 'GET'
      }
    }
    let flag = this.validate(rules);
    if(!flag) {
      console.log(validateErrors); // name1 shoud eq name2
    }
  }
}

// src/config/validator.js
module.exports = {
  rules: {
    _eqLucy(validValue, { validName, currentQuery, ctx, rule, rules }){
      let parsedValue = currentQuery[validValue];
      return parsedValue;
    },

    eqLucy(value, { validName, validValue, currentQuery, ctx, rule, rules, parsedValidValue }) {
      return value === parsedValue;
    }
  },
  messages: {
    eqLucy: '{name} should eq {args}'
  }
}
```

解析参数 `_eqLucy` 注入的第一个参数是当前校验规则的值（对于本例子，validValue 为 'name2'），其他参数意义同上面的介绍。

#### 自定义错误信息

错误信息中可以存在三个插值变量 `{name}`、`{args}`、 `{pargs}`。 `{name}` 会被替换为校验的字段名称， `{args}`会被替换为校验规则的值，`{pargs}` 会被替换为解析方法返回的值。如果`{args}`、`{pargs}` 不是字符串，将做 `JSON.stringify` 处理。


对于非 `Object: true` 类型的字段，支持三种自定义错误的格式：规则1：规则：错误信息；规则2：字段名：错误信息；规则3：字段名：{ 规则： 错误信息} 。

对于同时指定了多个错误信息的情况，优先级 规则3 > 规则2 > 规则1。

``` js
module.exports = class extends think.Logic {
  let rules = {
    username: {
      required: true,
      method: 'GET'
    }
  }
  let msgs = {
    required: '{name} can not blank',         // 规则 1
    username: '{name} can not blank',         // 规则 2
    username: {
      required: '{name} can not blank'        // 规则 3
    }
  }
  this.validate(rules, msgs);
}
```

对于 `Object: true` 类型的字段，支持以下方式的自定义错误。优先级为 规则 5 > (4 = 3) > 2 > 1 。

``` js
module.exports = class extends think.Logic {
  let rules = {
    address: {
      object: true,
      children: {
        int: true
      }
    }
  }
  let msgs = {
    int: 'this is int error message for all field',             // 规则1
    address: {
      int: 'this is int error message for address',             // 规则2
      a: 'this is int error message for a of address',          // 规则3
      'b,c': 'this is int error message for b and c of address' // 规则4
      d: {
        int: 'this is int error message for d of address'       // 规则5
      }
    }
  }
  let flag = this.validate(rules, msgs);
}
```

### 支持的校验类型

#### required

`required: true` 字段必填，默认 `required: false`。`undefined`、`空字符串` 、`null`、`NaN` 在 `required: true` 时校验不通过。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        required: true
      }
    }
    this.validate(rules);
    // todo
  }
}
```

`name` 为必填项。

#### requiredIf

当另一个项的值为某些值其中一项时，该项必填。如：

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        requiredIf: ['username', 'lucy', 'tom'],
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```

对于上述例子， 当 `GET` 请求中的 `username` 的值为 `lucy`、`tom` 任何一项时， `name` 的值必填。

#### requiredNotIf

当另一个项的值不在某些值中时，该项必填。如：

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        requiredNotIf: ['username', 'lucy', 'tom'],
        method: 'POST'
      }
    }
    this.validate(rules);
    // todo
  }
}
```

对于上述例子，当 `POST` 请求中的 `username` 的值不为 `lucy` 或者 `tom` 任何一项时， `name` 的值必填。


#### requiredWith

当其他几项有一项值存在时，该项必填。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        requiredWith: ['id', 'email'],
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```

对于上述例子，当 `GET` 请求中 `id`， `email` 有一项值存在时，`name` 的值必填。

#### requiredWithAll

当其他几项值都存在时，该项必填。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        requiredWithAll: ['id', 'email'],
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```

对于上述例子，当 `GET` 请求中 `id`， `email` 所有项值存在时，`name` 的值必填。

#### requiredWithOut

当其他几项有一项值不存在时，该项必填。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        requiredWithOut: ['id', 'email'],
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```
对于上述例子，当 `GET` 请求中 `id`， `email` 有任何一项值不存在时，`name` 的值必填。


#### requiredWithOutAll

当其他几项值都不存在时，该项必填。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        requiredWithOutAll: ['id', 'email'],
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```
对于上述例子，当 `GET` 请求中 `id`， `email` 所有项值不存在时，`name` 的值必填。

#### contains

值需要包含某个特定的值。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        contains: 'ID-',
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```
对于上述例子，当 `GET` 请求中 `name` 得值需要包含字符串 `ID-`。

#### equals

和另一项的值相等。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        equals: 'username',
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```

对于上述例子，当 `GET` 请求中的 `name` 与 `username` 的字段要相等。

#### different

和另一项的值不等。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      name: {
        different: 'username',
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```

对于上述例子，当 `GET` 请求中的 `name` 与 `username` 的字段要不相等。

#### before

值需要在一个日期之前，默认为需要在当前日期之前。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      time: {
        before: '2099-12-12 12:00:00', // before: true 早于当前时间
        method: 'GET'
      }
    }
    this.validate(rules);
    // todo
  }
}
```
对于上述例子，当 `GET` 请求中的 `time` 字段对应的时间值要早于 `2099-12-12 12:00:00`。

#### after

值需要在一个日期之后，默认为需要在当前日期之后，`after: true | time string`。

#### alpha

值只能是 [a-zA-Z] 组成，`alpha: true`。

#### alphaDash

值只能是 [a-zA-Z_] 组成，`alphaDash: true`。

#### alphaNumeric

值只能是 [a-zA-Z0-9] 组成，`alphaNumeric: true`。

#### alphaNumericDash

值只能是 [a-zA-Z0-9_] 组成，`alphaNumericDash: true`。

#### ascii

值只能是 ascii 字符组成， `ascii: true`。

#### base64

值必须是 base64 编码，`base64: true`。

#### byteLength

字节长度需要在一个区间内， `byteLength: options`。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      field_name: {
        byteLength: {min: 2, max: 4} // 字节长度需要在 2 - 4 之间
        // byteLength: {min: 2} // 字节最小长度需要为 2
        // byteLength: {max: 4} // 字节最大长度需要为 4
        // byteLength: 10 // 字节长度需要等于 10
      }
    }
  }
}
```

#### creditCard

需要为信用卡数字，`creditCard: true`。

#### currency

需要为货币，`currency: true | options`， `options` 参见 `https://github.com/chriso/validator.js`。

#### date

需要为日期，`date: true`。

#### decimal

需要为小数，例如：0.1， .3， 1.1， 1.00003， 4.0，`decimal: true`。

#### divisibleBy

需要被一个数整除，`divisibleBy: number`。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      field_name: {
        divisibleBy: 2 //可以被 2 整除
      }
    }
  }
}
```

#### email

需要为 email 格式，`email: true | options`， `options` 参见 `https://github.com/chriso/validator.js`。

#### fqdn

需要为合格的域名，`fqdn: true | options`， `options` 参见 `https://github.com/chriso/validator.js`。

#### float

需要为浮点数，`float: true | options`， `options` 参见 `https://github.com/chriso/validator.js`。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      money: {
        float: true, //需要是个浮点数
        // float: {min: 1.0, max: 9.55} // 需要是个浮点数，且最小值为 1.0，最大值为 9.55
      }
    }
    this.validate();
    // todo
  }
}
```

#### fullWidth

需要包含宽字节字符，`fullWidth: true`。

#### halfWidth

需要包含半字节字符，`halfWidth: true`。

#### hexColor

需要为个十六进制颜色值，`hexColor: true`。

#### hex

需要为十六进制，`hex: true`。

#### ip

需要为 ip 格式，`ip: true`。

#### ip4

需要为 ip4 格式，`ip4: true`。

#### ip6

需要为 ip6 格式，`ip6: true`。

#### isbn

需要为国际标准书号，`isbn: true`。

#### isin

需要为证券识别编码，`isin: true`。

#### iso8601

需要为 iso8601 日期格式，`iso8601: true`。

#### issn

国际标准连续出版物编号，`issn: true`。

#### uuid

需要为 UUID（3，4，5 版本)，`uuid: true`。

#### dataURI

需要为 dataURI 格式，`dataURI: true`。

#### md5

需要为 md5，`md5: true`。

#### macAddress

需要为 mac 地址， `macAddress: true`。

#### variableWidth

需要同时包含半字节和全字节字符， `variableWidth: true`。

#### in

在某些值中，`in: [...]`。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      version: {
        in: ['2.0', '3.0'] //需要是 2.0，3.0 其中一个
      }
    }
    this.validate();
    // todo
  }
}
```

#### notIn

不能在某些值中， `notIn: [...]`。

#### int

需要为 int 型， `int: true | options`， `options` 参见 `https://github.com/chriso/validator.js`。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      field_name: {
        int: true, //需要是 int 型
        //int: {min: 10, max: 100} //需要在 10 - 100 之间
      }
    }
    this.validate();
    // todo
  }
}
```

#### length

长度需要在某个范围，`length: options`。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      field_name: {
        length: {min: 10}, //长度不能小于10
        // length: {max: 20}, //长度不能大于10
        // length: {min: 10, max: 20}, //长度需要在 10 - 20 之间
        // length: 10 //长度需要等于10
      }
    }
    this.validate();
    // todo
  }
}
```

#### lowercase

需要都是小写字母，`lowercase: true`。

#### uppercase

需要都是大写字母，`uppercase: true`。

#### mobile

需要为手机号，`mobile: true | options`，`options` 参见 `https://github.com/chriso/validator.js`。

```js
module.exports = class extends think.Logic {
  indexAction(){
    let rules = {
      mobile: {
        mobile: 'zh-CN' //必须为中国的手机号
      }
    }
    this.validate();
    // todo
  }
}
```

#### mongoId

需要为 MongoDB 的 ObjectID，`mongoId: true`。

#### multibyte

需要包含多字节字符，`multibyte: true`。

#### url

需要为 url，`url: true|options`，`options` 参见 `https://github.com/chriso/validator.js`。

#### order

需要为数据库查询 order，如：name DESC，`order: true`。

#### field

需要为数据库查询的字段，如：name,title，`field: true`。

#### image

```js
let rules = {
  file: {
    required: true, // required 默认为false
    image: true,
    method: 'file' // 文件通过post提交，验证文件需要制定 method 为 `file`
  }
}
```
上传的文件需要为图片，`image: true`。

#### startWith

需要以某些字符打头，`startWith: string`。

#### endWith

需要以某些字符结束, `endWith: string`。

#### string

需要为字符串，`string: true`。

#### array

需要为数组，`array: true`，对于指定为 `array` 类型的字段，如果字段对应的值是数组不做处理；如果字段对应的值是字符串，进行 `split(,)` 处理；其他情况转化为 `[字段值]`。

#### boolean

需要为布尔类型。`'yes'`， `'on'`， `'1'`， `'true'`， `true` 会自动转为布尔 `true` 。

#### object

需要为对象，`object: true`。

#### regexp

字段值要匹配给出的正则。

```js
module.exports = class extends think.Logic {
  indexAction(){
    this.rules = {
      name: {
        regexp: /thinkjs/g
      }
    }
    this.validate();
    // todo
  }
}
```


## Controller / 控制器

MVC 模型中，控制器是用户请求的逻辑处理部分。比如：将用户相关的操作都放在 `user.js` 里，每一个操作就是里面一个 Action。

### 创建 Controller

项目中的 controller 需要继承 `think.Controller` 类，这样能使用一些内置的方法。当然项目中可以创建一些通用的基类，然后实际的 controller 都继承自这个基类。

项目创建时会自动创建了一个名为 `base.js` 的基类，其他 controller 继承该类即可。

```js
//src/controller/user.js

const Base = require('./base.js');
module.exports = class extends Base {
  indexAction(){
    this.body = 'hello word!';
  }
}
```

创建完成后，框架会监听文件变化然后重启服务。这时访问 `http://127.0.0.1:8360/user/index` 就可以看到输出的 `hello word!`

### Action 执行

Action 执行是通过中间件 [think-controller](https://github.com/thinkjs/think-controller) 来完成的，通过 `ctx.action` 值在 controller 寻找 `xxxAction` 的方法名并调用，且调用相关的魔术方法，具体顺序为：

* 实例化 Controller 类，传入 `ctx` 对象
* 如果方法 [__before](/doc/3.0/controller.html#toc-083) 存在则调用，如果返回值为 `false`，则停止继续执行
* 如果方法 `xxxAction` 存在则执行，如果返回值为 `false`，则停止继续执行
* 如果方法 `xxxAction` 不存在但 [__call](/doc/3.0/controller.html#toc-fcb) 方法存在，则调用 __call，如果返回值为 `false`，则停止继续执行
* 如果方法 [__after](/doc/3.0/controller.html#toc-e16) 存在则执行

### 前置操作 __before

项目中，有时候需要在一个统一的地方做一些操作，如：判断是否已经登录，如果没有登录就不能继续后面行为。此种情况下，可以通过内置的 `__before` 来实现。

`__before` 是在调用具体的 Action 之前调用的，这样就可以在其中做一些处理。

```js
module.exports = class extends think.Controller {
  async __before(){
    const userInfo = await this.session('userInfo');
    //获取用户的 session 信息，如果为空，返回 false 阻止后续的行为继续执行
    if(think.isEmpty(userInfo)){
      return false;
    }
  }
  indexAction(){
    // __before 调用完成后才会调用 indexAction
  }
}
```
如果类继承需要调用父级的 `__before` 方法的话，可以通过 `super.__before` 来完成，如：

```js
module.exports = class extends Base {
  __before(){
    // 通过 Promise.resolve 将返回值包装为 Promise
    // 如果返回值确定为 Promise，那么就不需要再包装了
    return Promise.resolve(super.__before()).then(flag => {
      // 如果父级想阻止后续继承执行会返回 false，这里判断为 false 的话不再继续执行了。
      if(flag === false) return false;

      // 其他逻辑代码
    })
  }
}
```

如果不需要 Babel 转译，那么可以用下面更简洁的方式：

```js
module.exports = class extends Base {
  async __before(){
    const flag = await super.__before();
    // 如果父级想阻止后续继承执行会返回 false，这里判断为 false 的话不再继续执行了。
    if(flag === false) return false;
    ...
  }
}
```

### 后置操作 __after

后置操作 `__after` 与 `__before` 对应，只是在具体的 Action 执行之后执行，如果具体的 Action 执行返回了 `false`，那么 `__after` 不再执行。

```js
module.exports = class extends think.Controller {
  indexAction(){

  }
  __after(){
    //indexAction 执行完成后执行，如果 indexAction 返回了 false 则不再执行
  }
}
```

### 魔术方法 __call

当解析后的 url 对应的控制器存在，但 Action 不存在时，会试图调用控制器下的魔术方法 `__call`。这里可以对不存在的方法进行统一处理。

```js
module.exports = class extends think.Controller {
  indexAction(){

  }
  __call(){
    //如果相应的Action不存在则调用该方法
  }
}
```

### ctx 对象

Controller 实例化时会传入 [ctx](/doc/3.0/context.html) 对象，在 Controller 里可以通过 `this.ctx` 来获取 ctx 对象，并且 Controller 上很多方法也是通过调用 ctx 里的方法来实现的。

如果子类中需要重写 constructor 方法，那么需要调用父类中的 constructor，并将 ctx 参数传递进去：

```js
const Base = require('./base.js');
module.exports = class extends Base {
  constructor(ctx){
    super(ctx); // 调用父级的 constructor 方法，并把 ctx 传递进去
    // 其他额外的操作
  }
}
```

### 多级控制器

有时候项目比较复杂，文件较多，所以希望根据功能进行一些划分。如：用户端的功能放在一块、管理端的功能放在一块。

这时可以借助多级控制器来完成这个功能，在 `src/controller/` 目录下创建 `user/` 和 `admin/` 目录，然后用户端的功能文件都放在 `user/` 目录下，管理端的功能文件都放在 `admin/` 目录下。访问时带上对应的目录名，路由解析时会优先匹配目录下的控制器。

假如控制器下有 console 子目录，下有 user.js 文件，即：`src/controller/console/user.js`，当访问请求为 `/console/user/login` 时，会优先解析出 Controller 为 `console/user`，Action 为 `login`。

### 阻止后续逻辑执行

Controller 里的处理顺序依次为 `__before`、`xxxAction`、`__after`，有时候在一些特定的场景下，需要提前结束请求，阻止后续的逻辑继续执行。这时候可以通过 `return false` 来处理。

```js
module.exports = class extends think.Controller {
  __before() {
    if(!user.isLogin) {
      return false; // 这里 return false，那么 xxxAction 和 __after 不再执行
    }
  }
  xxxAction() {
    // action 里 return false，那么 __after 则不再执行
  }
  __after() {

  }
}
```

### 获取参数、表单值

对于 URL 上传递的参数或者表单上传的值，框架直接做了解析，可以直接通过对应的方法获取。
对于 URL 上传递的参数，在 Action 中可以通过 [get](/doc/3.0/controller.html#toc-b4e) 方法获取。对于表单提交的字段或者文件可以通过 [post](/doc/3.0/controller.html#toc-3d4) 和 [file](/doc/3.0/controller.html#toc-88b) 方法获取。表单数据解析是通过中间件 [think-payload](https://github.com/thinkjs/think-payload) 来完成的，解析后的数据放在 `ctx.request.body` 对象上，最后包装成 post 和 file 方法供使用。

### 透传数据

由于用户的请求处理经过了中间件、Logic、Controller 等多层的处理，有时候希望在这些环节中透传一些数据，这时候可以通过 `ctx.state.xxx` 来完成。

```js
// 中间件中设置 state
(ctx, next) => {
  ctx.state.userInfo = {};
}

// Logic、Controller 中获取 state
indexAction() {
  const userInfo = this.ctx.state.userInfo;
}
```
透传数据时避免直接在 `ctx` 对象上添加属性，这样可能会覆盖已有的属性，引起一些奇怪的问题。

### 常见问题

#### 怎么获取 req 和 res 对象？

有时候需要获取 Node 的 `req` 和 `res` 对象，这时候可以通过 `this.ctx.req` 和 `this.ctx.res` 获取，如：

```js
module.exports = class extends think.Controller {
  indexAction() {
    const req = this.ctx.req;
    const res = this.ctx.res;
    // do something with req & res
  }
}
```

#### async/await 和 super 同时使用为什么报错？

目前 Babel 的稳定版还是 `6.x`，这个版本下如果同时使用了 async/await 和 super，那么编译后的代码有问题导致报错，需要等待 7.0 的版本，具体见 <https://github.com/babel/babel/issues/3930>。

目前的解决办法是，不要 async/await 和 super 同时使用，如果必须有 super 调用，那么就直接用 Promise 的方式。如：

```js
module.exports = class extends Base {
  aaa () {
    // 通过 Promise.resolve 将父级方法返回值包装为 Promise，然后就可以用 then 方法了
    return Promise.resolve(super.aaa()).then(data => {
      ...
    })
  }
}
```

### API


#### controller.ctx

传递进来的 `ctx` 对象。

#### controller.body

设置或者获取返回内容，等同于 [ctx.body](/doc/3.0/context.html#toc-688)。

#### controller.ip

* `return` {String}

获取当前请求用户的 ip，等同于 [ctx.ip](/doc/3.0/context.html#toc-5d1)。

```js
module.exports = class extends think.Controller {
  indexAction() {
    const ip = this.ip; // 获取用户的 IP
  }
}
```


#### controller.ips

获取当前请求链路的所有 ip，等同于 [ctx.ips](/doc/3.0/context.html#toc-f4e)。


#### controller.method

获取当前请求的类型，等同于 [ctx.method](/doc/3.0/context.html#toc-972)。

```js
module.exports = class extends think.Controller {
  indexAction() {
    const method = this.method; // 获取当前请求类型
    if(method === 'OPTIONS') {

    }
  }
}
```

#### controller.isGet

判断是否是 GET 请求，等同于 [ctx.isGet](/doc/3.0/context.html#toc-15d)。

```js
module.exports = class extends think.Controller {
  indexAction() {
    if(this.isGet) { // 如果是 GET 请求

    }
  }
}
```

#### controller.isPost

判断是否是 POST 请求，等同于 [ctx.isPost](/doc/3.0/context.html#toc-056)。


```js
module.exports = class extends think.Controller {
  indexAction() {
    if(this.isPost) { // 如果是 POST 请求

    }
  }
}
```

#### controller.isCli

* `return` {Boolean}

是否是命令行下调用，等同于 [ctx.isCli](/doc/3.0/context.html#toc-e64)。


```js
module.exports = class extends think.Controller {
  indexAction() {
    if(this.isCli) { // 如果是命令行调用

    }
  }
}
```

#### controller.userAgent

获取当前请求的 userAgent，等同于 [ctx.userAgent](/doc/3.0/context.html#toc-125)。

```js
module.exports = class extends think.Controller {
  indexAction() {
    const userAgent = (this.userAgent || '').toLowerCase();
    if(userAgent.indexOf('spider') > -1) {

    }
  }
}
```

#### controller.isMethod(method)

判断当前的请求类型是否是指定的类型，等同于 [ctx.isMethod](/doc/3.0/context.html#toc-dd7)。

```js
module.exports = class extends think.Controller {
  indexAction() {
    const isDelete = this.isMethod('DELETE'); // 是否是 DELETE 请求
  }
}
```


#### controller.isAjax(method)

判断是否是 Ajax 请求。如果指定了 method，那么请求类型也要相同，等同于 [ctx.isAjax](/doc/3.0/context.html#toc-677)。

```js
module.exports = class extends think.Controller {
  indexAction(){
    //是ajax 且请求类型是 POST
    let isAjax = this.isAjax('post');
  }
}
```

#### controller.isJsonp(callback)

是否是 jsonp 请求，等同于 [ctx.isJsonp](/doc/3.0/context.html#toc-178)。

#### controller.get(name)

获取 query 参数，等同于 [ctx.param](/doc/3.0/context.html#toc-f5e)。由于 ctx.get 已经被 Koa 使用，所以无法添加 ctx.get 方法。

#### controller.post(name)

获取 POST 提交的参数，等同于 [ctx.post](/doc/3.0/context.html#toc-29b)。

#### controller.file(name)

等同于 [ctx.file](/doc/3.0/context.html#toc-322) 方法。

#### controller.header(name, value)

* `name` {String} header 名
* `value` {String} header 值

获取或者设置 header。

```js
module.exports = class extends think.Controller {
  indexAction(){
    let accept = this.header('accept'); //获取 header
    this.header('X-NAME', 'thinks'); //设置 header
  }
}
```

#### controller.expires(time)

设置 Cache-Control 和 Expires 缓存头，等同于 [ctx.expires](/doc/3.0/context.html#toc-f99)。

#### controller.referer(onlyHost)

获取 referrer，等同于 [ctx.referer](/doc/3.0/context.html#toc-38c)。

#### controller.referrer(onlyHost)

该方法等同于 controller.referer 方法。

#### controller.cookie(name, value, options)

操作 cookie，等同于 [ctx.cookie](/doc/3.0/context.html#toc-a67)。

#### controller.redirect(url)

页面跳转，等用于 [ctx.redirect](/doc/3.0/context.html#toc-3e0)。

#### controller.jsonp(data, callback)

输出 jsonp 格式内容，等用于 [ctx.jsonp](/doc/3.0/context.html#toc-45f)。

#### controller.json(data)

json 的方式输出内容，等同于 [ctx.json](/doc/3.0/context.html#toc-77f)。

#### controller.status(status)

设置状态码，等同于 [ctx.status](/doc/3.0/context.html#toc-606)。

#### controller.success(data, message)

格式化输出一个正常的数据，一般是操作成功后输出，等同于 [ctx.success](/doc/3.0/context.html#toc-526)。


#### controller.fail(errno, errmsg, data)

格式化输出一个异常的数据，一般是操作失败后输出，等同于 [ctx.fail](/doc/3.0/context.html#toc-c4f)。

#### controller.download(filepath, filename)

下载文件，等同于 [ctx.download](/doc/3.0/context.html#toc-b4e)。

#### controller.controller(name, m)

* `name` {String} 控制器名称
* `m` {String} 模块名，多模块项目下有效
* `return` {Object} 控制器实例

获取另一个控制器的实例，如果不存在则报错。

```js
module.exports = class extends think.Controller {
  indexAction() {
    // 获取其他控制器实例，然后调用其方法
    const userController = this.controller('user');
    userController.xxx();
  }
  index2Action() {
    // 获取子级控制器实例，然后调用其方法
    const userController = this.controller('console/user');
    userController.xxx();
  }
  index3Action() {
    // 获取 admin 模块下控制器实例，然后调用其方法
    const userController = this.controller('console/user', 'admin');
    userController.xxx();
  }
}
```

#### controller.action(controller, name, m)

* `controller` {String | Object} 控制器名称，会通过 `this.controller` 获取到控制器实例
* `name` {String} Action 名称
* `m` {String, Optional} 模块名，多模块项目下有效
* `return` {Mixed}

调用其他控制器下的 Action 方法，会自动调用 `__before`、`__after` 之类的魔术方法。

```js
module.exports = class extends think.Controller {
  indexAction() {
    // 调用 user 控制器的 loginAction 方法
    const ret = this.action('user', 'login');
  }
  index2Action() {
    // 调用 front/user 控制器（子级控制器）的 loginAction 方法
    const ret = this.action('front/user', 'login');
  }
  index3Action() {
    // 调用 admin 模块下（多模块项目） user 控制器的 loginAction 方法
    const ret = this.action('user', 'login', 'admin');
  }
}
```
#### controller.service(name, m, ...args)

实例化 Service 类，等同于 [think.service](/doc/3.0/think.html#toc-014)。


## View / 视图

由于某些项目下并不需要 View 的功能，所以 3.0 里并没有直接内置 View 的功能，而是通过 Extend 和 Adapter 来实现的。

### Extend 来支持 View

配置 `src/config/extend.js`，添加如下的配置，如果已经存在则不需要再添加：

```js
const view = require('think-view');
module.exports = [
  view
]
```

通过添加视图的扩展，让项目有渲染模板文件的能力，视图扩展是通过模块[think-view](https://github.com/thinkjs/think-view) 实现的。

### 配置 View Adapter

在 `src/config/adapter.js` 中添加如下的配置，如果已经存在则不需要再添加：

```js
const nunjucks = require('think-view-nunjucks');
const path = require('path');

// 视图的 adapter 名称为 view
exports.view = {
  type: 'nunjucks', // 这里指定默认的模板引擎是 nunjucks
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'), //模板文件的根目录
    sep: '_', //Controller 与 Action 之间的连接符
    extname: '.html' //模板文件扩展名
  },
  nunjucks: {
    handle: nunjucks,
    beforeRender: () => {}, // 模板渲染预处理
    options: { // 模板引擎额外的配置参数

    }
  }
}
```

这里用的模板引擎是 `nunjucks`，项目中可以根据需要修改。

### 具体使用

配置了 Extend 和 Adapter 后，就可以在 Controller 里使用了。如：

```js
module.exports = class extends think.Controller {
  indexAction(){
    this.assign('title', 'thinkjs'); //给模板赋值
    return this.display(); //渲染模板
  }
}
```

#### assign

给模板赋值。

```js
//单条赋值
this.assign('title', 'thinkjs'); 

//多条赋值
this.assign({
  title: 'thinkjs', 
  name: 'test'
}); 

//获取之前赋过的值，如果不存在则为 undefined
const title = this.assign('title'); 

//获取所有赋的值
const assignData = this.assign(); 
```

#### render

获取渲染后的内容，该方法为异步方法，需要通过 async/await 处理。

```js
//根据当前请求解析的 controller 和 action 自动匹配模板文件
const content1 = await this.render(); 

//指定文件名
const content2 = await this.render('doc'); 
const content3 = await this.render('doc/detail'); 
const content4 = await this.render('doc_detail');

//不指定文件名但切换模板类型
const content5 = await this.render(undefined, 'ejs');

//指定文件名且切换模板类型
const content6 = await this.render('doc', 'ejs'); 

//切换模板类型，并配置额外的参数
//切换模板类型时，需要在 adapter 配置里配置对应的类型
const content7 = await this.render('doc', {
  type: 'ejs', 
  xxx: 'yyy'
});
```

#### display

渲染并输出内容，该方法实际上是调用了 `render` 方法，然后将渲染后的内容赋值到 `ctx.body` 属性上。该方法为异步方法，需要通过 async/await 处理。

```js
//根据当前请求解析的 controller 和 action 自动匹配模板文件
await this.display(); 

//指定文件名
await this.display('doc'); 
await this.display('doc/detail'); 
await this.display('doc_detail');

//不指定文件名切换模板类型
await this.display(undefined, 'ejs');

//指定文件名且切换模板类型
await this.display('doc', 'ejs'); 

//切换模板类型，并配置额外的参数
await this.display('doc', {
  type: 'ejs', 
  xxx: 'yyy'
});
```


### 模板预处理

有时候需要对模板进行预处理，比较常见的操作是给 `nunjucks` 引擎增加 `Filter`。这时候你就可以使用 `beforeRender` 方法。

```js
const nunjucks = require('think-view-nunjucks');
const path = require('path');

exports.view = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'), //模板文件的根目录
    sep: '_', //Controller 与 Action 之间的连接符
    extname: '.html' //文件扩展名
  },
  nunjucks: {
    handle: nunjucks,
    beforeRender(env, nunjucks, config) {
      env.addFilter('utc', time => (new Date(time)).toUTCString());
    }
  }
}
```

其中不同模板引擎 `beforeRender()` 方法传入的参数可能不同，可在 https://github.com/thinkjs/think-awesome#view 项目中找到对应的模板引擎查看。

### 修改模板引擎默认参数

有时候想修改模板引擎的一些参数，如：修改左右定界符，这时候可以通过 `options` 完成：

```js
const nunjucks = require('think-view-nunjucks');
const path = require('path');

exports.view = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'), //模板文件的根目录
    sep: '_', //Controller 与 Action 之间的连接符
    extname: '.html' //文件扩展名
  },
  nunjucks: {
    handle: nunjucks,
    options: {
      tags: { // 修改定界符相关的参数
        blockStart: '<%',
        blockEnd: '%>',
        variableStart: '<$',
        variableEnd: '$>',
        commentStart: '<#',
        commentEnd: '#>'
      }
    }
  }
}
```

### 默认注入的参数

除了手工通过 `assign` 方法注册一些变量到模板外，系统在渲染模板的时候，自动注入 `controller`、`config`、`ctx` 变量，以便于在模板里直接使用。

#### controller

当前控制器实例，在模板里可以直接调用控制器上的属性和方法。

```
{{ if controller.type === 'xx' }}
  <p>当前 type 为 xx</p>
{{ endif }}
```

这里以 `nunjucks` 模板引擎举例，如果是调用控制器里的方法，那么方法必须为一个**同步方法**。

#### config

所有的配置，在模板里可以直接通过 `config.xxx` 来获取配置，如果属性不存在，那么值为 `undefined`。


#### ctx

当前请求的 Context 对象，在模板里可以通过直接通过 `ctx.xxx` 调用其属性或者 `ctx.yyy()` 调用其方法。

如果是调用其方法，那么方法必须为一个**同步方法**。

### 支持的模板引擎

目前官方支持的模板引擎有: [pug](https://github.com/thinkjs/think-view-pug)、[nunjucks](https://github.com/thinkjs/think-view-nunjucks)、[handlebars](https://github.com/thinkjs/think-view-handlebars)、[ejs](https://github.com/thinkjs/think-view-ejs)。

如果你实现了新的模板引擎支持，欢迎提交到 <https://github.com/thinkjs/think-awesome#view>。

### 常见问题

#### 为什么调用了 display 方法还是 404 错误？

有时候会遇到在 Action 里调用 `display` 方法，但页面还是显示 404 错误的情况：

```
NotFoundError: url `/index/page` not found.
```

这是因为 `display` 方法是个异步方法，前面没有加 await 或者没有 return 导致的。正确的用法为：

```js
module.exports = class extends think.Controller {
  indexAction() {
    return this.display(); // 通过 return 将 display 的异步返回
  }
}
```

```js
module.exports = class extends think.Controller {
  async indexAction() {
    await this.display(); // 通过 await 等待 display 方法的返回
  }
}
```

如果 `display` 方法是在异步的方法里调用，那么需要将异步方法包装成 Promise，然后将其返回。

#### 如何关闭视图的功能？

有的项目只是提供 API 接口的功能，不需要模板渲染。创建项目时默认加载了视图的扩展，如果不需要视图的功能，可以修改 `src/config/extend.js`，将视图的扩展去除。修改 `src/config/adapter.js`，将视图的 adapter 配置去除。

#### 怎么在模板里使用 session/cache 的功能？

有时候需要在模板里获取 session/cache 相关的信息，但由于 session/cache 的操作都是异步的，所以无法直接调用 `controller.session` 来操作，需要在 Action 里获取到数据然后赋值导模板中，如：

```js
module.exports = class extends think.Controller {
  async indexAction() {
    const userInfo = await this.session('userInfo');
    this.assign('userInfo', userInfo);
  }
}
```
获取到 `userInfo` 并赋值后，在模板里就可以通过 `userInfo.xxx` 获取对应的值了。

## Router / 路由

当用户访问一个地址时，需要有一个对应的逻辑进行处理。传统的处理方式下，一个请求对应的一个文件，如访问时 `/user/about.php`，那么就会在项目对应的目录下有 `/user/about.php` 这个实体文件。这种方式虽然能解决问题，但会导致文件很多，同时可能很多文件里逻辑功能其实比较简单。

在现在的 MVC 开发模型里，一般都是通过路由来解决此类问题。解决方式为：先将用户的所有请求映射到一个入口文件（如：`index.php`），然后框架解析当前请求的地址，根据配置或者约定解析出对应要执行的功能，最后去调用然后响应用户的请求。

由于 Node.js 是自己启动 HTTP(S) 服务的，所以已经天然将用户的请求汇总到一个入口了，这样处理路由映射就更简单了。

在 ThinkJS 中，当用户访问一个 URL 时，最后是通过 controller 里具体的 action 来响应的。所以就需要解析出 URL 对应的 controller 和 action，这个解析工作是通过 [think-router](https://github.com/thinkjs/think-router) 模块实现的。

### 路由配置

`think-router` 是一个 middleware，项目创建时默认已经加到配置文件 `src/config/middleware.js` 里了，其中 `options` 支持如下的参数：

* `defaultModule` {String} 多模块项目下，默认的模块名。默认值为 `home`
* `defaultController` {String} 默认的控制器名，默认值为 `index`
* `defaultAction` {String} 默认的操作名，默认值为 `index`
* `prefix` {Array} 默认去除的 pathname 前缀，默认值为 `[]`
* `suffix` {Array} 默认去除的 pathname 后缀，默认值为 `['.html']`
* `enableDefaultRouter` {Boolean} 在不匹配情况下是否使用默认路由解析，默认值为 `true`
* `subdomainOffset` {Number} 子域名映射下的偏移量，默认值为 `2`
* `subdomain` {Object|Array} 子域名映射列表，默认为 `{}`
* `denyModules` {Array} 多模块项目下，禁止访问的模块列表，默认为 `[]`

具体的默认配置如下，项目中可以根据需要进行修改：

```js
module.exports = [
  {
    handle: 'router',
    options: {
      defaultModule: 'home',
      defaultController: 'index',
      defaultAction: 'index',
      prefix: [],
      suffix: ['.html'],
      enableDefaultRouter: true,
      subdomainOffset: 2,
      subdomain: {},
      denyModules: []
    }
  }
];
```

### 路径预处理

当用户访问服务时，通过 `ctx.url` 属性，可以得到初始的 `pathname`，如：访问本页面 `https://www.thinkjs.org/zh-cn/doc/3.0/router.html`，初始 pathname 为 `/zh-cn/doc/3.0/router.html`。

为了方便后续通过 pathname 解析出对应的 controller 和 action，需要对 pathname 进行预处理。

#### prefix & suffix

有时候为了搜索引擎优化或者一些其他的原因，URL 上会多加一些东西。比如：当前页面是一个动态页面，为了 SEO，会在 URL 后面加上 `.html` 后缀假装页面是一个静态页面，但 `.html` 对于路由解析来说是无用的，是要去除的。

这时候可以通过 `prefix` 和 `suffix` 配置来去除一些前置或者后置的特定值，如：

```js
{
  prefix: [],
  suffix: ['.html'],
}
```

`prefix` 与 `subffix` 为数组，数组的每一项可以为字符串或者正则表达式， 在匹配到第一个之后停止后续匹配。对于上述 `pathname` 在默认配置下进行过滤后，拿到纯净的 pathname 为 `/zh-cn/doc/3.0/router`。

如果访问的 URL 是 `http://www.thinkjs.org/`，那么最后拿到纯净的 `pathname` 则为字符串 `/`。

#### 子域名映射

当项目比较复杂时，可能希望将不同的功能部署在不同的域名下，但代码还是在一个项目下，这时候可以通过子域名映射来完成：

```js
{
  subdomainOffset: 2, // 域名偏移量
  subdomain: { // 子域名映射详细配置
    'aaa.bbb': 'aaa'
  }
}
```

在做子域名映射时，需要解析出当前域名的子域名具体是什么？这时候就需要用到域名偏移量  `subdomainOffset` 了，该配置默认值为 2， 例如：对于域名 aaa.bbb.example.com， 解析后的子域名列表为 `["aaa", "bbb"]`, 当域名偏移量为 3 时，解析后的子域名列表为 `["aaa"]`，解析后的值保存在 `ctx.subdomains` 属性上。如果当前域名是个 IP，那么解析后的 ctx.subdomains 始终为空数组。

在进行子域名匹配时，会将 `ctx.subdomains` 转为字符串（`join(",")`）然后跟 `subdomain` 配置进行匹配。如果匹配到了 `subdomain` 里的配置，那么会将对应的值前缀补充到 `pathname` 值上。如：当访问 `http://aaa.bbb.example.com/api_lib/inbox/123`，由于配置了 `'aaa.bbb': 'aaa'`, 那么得到的 pathname 将为 `/aaa/api_lib/inbox/123`，匹配顺序为按配置依次向后匹配，如果匹配到了，那么会终止后续的匹配。

如果 `subdomain` 配置是一个数组，那么会自动将数组转化为对象，方便后续进行匹配。

```js
subdomain: ['admin', 'user']

// 转化为
subdomain: {
  admin: 'admin',
  user: 'user'
}
```

### 路由解析

通过 `prefix & suffix` 和 `subdomain` 预处理后，得到真正后续要解析的 `pathname`。默认的路由解析规则为 `/controller/action`，如果是多模块项目，那么规则为 `/module/controller/action`，根据这个规则解析出对应的 `module`、`controller`、`action` 值。

如果 controller 有子级，那么会优先匹配子级 controller，然后再匹配 action。

| pathname  | 项目类型  | 子级控制器  |  module | controller  | action | 备注 |
|---|---|---|---|---|---|---|
| / | 单模块 | 无 | | index | index | controller、action 为配置的默认值 |
| /user | 单模块 | 无 | | user | index | action 为配置的默认值 |
| /user/login | 单模块 | 无 | | user | login |  |
| /console/user/login | 单模块 | 有 | | console/user | login | 有子级控制器 console/user |
| /console/user/login/aaa/bbb | 单模块 | 有 | | console/user | login | 剩余的 aaa/bbb 不再解析 |
| /admin/user | 多模块 | 无 | admin | user | index | 多模块项目，有名为 admin 的模块 |
| /admin/console/user/login | 多模块 | 有 | admin | console/user | login | | |


解析后的 module、controller、action 分别放在 `ctx.module`、`ctx.controller`、`ctx.action` 上，方便后续调用处理。如果不想要默认的路由解析，那么可以通过配置 `enableDefaultRouter: false` 关闭。

### 自定义路由规则

虽然默认的路由解析方式能够满足需求，但有时候会导致 URL 看起来不够优雅，我们更希望 URL 比较简短，这样会更利于记忆和传播。框架提供了自定义路由来处理这种需求。

自定义路由规则配置文件为 `src/config/router.js`（多模块项目放在 `src/common/config/router.js`），路由规则为二维数组：

```js
module.exports = [
  [/libs\/(.*)/i, '/libs/:1', 'get'],
  [/fonts\/(.*)/i, '/fonts/:1', 'get,post'],
];
```
每一条路由规则也为一个数组，数组里面的项分别对应为：`match`、`pathname`、`method`、`options`：

* `match` {String | RegExp} pathname 匹配规则，可以是字符串或者正则。如果是字符串，那么会通过 [path-to-regexp](https://github.com/pillarjs/path-to-regexp) 模块转为正则
* `pathname` {String} 匹配后映射后的 pathname，后续会根据这个映射的 pathname 解析出对应的 controller、action
* `method` {String} 该条路由规则支持的请求类型，默认为所有。多个请求类型中间用逗号隔开，如：`get,post`
* `options` {Object} 额外的选项，如：跳转时指定 statusCode

自定义路由在服务启动时读到 `think.app.routers` 对象上，路由的匹配规则为：从前向后逐一匹配，如果命中到了该项规则，则不再向后匹配。

#### 获取 match 中匹配的值

配置规则时，有时候需要在 pathname 中获取 match 中匹配到的值，这时候可以通过字符串匹配或者正则分组来获取。

##### 字符串路由


```js
module.exports = [
  ['/user/:name', 'user']
]
```
字符串匹配的格式为 `:name` 的方式，当匹配到这条路由后，会获取到 `:name` 对应的值，最终转化为对应的参数，以便于后续获取。

对于上面的路由，假如访问的路径为 `/user/thinkjs`，那么 `:name` 匹配到的值为 `thinkjs`，这时会追加个名为 name 的参数，controller 里可以通过 `this.get("name")` 来获取这个参数。当然在 `pathname` 中也是可以引用 `:name` ，如：

```js
module.exports = [
  ['/user/:name', 'user/info/:name']
]
```

##### 正则路由

```js
module.exports = [
  [\/user\/(\w+)/, 'user?name=:1']
]
```
对于上面的路由，假如访问的路径为 `/user/thinkjs`，那么正则中的分组 `(\w+)` 匹配到的值为 `thinkjs`，这样在第二个参数可以通过 `:1` 来获取这个值。对于正则中有多个分组，那么可以通过 `:1`、`:2`、`:3` 这样来获取对应匹配的值。


#### Redirect

有时候项目经过多次重构后，URL 地址可能会发生一些变化，为了兼容之前的 URL，一般需要把之前的 URL 跳转到新的 URL 上。这里可以通过将 `method` 设置为 `redirect` 来完成。

```js
module.exporst = [
  ['/usersettings', '/user/setting', 'redirect', {statusCode: 301}]
]
```
当访问地址为 `/usersettings` 时会自动跳转到 `/user/setting`，同时指定此次请求的 statusCode 为 301。

#### RESTful

有时候希望提供 RESTful API，这时候也可以借助自定义路由来完成，相关文档请移步到 [RESTful API](/doc/3.0/rest.html)。

### 动态添加自定义路由

有时候我们需要开发一些定制化很高的系统，如：通用的 CMS 系统，这些系统一般都可以配置一些页面的访问规则。这时候一些自定义路由就不能写死了，而是需要把后台配置的规则保存在数据库中，然后动态配置自定义路由规则。

这时候可以借助 `think.beforeStartServer` 方法在服务启动之前从数据库里读到最新的自定义路由规则，然后通过 `routerChange` 事件来处理。

```js
// src/bootstrap/worker.js

think.beforeStartServer(async () => {
  const config = think.model('config');
  // 将所有的自定义路由保存在字段为 router 的数据上
  const data = await config.where({key: 'router'}).find(); 
  const routers = JSON.parse(data.value);
  // 触发 routerChange 事件，将新的自定义路由设置到 think.app.routers 对象上
  // routers 格式和自定义路由格式相同，二维数组
  think.app.emit('routerChange', routers); 
})

```

### 常见问题

#### 怎么查看当前地址解析后的 controller 和 action 分别对应什么？

解析后的 controller 和 action 分别放在了 `ctx.controller` 和 `ctx.action` 上，有时候我们希望快速知道当前访问的路径最后解析的 controller 和 action 是什么，这时候可以借助 `debug` 来快速看到。

```
DEBUG=think-router npm start
```

[think-router](https://github.com/thinkjs/think-router) 在路由解析时打印了相关的调试信息，通过 `DEBUG=think-router` 来开启，开启后会在控制台下看到如下的调试信息：

```
think-router matchedRule: {"match":{"keys":[]},"path":"console/service/func","method":"GET","options":{},"query":{}} +53ms
think-router RouterParser: path=/console/service/func, module=, controller=console/service, action=func, query={} +0ms
```

`matchedRule` 为命中了哪个自定义路由，`RouterParser` 为解析出来的值。

当然通过 debug 信息也能快速定位后有时候有些自定义路由没能生效的问题。

#### 如何优化自定义路由匹配性能？

由于自定义路由是从前往后依次匹配的，直到规则命中才停止往后继续匹配，如果规则很靠后的话就需要把前面的规则都走一遍，这样可能会有点慢。这时候可以结合每个接口的流量情况，把重要的路由放在前面，不重要的路由放在后面来提升性能。

#### 正则路由建议

对于正则路由，默认并不是严格匹配，这样可能会有正则性能问题，同时可能会容易对其他的路由产生影响，这时候可以通过 `^` 和 `$` 进行严格匹配。

```js
module.exports = [
  [/^\/user$/, 'user']
]
```
对于上面的路由，只有访问地址为 `/user` 时才会命中该条规则，这样可以减少对其他路由的影响。如果去掉 `^` 和 `$`，那么访问 `/console/user/thinkjs` 也会命中上面的路由，实际上我们可能写了其他的路由来匹配这个地址，但被这条规则提前命中了，这样给开发带来了一些困难。

#### 能使用第三方的路由解析器么？

框架默认的路由解析是通过 [think-router](https://github.com/thinkjs/think-router) 来完成的，如果想替换为第三方的路由解析器，那么可以将 `src/config/middleware.js` 里的路由配置替换为对应的模块，然后将解析后的 module、controller、action 值保存在 `ctx` 对象上，以便后续的中间件处理。

```js
// 第三方路由解析模块示例，具体代码可以参考 https://github.com/thinkjs/think-router
module.exports = (options, app) => {
  return (ctx, next) => {
    const routers = app.routers; // 拿到所有的自定义路由配置
    ...
    ctx.module = ''; // 将解析后的 module、controller、action 保存在 ctx 上
    ctx.controller = '';
    ctx.action = '';
    return next();
  }
}
```


## Adapter / 适配器

Adapter 是用来解决一类功能的多种实现，这些实现提供一套相同的接口，类似设计模式里的工厂模式。如：支持多种数据库，支持多种模版引擎等。通过这种方式，可以很方便的在不同的类型中进行切换。Adapter 一般配合 Extend 一起使用。

框架默认提供了很多种 Adapter，如： View、Model、Cache、Session、Websocket，项目中也可以根据需要进行扩展，也可以引入第三方的 Adapter。

### Adapter 配置

Adapter 的配置文件为 `src/config/adapter.js`（多模块项目文件为 `src/common/config/adapter.js`），格式如下：

```js
const nunjucks = require('think-view-nunjucks');
const ejs = require('think-view-ejs');
const path = require('path');

exports.view = {
  type: 'nunjucks', // 默认的模板引擎为 nunjucks
  common: { //通用配置
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: { // nunjucks 的具体配置
    handle: nunjucks
  },
  ejs: { // ejs 的具体配置
    handle: ejs,
    viewPath: path.join(think.ROOT_PATH, 'view/ejs/'),
  }
}

exports.cache = {
  ...
}
```

* `type` 默认使用 Adapter 的类型，具体调用时可以传递参数改写
* `common` 配置通用的一些参数，项目启动时会跟具体的 adapter 参数作合并
* `nunjucks` `ejs` 配置特定类型的 Adapter 参数，最终获取到的参数是 common 参数与该参数进行合并
* `handle` 对应类型的处理函数，一般为一个类


Adapter 配置支持运行环境，可以根据不同的运行环境设置不同的配置，如：在开发环境和生产环境的数据库一般都是不一样的，这时候可以通过 `adapter.development.js` 和 `adapter.production.js` 存放有差异的配置，系统启动后会读取对应的运行环境配置和默认配置进行合并。

如：现在是在生产环境下，那么会读取 `adapter.production.js` 和 `adapter.js` 配置进行合并生成最终的 adapter 配置。

Adapter 的配置读取和合并在项目启动时就已经执行，对于上面的配置，最终合并的配置如下：

```js
exports.view = {
  type: 'nunjucks', // 默认的模板引擎为 nunjucks
  nunjucks: { // nunjucks 的具体配置
    handle: nunjucks,
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  ejs: { // ejs 的具体配置
    handle: ejs,
    viewPath: path.join(think.ROOT_PATH, 'view/ejs/'),
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  }
}
```

可以看到，common 里的配置会被合并到 nunjucks 和 ejs 中，后续再获取的时候就不用再合并 common 里的配置了。

### Adapter 配置解析

Adapter 配置存储了所有类型下的详细配置，具体使用时需要对其解析，选择对应的一种进行使用。比如上面的配置文件中，配置了 nunjucks 和 ejs 二种模板引擎的详细配置，但具体使用时一种场景下肯定只会用其一种模板引擎。

Adapter 的配置解析是通过 [think-helper](https://github.com/thinkjs/think-helper) 模块中的 `parseAdapterConfig` 方法来完成的，如：

```js
const helper = require('think-helper');
const viewConfig = think.config('view'); // 获取 view adapter 的详细配置

const nunjucks = helper.parseAdatperConfig(viewConfig); // 获取 nunjucks 的配置，默认 type 为 nunjucks
/**
{
  type: 'nunjucks',
  handle: nunjucks,
  viewPath: path.join(think.ROOT_PATH, 'view'),
  sep: '_',
  extname: '.html'
}
*/

const ejs = helper.parseAdatperConfig(viewConfig, 'ejs') // 获取 ejs 的配置
/**
{
  handle: ejs,
  type: 'ejs',
  viewPath: path.join(think.ROOT_PATH, 'view/ejs/'),
  viewPath: path.join(think.ROOT_PATH, 'view'),
  sep: '_',
  extname: '.html'
}
*/
```

通过 `parseAdapterConfig` 方法就可以拿到对应类型的配置，然后就可以调用对应的 `handle`，传入配置然后执行了。

当然，配置解析并不需要使用者在项目中具体调用，一般都是在插件对应的方法里已经处理。

### Adapter 使用

Adapter 都是一类功能的不同实现，一般是不能独立使用的，而是配合对应的扩展一起使用。如：view Adapter（think-view-nunjucks、think-view-ejs）配合 [think-view](https://github.com/thinkjs/think-view) 扩展进行使用。

项目安装 think-view 扩展后，提供了对应的方法来渲染模板，但渲染不同的模板需要的模板引擎有对应的 Adapter 来实现，也就是配置中的 `handle` 字段。

### 项目中创建 Adapter

除了引入外部的 Adapter 外，项目内也可以创建 Adapter 来使用。Adapter 文件放在 `src/adapter/` 目录下（多模块项目放在 `src/common/adapter/`），如：`src/adapter/cache/xcache.js`，表示加了一个名为 `xcache` 的 cache Adapter 类型，然后该文件实现 cache 类型一样的接口即可。

实现完成后，就可以直接通过字符串引用这个 Adapter 了，如：

```js
exports.cache = {
  type: 'file',
  xcache: {
    handle: 'xcache', //这里配置字符串，项目启动时会自动查找 src/adapter/cache/xcache.js 文件
    ...
  }
}
```

### 推荐的 Adapter

框架推荐的 Adapter 为 <https://github.com/thinkjs/think-awesome#adapters>。


## Extend / 扩展

虽然框架内置了很多功能，但在实际项目开发中，提供的功能还是远远不够的。3.0 里引入了扩展机制，方便对框架进行扩展。支持的扩展类型为：`think`、`application`、`context`、`request`、`response`、`controller`、`logic` 和 `service`。

框架内置的很多功能也是扩展来实现的，如：`Session`、`Cache`。

### 扩展配置

扩展配置文件路径为 `src/config/extend.js`（[多模块](/doc/3.0/multi_module.html)项目文件路径为 `src/common/config/extend.js`），格式为数组：

```js
const view = require('think-view');

module.exports = [
  view //make application support view
];
```

如上，通过 view 扩展框架就支持渲染模板的功能，Controller 类上就有了 `assign`、`display` 等方法。

### 项目里的扩展

除了引入外部的 Extend 来丰富框架的功能，也可以在项目中对对象进行扩展，扩展文件放在 `src/extend/` 目录下（[多模块](/doc/3.0/multi_module.html)项目放在 `src/common/extend/` 下）。

* `src/extend/think.js` 扩展 think 对象，think.xxx
* `src/extend/application.js` 扩展 Koa 里的 app 对象（think.app）
* `src/extend/request.js` 扩展 Koa 里的 request 对象（think.app.request）
* `src/extend/response.js` 扩展 Koa 里的 response 对象（think.app.response）
* `src/extend/context.js` 扩展 ctx 对象（think.app.context）
* `src/extend/controller.js` 扩展 controller 类（think.Controller）
* `src/extend/logic.js` 扩展 logic 类（think.Logic）- logic 继承 controller 类，所以 logic 包含 controller 类所有方法
* `src/extend/service.js` 扩展 service 类（think.Service）

比如：我们想给 `ctx` 添加个 `isMobile` 方法来判断当前请求是不是手机访问，可以通过下面的方式：

```
// src/extend/context.js
module.exports = {
  isMobile(){
    const userAgent = this.userAgent.toLowerCase();
    const mList = ['iphone', 'android'];
    return mList.some(item => userAgent.indexOf(item) > -1);
  }
}
```

这样后续就可以通过 `ctx.isMobile()` 来判断是否是手机访问了。当然这个方法没有任何的参数，我们也可以变成一个 `getter`。

```
// src/extend/context.js
module.exports = {
  get isMobile(){
    const userAgent = this.userAgent.toLowerCase();
    const mList = ['iphone', 'android'];
    return mList.some(item => userAgent.indexOf(item) > -1);
  }
}
```

这样在 ctx 中就可以直接用 `this.isMobile` 来使用，其他地方通过 `ctx.isMobile` 使用，如： 在 controller 中用 `this.ctx.isMobile`。 

如果在 controller 中也想通过 `this.isMobile` 使用，怎么办呢？ 可以给 controller 也扩展一个 `isMobile` 属性来完成。

```
// src/extend/controller.js
module.exports = {
  get isMobile(){
    return this.ctx.isMobile;
  }
}
```

通过也给 controller 扩展 `isMobile` 属性后，后续在 controller 里可以直接使用 `this.isMobile` 了。

当然这样扩展后，只能在当前项目里使用这些功能，如果要在其他项目中使用，可以将这些扩展发布为一个 npm 模块。发布的模块在入口文件里需要定义对应的类型的扩展，如：

```
const controllerExtend = require('./controller.js');
const contextExtend = require('./context.js');

// 模块入口文件
module.exports = {
  controller: controllerExtend,
  context: contextExtend
}
```

### 扩展里使用 app 对象

有些 Extend 需要使用一些 `app` 对象上的数据，那么可以导出为一个函数，配置时把 `app` 对象传递进去即可。

```
// src/config/extend.js
const model = require('think-model');
module.exports = [
  model(think.app) //将 think.app 传递给 model 扩展
];
```

当然除了传 `app` 对象，也可以根据需要传递其他对象。

### 推荐扩展列表

推荐的 Extend 列表见 <https://github.com/thinkjs/think-awesome#extends>，如果你开发了比较好的 Extend，也欢迎发 Pull Request。

### 常见问题

#### 多个扩展提供的方法重名了怎么办？

如果多个扩展提供的方法重名了，那么后面的扩展会覆盖前面扩展的方法，所以可以根据调整顺序来决定如何覆盖。另：创建扩展时尽快使用有意义的方法名，不要使用太过于简单的方法名。

扩展的方面名不可与框架内置的方法重名，重名的话可能会引起一些奇怪的问题。


## 异步处理

Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，很多接口都是异步的，如：文件操作、网络请求。虽然提供了文件操作的同步接口，但这些接口是阻塞式的，非特殊情况下不要使用它。

对于异步接口，官方的 API 都是 callback 形式的，如：

```js
const fs = require('fs');
fs.readFile(filepath, 'utf8', (err, content) => {
  if(err) return ;
  ...
})
```
这种方式下，当业务逻辑复杂后，很容易出现 [callback hell](http://callbackhell.com/) 的问题。为了解决这个问题，相继出现了 event、thunk、Promise、Generator function、Async functions 等解决方案，最终 `Async functions` 方案胜出，ThinkJS 也直接选用这种方案来解决异步问题。

### Async functions

Async functions 使用 `async/await` 语法定义函数，如：

```js
async function fn() {
  const value = await getFromApi();
  doSomethimgWithValue();
}
```

* 有 await 时必须要有 async，但有 async 不一定非要有 await
* Async functions 可以是普通函数的方式，也可以是 Arrow functions 的方式
* await 后面需要接 Promise，如果不是 Promise，则不会等待处理
* 返回值肯定为 Promise

返回值和 await 后面接的表达式均为 Promise，也就是说 Async functions 以 Promise 为基础。如果 await 后面的表达式返回值不是 Promise，那么需要通过一些方式将其包装为 Promise。

#### 项目中使用

ThinkJS 3.0 直接推荐大家使用 Async functions 来解决异步的问题，并且框架提供的所有异步接口都是 Promise 的方式，方便开发者直接使用 Async functions 调用。

```js
module.exports = class extends think.Controller {
  async indexAction() {
    // select 接口返回 Promise，方便 await 使用
    const list = await this.model('user').select();
    return this.success(list);
  }
}
```

虽然使用 Async functions 解决异步问题时比较优雅，但需要 Node.js 的版本 `>=7.6.0` 才支持，如果在之前的版本中使用，需要借助 Babel 进行转译（由于框架只是要求 Node.js 版本大于 6.0，所以默认创建的项目是带 Babel 转译的，将 Async functions 转译为 Generator functions + co 的方式）。

#### 和 Generator 区别

虽然 Async functions 和 Generator 从语法糖上看起来很相似，但其实还是有很多的区别，具体为：

* 为解决异步而生，`async/await` 更加语义化。而 Generator 本身是个迭代器，只是被发现可以用来解决异步问题
* 要求 await 后面必须是 Promise 接口，而 yield 后面没有任何限制
* 不需要额外的执行器，Generator 需要借助 [co](https://github.com/tj/co) 这样的执行器
* 可以定义为 Arrow functions 的方式，而 Generator function 不能
* 没有类似 yield 和 yield * 的问题

### promisify

Async functions 需要 await 后面接的表达式返回值为 Promise，但很多接口并不是返回 Promise，如：Node.js 原生提供异步都是 callback 的方式，这个时候就需要将 callback 方式的接口转换为 Promise 方式的接口。

由于 callback 方式的接口都是 `fn(aa, bb, callback(err, data))` 的方式，这样就不需要每次都手工将 callback 接口包装为 Promise 接口，框架提供了 `think.promisify` 用来快速转换，如：

```js
const fs = require('fs');
const readFile = think.promisify(fs.readFile, fs);

const parseFile = async (filepath) => {
  const content = await readFile(filepath, 'utf8'); // readFile 返回 Promise
  doSomethingWithContent();
}
```

对于回调函数不是 `callback(err, data)` 形式的函数，就不能用 `think.promisify` 快速包装了，这时候需要手工处理，如：

```js
const exec = require('child_process').exec;
return new Promise((resolve, reject) => {
  // exec 的回调函数有多个参数
  exec(filepath, (err, stdout, stderr) => {
    if(err) return reject(err);
    if(stderr) return reject(stderr);
    resolve(stdout);
  })
})
```

### 错误处理

在 Node.js 中，错误处理是个很麻烦的事情，稍不注意，请求可能就不能正常结束。对 callback 接口来说，需要在每个 callback 里进行判断处理，非常麻烦。

采用 Async functions 后，错误会自动转换为 Rejected Promise，当 await 后面是个 Rejected Promise 时会自动中断后续的执行，所以只需要捕获 Rejected Promise 就可以了。

#### try/catch

一种捕获错误的方式是使用 `try/catch`，像同步方式的代码里加 try/catch 一样，如：

```js
module.exports = class extends think.Contoller {
  async indexAction() {
    try {
      await getDataFromApi1();
      await getDataFromApi2();
      await getDataFromApi3();
    } catch(e) {
      // capture error
    }
  }
}
```
通过在外层添加 `try/catch`，可以捕获到错误。但这种方式有个问题，在 catch 里捕获到的错误并不知道是哪个接口触发的，如果要根据不同的接口错误返回不同的错误信息就比较困难了，难不成在每个接口都单独加个 try/catch？那样的话会让代码非常难看。这种情况下可以用 `then/catch` 来处理。

#### then/catch

对于 Promise，我们知道有 then 和 catch 方法，用来处理 resolve 和 reject 下的行为。由于 await 后面跟的是 Promise，那么就可以对 Rejected Promise 进行处理来规避错误的发生。可以把 Rejected Promise 转换为 Resolved Promise 防止触发错误，然后我们在手工处理对应的错误信息就可以了。

```js
module.exports = class extends think.Controller {
  async indexAction() {
    // 通过 catch 将 rejected promise 转换为 resolved promise
    const result = await getDataFromApi1().catch(err => {
      return think.isError(err) ? err : new Error(err)
    });
    // 这里判断如果返回值是转换后的错误对象，然后对其处理。
    // 接口正常情况下不会返回 Error 对象
    if (think.isError(result)) {
      // 这里将错误信息返回，或者返回格式化后的错误信息也都可以
      return this.fail(1000, result.message);
    }

    const result2 = await getDataFromApi2().catch(err => {
      return think.isError(err) ? err : new Error(err)
    });
    if(think.isError(result2)) {
      return this.fail(1001, result.message);
    }

    // 如果不需要错误信息，可以在 catch 里返回 false
    // 前提是接口正常情况下不返回 false，如果可能返回 false 的话，可以替换为其他特殊的值
    const result3 = await getDataFromApi3().catch(() => false);
    if(result3 === false) {
      return this.fail(1002, 'error message');
    }
  }
}
```

通过 Promise 后面接 catch 将 Rejected Promise 转化为 Resolved Promise 的方式，可以轻松定制要输出的错误信息。

#### trace

有些情况下，并不方便在外层添加 try/catch，也不太方便在每个 Promise 后面加上 catch 将 Rejected Promise 转换为 Resolved Promise，这时候系统提供 [trace](https://github.com/thinkjs/think-trace) 中间件来处理错误信息。

```js
// src/config/middleware.js

module.exports = [
  ...
  {
    handle: 'trace',
    options: {
      sourceMap: false,
      debug: true, // 是否打印详细的错误信息
      error(err) {
        // 这里可以根据需要对错误信息进行处理，如：上报到监控系统
        console.error(err);
      }
    }
  }
  ...
];
```

当出现错误后，trace 模块会自动捕获错误，debug 模式下会显示详细的错误信息，并根据请求类型输出对应的数据返回。

![](https://camo.githubusercontent.com/7fc4d8401b0bae26bae354f70da39e7ad0812af2/68747470733a2f2f70312e73736c2e7168696d672e636f6d2f743031303539383661633764666331633139372e706e67)

### timeout

有时候需要延迟处理一些事务，最常见的办法就是通过 `setTimeout` 函数来处理，但 setTimeout 本身并不返回 Promise，这时候如果里面的执行函数报错了是无法捕获到的，这时候需要装成 Promise。

框架提供了 `think.timeout` 方法可以快速包装成 Promise，如：

```js
return think.timeout(3000).then(() => {
  // 3s 后执行到这里
})
```

或者是：

```js
module.exports = class extends think.Controller {
  async indexAction() {
    await think.timeout(3000);// 等待 3s 执行后续的逻辑
    return this.success();
  }
}
```

### 常见问题

#### 项目中是不是不能使用 Generator？

是的，ThinkJS 3.x 中不再支持 Generator，异步都用 Async functions 来处理，配合 Promise，是目前最优雅的解决异步问题的方案。


# 模型/数据库

## 关系数据库


在项目开发中，经常需要操作数据库（如：增删改查等功能），手工拼写 SQL 语句非常麻烦，同时还要注意 SQL 注入等安全问题。为此框架提供了模型功能，方便操作数据库。

### 扩展模型功能

框架默认没有提供模型的功能，需要加载对应的扩展才能支持，对应的模块为 [think-model](https://github.com/thinkjs/think-model)。修改扩展的配置文件 `src/config/extend.js`（多模块项目为 `src/common/config/extend.js`），添加如下的配置：

```js
const model = require('think-model');

module.exports = [
  model(think.app) // 让框架支持模型的功能
]
```

添加模型的扩展后，会添加方法 [think.Model](/doc/3.0/relation_model.html#toc-c4c)、[think.model](/doc/3.0/relation_model.html#toc-3f0)、[ctx.model](/doc/3.0/relation_model.html#toc-876)、[controller.model](/doc/3.0/relation_model.html#toc-7ff)、[service.model](/doc/3.0/relation_model.html#toc-af8)。


### 配置数据库

模型由于要支持多种数据库，所以配置文件的格式为 Adapter 的方式，文件路径为 `src/config/adapter.js`（多模块项目下为 `src/common/config/adapter.js`）。

```js
const mysql = require('think-model-mysql');
exports.model = {
  type: 'mysql', // 默认使用的类型，调用时可以指定参数切换
  common: { // 通用配置
    logConnect: true, // 是否打印数据库连接信息
    logSql: true, // 是否打印 SQL 语句
    logger: msg => think.logger.info(msg) // 打印信息的 logger
  },
  mysql: { // mysql 配置
    handle: mysql
  },
  mysql2: { // 另一个 mysql 的配置
    handle: mysql
  },
  sqlite: {  // sqlite 配置

  },
  postgresql: { // postgresql 配置

  }
}
```

如果项目里要用到同一个类型的多个数据库配置，那么可以通过不同的 type 区分，如：`mysql`，`mysql2`，调用时可以指定参数切换。

```js
const user1 = think.model('user'); // 使用默认的数据库配置，默认的 type 为 mysql，那么就是使用 mysql 的配置
const user2 = think.model('user', 'mysql2'); // 使用 mysql2 的配置
const user3 = think.model('user', 'sqlite'); // 使用 sqlite 的配置
const user4 = think.model('user', 'postgresql'); // 使用 postgresql 的配置
```

由于可以调用时指定使用哪个 `type`，理论上可以支持无限多的类型配置，项目中可以根据需要进行配置。

#### Mysql

Mysql 的 Adapter 为 [think-model-mysql](https://github.com/thinkjs/think-model-mysql)，底层基于 [mysql](https://github.com/mysqljs/mysql) 库实现，使用连接池的方式连接数据库，默认连接数为 1。

```js
const mysql = require('think-model-mysql');
exports.model = {
  type: 'mysql',
  mysql: {
    handle: mysql, // Adapter handle
    user: 'root', // 用户名
    password: '', // 密码
    database: '', // 数据库
    host: '127.0.0.1', // host 
    port: 3306, // 端口
    connectionLimit: 1, // 连接池的连接个数，默认为 1
    prefix: '', // 数据表前缀，如果一个数据库里有多个项目，那项目之间的数据表可以通过前缀来区分
  }
}
```

除了用 host 和 port 连接数据库外，也可以通过 `socketPath` 来连接，更多配置选项请见 <https://github.com/mysqljs/mysql#connection-options>

#### SQLite

SQLite 的 Adapter 为 [think-model-sqlite](https://github.com/thinkjs/think-model-sqlite)，底层基于 [sqlite3](https://github.com/mapbox/node-sqlite3) 库实现，使用连接池的方式连接数据库，默认连接数为 1。

```js
const sqlite = require('think-model-sqlite');
exports.model = {
  type: 'sqlite',
  sqlite: {
    handle: sqlite, // Adapter handle
    path: path.join(think.ROOT_PATH, 'runtime/sqlite'), // sqlite 保存的目录
    database: '', // 数据库名
    connectionLimit: 1, // 连接池的连接个数，默认为 1
    prefix: '', // 数据表前缀，如果一个数据库里有多个项目，那项目之间的数据表可以通过前缀来区分
  }
}
```

#### PostgreSQL


PostgreSQL 的 Adapter 为 [think-model-postgresql](https://github.com/thinkjs/think-model-postgresql)，底层基于 [pg](https://github.com/brianc/node-postgres) 库实现，使用连接池的方式连接数据库，默认连接数为 1。

```js
const postgresql = require('think-model-postgresql');
exports.model = {
  type: 'postgresql',
  postgresql: {
    handle: postgresql, // Adapter handle
    user: 'root', // 用户名
    password: '', // 密码
    database: '', // 数据库
    host: '127.0.0.1', // host 
    port: 3211, // 端口
    connectionLimit: 1, // 连接池的连接个数，默认为 1
    prefix: '', // 数据表前缀，如果一个数据库里有多个项目，那项目之间的数据表可以通过前缀来区分
  }
}
```

除了用 host 和 port 连接数据库外，也可以通过 `connectionString` 来连接，更多配置选项请见 <https://node-postgres.com/features/connecting>

### 创建模型文件

模型文件放在 `src/model/` 目录下（多模块项目为 `src/common/model` 以及 `src/[module]/model`），继承模型基类 `think.Model`，文件格式为：

```js
// src/model/user.js
module.exports = class extends think.Model {
  getList() {
    return this.field('name').select();
  }
}
```
也可以在项目根目录下通过 `thinkjs model modelName` 快速创建模型文件。

------

如果项目比较复杂，希望对模型文件分目录管理，那么可以在模型目录下建立子目录，如： `src/model/front/user.js`，`src/model/admin/user.js`，这样在模型目录下建立 `front` 和 `admin` 目录，分别管理前台和后台的模型文件。

含有子目录的模型实例化需要带上子目录，如：`think.model('front/user')`，具体见[这里](/doc/3.0/relation_model.html#toc-9d9)。

### 实例化模型

项目启动时，会扫描项目下的所有模型文件（目录为 `src/model/`，多模块项目下目录为 `src/common/model` 以及各种 `src/[module]/model`），扫描后会将所有的模型类存放在 `think.app.models` 对象上，实例化时会从这个对象上查找，如果找不到则实例化模型基类 `think.Model`。

#### think.model

实例化模型类。

```js
think.model('user'); // 获取模型的实例
think.model('user', 'sqlite'); // 获取模型的实例，修改数据库的类型
think.model('user', { // 获取模型的实例，修改类型并添加其他的参数
  type: 'sqlite',
  aaa: 'bbb'
}); 
think.model('user', {}, 'admin'); // 获取模型的实例，指定为 admin 模块（多模块项目下有效）
```
#### ctx.model

实例化模型类，获取配置后调用 `think.model` 方法，多模块项目下会获取当前模块下的配置。

```js
const user = ctx.model('user');
```

#### controller.model

实例化模型类，获取配置后调用 `think.model` 方法，多模块项目下会获取当前模块下的配置。

```js
module.exports = class extends think.Controller {
  async indexAction() {
    const user = this.model('user'); // controller 里实例化模型
    const data = await user.select();
    return this.success(data);
  }
}
```

#### service.model

实例化模型类，等同于 `think.model`

#### 含有子目录的模型实例化

如果模型目录下含有子目录，那么实例化时需要带上对应的子目录，如：

```js
const user1 = think.model('front/user'); // 实例化前台的 user 模型
const user2 = think.model('admin/user'); // 实例化后台的 user 模型
```

### CRUD 操作

`think.Model` 基类提供了丰富的方法进行 CRUD 操作，下面来一一介绍。

#### 查询数据

模型提供了多种方法来查询数据，如:

* [find](/doc/3.0/relation_model.html#toc-a74) 查询单条数据
* [select](/doc/3.0/relation_model.html#toc-3ad) 查询多条数据
* [count](/doc/3.0/relation_model.html#toc-274) 查询总条数
* [countSelect](/doc/3.0/relation_model.html#toc-a39) 分页查询数据
* [max](/doc/3.0/relation_model.html#toc-df2) 查询字段的最大值
* [avg](/doc/3.0/relation_model.html#toc-8d2) 查询字段的平均值
* [min](/doc/3.0/relation_model.html#toc-1d7) 查询字段的最小值
* [sum](/doc/3.0/relation_model.html#toc-c11) 对字段值进行求和
* [getField](/doc/3.0/relation_model.html#toc-f0a) 查询指定字段的值

同时模型支持通过下面的方法指定 SQL 语句中的特定条件，如：

* [where](/doc/3.0/relation_model.html#toc-d47) 指定 SQL 语句中的 where 条件
* [limit](/doc/3.0/relation_model.html#toc-47d) / [page](/doc/3.0/relation_model.html#toc-a43) 指定 SQL 语句中的 limit
* [field](/doc/3.0/relation_model.html#toc-68b) / [fieldReverse](/doc/3.0/relation_model.html#toc-ad6) 指定 SQL 语句中的 field
* [order](/doc/3.0/relation_model.html#toc-973) 指定 SQL 语句中的 order
* [group](/doc/3.0/relation_model.html#toc-55a) 指定 SQL 语句中的 group
* [join](/doc/3.0/relation_model.html#toc-48b) 指定 SQL 语句中的 join
* [union](/doc/3.0/relation_model.html#toc-ad1) 指定 SQL 语句中的 union
* [having](/doc/3.0/relation_model.html#toc-be2) 指定 SQL 语句中的 having
* [cache](/doc/3.0/relation_model.html#toc-fb8) 设置查询缓存 

#### 添加数据

模型提供了下列的方法来添加数据：

* [add](/doc/3.0/relation_model.html#toc-c73) 添加单条数据
* [thenAdd](/doc/3.0/relation_model.html#toc-3e2) where 条件不存在时添加
* [addMany](/doc/3.0/relation_model.html#toc-a55) 添加多条数据
* [selectAdd](/doc/3.0/relation_model.html#toc-a56) 添加子查询的结果数据

#### 更新数据

模型提供了下列的方法来更新数据：

* [update](/doc/3.0/relation_model.html#toc-b86) 更新单条数据
* [updateMany](/doc/3.0/relation_model.html#updatemany-datalist-options) 更新多条数据
* [thenUpdate](/doc/3.0/relation_model.html#toc-1b0) 条件式更新
* [increment](/doc/3.0/relation_model.html#toc-990) 字段增加值
* [decrement](/doc/3.0/relation_model.html#toc-41c) 字段减少值

#### 删除数据

模型提供了下列的方法来删除数据：

* [delete](/doc/3.0/relation_model.html#toc-866) 删除数据

#### 手动执行 SQL 语句

有时候模型包装的方法不能满足所有的情况，这时候需要手工指定 SQL 语句，可以通过下面的方法进行：

* [query](/doc/3.0/relation_model.html#toc-89d) 手写 SQL 语句查询
* [execute](/doc/3.0/relation_model.html#toc-a1e) 手写 SQL 语句执行


### 事务

对于数据安全要求很高的业务（如：订单系统、银行系统）操作时需要使用事务，这样可以保证数据的原子性、一致性、隔离性和持久性，模型提供了操作事务的方法。

#### 手工操作事务

可以手工通过 [model.startTrans](/doc/3.0/relation_model.html#toc-0ae)、[model.commit](/3.0/relation_model.html#toc-9fc) 和 [model.rollback](/3.0/relation_model.html#toc-0f2) 方法操作事务。

#### transaction

每次操作事务时都手工执行 startTrans、commit 和 rollback 比较麻烦，模型提供了 [model.transaction](/doc/3.0/relation_model.html#toc-e30) 方法快速操作事务。

### 设置主键

可以通过 `pk` 属性设置数据表的主键，具体见 [model.pk](/doc/3.0/relation_model.html#toc-c88)。

### 设置 schema

可以通过 `schema` 属性设置数据表的主键，具体见 [model.schema](/doc/3.0/relation_model.html#toc-2d3)。

### 关联查询

数据库中表经常会跟其他数据表有关联，数据操作时需要连同关联的表一起操作。如：一个博客文章会有分类、标签、评论，以及属于哪个用户，支持的类型有：一对一、一对一（属于）、一对多和多对多。

可以通过 [model.relation](/doc/3.0/relation_model.html#toc-548) 属性配置详细的关联关系。

#### 一对一

一对一关联，表示当前表含有一个附属表。假设当前表的模型名为 `user`，关联表的模型名为 `info`，那么配置中字段 `key` 的默认值为 `id`，字段 `fKey` 的默认值为 `user_id`。

```js
module.exports = class extends think.Model {
  get relation() {
    return {
      info: think.Model.HAS_ONE
    };
  }
}
```

执行查询操作时，可以得到类似如下的数据：

```js
[
  {
    id: 1,
    name: '111',
    info: { //关联表里的数据信息
      user_id: 1,
      desc: 'info'
    }
  }, ...]
```

#### 一对一（属于）

一对一关联，属于某个关联表，和 HAS_ONE 是相反的关系。假设当前模型名为 `info`，关联表的模型名为 `user`，那么配置字段 `key` 的默认值为 `user_id`，配置字段 `fKey` 的默认值为 `id`。


```js
module.exports = class extends think.Model {
  get relation() {
    return {
      user: think.Model.BELONG_TO
    }
  }
}
```

执行查询操作时，可以得到类似下面的数据：

```js
[
  {
    id: 1,
    user_id: 1,
    desc: 'info',
    user: {
      name: 'thinkjs'
    }
  }, ...
]
```

#### 一对多

一对多的关系。假如当前模型名为 `post`，关联表的模型名为 `comment`，那么配置字段 `key` 默认值为 `id`，配置字段 `fKey` 默认值为 `post_id`。

```js
module.exports = class extends think.Model {
  get relation() {
    return {
      comment: {
        type: think.Model.HAS_MANY
      }
    }
  }
}
```

执行查询数据时，可以得到类似下面的数据：

```js
[{
  id: 1,
  title: 'first post',
  content: 'content',
  comment: [{
    id: 1,
    post_id: 1,
    name: 'welefen',
    content: 'first comment'
  }, ...]
}, ...]
```

如果关联表的数据需要分页查询，可以通过 [model.setRelation](/doc/3.0/relation_model.html#toc-d7a) 方法进行。

#### 多对多

多对多关系。假设当前模型名为 `post`，关联模型名为 `cate`，那么需要一个对应的关联关系表。配置字段 `rModel` 默认值为 `post_cate`，配置字段 `rfKey` 默认值为 `cate_id`。


```js
module.exports = class extends think.Model {
  get relation() {
    return {
      cate: {
        type: think.Model.MANY_TO_MANY,
        rModel: 'post_cate',
        rfKey: 'cate_id'
      }
    }
  }
}
```

查询出来的数据结构为：

```js
[{
  id: 1,
  title: 'first post',
  cate: [{
    id: 1,
    name: 'cate1',
    post_id: 1
  }, ...]
}, ...]
```

### 分布式/读写分离

有时候数据库需要用到分布式数据库，或者进行读写分离，这时候可以给配置里添加 `parser` 完成，如：

```js
exports.model = {
  type: 'mysql',
  mysql: {
    user: 'root',
    password: '',
    parser: sql => {
      // 这里会把当前要执行的 SQL 传递进来
      const sqlLower = sql.toLowerCase();
      if(sql.indexOf('select ') === 0) {
        return {
          host: '',
          port: ''
        }
      } else {
        return {
          host: '',
          port: ''
        }
      }
    }
  }
}
```

`parser` 里可以根据 sql 返回不同的配置，会将返回的配置和默认的配置进行合并。

### 常见问题

#### 数据库的连接数最大连接数是多少？

假设项目有二个集群，每个集群有十台机器，机器机器开启了四个 worker，数据库配置的连接池里的连接数为五，那么总体的最大连接数为：`2 * 10 * 4 * 5 = 400`

#### 如何查看相关调试信息？

模型使用的 debug 名称为 `think-model`，可以通过 `DEBUG=think-model npm start` 启动服务然后查看调试信息。

### API

#### model.schema

设置表结构，默认从数据表中获取，也可以自己配置增加额外的配置项。

```js
module.exports = class extends think.Model {
  get schema() {
    return {
      id: { // 字段名称
        type: 'int(11)',
        ...
      }
    }
  }
}
```
支持的字段为：

* `type` {String} 字段的类型，包含长度属性
* `required` {Boolean} 是否必填
* `default` {mixed} 默认值，可以是个值，也可以是函数
  ```js
  module.exports = class extends think.Model {
    get schema() {
      return {
        type: { // 字段名称
          type: 'varchar(10)',
          default: 'small'
        },
        create_time: {
          type: 'datetime',
          default: () => think.datetime() // default 为一个函数
        },
        score: {
          type: 'int',
          default: data => { // data 为添加/更新时的数据
            return data.grade * 1.5;
          }
        }
      }
    }
  }
  ```
* `primary` {boolean} 是否为主键
* `unique` {boolean} 字段是否唯一
* `autoIncrement` {boolean} 自动是否 `auto increment`
* `readonly` {boolean} 字段是否只读，也就是只能创建时添加，不让更新该字段
* `update` {boolean} 默认值是否在更新时也有效。如果设置了 `readonly`，那么该字段无效。


#### model.relation

配置数据表的关联关系。

```js
module.exports = class extends think.Model {
  // 配置关联关系
  get relation() {
    return {
      cate: { // 配置跟分类的关联关系
        type: think.Model.MANY_TO_MANY,
        ...
      },
      comment: { // 配置跟评论的关联关系

      } 
    }
  }
}
```

每个关联关系支持的配置如下：

* `type` 关联关系类型，默认为 `think.Model.HAS_ONE`

  ```
  一对一：think.Model.HAS_ONE
  一对一（属于）：think.Model.BELONG_TO
  一对多：think.Model.HAS_MANY
  多对多：think.Model.MANY_TO_MANY
  ```
* `model` 关联表的模型名，默认为配置的 key

  ```
  实例化对应关联模型的时候使用，会通过 const relationModel = this.model(item.model) 去实例化关联模型
  ```
* `name` 对应的数据字段名，默认为配置的 key，查询到数据后，保存字段的名称。

  ```
  // 原始数据
  const originData = {
    id: 1,
    email: ''
  }
  // 设置对应的数据字段名为 cate
  // 那么最终生成的数据为
  const targetData = {
    id: 1,
    email: '',
    cate: {

    }
  }
  ```
* `key` 当前模型的关联 key

  ```
  一对一、一对多、多对多下默认值为当前模型的主键，如：id
  一对一（属于）下默认值为关联表名称和 id 的组合，如：cate_id
  ```
* `fKey` 关联表与只对应的 key

  ```
  一对一、一对多、多对多下默认值为关联表名称和 id 的组合，如：cate_id
  一对一（属于）下默认值为当前模型的主键，如：id
  ```

* `field` 关联表查询时设置的 field，默认值为 `*`。如果需要设置，必须包含 `fKey` 对应的值，支持函数。

  ```
  // 设置 field 字段
  get relation() {
    return {
      cate: {
        field: 'id,name' // 只查询 id, name 字段
      }
    }
  }

  // 设置 field 为 function
  get relation() {
    return {
      cate: {
        // rModel 为关联模型的实例，model 为当前模型的实例
        field: (rModel, model) => { 
          return 'id,name'
        }
      }
    }
  }
  ```
* `where` 关联表查询时设置的 where 条件，支持函数
* `order` 关联表查询时设置的 order，支持函数
* `limit` 关联表查询时设置的 limit，支持函数
* `page` 关联表查询时设置的 page，支持函数
* `rModel` 多对多关系下，对应的关联关系模型名，默认值为二个模型名的组合，如：`article_cate`

  ```
  多对多关联模型下，一般需要一个中间的关联表维护关联关系，如：article（文章）和 cate（分类）是多对多的关联关系，那么就需要一个文章-分类的中间关系表（article_cate），rModel 为配置的中间关联表的模型名称
  ```
* `rfKey` 多对多关系下，关系表对应的 key
* `relation` 是否关闭关联表的关联关系

  ```
  // 如果关联表还配置了关联关系，那么查询时还会一并查询
  // 有时候不希望查询关联表的关联数据，那么就可以通过 relation 属性关闭
  get relation() {
    return {
      cate: {
        relation: false // 关闭关联表的所有关联关系，可以避免关联死循环等各种问题
      }
    }
  }
  ```

#### model.setRelation(name, value)

设置关联关系后，查询等操作都会自动查询关联表的数据。如果某些情况下不需要查询关联表的数据，可以通过 `setRelation` 方法临时关闭关联关系查询。

##### 全部关闭

通过 `setRelation(false)` 关闭所有的关联关系查询。

```js
module.exports = class extends think.Model {
  constructor(...args){
    super(...args);
    this.relation = {
      comment: think.Model.HAS_MANY,
      cate: think.Model.MANY_TO_MANY
    };
  }
  getList(){
    return this.setRelation(false).select();
  }
}
```

##### 部分启用

通过 `setRelation('comment')` 只查询 `comment` 的关联数据，不查询其他的关联关系数据。

```js
module.exports = class extends think.Model {
  constructor(...args){
    super(...args);
    this.relation = {
      comment: think.Model.HAS_MANY,
      cate: think.Model.MANY_TO_MANY
    };
  }
  getList2(){
    return this.setRelation('comment').select();
  }
}
```

##### 部分关闭

通过 `setRelation('comment', false)` 关闭 `comment` 的关联关系数据查询。

```js
module.exports = class extends think.Model {
  constructor(...args){
    super(...args);
    this.relation = {
      comment: think.Model.HAS_MANY,
      cate: think.Model.MANY_TO_MANY
    };
  }
  getList2(){
    return this.setRelation('comment', false).select();
  }
}
```

##### 重新全部启用

通过 `setRelation(true)` 重新启用所有的关联关系数据查询。

```js
module.exports = class extends think.Model {
  constructor(...args){
    super(...args);
    this.relation = {
      comment: think.Model.HAS_MANY,
      cate: think.Model.MANY_TO_MANY
    };
  }
  getList2(){
    return this.setRelation(true).select();
  }
}
```

##### 动态更改配置项

虽然通过 relation 属性配置了关联关系，但有时候调用的时候希望动态修改某些值，如：设置分页，这时候也可以通过 setRelation 方法来完成。

```js
module.exports = class extends think.Model {
  constructor(...args){
    super(...args);
    this.relation = {
      comment: think.Model.HAS_MANY,
      cate: think.Model.MANY_TO_MANY
    };
  }
  getList2(page){
    // 动态设置 comment 的分页
    return this.setRelation('comment', {page}).select();
  }
}
```

#### model.db(db)

获取或者设置 db 的实例，db 为 Adapter handle（如：think-model-mysql） 的实例。事务操作时由于要复用一个连接需要使用该方法。

```js
module.exports = class extends think.Model {
  async getList() {
    // 让 user 复用当前的 Apdater handle 实例，这样后续可以复用同一个数据库连接
    const user = this.model('user').db(this.db()); 
  }
}
```

#### model.modelName

实例化模型时传入的模型名

```js
const user = think.model('user');
```

实例化时传入的模型名为 `user`，那么 `model.modelName` 值为 `user`。

#### model.config

实例化模型时传入的配置，模型实例化时会自动传递，不用手工赋值。

```js
{
  host: '127.0.0.1',
  port: 3306,
  ...
}
```

#### model.tablePrefix

获取数据表前缀，从配置里的 `prefix` 字段获取。如果要修改的话，可以通过下面的方式：

```js
module.exports = class extends think.Model {
  get tablePrefix() {
    return 'think_';
  }
}
```

#### model.tableName

获取数据表名，值为 `tablePrefix + modelName`。如果要修改的话，可以通过下面的方式：

```js
module.exports = class extends think.Model {
  get tableName() {
    return 'think_user';
  }
}
```

#### model.pk

获取数据表的主键，默认值为 `id`。如果数据表的主键不是 `id`，需要自己配置，如：

```js
module.exports = class extends think.Model {
  get pk() {
    return 'user_id';
  }
}
```

有时候不想写模型文件，而是在控制器里直接实例化，这时候又想改变主键的名称，那么可以通过设置 `_pk` 属性的方式，如：

```js
module.exports = class extends think.Controller {
  async indexAction() {
    const user = this.model('user');
    user._pk = 'user_id'; // 通过 _pk 属性设置 pk
    const data = await user.select();
  }
}
```

#### model.options

模型操作的一些选项，设置 where、limit、group 等操作时最终都会解析到 options 选项上，格式为：

```js
{
  where: {}, // 存放 where 条件的配置项
  limit: {}, // 存放 limit 的配置项
  group: {},
  ...
}
```

#### model.lastSql

获取最近一次执行的 SQL 语句，默认值为空。

```js
const user = think.model('user');
console.log(user.lastSql); // 打印最近一条的 sql 语句，如果没有则为空
```

#### model.model(name)

* `name` {String} 要实例化的模型名
* `return` {this} 模型实例

实例化别的模型，支持子目录的模型实例化。

```js
module.exports = class extends think.Model {
  async getList() {
    // 如果含有子目录，那么这里带上子目录，如： this.model('front/article')
    const article = this.model('article'); 
    const data = await article.select();
    ...
  }
}
```

#### model.limit(offset, length)

* `offset` {Number} SQL 语句里的 offset
* `length` {Number} SQL 语句里的 length
* `return` {this}

设置 SQL 语句里的 `limit`，会赋值到 `this.options.limit` 属性上，便于后续解析。

```js
module.exports = class extends think.Model() {
  async getList() {
    // SQL: SELECT * FROM `test_d` LIMIT 10
    const list1 = await this.limit(10).select();
    // SQL: SELECT * FROM `test_d` LIMIT 10,20
    const list2 = await this.limit(10, 20).select();
  }
}
```

#### model.page(page, pagesize)

* `page` {Number} 设置当前页数
* `pagesize` {Number} 每页条数，默认值为 `this.config.pagesize`
* `return` {this}

设置查询分页，会解析为 [limit](/doc/3.0/relation_model.html#toc-47d) 数据。

```js
module.exports = class extends think.Model() {
  async getList() {
    // SQL: SELECT * FROM `test_d` LIMIT 0,10
    const list1 = await this.page(1).select(); // 查询第一页，每页 10 条
    // SQL: SELECT * FROM `test_d` LIMIT 20,20
    const list2 = await this.page(2, 20).select(); // 查询第二页，每页 20 条
  }
}
```

每页条数可以通过配置项 `pageSize` 更改，如：

```js
// src/config/adapter.js
exports.model = {
  type: 'mysql',
  mysql: {
    database: '',
    ...
    pageSize: 20, // 设置默认每页为 20 条
  }
}
```

#### model.where(where)

* `where` {String | Object} 设置查询条件
* `return` {this}

设置 where 查询条件，会添加 `this.options.where` 属性，方便后续解析。可以通过属性 `_logic` 设置逻辑，默认为 `AND`。可以通过属性 `_complex` 设置复合查询。

`注意：where 条件中的值必须要在 Logic 里做数据校验，否则可能会有 SQL 注入漏洞。`

##### 普通条件

```js
module.exports = class extends think.Model {
  where1(){
    //SELECT * FROM `think_user`
    return this.where().select();
  }
  where2(){
    //SELECT * FROM `think_user` WHERE ( `id` = 10 )
    return this.where({id: 10}).select();
  }
  where3(){
    //SELECT * FROM `think_user` WHERE ( id = 10 OR id < 2 )
    return this.where('id = 10 OR id < 2').select();
  }
  where4(){
    //SELECT * FROM `think_user` WHERE ( `id` != 10 )
    return this.where({id: ['!=', 10]}).select();
  }
}
```

##### null 条件

```js
module.exports = class extends think.Model {
  where1(){
    //SELECT * FROM `think_user` where ( title IS NULL );
    return this.where({title: null}).select();
  }
  where2(){
    //SELECT * FROM `think_user` where ( title IS NOT NULL );
    return this.where({title: ['!=', null]}).select();
  }
}
```

##### EXP 条件

ThinkJS 默认会对字段和值进行转义，防止安全漏洞。有时候一些特殊的情况不希望被转义，可以使用 EXP 的方式，如：

```js
module.exports = class extends think.Model {
  where1(){
    //SELECT * FROM `think_user` WHERE ( (`name` ='name') )
    return this.where({name: ['EXP', "=\"name\""]}).select();
  }
}
```

##### LIKE 条件

```js
module.exports = class extends think.Model {
  where1(){
    //SELECT * FROM `think_user` WHERE ( `title` NOT LIKE 'welefen' )
    return this.where({title: ['NOTLIKE', 'welefen']}).select();
  }
  where2(){
    //SELECT * FROM `think_user` WHERE ( `title` LIKE '%welefen%' )
    return this.where({title: ['like', '%welefen%']}).select();
  }
  //like 多个值
  where3(){
    //SELECT * FROM `think_user` WHERE ( (`title` LIKE 'welefen' OR `title` LIKE 'suredy') )
    return this.where({title: ['like', ['welefen', 'suredy']]}).select();
  }
  //多个字段或的关系 like 一个值
  where4(){
    //SELECT * FROM `think_user` WHERE ( (`title` LIKE '%welefen%') OR (`content` LIKE '%welefen%') )
    return this.where({'title|content': ['like', '%welefen%']}).select();
  }
  //多个字段与的关系 Like 一个值
  where5(){
    //SELECT * FROM `think_user` WHERE ( (`title` LIKE '%welefen%') AND (`content` LIKE '%welefen%') )
    return this.where({'title&content': ['like', '%welefen%']}).select();
  }
}
```


##### IN 条件

```js
module.exports = class extens think.Model {
  where1(){
    //SELECT * FROM `think_user` WHERE ( `id` IN ('10','20') )
    return this.where({id: ['IN', '10,20']}).select();
  }
  where2(){
    //SELECT * FROM `think_user` WHERE ( `id` IN (10,20) )
    return this.where({id: ['IN', [10, 20]]}).select();
  }
  where3(){
    //SELECT * FROM `think_user` WHERE ( `id` NOT IN (10,20) )
    return this.where({id: ['NOTIN', [10, 20]]}).select();
  }
}
```

##### BETWEEN 查询

```js
module.exports = class extens think.Model {
  where1(){
    //SELECT * FROM `think_user` WHERE (  (`id` BETWEEN 1 AND 2) )
    return this.where({id: ['BETWEEN', 1, 2]}).select();
  }
  where2(){
    //SELECT * FROM `think_user` WHERE (  (`id` BETWEEN '1' AND '2') )
    return this.where({id: ['between', '1,2']}).select();
  }
}
```

##### 多字段查询

```js
module.exports = class extends think.Model {
  where1(){
    //SELECT * FROM `think_user` WHERE ( `id` = 10 ) AND ( `title` = 'www' )
    return this.where({id: 10, title: "www"}).select();
  }
  //修改逻辑为 OR
  where2(){
    //SELECT * FROM `think_user` WHERE ( `id` = 10 ) OR ( `title` = 'www' )
    return this.where({id: 10, title: "www", _logic: 'OR'}).select();
  }
  //修改逻辑为 XOR
  where2(){
    //SELECT * FROM `think_user` WHERE ( `id` = 10 ) XOR ( `title` = 'www' )
    return this.where({id: 10, title: "www", _logic: 'XOR'}).select();
  }
}
```

##### 多条件查询

```js
module.exports = class extends think.Model {
  where1(){
    //SELECT * FROM `think_user` WHERE ( `id` > 10 AND `id` < 20 )
    return this.where({id: {'>': 10, '<': 20}}).select();
  }
  //修改逻辑为 OR 
  where2(){
    //SELECT * FROM `think_user` WHERE ( `id` < 10 OR `id` > 20 )
    return this.where({id: {'<': 10, '>': 20, _logic: 'OR'}}).select()
  }
}
```

##### 复合查询

```js
module.exports = class extends think.Model {
  where1(){
    //SELECT * FROM `think_user` WHERE ( `title` = 'test' ) AND (  ( `id` IN (1,2,3) ) OR ( `content` = 'www' ) )
    return this.where({
      title: 'test',
      _complex: {id: ['IN', [1, 2, 3]],
        content: 'www',
        _logic: 'or'
      }
    }).select()
  }
}
```


#### model.field(field)

* `field` {String} 查询字段，支持 `AS`。
* `return` {this}

设置 SQL 语句中的查询字段，默认为 `*`。设置后会赋值到 `this.options.field` 属性上，便于后续解析。

```js
module.exports = class extends think.Model{
  async getList() {
    // SQL: SELECT `d_name` FROM `test_d`
    const data1 = await this.field('d_name').select();

    // SQL: SELECT `c_id`,`d_name` FROM `test_d`
    const data2 = await this.field('c_id,d_name').select();

    // SQL: SELECT c_id AS cid,`d_name` FROM `test_d`
    const data3 = await this.field('c_id AS cid, d_name').select();
  }
}
```

#### model.fieldReverse(field)

* `field` {String} 查询字段，不支持 `AS`。
* `return` {this}

查询时设置反选字段（即：不查询配置的字段，而是查询其他的字段），会添加 `this.options.field` 和 `this.options.fieldReverse` 属性，便于后续分析。

该功能的实现方式为：查询数据表里的所有字段，然后过滤掉配置的字段。


```js
module.exports = class extends think.Model{
  async getList() {
    // SQL: SELECT `id`, `c_id` FROM `test_d`
    const data1 = await this.fieldReverse('d_name').select();
  }
}
```

#### model.table(table, hasPrefix)

* `table` {String} 表名，支持值为一个 SELECT 语句
* `hasPrefix` {Boolean} `table` 里是否已经含有了表前缀，默认值为 `false`
* `return` {this}

设置当前模型对应的表名，如果 hasPrefix 为 false 且 table 不是 SQL 语句，那么表名会追加 `tablePrefix`，最后的值会设置到 `this.options.table` 属性上。

如果没有设置该属性，那么最后解析 SQL 时通过 `mode.tableName` 属性获取表名。

#### model.union(union, all)

* `union` {String} union 查询字段
* `all` {boolean} 是否使用 UNION ALL
* `return` {this}

设置 SQL 中的 UNION 查询，会添加 `this.options.union` 属性，便于后续分析。

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` UNION (SELECT * FROM think_pic2)
    return this.union('SELECT * FROM think_pic2').select();
  }
  getList2(){
    //SELECT * FROM `think_user` UNION ALL (SELECT * FROM `think_pic2`)
    return this.union({table: 'think_pic2'}, true).select();
  }
}
```

#### model.join(join)

* `join` {String | Object | Array} 要组合的查询语句，默认为 `LEFT JOIN`
* `return` {this}

组合查询，支持字符串、数组和对象等多种方式。会添加 `this.options.join` 属性，便于后续分析。

##### 字符串

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` LEFT JOIN think_cate ON think_group.cate_id=think_cate.id
    return this.join('think_cate ON think_group.cate_id=think_cate.id').select();
  }
}
```

##### 数组

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` LEFT JOIN think_cate ON think_group.cate_id=think_cate.id RIGHT JOIN think_tag ON think_group.tag_id=think_tag.id
    return this.join([
      'think_cate ON think_group.cate_id=think_cate.id', 
      'RIGHT JOIN think_tag ON think_group.tag_id=think_tag.id'
    ]).select();
  }
}
```

##### 对象：单个表

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` INNER JOIN `think_cate` AS c ON think_user.`cate_id`=c.`id`
    return this.join({
      table: 'cate', 
      join: 'inner', //join 方式，有 left, right, inner 3 种方式
      as: 'c', // 表别名
      on: ['cate_id', 'id'] //ON 条件
    }).select();
  }
}
```

##### 对象：多次 JOIN

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM think_user AS a LEFT JOIN `think_cate` AS c ON a.`cate_id`=c.`id` LEFT JOIN `think_group_tag` AS d ON a.`id`=d.`group_id`
    return this.alias('a').join({
      table: 'cate',
      join: 'left',
      as: 'c',
      on: ['cate_id', 'id']
    }).join({
      table: 'group_tag',
      join: 'left',
      as: 'd',
      on: ['id', 'group_id']
    }).select()
  }
}
```


##### 对象：多个表

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` LEFT JOIN `think_cate` ON think_user.`id`=think_cate.`id` LEFT JOIN `think_group_tag` ON think_user.`id`=think_group_tag.`group_id`
    return this.join({
      cate: {
        on: ['id', 'id']
      },
      group_tag: {
        on: ['id', 'group_id']
      }
    }).select();
  }
}
```

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM think_user AS a LEFT JOIN `think_cate` AS c ON a.`id`=c.`id` LEFT JOIN `think_group_tag` AS d ON a.`id`=d.`group_id`
    return this.alias('a').join({
      cate: {
        join: 'left', // 有 left,right,inner 3 个值
        as: 'c',
        on: ['id', 'id']
      },
      group_tag: {
        join: 'left',
        as: 'd',
        on: ['id', 'group_id']
      }
    }).select()
  }
}
```

##### 对象：ON 条件含有多个字段

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` LEFT JOIN `think_cate` ON think_user.`id`=think_cate.`id` LEFT JOIN `think_group_tag` ON think_user.`id`=think_group_tag.`group_id` LEFT JOIN `think_tag` ON (think_user.`id`=think_tag.`id` AND think_user.`title`=think_tag.`name`)
    return this.join({
      cate: {on: 'id, id'},
      group_tag: {on: ['id', 'group_id']},
      tag: {
        on: { // 多个字段的 ON
          id: 'id',
          title: 'name'
        }
      }
    }).select()
  }
}
```

##### 对象：table 值为 SQL 语句

```js
module.exports = class extends think.Model {
  async getList(){
    let sql = await this.model('group').buildSql();
    //SELECT * FROM `think_user` LEFT JOIN ( SELECT * FROM `think_group` ) ON think_user.`gid`=( SELECT * FROM `think_group` ).`id`
    return this.join({
      table: sql,
      on: ['gid', 'id']
    }).select();
  }
}
```

#### model.order(order)

* `order` {String | Array | Object} 排序方式
* `return` {this}

设置 SQL 中的排序方式。会添加 `this.options.order` 属性，便于后续分析。

##### 字符串

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` ORDER BY id DESC, name ASC
    return this.order('id DESC, name ASC').select();
  }
  getList1(){
    //SELECT * FROM `think_user` ORDER BY count(num) DESC
    return this.order('count(num) DESC').select();
  }
}
```



##### 数组

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` ORDER BY id DESC,name ASC
    return this.order(['id DESC', 'name ASC']).select();
  }
}
```

##### 对象

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` ORDER BY `id` DESC,`name` ASC
    return this.order({
      id: 'DESC',
      name: 'ASC'
    }).select();
  }
}
```


#### model.alias(aliasName)

* `aliasName` {String} 表别名
* `return` {this}

设置表别名。会添加 `this.options.alias` 属性，便于后续分析。

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM think_user AS a;
    return this.alias('a').select();
  }
}
```

#### model.having(having)

* `having` {String} having 查询的字符串
* `return` {this}

设置 having 查询。会设置 `this.options.having` 属性，便于后续分析。

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` HAVING view_nums > 1000 AND view_nums < 2000
    return this.having('view_nums > 1000 AND view_nums < 2000').select();
  }
}
```


#### model.group(group)

* `group` {String} 分组查询的字段
* `return` {this}

设定分组查询。会设置 `this.options.group` 属性，便于后续分析。

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT * FROM `think_user` GROUP BY `name`
    return this.group('name').select();
  }
}
```

#### model.distinct(distinct)

* `distinct` {String} 去重的字段
* `return` {this}

去重查询。会设置 `this.options.distinct` 属性，便于后续分析。

```js
module.exports = class extends think.Model {
  getList(){
    //SELECT DISTINCT `name` FROM `think_user`
    return this.distinct('name').select();
  }
}
```


#### model.beforeAdd(data)

* `data` {Object} 要添加的数据

添加前置操作。

#### model.afterAdd(data)

* `data` {Object} 要添加的数据

添加后置操作。

#### model.afterDelete(data)

删除后置操作。

#### model.beforeUpdate(data)

* `data` {Object} 要更新的数据

更新前置操作。

#### model.afterUpdate(data)

* `data` {Object} 要更新的数据

更新后置操作。

#### model.afterFind(data)

* `data` {Object} 查询的单条数据
* `return` {Object | Promise}

`find` 查询后置操作。

#### model.afterSelect(data)

* `data` [Array] 查询的数据数据
* `return` {Array | Promise}

`select` 查询后置操作。



#### model.add(data, options)

* `data` {Object} 要添加的数据，如果数据里某些字段在数据表里不存在会自动被过滤掉
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回插入的 ID

添加一条数据，返回值为插入数据的 id。

如果数据表没有主键或者没有设置 `auto increment` 等属性，那么返回值可能为 0。如果插入数据时手动设置主键的值，那么返回值也可能为 0。

```js
module.exports = class extends think.Controller {
  async addAction(){
    let model = this.model('user');
    let insertId = await model.add({name: 'xxx', pwd: 'yyy'});
  }
}
```

有时候需要借助数据库的一些函数来添加数据，如：时间戳使用 mysql 的 `CURRENT_TIMESTAMP` 函数，这时可以借助 `exp` 表达式来完成。

```js
module.exports = class extends think.Controller {
  async addAction(){
    let model = this.model('user');
    let insertId = await model.add({
      name: 'test',
      time: ['exp', 'CURRENT_TIMESTAMP()']
    });
  }
}
```

#### model.thenAdd(data, where)

* `data` {Object} 要添加的数据
* `where` {Object} where 条件，会通过 [where](/doc/3.0/relation_model.html#toc-d47) 方法设置 where 条件
* `return` {Promise}

当 where 条件未命中到任何数据时才添加数据。

```js
module.exports = class extends think.Controller {
  async addAction(){
    const model = this.model('user');
    //第一个参数为要添加的数据，第二个参数为添加的条件，根据第二个参数的条件查询无相关记录时才会添加
    const result = await model.thenAdd({name: 'xxx', pwd: 'yyy'}, {email: 'xxx'});
    // result returns {id: 1000, type: 'add'} or {id: 1000, type: 'exist'}
  }
}
```

也可以把 where 条件通过 `this.where` 方法直接指定，如：

```js
module.exports = class extends think.Controller {
  async addAction(){
    const model = this.model('user');
    const result = await model.where({email: 'xxx'}).thenAdd({name: 'xxx', pwd: 'yyy'});
    // result returns {id: 1000, type: 'add'} or {id: 1000, type: 'exist'}
  }
}
```


#### model.addMany(dataList, options)

* `dataList` {Array} 要添加的数据列表
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回插入的 ID 列表

一次添加多条数据。

```js
module.exports = class extends think.Controller {
  async addAction(){
    let model = this.model('user');
    let insertIds = await model.addMany([
      {name: 'xxx', pwd: 'yyy'},
      {name: 'xxx1', pwd: 'yyy1'}
    ]);
  }
}
```

#### model.selectAdd(fields, table, options)

* `fields` {Array | String} 列名
* `table` {String} 表名
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回插入的 ID 列表

添加从 options 解析出来子查询的结果数据。

```js
module.exports = class extends think.Controller {
  async addAction(){
    let model = this.model('user');
    let insertIds = await model.selectAdd(
      'xxx,xxx1,xxx2',
      'tableName',
      {
        id: '1'
      }
    );
  }
}
```


#### model.delete(options)

* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回影响的行数

删除数据。

```js
module.exports = class extends think.Controller {
  async deleteAction(){
    let model = this.model('user');
    let affectedRows = await model.where({id: ['>', 100]}).delete();
  }
}
```


#### model.update(data, options)

* `data` {Object} 要更新的数据
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回影响的行数

更新数据。

```js
module.exports = class extends think.Controller {
  async updateAction(){
    let model = this.model('user');
    let affectedRows = await model.where({name: 'thinkjs'}).update({email: 'admin@thinkjs.org'});
  }
}
```

默认情况下更新数据必须添加 where 条件，以防止误操作导致所有数据被错误的更新。如果确认是更新所有数据的需求，可以添加 `1=1` 的 where 条件进行，如：

```js
module.exports = class extends think.Controller {
  async updateAction(){
    let model = this.model('user');
    let affectedRows = await model.where('1=1').update({email: 'admin@thinkjs.org'});
  }
}
```

有时候更新值需要借助数据库的函数或者其他字段，这时候可以借助 `exp` 来完成。

```js
module.exports = class extends think.Controller {
  async updateAction(){
    let model = this.model('user');
    let affectedRows = await model.where('1=1').update({
      email: 'admin@thinkjs.org',
      view_nums: ['exp', 'view_nums+1'],
      update_time: ['exp', 'CURRENT_TIMESTAMP()']
    });
  }
}
```


#### model.thenUpdate(data, where)

* `data` {Object} 要更新的数据
* `where` {Object} where 条件
* `return` {Promise}

当 where 条件未命中到任何数据时添加数据，命中数据则更新该数据。

#### updateMany(dataList, options)

* `dataList` {Array} 要更新的数据列表
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 影响的行数

更新多条数据，dataList 里必须包含主键的值，会自动设置为更新条件。

```js
this.model('user').updateMany([{
  id: 1, // 数据里必须包含主键的值
  name: 'name1'
}, {
  id: 2,
  name: 'name2'
}])
```

#### model.increment(field, step)

* `field` {String} 字段名
* `step` {Number} 增加的值，默认为 1
* `return` {Promise}

字段值增加。

```js
module.exports = class extends think.Model {
  updateViewNums(id){
    return this.where({id: id}).increment('view_nums', 1); //将阅读数加 1
  }
}
```

#### model.decrement(field, step)

* `field` {String} 字段名
* `step` {Number} 增加的值，默认为 1
* `return` {Promise}

字段值减少。

```js
module.exports = class extends think.Model {
  updateViewNums(id){
    return this.where({id: id}).decrement('coins', 10); //将金币减 10 
  }
}
```


#### model.find(options)

* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回单条数据

查询单条数据，返回的数据类型为对象。如果未查询到相关数据，返回值为 `{}`。

```js
module.exports = class extends think.Controller {
  async listAction(){
    let model = this.model('user');
    let data = await model.where({name: 'thinkjs'}).find();
    //data returns {name: 'thinkjs', email: 'admin@thinkjs.org', ...}
    if(think.isEmpty(data)) {
      // 内容为空时的处理
    }
  }
}
```

可以通过 [think.isEmpty](/doc/3.0/think.html#toc-df2) 方法判断返回值是否为空。

#### model.select(options)

* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回多条数据

查询多条数据，返回的数据类型为数组。如果未查询到相关数据，返回值为 `[]`。

```js
module.exports = class extends think.Controller {
  async listAction(){
    let model = this.model('user');
    let data = await model.limit(2).select();
    //data returns [{name: 'thinkjs', email: 'admin@thinkjs.org'}, ...]
    if(think.isEmpty(data)){

    }
  }
}
```

可以通过 [think.isEmpty](/doc/3.0/think.html#toc-df2) 方法判断返回值是否为空。

#### model.countSelect(options, pageFlag)

* `options` {Number | Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `pageFlag` {Boolean} 当页数不合法时处理，true 为修正到第一页，false 为修正到最后一页，默认不修正
* `return` {Promise}

分页查询，一般需要结合 `page` 方法一起使用。如：

```js
module.exports = class extends think.Controller {
  async listAction(){
    let model = this.model('user');
    let data = await model.page(this.get('page')).countSelect();
  }
}
```

返回值数据结构如下：

```js
{
  pagesize: 10, //每页显示的条数
  currentPage: 1, //当前页
  count: 100, //总条数
  totalPages: 10, //总页数
  data: [{ //当前页下的数据列表
    name: "thinkjs",
    email: "admin@thinkjs.org"
  }, ...]
}
```

有时候总条数是放在其他表存储的，不需要再查当前表获取总条数了，这个时候可以通过将第一个参数 `options` 设置为总条数来查询。

```js
module.exports = class extends think.Controller {
  async listAction(){
    const model = this.model('user');
    const total = 256;
    // 指定总条数查询
    const data = await model.page(this.get('page')).countSelect(total);
  }
}
```

#### model.getField(field, num)

* `field` {String} 字段名，多个字段用逗号隔开
* `num` {Boolean | Number} 需要的条数
* `return` {Promise}

获取特定字段的值，可以设置 where、group 等条件。

** 获取单个字段的所有列表 **

```js
module.exports = class extends think.Controller {
  async listAction(){
    const data = await this.model('user').getField('c_id');
    // data = [1, 2, 3, 4, 5]
  }
}
```

** 指定个数获取单个字段的列表 **

```js
module.exports = class extends think.Controller {
  async listAction(){
    const data = await this.model('user').getField('c_id', 3);
    // data = [1, 2, 3]
  }
}
```

** 获取单个字段的一个值 **

```js
module.exports = class extends think.Controller {
  async listAction(){
    const data = await this.model('user').getField('c_id', true);
    // data = 1
  }
}
```

** 获取多个字段的所有列表 **

```js
module.exports = class extends think.Controller {
  async listAction(){
    const data = await this.model('user').getField('c_id,d_name');
    // data = {c_id: [1, 2, 3, 4, 5], d_name: ['a', 'b', 'c', 'd', 'e']}
  }
}

```


** 获取指定个数的多个字段的所有列表 **

```js
module.exports = class extends think.Controller {
  async listAction(){
    const data = await this.model('user').getField('c_id,d_name', 3);
    // data = {c_id: [1, 2, 3], d_name: ['a', 'b', 'c']}
  }
}
```

** 获取多个字段的单一值 **

```js
module.exports = class extends think.Controller {
  async listAction(){
    const data = await this.model('user').getField('c_id,d_name', true);
    // data = {c_id: 1, d_name: 'a'}
  }
}
```

#### model.count(field)

* `field` {String} 字段名，如果不指定那么值为 `*`
* `return` {Promise} 返回总条数

获取总条数。

```js
module.exports = class extends think.Model{
  // 获取字段值之和
  getScoreCount() {
    // SELECT COUNT(score) AS think_count FROM `test_d` LIMIT 1
    return this.count('score');
  }
}
```

#### model.sum(field)

* `field` {String} 字段名
* `return` {Promise}

对字段值进行求和。

```js
module.exports = class extends think.Model{
  // 获取字段值之和
  getScoreSum() {
    // SELECT SUM(score) AS think_sum FROM `test_d` LIMIT 1
    return this.sum('score');
  }
}
```

#### model.min(field)

* `field` {String} 字段名
* `return` {Promise}

求字段的最小值。


```js
module.exports = class extends think.Model{
  // 获取最小值
  getScoreMin() {
    // SELECT MIN(score) AS think_min FROM `test_d` LIMIT 1
    return this.min('score');
  }
}
```

#### model.max(field)

* `field` {String} 字段名
* `return` {Promise}

求字段的最大值。

```js
module.exports = class extends think.Model{
  // 获取最大值
  getScoreMax() {
    // SELECT MAX(score) AS think_max FROM `test_d` LIMIT 1
    return this.max('score');
  }
}
```

#### model.avg(field)

* `field` {String} 字段名
* `return` {Promise}

求字段的平均值。

```js
module.exports = class extends think.Model{
  // 获取平均分
  getScoreAvg() {
    // SELECT AVG(score) AS think_avg FROM `test_d` LIMIT 1
    return this.avg('score');
  }
}
```

#### model.query(sqlOptions)

* `sqlOptions` {String | Object} 要执行的 sql 选项
* `return` {Promise} 查询的数据

指定 SQL 语句执行查询，`sqlOptions` 会通过 [parseSql](/doc/3.0/relation_model.html#toc-ec3) 方法解析，使用该方法执行 SQL 语句时需要自己处理安全问题。

```js
module.exports = class extends think.Model {
  getMysqlVersion() {
    return this.query('select version();');
  }
}
```


#### model.execute(sqlOptions)

* `sqlOptions` {String | Object} 要操作的 sql 选项
* `return` {Promise} 

执行 SQL 语句，`sqlOptions` 会通过 [parseSql](/doc/3.0/relation_model.html#toc-ec3) 方法解析，使用该方法执行 SQL 语句时需要自己处理安全问题。

```js
module.exports = class extends think.Model {
  xxx() {
    return this.execute('set @b=5;call proc_adder(2,@b,@s);');
  }
}
```


#### model.parseSql(sqlOptions, ...args)

* `sqlOptions` {String | Object} 要解析的 SQL 语句
* `...args` {Array} 解析的数据
* `return` {Object}

解析 SQL 语句，将 SQL 语句中的 `__TABLENAME__` 解析为对应的表名。通过 [util.format](https://nodejs.org/api/util.html#util_util_format_format_args) 将 args 数据解析导 sql 中。

```js
module.exports = class extends think.Model {
  getSql(){
    const sql = 'SELECT * FROM __GROUP__ WHERE id=10';
    const sqlOptions = this.parseSql(sql);
    //{sql: "SELECT * FROM think_group WHERE id=10"}
  }
  getSql2(){
    const sql = 'SELECT * FROM __GROUP__ WHERE id=10';
    const sqlOptions = this.parseSql({sql, debounce: false});
    //{sql: SELECT * FROM think_group WHERE id=10", debounce: false}
  }
}
```

#### model.parseOptions(options)

* `options` {Object} 要合并的 options，会合并到 `this.options` 中一起解析
* `return` {Promise}

解析 options。where、limit、group 等操作会将对应的属性设置到 `this.options` 上，该方法会对 `this.options` 进行解析，并追加对应的属性，以便在后续的处理需要这些属性。

```js
const options = await this.parseOptions({limit: 1});
/**
options = {
  table: '',
  tablePrefix: '',
  pk: '',
  field: '',
  where: '',
  limit: '',
  group: '',
  ...
}
*/
```

调用 `this.parseOptions` 解析后，`this.options` 属性会被置为空对象 `{}`。


#### model.startTrans()

* `return` {Promise}

开启事务。

#### model.commit()

* `return` {Promise}

提交事务。

#### model.rollback()

* `return` {Promise}

回滚事务。

```js
module.exports = class extends think.Model {
  async addData() {
    // 如果添加成功则 commit，失败则 rollback
    try {
      await this.startTrans();
      const result = await this.add({});
      await this.commit();
      return result;
    } catch(e){
      await this.rollback();
    }
  }
}
```

如果事务操作过程中需要实例化多个模型操作，那么需要让模型之间复用同一个数据库连接，具体见 [model.db](/doc/3.0/relation_model.html#toc-f95)。

#### model.transaction(fn)

* `fn` {Function} 要执行的函数，如果有异步操作，需要返回 Promise
* `return` {Promise}

使用事务来执行传递的函数，函数要返回 Promise。如果函数返回值为 Resolved Promise，那么最后会执行 commit，如果返回值为 Rejected Promise（或者报错），那么最后会执行 rollback。

```js
module.exports = class extends think.Model {
  async updateData(data){
    const result = await this.transaction(async () => {
      const insertId = await this.add(data);
      return insertId;
    })
  }
}
```
由于事务里的操作需要在同一个连接里执行，如果处理过程中涉及多个模型的操作，需要多个模型复用同一个数据库连接，这时可以通过 `model.db` 方法达到复用数据库连接的效果。

```js
module.exports = class extends think.Model {
  async updateData(data){
    const result = await this.transaction(async () => {
      const insertId = await this.add(data);
      // 通过 db 方法让 user_cate 模型复用当前模型的数据库连接
      const userCate = this.model('user_cate').db(this.db());
      let result = await userCate.add({user_id: insertId, cate_id: 100});
      return result;
    })
  }
}
```

#### model.cache(key, config)

* `key` {String} 缓存 key，如果不设置会获取 SQL 语句的 md5 值作为 key
* `config` {Mixed} 缓存配置
* `return` {this}

设置查询缓存，只在 `select`、`find`、`getField` 等查询相关的方法下有效。会自动合并 cache Adapter、model cache 的配置。

```js
// cache adapter 配置
exports.cache = {
  type: 'file',
  file: {
    handle: fileCache,
    ...
  }
}
// model adapter 配置
exports.model = {
  type: 'mysql',
  mysql: {
    handle: mysqlModel,
    ...
    cache: { // 额外的缓存配置
      type: 'file',
      handle: fileCache
    }
  }
}
```

最终会将 cache adapter 配置、model cache 配置、以及参数里的配置合并起来作为 cache 的配置。

```js
module.exports = class extends think.Controller {
  indexAction() {
    // 设置缓存 key 为 userList，有效期为 2 个小时
    return this.model('user').cache('userList', {timeout: 2 * 3600 * 1000}).select();
  }
}
```


## MongoDB

有时候关系数据库并不能满足项目的需求，需要 MongoDB 来存储数据。框架提供了 [think-mongo](https://github.com/thinkjs/think-mongo) 扩展来支持 MongoDB，该模块是基于 [mongodb](https://github.com/mongodb/node-mongodb-native) 实现的。

### 扩展 MongoDB 功能

修改扩展的配置文件 `src/config/extend.js`（多模块项目为 `src/common/config/extend.js`），添加如下的配置：

```js
const mongo = require('think-mongo');

module.exports = [
  mongo(think.app) // 让框架支持模型的功能
]
```

添加完扩展后，会注入 `think.Mongo`、`think.mongo`、`ctx.mongo` 和 `controller.mongo` 方法，其中 think.Mongo 为 Mongo 模型的基类文件，其他为实例化 Mongo 模型的方法，ctx.mongo 和 controller.mongo 是 think.mongo 方法的包装。

### 配置 MongoDB 数据库

MongoDB 的数据库配置复用了关系数据库模型的配置，为 adapter 配置，放在 model 下。文件路径为 `src/config/adapter.js`（多模块项目下为 `src/common/config/adapter.js`）。


```js
exports.model = {
  type: 'mongo', // 默认使用的类型，调用时可以指定参数切换
  common: { // 通用配置
    logConnect: true, // 是否打印数据库连接信息
    logger: msg => think.logger.info(msg) // 打印信息的 logger
  },
  mongo: {
    host: '127.0.0.1',
    port: 27017,
    user: '',
    password: '',
    database: '', // 数据库名称
    options: ''
  }
}
```

可以支持多个 host 和 port， 如：

```js
exports.model = {
  type: 'mongo', // 默认使用的类型，调用时可以指定参数切换
  common: { // 通用配置
    logConnect: true, // 是否打印数据库连接信息
    logger: msg => think.logger.info(msg) // 打印信息的 logger
  },
  mongo: {
    host: ['127.0.0.1', '10.16.1.2'],
    port: [27017, 27018],
    user: '',
    password: '',
    database: '', // 数据库名称
    options: ''
  }
}
```

更多配置选项请见 <http://mongodb.github.io/node-mongodb-native/2.0/tutorials/urls/>。

### 创建模型文件

模型文件放在 `src/model/` 目录下（多模块项目为 `src/common/model` 以及 `src/[module]/model`），继承模型基类 `think.Mongo`，文件格式为：

```js
// src/model/user.js
module.exports = class extends think.Mongo {
  getList() {
    return this.field('name').select();
  }
}
```

如果项目比较复杂，希望对模型文件分目录管理，那么可以在模型目录下建立子目录，如： `src/model/front/user.js`，`src/model/admin/user.js`，这样在模型目录下建立 `front` 和 `admin` 目录，分别管理前台和后台的模型文件。

含有子目录的模型实例化需要带上子目录，如：`think.mongo('front/user')`，具体见[这里](/doc/3.0/relation_model.html#toc-9d9)。


### 实例化模型

项目启动时，会扫描项目下的所有模型文件（目录为 `src/model/`，多模块项目下目录为 `src/common/model` 以及各种 `src/[module]/model`），扫描后会将所有的模型类存放在 `think.app.models` 对象上，实例化时会从这个对象上查找，如果找不到则实例化模型基类 `think.Mongo`。

#### think.mongo

实例化模型类。

```js
think.mongo('user'); // 获取模型的实例
think.mongo('user', 'sqlite'); // 获取模型的实例，修改数据库的类型
think.mongo('user', { // 获取模型的实例，修改类型并添加其他的参数
  type: 'sqlite',
  aaa: 'bbb'
}); 
think.mongo('user', {}, 'admin'); // 获取模型的实例，指定为 admin 模块（多模块项目下有效）
```
#### ctx.mongo

实例化模型类，获取配置后调用 `think.mongo` 方法，多模块项目下会获取当前模块下的配置。

```js
const user = ctx.mongo('user');
```

#### controller.mongo

实例化模型类，获取配置后调用 `think.mongo` 方法，多模块项目下会获取当前模块下的配置。

```js
module.exports = class extends think.Controller {
  async indexAction() {
    const user = this.mongo('user'); // controller 里实例化模型
    const data = await user.select();
    return this.success(data);
  }
}
```

#### service.mongo

实例化模型类，等同于 `think.mongo`

#### 含有子目录的模型实例化

如果模型目录下含有子目录，那么实例化时需要带上对应的子目录，如：

```js
const user1 = think.mongo('front/user'); // 实例化前台的 user 模型
const user2 = think.mongo('admin/user'); // 实例化后台的 user 模型

```

### 常见问题

#### 如何在项目中使用 mongoose？

提供了 [think-mongoose](https://github.com/thinkjs/think-mongoose) 模块，可以在项目直接使用 Mongoose 里的一些操作。

### API

#### mongo.pk

获取数据表的主键，默认值为 `_id`。如果数据表的主键不是 `_id`，需要自己配置，如：

```js
module.exports = class extends think.Mongo {
  get pk() {
    return 'user_id';
  }
}
```

有时候不想写模型文件，而是在控制器里直接实例化，这时候又想改变主键的名称，那么可以通过设置 `_pk` 属性的方式，如：

```js
module.exports = class extends think.Controller {
  async indexAction() {
    const user = this.mongo('user');
    user._pk = 'user_id'; // 通过 _pk 属性设置 pk
    const data = await user.select();
  }
}
```


#### mongo.tablePrefix

获取数据表前缀，从配置里的 `prefix` 字段获取。如果要修改的话，可以通过下面的方式：

```js
module.exports = class extends think.Mongo {
  get tablePrefix() {
    return 'think_';
  }
}
```

#### mongo.mongo

获取数据表名，值为 `tablePrefix + modelName`。如果要修改的话，可以通过下面的方式：

```js
module.exports = class extends think.Mongo {
  get tableName() {
    return 'think_user';
  }
}
```


#### mongo.model(name)

* `name` {String} 要实例化的模型名
* `return` {this} 模型实例

实例化别的模型，支持子目录的模型实例化。

```js
module.exports = class extends think.Mongo {
  async getList() {
    // 如果含有子目录，那么这里带上子目录，如： this.mongo('front/article')
    const article = this.mongo('article'); 
    const data = await article.select();
    ...
  }
}
```

#### mongo.db(db)

获取或者设置 db 的实例，db 为 Adapter handle 的实例。

```js
module.exports = class extends think.Mongo {
  async getList() {
    // 让 user 复用当前的 Apdater handle 实例，这样后续可以复用同一个数据库连接
    const user = this.mongo('user').db(this.db()); 
  }
}
```

#### mongo.modelName

实例化模型时传入的模型名

```js
const user = think.mongo('user');
```

实例化时传入的模型名为 `user`，那么 `model.modelName` 值为 `user`。

#### mongo.config

实例化模型时传入的配置，模型实例化时会自动传递，不用手工赋值。

```js
{
  host: '127.0.0.1',
  port: 27017,
  ...
}
```

#### mongo.limit(offset, length)

* `offset` {Number} 起始位置(类似于 SQL 语句里的 offset)
* `length` {Number} 长度(类俗语 SQL 语句里的 length)
* `return` {this}

设置 SQL 语句里的 `limit`，会赋值到 `this.options.limit` 属性上，便于后续解析。

```js
module.exports = class extends think.Mongo() {
  async getList() {
    // 前 10 条
    const list1 = await this.limit(10).select();
    // 11 ~ 20条
    const list2 = await this.limit(10, 20).select();
  }
}
```


#### mongo.page(page, pagesize)

* `page` {Number} 设置当前页数
* `pagesize` {Number} 每页条数，默认值为 `this.config.pagesize`
* `return` {this}

设置查询分页，会解析为 [limit](/doc/3.0/mongo.html#toc-769) 数据。

```js
module.exports = class extends think.Mongo() {
  async getList() {
    const list1 = await this.page(1).select(); // 查询第一页，每页 10 条
    const list2 = await this.page(2, 20).select(); // 查询第二页，每页 20 条
  }
}
```

每页条数可以通过配置项 `pageSize` 更改，如：

```js
// src/config/adapter.js
exports.model = {
  type: 'mongo',
  mongo: {
    database: '',
    ...
    pageSize: 20, // 设置默认每页为 20 条
  }
}
```

#### model.where(where)

* `where` {String} 设置查询条件
* `return` {this}

设置查询字段，设置后会赋值到 `this.options.where` 属性上，便于后续解析。

```js
module.exports = class extends think.Mongo{
  async getList() {
    const data = await this.where(where).select();
  }
}
```

#### model.field(field)

* `field` {String} 查询字段。
* `return` {this}

设置查询字段，设置后会赋值到 `this.options.field` 属性上，便于后续解析。

```js
module.exports = class extends think.Mongo{
  async getList() {
    const data1 = await this.field('d_name').select();

    const data2 = await this.field('c_id,d_name').select();
  }
}
```


#### model.table(table, hasPrefix)

* `table` {String} 表名，支持值为一个 SELECT 语句
* `hasPrefix` {Boolean} `table` 里是否已经含有了表前缀，默认值为 `false`
* `return` {this}

设置当前模型对应的表名，如果 hasPrefix 为 false，那么表名会追加 `tablePrefix`，最后的值会设置到 `this.options.table` 属性上。

如果没有设置该属性，那么最后解析时通过 `model.tableName` 属性获取表名。


#### model.parseOptions(options)

* `options` {Object} 要合并的 options，会合并到 `this.options` 中一起解析
* `return` {Promise}

解析 options。where、limit、group 等操作会将对应的属性设置到 `this.options` 上，该方法会对 `this.options` 进行解析，并追加对应的属性，以便在后续的处理需要这些属性。

```js
const options = await this.parseOptions({limit: 1});
/**
options = {
  table: '',
  tablePrefix: '',
  pk: '',
  field: '',
  where: '',
  limit: '',
  group: '',
  ...
}
*/
```

调用 `this.parseOptions` 解析后，`this.options` 属性会被置为空对象 `{}`。

#### model.order(order)

* `order` {String | Array | Object} 排序方式
* `return` {this}

设置排序方式。会添加 `this.options.order` 属性，便于后续分析。

#### model.group(group)

* `group` {String} 分组查询的字段
* `return` {this}

设定分组查询。会设置 `this.options.group` 属性，便于后续分析。

#### model.distinct(distinct)

* `distinct` {String} 去重的字段
* `return` {this}

去重查询。会设置 `this.options.distinct` 属性，便于后续分析。


#### model.add(data, options)

* `data` {Object} 要添加的数据，如果数据里某些字段在数据表里不存在会自动被过滤掉
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回插入的 ID

添加一条数据，返回值为插入数据的 id。

如果数据表没有主键或者没有设置 `auto increment` 等属性，那么返回值可能为 0。如果插入数据时手动设置主键的值，那么返回值也可能为 0。

```js
module.exports = class extends think.Controller {
  async addAction(){
    let model = this.mongo('user');
    let insertId = await model.add({name: 'xxx', pwd: 'yyy'});
  }
}
```


#### model.thenAdd(data, where)

* `data` {Object} 要添加的数据
* `where` {Object} where 条件，会通过 [where](/doc/3.0/relation_model.html#toc-d47) 方法设置 where 条件
* `return` {Promise}

当 where 条件未命中到任何数据时才添加数据。

```js
module.exports = class extends think.Controller {
  async addAction(){
    const model = this.mongo('user');
    //第一个参数为要添加的数据，第二个参数为添加的条件，根据第二个参数的条件查询无相关记录时才会添加
    const result = await model.thenAdd({name: 'xxx', pwd: 'yyy'}, {email: 'xxx'});
    // result returns {id: 1000, type: 'add'} or {id: 1000, type: 'exist'}
  }
}
```

也可以把 where 条件通过 `this.where` 方法直接指定，如：

```js
module.exports = class extends think.Controller {
  async addAction(){
    const model = this.mongo('user');
    const result = await model.where({email: 'xxx'}).thenAdd({name: 'xxx', pwd: 'yyy'});
    // result returns {id: 1000, type: 'add'} or {id: 1000, type: 'exist'}
  }
}
```

#### model.addMany(dataList, options)

* `dataList` {Array} 要添加的数据列表
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回插入的 ID 列表

一次添加多条数据。

```js
module.exports = class extends think.Controller {
  async addAction(){
    let model = this.mongo('user');
    let insertIds = await model.addMany([
      {name: 'xxx', pwd: 'yyy'},
      {name: 'xxx1', pwd: 'yyy1'}
    ]);
  }
}
```


#### model.delete(options)

* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回影响的行数

删除数据。

```js
module.exports = class extends think.Controller {
  async deleteAction(){
    let model = this.mongo('user');
    let affectedRows = await model.where({id: ['>', 100]}).delete();
  }
}
```


#### model.update(data, options)

* `data` {Object} 要更新的数据
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回影响的行数

更新数据。

```js
module.exports = class extends think.Controller {
  async updateAction(){
    let model = this.mongo('user');
    let affectedRows = await model.where({name: 'thinkjs'}).update({email: 'admin@thinkjs.org'});
  }
}
```

默认情况下更新数据必须添加 where 条件，以防止误操作导致所有数据被错误的更新。如果确认是更新所有数据的需求，可以添加 `1=1` 的 where 条件进行，如：

```js
module.exports = class extends think.Controller {
  async updateAction(){
    let model = this.mongo('user');
    let affectedRows = await model.where('1=1').update({email: 'admin@thinkjs.org'});
  }
}
```

有时候更新值需要借助数据库的函数或者其他字段，这时候可以借助 `exp` 来完成。

```js
module.exports = class extends think.Controller {
  async updateAction(){
    let model = this.mongo('user');
    let affectedRows = await model.where('1=1').update({
      email: 'admin@thinkjs.org',
      view_nums: ['exp', 'view_nums+1'],
      update_time: ['exp', 'CURRENT_TIMESTAMP()']
    });
  }
}
```


#### model.thenUpdate(data, where)

* `data` {Object} 要更新的数据
* `where` {Object} where 条件
* `return` {Promise}

当 where 条件未命中到任何数据时添加数据，命中数据则更新该数据。

#### model.updateMany(dataList, options)

* `dataList` {Array} 要更新的数据列表
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 影响的行数

更新多条数据，dataList 里必须包含主键的值，会自动设置为更新条件。

```js
this.mongo('user').updateMany([{
  id: 1, // 数据里必须包含主键的值
  name: 'name1'
}, {
  id: 2,
  name: 'name2'
}])
```

#### model.increment(field, step)

* `field` {String} 字段名
* `step` {Number} 增加的值，默认为 1
* `return` {Promise}

字段值增加。

```js
module.exports = class extends think.Mongo {
  updateViewNums(id){
    return this.where({id: id}).increment('view_nums', 1); //将阅读数加 1
  }
}
```

#### model.decrement(field, step)

* `field` {String} 字段名
* `step` {Number} 增加的值，默认为 1
* `return` {Promise}

字段值减少。

```js
module.exports = class extends think.Mongo {
  updateViewNums(id){
    return this.where({id: id}).decrement('coins', 10); //将金币减 10 
  }
}
```


#### model.find(options)

* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回单条数据

查询单条数据，返回的数据类型为对象。如果未查询到相关数据，返回值为 `{}`。

```js
module.exports = class extends think.Controller {
  async listAction(){
    let model = this.mongo('user');
    let data = await model.where({name: 'thinkjs'}).find();
    //data returns {name: 'thinkjs', email: 'admin@thinkjs.org', ...}
    if(think.isEmpty(data)) {
      // 内容为空时的处理
    }
  }
}
```

可以通过 [think.isEmpty](/doc/3.0/think.html#toc-df2) 方法判断返回值是否为空。

#### model.select(options)

* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise} 返回多条数据

查询多条数据，返回的数据类型为数组。如果未查询到相关数据，返回值为 `[]`。

```js
module.exports = class extends think.Controller {
  async listAction(){
    let model = this.mongo('user');
    let data = await model.limit(2).select();
    //data returns [{name: 'thinkjs', email: 'admin@thinkjs.org'}, ...]
    if(think.isEmpty(data)){

    }
  }
}
```

可以通过 [think.isEmpty](/doc/3.0/think.html#toc-df2) 方法判断返回值是否为空。

#### model.countSelect(options, pageFlag)

* `options` {Number | Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `pageFlag` {Boolean} 当页数不合法时处理，true 为修正到第一页，false 为修正到最后一页，默认不修正
* `return` {Promise}

分页查询，一般需要结合 `page` 方法一起使用。如：

```js
module.exports = class extends think.Controller {
  async listAction(){
    let model = this.mongo('user');
    let data = await model.page(this.get('page')).countSelect();
  }
}
```

返回值数据结构如下：

```js
{
  pagesize: 10, //每页显示的条数
  currentPage: 1, //当前页
  count: 100, //总条数
  totalPages: 10, //总页数
  data: [{ //当前页下的数据列表
    name: "thinkjs",
    email: "admin@thinkjs.org"
  }, ...]
}
```

有时候总条数是放在其他表存储的，不需要再查当前表获取总条数了，这个时候可以通过将第一个参数 `options` 设置为总条数来查询。

```js
module.exports = class extends think.Controller {
  async listAction(){
    const model = this.mongo('user');
    const total = 256;
    // 指定总条数查询
    const data = await model.page(this.get('page')).countSelect(total);
  }
}
```
#### model.sum(field)

* `field` {String} 字段名
* `return` {Number|Array} 返回求和结果

没有分组情况下，默认返回数字，有人组的情况下返回分组信息以及求和结果，如下示例：

```js
module.exports = class extends think.Controller {
  async listAction(){
    let model = this.mongo('user');
    // ret1 = 123  没有分组情况下，返回数字
    let ret1 = await m.sum('age');		
    // ret2 = [{group:'thinkjs1',total:6},{group:'thinkjs2',total:8}]
    // 有分组的情况返回[{group:xxx,total:xxx}...]
    let ret2 = await m.group('name').sum('age'); 
	// ret3 = [{group:{name:'thinkjs',version'1.0'},total:6},{group:{name:'thinkjs',version'2.0'},total:8},]
    let ret3 = await m.where({name:'thinkjs'}).order('version ASC').group('name,version').sum('age'); 
  }
}
```

#### model.aggregate(options)
* `options` {Object} 操作选项，会通过 [parseOptions](/doc/3.0/relation_model.html#toc-d91) 方法解析
* `return` {Promise}

聚合操作，详见[Aggregation](https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/)

#### model.mapReduce(map,reduce,out)
* `map` {	function | string} mapping方法
* `reduce` {	function | string} reduce方法
* `out` {Object} 其他配置
* `return` {Promise}
* 
集合中 Map-Reduce 操作，详见[MapReduce](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#mapReduce)

#### model.createIndex(indexes,options)
* `indexes` {	string | object} 索引名
* `options` {Object} 操作选项
* `return` {Promise}

创建索引，详见[ensureIndex](http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html#ensureIndex)

#### model.getIndexes()
* `return` {Promise}

获取索引

# 进阶应用

## think 对象

框架中内置 `think` 全局对象，方便在项目中随时随地使用。

### API

#### think.app

`think.app` 为 Koa [Application](https://github.com/koajs/koa/blob/master/lib/application.js#L61) 对象的实例，系统启动时生成。

此外为 app 扩展了更多的属性。

* `think.app.think` 等同于 think 对象，方便有些地方传入了 app 对象，同时要使用 think 对象上的其他方法
* `think.app.modules` 模块列表，单模块项目下为空数组
* `think.app.controllers` 存放项目下的 controller 文件，便于后续快速调用
* `think.app.logics` 存放项目下的 logic 文件
* `think.app.models` 存放项目下的模型文件
* `think.app.services` 存放 service 文件
* `think.app.routers` 存放自定义路由配置
* `think.app.validators` 存放校验配置
* `think.app.server` 创建 HTTP 服务后的 server 对象

如果想要查下这些属性具体的值，可以在 `appReady` 事件中进行。

```js
think.app.on('appReady', () => {
  console.log(think.app.controllers)
})
```

#### think.ROOT_PATH

项目的根目录，其他目录可以通过该目录来生成，如：

```js
const runtimePath = path.join(think.ROOT_PATH, 'runtime/');
const viewPath = path.join(think.ROOT_PATH, 'view/');
```

#### think.APP_PATH

APP 根目录，默认为 `${think.ROOT_PATH}/app`，如果项目不需要转译的话，那么默认路径为：`${think.ROOT_PATH}/src`。


#### think.env

当前运行环境，等同于 `think.app.env`，值在 `development.js` 之类的入口文件中定义。

#### think.version

当前 ThinkJS 的版本号。

#### think.config(name, value, m)

* `name` {String} 配置名
* `value` {Mixed} 配置值
* `m` {String} 模块名，多模块项目下使用

读取或者设置配置，该功能由 [think-config](https://github.com/thinkjs/think-config) 模块实现。在 context、controller、logic 上可以直接通过 `this.config` 方法来操作配置。

```js
// 获取配置
const value1 = think.config('name');
// 指定模块获取配置，多模块项目下有效
const value2 = think.config('name', undefined, 'admin');

// 设置配置
think.config('name', 'value');
// 指定模块设置配置值
think.config('name', 'value', 'admin');
```

#### think.Controller

控制器基类，其他控制器类继承该类。

```js
// src/controller/user.js
module.exports = class userController extends think.Controller {
  indexAction() {

  }
}
```

#### think.Logic

Logic 基类，继承自 `think.Controller`。

```js
// src/logic/user.js
module.exports = class userLogic extends think.Logic {
  indexAction() {

  }
}
```

#### think.Service

Service 基类，其他 Service 类继承该类。

```js
// src/service/sms.js
module.exports = class extends think.Service {

}
```

#### think.service(name, m, ...args)

* `name` {String} Service 名称
* `m` {String} 模块名，多模块项目下有效
* `...args` {Array} 实例化 Service 类需要的参数。单模块项目下，会把 `m` 参数补充导 args 里。

实例化 Service 类，如果导出的对象不是个类，那么直接返回。

```js
const instance1 = think.service('sms');
const instance2 = think.service('sms', 'admin');
```

#### think.beforeStartServer(fn)

* `fn` {Function} 要注册的函数名

服务启动之前要注册执行的函数，如果有异步操作，fn 需要返回 Promise。

#### think.isArray(array)

* `array` {any} 判断输入是否是数组
* `return` {Boolean}

判断是否是数组，等同于 `Array.isArray`。

```js
think.isArray([]); // true
think.isArray({}); // false
```

#### think.isBoolean(boolean)

* `boolean` {any}

判断输入是否是布尔值

```js
think.isBoolean(false); // true
```

#### think.isInt(any)

* `any` {any}

判断输入的是否是整数

#### think.isNull(any)

* `any` {any}

判断输入是 `null`，也可以直接通过 `xxx === null` 来判断。

#### think.isNullOrUndefined(any)

* `any` {any}

判断输入是 `null` 或者 `undefined`

#### think.isNumber(number)

* `number` {any}

判断输入是否是数字

```js
think.isNumber(1); // true
```

#### think.isString(str)

* `str` {any}

判断输入是是否是字符串

#### think.isSymbol(any)

* `any` {any}

判断输入是是否是 Symbol 类型

#### think.isUndefined(any)

* `any` {any}

判断输入是是否是 undefined，也可以直接通过 `xxx === undefined` 来判断。

#### think.isRegExp(reg)

* `reg` {any}

判断输入是是否是正则对象

#### think.isDate(date)

* `date` {any}

判断输入是是否是日期对象

#### think.isError(error)

* `error` {any}

判断输入是是否是Error类型

#### think.isFunction(any)

* `any` {any}

判断输入是是否是函数类型

#### think.isPrimitive(any)

* `any` {any}

判断输入是是否是原始类型，包含：`null`、`string`、`boolean`、`number`、`symbol`、`undefined`。

#### think.isIP(ip)

* `ip` {String}

判断一个字符串是否是 ip 地址，IP v4 或者 IP v6，等同于 `net.isIP`。

#### think.isBuffer(buffer)

* `buffer` {any}

判断输入是否是一个Buffer对象，等同于 `Buffer.isBuffer`。

#### think.isIPv4(ip)

* `ip` {String}

判断一个字符串是否是 IP v4 地址，等同于 `net.isIPv4`。

#### think.isIPv6(ip)

* `ip` {String}

判断一个字符串是否是 IP v6 地址，等同于 `net.isIPv6`

#### think.isMaster

判断当前进程是否为主进程，等同于 `cluster.isMaster`

#### think.isObject(obj)

* `obj` {any}

判断一个输入是否为 Object，通过 Object.prototype.toString.call(obj) 是否为 `[object Object]` 判断

```js
think.isObject({}); // true
think.isObject([]); // false
think.isObject(null); // false
```

#### think.promisify(fn, receiver)

* `fn` {Function} 要包装的函数
* `receiver` {Object} 要绑定作用域的对象

此方法把一个 callback 函数包装 成Promise

```js
let fn = think.promisify(fs.readFile, fs);
let data = await fn(__filename);
```

#### think.extend(target,...any)

* `target` {Object} 要extend的目标对象
* `...any` {Object} 可以有任意多个对象

深拷贝对象，如果 key 相同，那么后面的值会覆盖前面的值。

```js
think.extend({a: 1}, {b: 2});
// return {a:1,b:2};

think.extend({a: 1}, {a: 2});
// return {a: 2}
```

#### think.camelCase(str)

* `str` {String}

把字符串转成驼峰表示法

```js
think.camelCase('index_index');
// return 'indexIndex'
```

#### think.snakeCase(str)

* `str` {String}

把驼峰写法转化为蛇形写法

```js
think.snakeCase('indexIndex');
// return 'index_index'
```

#### think.isNumberString(str)

* `str` {String}

判断输入是不是一个字符串类型的数字

```js
think.isNumberString('419');
// return true
```

#### think.isTrueEmpty(any)

* `any` {any}

判断是否是真正的空，`undefined`、`null`、`''`、`NaN` 为 true，其他为 false。

```js
think.isTrueEmpty(null);
// return true
```

#### think.isEmpty(any)

* `any` {any}

判断对象是否为空， `undefined`, `null` ,`''`, `NaN`, `[]`, `{}`, `0`, `false` 为 true，其他为 false。

```js
think.isEmpty(null);
// return true
```

#### think.defer()

生成一个 Deferred 对象。

```js
function test() {
  const defer = think.defer();
  setTimeout(function() {
    defer.reslove('1');
  },1000)
  return defer
}

test().then((result)=>{
  resut === '1'
})
```

#### think.omit(obj, props)

* `obj` {Object} 要操作的对象
* `props` {String | Array} 要忽略的属性，如果是字符串，多个值用逗号隔开

忽略对象中的某些属性，返回新的对象

```js
const value = think.omit({a: 1, b: 2, c: 3}, 'a,b');
// value is {c: 3}
```

#### think.md5(str)

* `str` {String}

计算字符串的 md5 值。

#### think.timeout(num)

* `num`{Number} 时间，单位为毫秒

将 setTimeout 包装为 Promise

```js
think.timeout(1000).then(()=>{
  ...
})
```


#### think.escapeHtml(str)

* `str` {String}

对字符串进行 HTML 转义，转义 `<`、`>`、`"`、`'` 字符。

#### think.datetime(date, format)

* `data` {Date}
* `format` {String} default 'YYYY-MM-DD HH:mm:ss'

返回一个格式化日期

```js
think.datetime(1501406894849)
// return "2017-07-30 17:28:14"
```
#### think.uuid(version)

* `version` {String} v1|v4
* `return` {String}

生成 uuid 字符串，符合 [RFC4122](http://www.ietf.org/rfc/rfc4122.txt) 规范，基于 [uuid](https://github.com/kelektiv/node-uuid) 模块。

#### think.ms(str)

* `str` {String}
* `return` {Number}

把一个语义化的时间转成毫秒，如果转换失败则抛异常，使用 [ms](https://github.com/zeit/ms) 库转换。

```js
think.ms('2 days')  // 1d,10h,1y
// return 172800000
```

#### think.isExist(path)

* `path` {String}

检测路径是否存在

```js
think.isExist('/usr/local/bin/node')
// return true
```

#### think.isFile(filepath)

* `filepath` {String}

检测是否是一个文件路径

```js
think.isFile('/usr/local/bin/node')
// return true
```

#### think.isDirectory(filepath)

* `filepath` {String}

检测是否是一个文件夹路径

```js
think.isDirectory('/usr/local/bin')
// return true
```

#### think.chmod(path, mode)

* `path` {String}
* `mode` {String} default '0777'

改变文件或文件夹的权限

```js
think.chmod('/usr/local/bin', '0775')
```

#### think.mkdir(path, mode)

* `path` {String} 要创建的目录
* `mode` {String} 文件夹权限，默认为 `0777`
* `return` {Boolean}

创建文件夹。创建成功返回 true, 失败返回 false。

```js
think.mkdir('/usr/local/bin/thinkjs', '0775')
```

#### think.getdirFiles(dir, prefix)

* `dir` {String} 文件夹路径
* `prefix` {String} 路径前缀
* `return` {Array} 包含所有文件的数组

获取文件夹下的所有文件。

```js
think.getdirFiles('/usr/local/bin')
// return []
```

#### think.rmdir(path, reserve)

* `path` {String}
* `reserve` {Boolean} 是否保留当前的文件夹，只删除文件夹下的文件

删除文件夹和文件夹下的文件，异步操作。

```js
think.rmdir('/usr/local/bin/thinkjs', true).then(()=>{
  console.log('删除完成')
})
```

### 常见问题

#### think 对象是否推荐在插件里使用？

不建议在插件里（middleware、adapter、extend）里直接使用 think 对象，那样会让插件代码不方便单元测试。如果非要使用的话可以传入 `app` 对象，然后通过 `app.think.xxx` 来使用 think 对象上的属性或者方法。

```js
// src/config/middleware.js
module.exports = [
  {
    handle: xxx
  }
];


// xxx middleware
module.exports = (options, app) => {
  return (ctx, next) => {
    // 通过 app.think.modules 获取项目的模块列表
    const modules = app.think.modules;
    // 如果是多模块项目下（单模块项目长度始终为 0）
    if(modules.length) {

    }
  }
}
```



## 启动自定义

当通过 `npm start` 或者 `node production.js` 来启动项目时，虽然可以在这些入口文件里添加其他的逻辑代码，但并不推荐这么做。系统给出了其他启动自定义的入口。

### bootstrap

系统启动时会加载 `src/boostrap/` 目录下的文件，具体为：

* Master 进程下时加载 `src/bootstrap/master.js`
* Worker 进程下时加载 `src/bootstrap/worker.js`

所以可以将一些需要在系统启动时就需要执行的逻辑放在对应的文件里执行。

如果有一些代码需要在 Master 和 Worker 进程下都调用，那么可以放在一个单独的文件里，然后 master.js 和 worker.js 去 required。

```js
// src/bootstrap/common.js
global.commonFn = function(){

}

// src/bootstrap/master.js
require('./common.js')


// src/boostrap/worker.js
require('./common.js')

```

### 启动服务前执行

有时候需要在 node 启动 http 服务之前做一些特殊的逻辑处理，如：从数据库中读取配置并设置，从远程获取一些数据设置到缓存中。

这时候可以借助 `think.beforeStartServer` 方法来处理，如：

```js
think.beforeStartServer(async () => {
  const data = await getDataFromApi();
  think.config(key, data);
})
```
可以通过 `think.beforeStartServer` 注册多个需要执行的逻辑，如果逻辑函数中有异步的操作，需要返回 Promise。

系统会等待注册的多个逻辑执行完成后才启动服务，当然也不会无限制的等待，会有个超时时间。超时时间可以通过配置 `startServerTimeout` 修改，默认为 3 秒。

```js
//src/config/config.js
module.exports = {
  startServerTimeout: 5000 // 将超时时间改为 5s
}
```

### 自定义创建 http 服务

系统默认是通过 Koa 里的 listen 方法来创建 http 服务的，如果想要创建 https 服务，此时需要自定义创建服务，可以通过 `createServer` 配置来完成。

```js
// src/config/config.js
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
  cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
};

module.exports = {
  // 只需要创建服务，不需要 listen
  createServer: function(callback){
    https.createServer(options, callback);
  }
}
```

### think.app.server 对象

创建完  http 服务后，会将 server 对象赋值给 `think.app.server`，以便于在其他地方使用。

### appReady 事件

http 服务创建完成后，会触发 `appReady` 事件，其他地方可以通过 `think.app.on("appReady")` 来捕获该事件。

```js
think.app.on("appReady", () => {
  const server = think.app.server;
})
```

## Service / 服务

项目中，有时候除了查询数据库等操作外，也需要调用远程的一些接口，如：调用 GitHub 的接口、调用发送短信的接口等等。

这种功能放在 Model 下是不太合适的，为此，框架提供了 Service 来解决此类问题。

### 创建 Service 文件

Service 文件存放在 `src/service/` （多模块在 `src/common/service/`）目录下，文件内容格式如下：

```js
module.exports = class extends think.Service {
  constructor() {

  }
  xxx() {

  }
}
```
Service 都继承 `think.Service` 基类，但该基类不提供任何方法，可以通过 Extend 进行扩展。

可以在项目根目录下通过 `thinkjs service xxx` 命令创建 service 文件，支持多级目录。

### 实例化 Service 类

可以通过 `think.service` 方法实例化 Service 类，在控制器、ctx 也有对应的 `service` 方法，如：`ctx.service`、`controller.service`，这些方法都是 think.service 的快捷方式。

项目启动时，会扫描项目下所有的 services 文件，并存放到 `think.app.services` 对象下，实例化时会从该对象上查找对应的类文件，如果找不到则报错。

#### 无参数类的实例化

```js
// src/service/sms.js
module.exports = class extends think.Service {
  xxx() {

  }
}

// 实例化，没有任何参数
const sms = think.service('sms');
sms.xxx();
```

#### 有参数类的实例化 

```js
// src/service/sms.js
module.exports = class extends think.Service {
  constructor(key, secret) {
    super();
    this.key = key;
    this.secret = secret;
  }
  xxx() {

  }
}

// 带参数的实例化
const sms = think.service('sms', key, secret);
sms.xxx();
```

#### 多模块项目的实例化

```js
// src/home/service/sms.js
module.exports = class extends think.Service {
  constructor(key, secret) {
    super();
    this.key = key;
    this.secret = secret;
  }
  xxx() {

  }
}

// 指定从 home 下查找 service 类
const sms = think.service('sms', 'home', key, secret);
```

#### 多级目录的实例化

```js
// src/service/aaa/sms.js
module.exports = class extends think.Service {
  xxx() {

  }
}

const sms = think.servie('aaa/sms');
```

### 扩展 Service 类的方法

基类 think.Service 没有提供任何的方法，但实际中需要用到很多常用的方法，如：从远程接口获取数据的模块，处理完数据后将数据更新导数据库的操作。这个时候可以通过对应的扩展来加强 think.Service 类的功能，如：

* [think-fetch](https://github.com/thinkjs/think-fetch) 模块让 think.Service 类有了 `fetch` 方法，这样很方便获取远程的数据
* [think-model](https://github.com/thinkjs/think-model) 模块让 think.Service 类有了 `model` 方法，这样可以快速的操作数据库

这些模块都是 Extend/扩展，可以增强 think.Service 类的能力。

当然项目中也可以根据需要扩展 think.Service 类，如：

```js
// src/extend/service.js
module.exports = {
  getDataFromApi() {

  }
}
```

通过在扩展文件 `src/extend/service.js`（多模块项目为 `src/common/extend/service.js`）添加对应的方法，增强 `think.Service` 类的能力，这样在 `src/service/xxx.js` 中就可以直接使用这些方法了。

```js
// src/service/sms.js
module.exports = class extends think.Service {
  async xxx() {
    const data = await this.getDataFromApi(); // 这个访问为 extend/service.js 里扩展的方法
  }
}
```

如果这些扩展的方法比较通用，那么就可以整理成一个 Extend 模块发布，其他项目引入这个模块就可以了，具体见 [Extend/扩展](/doc/3.0/extend.html)。


## Cookie

由于 HTTP(S) 协议是一个无状态的协议，所以多次请求之间并不知道是来自同一个用户。这样就会带来很多问题，如：有些页面用户登录后才能访问，页面内容根据用户相关。

在早期时代，解决方案一般是生成一个随机 token，以后每次请求都会携带这个 token 来识别用户。这需要在 form 表单中插入一个包含 token 的隐藏域，或者放在 URL 请求的参数上。

这种方式虽然能解决问题，但给开发带来很大的不便，也不利于页面地址的传播。为了解决这个问题，[RFC 2965](https://tools.ietf.org/html/rfc2965) 引用了 Cookie 机制，请求时携带 `Cookie` 头信息，响应时通过 `Set-Cookie` 字段设置 Cookie。

### Cookie 格式

请求时 Cookie 格式为：

```
Cookie: name1=value1; name2=value2; name3=value3 //多个 Cookie 之间用 `; ` 隔开
```
响应时 Cookie 格式为：

```
Set-Cookie: key1=value1; path=path; domain=domain; max-age=max-age-in-seconds; expires=date-in-GMTString-format; secure; httponly
Set-Cookie: key2=value2; path=path; domain=domain; max-age=max-age-in-seconds; expires=date-in-GMTString-format; secure; httponly
```

* `key=value` 名称、值的键值对
* `path=path` 设置在哪个路径下生效，大部分时候设置为 `/`，这样可以在所有路径下生效
* `domain=domain` 设置在哪个域名下生效，会验证 domain 的合法性
* `max-age=max-age-in-seconds` 存活时间，一般跟 expires 配套使用
* `expires=date-in-GMTString-format` 失效日期
* `secure` 只在 `HTTPS` 下生效
* `httponly` 只在 HTTP 请求中携带，JS 无法获取

如果不设置 `max-age` 和 `expires`，那么 Cookie 会随着浏览器的进程退出而销毁。对于不希望 JS 能够获取到 Cookie，一般设置 `httponly` 属性，比如：用户 Session 对应的 Cookie。

虽然标准里并没有对 Cookie 的大小限制的规定，但浏览器一般都会有限制，所以不能将太大的文本保存在 Cookie 中（一般不能超过 4K）。

### 配置

框架中是通过 [cookies](https://github.com/pillarjs/cookies) 模块来进行 Cookie 的读取与设置的，支持如下的配置：

* `maxAge`: cookie的超时时间，表示当前时间（`Date.now()`）之后的毫秒数。
* `expires`: `Date` 对象，表示cookie的到期时间（不指定的话，默认是在会话结束时过期）。
* `path`: 字符串，表示 cookie 的路径（默认是`/`）。
* `domain`: 字符串，表示 cookie 的域（没有默认值）。
* `secure`: 布尔值，表示是否只通过 HTTPS 发送该 cookie（`false`时默认通过HTTP发送，`true`时默认通过HTTPS发送）。
* `httpOnly`: 布尔值，表示是否只通过 HTTP(S)发送该 cookie，而不能被客户端的 JavaScript 访问到（默认是`true`）。
* `sameSite`: 布尔值或字符串，表示是否该 cookie 是一个“同源” cookie（默认是`false`）。可以将其设置为`'strict'`，`'lax'`，或`true` （等价于`strict`）。
* `signed`: 布尔值，表示是否要将该 cookie 签名（默认是`false`）。如果设为`true`，还会发送另一个带有`.sig`后缀的同名 cookie，值为一个 27 字节的 url-safe base64 SHA1 值，表示_cookie-name _ = _ cookie-value_的散列值，相对于第一个 [Keygrip](https://www.npmjs.com/package/keygrip) 键。 此签名密钥用于在下次接收到 cookie 时检测篡改。
* `overwrite`: 布尔值，表示是否覆盖以前设置的同名 cookie（默认为false）。如果设为`true`，在同一个请求中设置的相同名称（不管路径或域）的所有 cookie 将在设置此 cookie 时从 Set-Cookie 头中过滤掉。


如果需要修改上面的配置，可以在配置文件 `src/config/config.js` 中修改。如：

```js
module.exports = {
  cookie: {
    domain: '', 
    path: '/',
    maxAge: 10 * 3600 * 1000, // 10个小时
    signed: true,
    keys: [] // 当 signed 为 true 时，使用 keygrip 库加密时的密钥
  }
}
```

### 操作 cookie

在 ctx、controller、logic 中，提供了 `cookie` 方法来操作 cookie。

#### 获取 cookie

```js
const theme = this.cookie('theme')
```

#### 设置 cookie

```js
this.cookie('theme', 'gray'); 
this.cookie('theme', 'yellow', { // 设定 cookie 时指定额外的配置
  maxAge: 10 * 1000,
  path: '/theme'
})
```

#### 删除 cookie

```js
this.cookie('theme', null)
this.cookie('theme', null, {
  domain: '',
  path: ''
})
```

删除 cookie 时需要和设置 cookie 时同样的 domain 和 path 配置，否则会因为不匹配导致 cookie 删除不成功。

### 常见问题

#### 输出内容后能否再发送 cookie？

由于发送 cookie 是通过 `Set-Cookie` header 字段来完成的，HTTP 协议中，规定 header 信息必须在内容之前发送，所以输出内容后不能再发送 cookie 信息。

如果强制在输出内容之后发送 cookie 等 header 信息，会出现类似下面的错误：

```
[ERROR] - Error: Can't set headers after they are sent.
    at ServerResponse.OutgoingMessage.setHeader (_http_outgoing.js:346:11)
    at Cookies.set (think-demo/node_modules/thinkjs/node_modules/cookies/index.js:115:13)
    at Object.cookie (think-demo/node_modules/thinkjs/lib/extend/context.js:260:21)
    at IndexController.cookie (think-demo/node_modules/thinkjs/lib/extend/controller.js:181:21)
    at Timeout._onTimeout (think-demo/src/controller/index.js:10:12)
    at tryOnTimeout (timers.js:224:11)
    at Timer.listOnTimeout (timers.js:198:5)

```


## Session / 会话

WEB 请求中经常通过 session 来维持会话的，框架通过 [think-session](https://github.com/thinkjs/think-session) 和 Adapter 来支持 session 功能。

### 配置扩展和 Adapter

修改扩展配置文件 `src/config/extend.js`（多模块项目为 `src/common/config/extend.js`），添加下面的配置：

```js
const session = require('think-session');
module.exports = [
  session
]
```


修改 Adapter 配置文件 `src/config/adapter.js`（多模块项目为 `src/common/config/adapter.js`），添加下面的配置：

```js
const fileSession = require('think-session-file');

exports.session = {
  type: 'file',
  common: {
    cookie: {
      name: 'thinkjs',
      keys: ['signature key'],
      signed: true
    }
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, 'runtime/session')
  }
}
```
支持的 session 类型列表见：<https://github.com/thinkjs/think-awesome#session>，其中 cookie 选项为 session 设置 cookie 时的配置项，会和 `think.config('cookie')` 值进行合并，name 字段值为 session 对应 cookie 的名字。


### 注入的方法

添加 think-session 扩展后，会注入 `ctx.session` 和 `controller.session` 方法，其中 controller.session 是 ctx.session 方法的包装，会读取当前请求下对应的配置。

#### 读取 session

```js
module.exports = class extends think.Controller {
  // 获取 session
  async indexAction() {
    const data = await this.session('name');
  }
}
```

#### 设置 session

```js
module.exports = class extends think.Controller {
  // 设置 session
  async indexAction() {
    await this.session('name', 'value');
  }
}
```

#### 删除 session

```js
module.exports = class extends think.Controller {
  // 删除整个 session
  async indexAction() {
    await this.session(null);
  }
}
```

### 常见问题

#### 一个请求下能操作不同类型的 session 么？

不能。session 数据是异步更新的，所以一个请求下只允许使用一种 session。

#### session 数据是怎么同步的？

当 session 数据改变后，并不会立即更新到 session 容器里（为了性能考虑），而是在请求结束时统一更新。

```js
this.ctx.res.once('finish', () => {
  this.flush(); // 在请求时将 session flush 导存储容器中
});
```

#### 如何获取 session 对应 cookie 的值？

session 对应 cookie 的值是不能手工设置的，而是框架自动生成，生成方式为 [think.uuid](/doc/3.0/think.html#toc-9ac)。后续 Action 中可以通过 `this.cookie('thinkjs')` （thinkjs 为 session 对应 cookie 的字段名称）。

#### 如何限制同一个帐号在不同的端登录？

有些情况下，只允许一个帐号在一个端下登录，如果换了一个端，需要把之前登录的端踢下线（默认情况下，同一个帐号可以在不同的端下同时登录的）。这时候可以借助一个服务保存用户唯一标识和 session cookie 值的对应关系，如果同一个用户，但 cookie 不一样，则不允许登录或者把之前的踢下线。如：

```js
// 当用户登录成功后
const cookie = this.cookie('thinkjs');
const uid = userInfo.id;
await this.redis.set(`uid-${uid}`, cookie);

// 请求时，判断 session cookie 值是否相同
const userInfo = await this.session('userInfo');
const cookie = this.cookie('thinkjs');
const saveCookie = await this.redis.get(`uid-${userInfo.id}`);
if(saveCookie && saveCookie !== cookie) {
  // 不是最近一台登录的设备
}
```


## Cache / 缓存

在项目中，我们经常用到缓存的功能，并且可能要用到不同类型的缓存。框架通过 [think-cache](https://github.com/thinkjs/think-cache) 扩展和对应的 Adapter 来操作缓存。

### 配置扩展和 Adapter

修改扩展配置文件 `src/config/extend.js`（多模块项目为 `src/common/config/extend.js`），添加下面的配置：

```js
const cache = require('think-cache');
module.exports = [
  cache
]
```

修改 Adapter 配置文件 `src/config/adapter.js`（多模块项目为 `src/common/config/adapter.js`），添加下面的配置：

```js
const fileCache = require('think-cache-file');

exports.cache = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000 // 单位：毫秒
  },
  file: {
    handle: fileCache,
    cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // 缓存文件存放的路径
    pathDepth: 1,
    gcInterval: 24 * 60 * 60 * 1000 // 清理过期缓存定时时间
  }
}
```
支持的缓存类型列表见：<https://github.com/thinkjs/think-awesome#cache>。

### 注入的方法

添加 think-cache 扩展后，会注入 `think.cache`、`ctx.cache` 和 `controller.cache` 方法，其中 ctx.cache 和 controller.cache 都是 think.cache 方法的包装，会读取当前请求下对应的缓存配置。

#### 获取缓存

```js
module.exports = class extends think.Controller {
  // 获取缓存
  async indexAction() {
    const data = await this.cache('name');
  }
  // 指定缓存类型获取，从 redis 里获取缓存，需要配置对应的 adapter
  async index2Action() {
    const data = await this.cache('name', undefined, 'redis');
  }
}
```

操作缓存的时候一般都是先读取缓存，如果不存在，再从对应的地方获取然后再写入缓存，如果每次都这么操作会导致代码写起来很麻烦。支持 value 为函数的方式来读取缓存。

```js
module.exports = class extends think.Controller {
  // 如果缓存存在，直接读取缓存
  // 如果缓存不存在，则执行 value 函数，然后将返回值设置到缓存中并返回。
  // 如果 value 函数里有异步操作，需要返回 Promise
  async indexAction() {
    const data = await this.cache('name', () => {
      return getDataFromApi();
    });
  }
}
```

#### 设置缓存

```js
module.exports = class extends think.Controller {
  // 设置缓存
  async indexAction() {
     await this.cache('name', 'value');
  }
  // 设置缓存，切换类型
  async index2Action() {
    await this.cache('name', 'value', 'redis');
  }
  // 设置缓存，切换类型
  async index2Action() {
    await this.cache('name', 'value', {
      type: 'redis',
      redis: {
        timeout: 24 * 60 * 60 * 1000
      }
    });
  }
}
```

#### 删除缓存

将缓存值设置为 `null` 为删除缓存。

```js
module.exports = class extends think.Controller {
  // 删除缓存
  async indexAction() {
    await this.cache('name', null);
  }
  // 删除缓存，切换类型
  async index2Action() {
    await this.cache('name', null, 'redis');
  }
}
```

### 缓存 gc

有些缓存容器在设置值的时候可以设置超时时间，如：Memcache、Redis，这样数据会自动过期然后删除。但有些缓存容器是没有自动删除的功能的，如：File、Db 等，这个时候就需要处理缓存过期后的清理。

缓存过期清理添加了 `gcInterval` 配置用来配置清理的时间间隔，最小为一个小时。表示为：一个小时执行一次缓存容器的 `gc` 方法，具体的清理逻辑在缓存的 gc 方法中定义，由 [think-gc](https://github.com/thinkjs/think-gc) 模块负责调度。

### 常见问题

#### 数据可以缓存在 Node.js 的内存中么？

理论上是可以的，但并不建议这么做。当缓存数据量暴涨时会导致内存占用量过大，进而影响用户请求的处理，得不偿失。


## Logger

ThinkJS 通过 [think-logger3](https://npmjs.com/think-logger3) 模块实现了强大的日志功能，并提供适配器扩展，可以很方便的扩展内置的日志模块。系统默认使用 [log4js](https://github.com/nomiddlename/log4js-node) 模块作为底层日志记录模块，具有日志分级、日志分割、多进程等丰富的特性。

### 基本使用

系统已经全局注入了 logger 对象 `think.logger`，其提供了 `debug`, `info`, `warn`, `error` 四种方法来输出日志，日志默认是输出至控制台中。

```javascript
think.logger.debug('debug message');
think.logger.info('info message');
think.logger.warn('warning');
think.logger.error(new Error('error'));
```

### 基本配置

系统默认自带了 `Console`, `File`, `DateFile` 三种适配器。默认是使用 `Console` 将日志输出到控制台中。

#### 文件

如果想要将日志输出到文件，将以下内容追加到 `src/config/adapter.js` 文件中：
```javascript
const path = require('path');
const {File} = require('think-logger3');

exports.logger = {
  type: 'file',
  file: {
    handle: File,
    backups: 10,
    absolute: true,
    maxLogSize: 50 * 1024,  //50M
    filename: path.join(think.ROOT_PATH, 'logs/xx.log')
  }
}

```

该配置表示系统会将日志写入到 `logs/xx.log` 文件中。当该文件超过 `maxLogSize` 值时，会创建一个新的文件 `logs/xx.log.1`。当日志文件数超过 `backups` 值时，旧的日志分块文件会被删除。文件类型目前支持如下参数：

- `filename`：日志文件地址
- `maxLogSize`：单日志文件最大大小，单位为 KB，默认日志没有大小限制。
- `backups`：最大分块地址文件数，默认为 5。
- `absolute`：`filename` 是否为绝对路径地址，如果 `filename` 是绝对路径，`absolute` 的值需要设置为 `true`。
- `layouts`：定义日志输出的格式。

#### 日期文件

如果想要将日志按照日期文件划分的话，将以下内容追加到 `src/config/adapter.js` 文件中：
```javascript
const path = require('path');
const {DateFile} = require('think-logger3');

exports.logger = {
  type: 'dateFile',
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: false,
    filename: path.join(think.ROOT_PATH, 'logs/xx.log')
  }
}

```

该配置会将日志写入到 `logs/xx.log` 文件中。隔天，该文件会被重命名为 `xx.log-2017-07-01`（时间以当前时间为准），然后会创建新的 `logs/xx.log` 文件。时间文件类型支持如下参数：

- `level`：日志等级
- `filename`：日志文件地址
- `absolute`：`filename` 是否为绝对路径地址，如果 `filename` 是绝对路径，`absolute` 的值需要设置为 `true`。
- `pattern`：该参数定义时间格式字符串，新的时间文件会按照该格式格式化后追加到原有的文件名后面。目前支持如下格式化参数：
    - `yyyy` - 四位数年份，也可以使用 `yy` 获取末位两位数年份
    - `MM` - 数字表示的月份，有前导零
    - `dd` - 月份中的第几天，有前导零的2位数字
    - `hh` - 小时，24小时格式，有前导零
    - `mm` - 分钟数，有前导零
    - `ss` - 秒数，有前导零
    - `SSS` - 毫秒数（不建议配置该格式以毫秒级来归类日志）
    - `O` - 当前时区
- `alwaysIncludePattern`：如果 `alwaysIncludePattern` 设置为 `true`，则初始文件直接会被命名为 `xx.log-2017-07-01`，然后隔天会生成 `xx.log-2017-07-02` 的新文件。
- `layout`：定义日志输出的格式。


### Level

日志等级用来表示该日志的级别，目前支持如下级别：

- ALL
- ERROR
- WARN
- INFO
- DEBUG

### Layout

`Console`, `File` 和 `DateFile` 类型都支持 `layout` 参数，表示输出日志的格式，值为对象，下面是一个简单的示例：

```javascript
const path = require('path');
const {File} = require('think-logger3');

module.exports = {
  type: 'file',
  file: {
    handle: File,
    backups: 10,
    absolute: true,
    maxLogSize: 50 * 1024,  //50M
    filename: path.join(think.ROOT_PATH, 'logs/xx.log'),
    layout: {
      type: 'pattern',
      pattern: '%[[%d] [%p]%] - %m',
    }
  }
}
```

默认的 `Console` 的输出格式是 `%[[%d] [%z] [%p]%] - %m`，即 `[时间] [进程ID] [日志等级] - 日志内容`。 目前 layout 支持如下参数：

- `type`：目前支持如下类型
    - basic
    - coloured
    - messagePassThrough
    - dummy
    - pattern
    - 自定义输出类型可参考 [Adding your own layouts](https://nomiddlename.github.io/log4js-node/layouts.html#adding-your-own-layouts)
- `pattern`：输出格式字符串，目前支持如下格式化参数
    - `%r` - `.toLocaleTimeString()` 输出的时间格式，例如 `下午5:13:04`。
    - `%p` - 日志等级
    - `%h` - 机器名称
    - `%m` - 日志内容
    - `%d` - 时间，默认以 ISO8601 规范格式化，可选规范有 `ISO8601`, `ISO8601_WITH_TZ_OFFSET`, `ABSOUTE`, `DATE` 或者任何可支持格式化的字串，例如 `%d{DATE}` 或者 `%d{yyyy/MM/dd-hh.mm.ss}`。
    - `%%` - 输出 `%` 字符串
    - `%n` - 换行
    - `%z` - 从 `process.pid` 中获取的进程 ID
    - `%[` - 颜色块开始区域
    - `%]` - 颜色块结束区域

### 自定义 handle

如果觉得提供的日志输出类型不满足大家的需求，可以自定义日志处理的 `handle`。自定义 handle 需要实现以下几个方法：

```javascript
module.exports = class {
  /**
   * @param {Object}  config  {}  配置传入的参数
   * @param {Boolean} clusterMode true  是否是多进程模式
   */
  constructor(config, clusterMode) {

  }

  debug() {

  }

  info() {

  }

  warn() {

  }

  error() {

  }
}
```



## 多进程

node 中提供了 `cluster` 模块来创建多进程应用，这样可以避免单一进程挂了导致服务异常的情况。框架是通过 [think-cluster](https://github.com/thinkjs/think-cluster) 模块来运行多进程模型的。

### 多进程配置

可以配置 `workers` 指定子进程的数量，默认为 `0`（当前 cpu 的个数）

```js
//src/config/config.js
module.exports = {
  workers: 0 // 可以根据实际情况修改，0 为 cpu 的个数
}
``` 

### 多进程模型

多进程模型下，Master 进程会根据 `workers` 的大小 `fork` 对应数量的 Worker 进程，由 Woker 进程来处理用户的请求。当 Worker 进程异常时会通知 Master 进程 Fork 一个新的 Worker 进程，并让当前 Worker 不再接收用户的请求。

### 进程间通信

多个 Worker 进程之间有时候需要进行通信，交换一些数据。但 Worker 进程之间并不能直接通信，而是需要借助 Master 进程来中转。

框架提供 `think.messenger` 来处理进程之间的通信，目前有下面几种方法：

* `think.messenger.broadcast` 将消息广播到所有 Worker 进程
  
  ```js
  //监听事件  src/bootstrap/worker.js
  think.messenger.on('test', data => {
    //所有进程都会捕获到该事件，包含当前的进程
  });

  // src/controller/xxx.js
  //发送广播事件
  think.messenger.broadcast('test', data);
  ```

* `think.messenger.consume` 任务消费，只在一个进程下执行（有时候系统启动下需要启动一些任务，但只希望任务只会在一个进程下执行一次）

  ```js
  // src/bootstrap/worker.js
  think.messenger.on('consumeEvent', (data) => {
    // 该回调函数只会在一个进程下执行
  });

  //调用事件，只会在一个进程下执行一次
  think.messenger.consume('consumeEvent', data);
  ```

* `think.messenger.map` 执行所有进程下的任务，并返回任务结果集（结果集需要通过 JSON.stringify 在进程间传递，结果集不能太大，如果太大的话可以通过其他的存储传递，如：文件）

  ```js
  // src/bootstrap/worker.js
  think.messenger.on('testMap', (data) => {
    return Math.random();
  });

  // src/controller/xxx.js
  if(xxx) {
    // 获取到所有子进程执行后的返回值，值为数组
    // 执行时只会取注册的第一个事件回调
    const data = await think.messenger.map('testMap', data);
  }
  ```

注：consume 和 map 方法需要 [think-cluster](https://github.com/thinkjs/think-cluster) 的版本 `>=1.4.0`。

### 自定义进程通信

有时候内置的一些通信方式还不能满足所有的需求，这时候可以自定义进程通信。由于 Master 进程执行时调用 `src/bootstrap/master.js`，Worker 进程执行时调用 `src/bootstrap/worker.js`，那么处理进程通信就比较简单。

```js
// src/bootstrap/master.js
const cluster = require('cluster');
cluster.on('message', (worker, message) => {
  // 接收到特定的消息进程处理
  if(message && message.act === 'xxx'){

  }
})

// src/bootstrap/worker.js
process.send({act: 'xxxx', ...args}); //发送数据到 Master 进程

```

### 常见问题

#### 子进程如何通知主进程重启服务？

有时候做一些通用的系统，需要有自动更新的功能（如：博客系统的更新功能），代码更新后，需要重启服务才能使其生效，如果每次都要手工重启服务必然不方便。框架提供了 `think-cluster-reload-workers` 指令让子进程可以通知主进程重启服务，这样就不用手工重启服务了。如：

```js
async upgrade() {
  await downloadCodeFromRemote(); // 从远程下载更新包
  await unzipCode(); // 解压缩代码
  await installDependencies(); // 重新安装依赖，可能有新的依赖
  process.send('think-cluster-reload-workers'); // 给主进程发送重启的指令
}
```

## Babel 转译


由于框架依赖的 Node 最低版本为 `6.0.0`，但这个版本还不支持 `async/await`，所以在项目里使用 `async/await` 时，需要借助 [Babel](https://babeljs.io/) 转译。

Babel 会将 `src/` 目录转译到 `app/` 目录下，并添加对应的 `sourceMap` 文件。

### Babel 转译规则

默认使用的 preset 为 [babel-preset-think-node](https://github.com/thinkjs/babel-preset-think-node)，在入口文件 `development.js` 里引用：

```js
const Application = require('thinkjs');
const babel = require('think-babel');
const watcher = require('think-watcher');
const notifier = require('node-notifier');

const instance = new Application({
  ROOT_PATH: __dirname,
  watcher: watcher,
  transpiler: [babel, {
    presets: ['think-node'] // 默认使用 babel-preset-think-node
  }],
  notifier: notifier.notify.bind(notifier),
  env: 'development'
});

instance.run();

```

babel-preset-think-node 只会转译 [es2015-modules-commonjs](http://babeljs.io/docs/plugins/transform-es2015-modules-commonjs/)、[exponentiation-operator](http://babeljs.io/docs/plugins/transform-exponentiation-operator/)、[trailing-function-commas](http://babeljs.io/docs/plugins/syntax-trailing-function-commas/)、[async-to-generator](http://babeljs.io/docs/plugins/transform-async-to-generator/)、[object-rest-spread](http://babeljs.io/docs/plugins/transform-object-rest-spread/)，如果这些转译不能满足需求的话，可以根据需要自己定制 babel preset。


### 关闭 Babel 转译

如果项目运行的 Node 版本大于 `7.6.0`（推荐使用 8.x.x LTS 版本），那么已经支持 `async/await` 了，就可以关闭 Babel 转译了。

#### 创建项目时关闭转译

创建项目时可以指定 `-w` 参数来关闭 Babel 转译。

```sh
thinkjs new demo -w;
```
这样创建后，运行时不会把 `src/` 转译到 `app/` 目录，直接运行 `src/` 目录下的代码。

#### 删除相关代码关闭转译


已有的项目可以手工删除相关的代码来关闭转译，其实使不使用 Babel 转译，只是入口文件里和模块依赖有一些区别：

* 有 Babel 转译的入口文件（development.js）

    ```js
    const Application = require('thinkjs');
    const babel = require('think-babel');
    const watcher = require('think-watcher');
    const notifier = require('node-notifier');

    const instance = new Application({
      ROOT_PATH: __dirname,
      watcher: watcher, //监听器，监听文件变化
      transpiler: [babel, {  //转译器，这里使用的是 babel，并指定转译参数
        presets: ['think-node']
      }],
      notifier: notifier.notify.bind(notifier), //通知器，当转译报错时如何通知
      env: 'development'
    });

    instance.run();
    ```

* 去除 Babel 转译的入口文件（development.js）

    ```js
    const Application = require('thinkjs');
    const watcher = require('think-watcher');
    const instance = new Application({
      ROOT_PATH: __dirname,
      watcher: watcher,
      env: 'development'
    });

    instance.run();
    ```

对比可以看到，去除 Babel 转译，只是移除了 `transpiler` 和 `notifier` 2 个配置，一个是指定转译器，一个是当转译报错时的通知处理方式，手工删除相关代码和模块依赖即可。

## WebSocket

对于 WebSocket 目前 ThinkJS 支持了 `socket.io`, 并对其进行了一些简单的包装，后续会增加 [socketjs](https://github.com/sockjs/sockjs-node), [ws](https://github.com/websockets/ws) 库的支持。

### 开启 WebSocket

在集群环境中，WebSocket 要求使用粘性会话，来确保给定客户端请求命中相同的 worker，否则其握手机制将无法正常工作。 为了实现这一点，需要开启 `stickyCluster` 配置。

为了保证性能，`stickyCluster` 功能默认是关闭的，项目如果需要开启，可以修改配置文件 `src/config/config.js`：

```js
module.exports = {
  stickyCluster: true,
  // ...
};
```

### 配置 WebSocket

WebSocket 是以 `extend` 的形式集成到 ThinkJS 的，首先要配置 `src/config/extend.js`:

```js
const websocket = require('think-websocket');

module.exports = [
  // ...
  websocket(think.app),
];
```

WebSocket 的各个实现是以 `adapter` 的形式存在的，以 `socket.io` 为例（使用 [think-websocket-socket.io](https://github.com/thinkjs/think-websocket-socket.io) 进行了封装），在 `src/config/adapter.js` 中配置如下：

```js
const socketio = require('think-websocket-socket.io');
exports.websocket = {
  type: 'socketio',
  common: {
    // common config
  },
  socketio: {
    handle: socketio,
    allowOrigin: '127.0.0.1:8360',  // 默认所有的域名都允许访问
    path: '/socket.io',             // 默认 '/socket.io'
    adapter: null,                  // 默认无 adapter
    messages: [{
      open: '/websocket/open',
      addUser: '/websocket/addUser'
    }]
  }
}
```

### 事件到 Action 的映射

以 `socket.io` 为例，ThinkJS 遵循了 `socket.io` 服务端和客户端之间通过事件来交互的机制，这样服务端需要将事件名映射到对应的 Action，才能响应具体的事件。事件的映射关系配置在 `messages` 字段，具体如下：

```js
exports.websocket = {
  // ...
  socketio: {
    // ...
    messages: {
      open: '/websocket/open',       // 建立连接时处理对应到 websocket Controller 下的 open Action
      close: '/websocket/close',     // 关闭连接时处理的 Action
      addUser: '/websocket/addUser', // addUser 事件处理的 Action
    }
  }
}
```

其中 `open` 和 `close` 事件名固定，表示建立连接和断开连接的事件，其他事件均为自定义，项目里可以根据需要添加。

### 服务端 Action 处理

通过配置事件到 Action 的映射后，就可以在对应的 Action 作相应的处理。如：

```js
module.exports = class extends think.Controller {

  constructor(...arg) {
    super(...arg);
  }

  openAction() {
    this.emit('opend', 'This client opened successfully!')
    this.broadcast('joined', 'There is a new client joined successfully!')
  }

  addUserAction() {
    console.log('获取客户端 addUser 事件发送的数据', this.wsData);
    console.log('获取当前 WebSocket 对象', this.websocket);
    console.log('判断当前请求是否是 WebSocket 请求', this.isWebsocket);
  }
}
```

#### emit

Action 里可以通过 `this.emit` 方法给当前 `socket` 发送事件，如：

```js
module.exports = class extends think.Controller {

  constructor(...arg) {
    super(...arg);
  }

  openAction() {
    this.emit('opend', 'This client opened successfully!')
  }
}
```

#### broadcast

Action 里可以通过 `this.broadcast` 方法给所有的 `socket` 广播事件，如：

```js
module.exports = class extends think.Controller {

  constructor(...arg) {
    super(...arg);
  }

  openAction() {
    this.broadcast('joined', 'There is a new client joined successfully!')
  }
}
```

### 客户端示例

客户端示例代码如下：

```
<script src="http://lib.baomitu.com/socket.io/2.0.1/socket.io.js"></script>
<script type="text/javascript">
  var socket = io('http://localhost:8360');

  $('.send').on('click', function(evt) {
    var username = $.trim($('.usernameInput').val());
    if(username) {
      socket.emit('addUser', username);
    }
  });

  socket.on('opend', function(data) {
    console.log('opend:', data);
  });

  socket.on('joined', function(data) {
    console.log('joined:', data);
  });
</script>
```


### socket.io

`socket.io` 对 WebSocket 前后端都有封装，使用起来非常方便。

#### io 对象

在 Action 里可以通过 `this.ctx.req.io` 来获取 `io` 对象，该对象为 socket.io 的一个实例。

io 对象包含的方法参见文档 [https://socket.io/docs/server-api/#server](https://socket.io/docs/server-api/#server)。

#### 设置 path

设置被 socket.io 处理的路径，默认为 `/socket.io`。如果需要修改，可以修改 `src/config/adapter.js` 的配置：

```js
exports.websocket = {
  // ...
  socketio: {
    // ...
    path: '/socket.io',
  }
}
```

[path](https://socket.io/docs/server-api/#server-path-value) 的详细配置参见文档 [https://socket.io/docs/server-api/#server-path-value](https://socket.io/docs/server-api/#server-path-value)，需要注意的是：如果服务端修改了处理的路径后，客户端也要作对应的修改。

#### 设置 allowOrigin

默认情况下 `socket.io` 允许所有域名的访问。如果需要修改，可以修改 `src/config/adapter.js` 的配置：

```js
exports.websocket = {
  // ...
  socketio: {
    // ...
    allowOrigin: '127.0.0.1:8360',
  }
}
```

[allowOrigin](https://socket.io/docs/server-api/#server-origins-value) 的详细配置参见文档 [https://socket.io/docs/server-api/#server-origins-value](https://socket.io/docs/server-api/#server-origins-value)，需要注意的是：如果服务端修改了处理的路径后，客户端也要作对应的修改。

#### 设置 adapter

使用多节点来部署 WebSocket 时，多节点之间可以借助 Redis 进行通信，这时可以设置 adapter 来实现。

```js
const redis = require('socket.io-redis');
exports.websocket = {
  // ...
  socketio: {
    // ...
    adapter: redis,
  }
}
```
[adapter](https://socket.io/docs/server-api/#server-adapter-value) 的详细配置参见文档 [https://socket.io/docs/server-api/#server-adapter-value](https://socket.io/docs/server-api/#server-adapter-value)。


## RESTful API

项目中，经常要提供一个 API 供第三方使用，一个通用的 API 设计规范就是使用 RESTful API，RESTful API 是使用 HTTP 中的请求类型来标识对资源的操作。如：

* `GET /ticket`  获取 ticket 列表
* `GET /ticket/:id` 查看某个具体的 ticket
* `POST /ticket`  新建一个 ticket
* `PUT /ticket/:id` 更新 id 为 12 的 ticket
* `DELETE /ticket/:id` 删除 id 为 12 的 ticekt

### 创建 RESTful Controller

可以通过 `-r` 参数来创建 REST Controller。如：

```
thinkjs controller user -r
```
会创建下面几个文件：
```
create : src/controller/rest.js
create : src/controller/user.js
create : src/logic/user.js
```

其中 `src/controller/user.js` 会继承 `src/controller/rest.js` 类，`rest.js` 是 RESTful Controller 的基类，具体的逻辑可以根据项目情况进行修改。

### 添加自定义路由

RESTful Controller 创建后并不能立即对其访问，需要添加对应的[自定义路由](/doc/3.0/router.html)，修改路由配置文件 `src/config/router.js`，添加如下的配置：

```js
module.exports = [
  [/\/user(?:\/(\d+))?/, 'user?id=:1', 'rest'], // 第一种方式
  ['/user/:id?', '/user', 'rest'], // 第二种方式
  ['/user/:id?', 'rest'], // 第三种方式
]
```
注：第三种方式需要 [think-router](https://github.com/thinkjs/think-router) 的版本 `>=1.0.17`。

上面自定义路由的含义为：

* `/\/user(?:\/(\d+))?/` URL 的正则
* `user?id=:1` 映射后要解析的路由，:1 表示取正则里的 (\d+) 的值
* `rest` 表示为 REST API

通过自定义路由，将 `/user/:id` 相关的请求指定为 REST Controller，然后就可以对其访问了。



* `GET /user` 获取用户列表，执行 `getAction`
* `GET /user/:id` 获取某个用户的详细信息，执行 `getAction`
* `POST /user` 添加一个用户，执行 `postAction`
* `PUT /user/:id` 更新一个用户，执行 `putAction`
* `DELETE /user/:id` 删除一个用户，执行 `deleteAction`

如果有一系列路由都是 RESTful 路由的话，每次都添加自定义路由势必有些麻烦，这时候可以修改一下自定义路由的配置文件，例如：

```js
module.exports = [
  [/\/api\/(\w+)(?:\/(\d+))?/, 'api/:1?id=:2', 'rest']
];
```
这样表示所有以 `/api` 开头的二级路由都会被指定成 RESTful 路由。

### 数据校验

Controller 里的方法执行时并不会对传递过来的数据进行校验，数据校验可以放在 Logic 里处理，文件为 `src/logic/user.js`，具体的 Action 与 Controller 里一一对应。具体的使用方式请见 [Logic](/doc/3.0/logic.html)。

### 子级 RESTful API

有时候有子级 RESTful API，如：某篇文章的评论接口，这时候可以通过下面的自定义路由完成：

```js
module.exports = [
  [/\/post\/(\d+)\/comments(?:\/(\d+))?/, 'comment?postId=:1&id=:2', 'rest']
]
```

这样在对应的 Action 里，可以通过 `this.get("postId")` 来获取文章的 id，然后放在过滤条件里处理即可。

```js
module.exports = class extends think.Controller {
  async getAction() {
    const postId = this.get('postId');
    const commentId = this.get('id');
    const comment = this.model('comment');
    if(commentId) { // 获取单条评论的详细信息
      const data = await comment.where({post_id: postId, id: commentId}).find();
      return this.success(data);
    } else { // 获取单条文章下的评论列表
      const list = await comment.where({post_id: postId}).select();
      return this.success(list);
    }
  }
}
```

### 多版本 RESTful API

有些 REST API 有时候前后不能完全兼容，需要有多个版本，这时候也可以通过自定义路由管理，如：

```js
module.exports = [
  [/\/v1\/user(?:\/(\d+))?/, 'v1/user?id=:1', 'rest'], //v1 版本
  [/\/v2\/user(?:\/(\d+))?/, 'v2/user?id=:1', 'rest']  //v2 版本
]
```

这时候只要在 `src/controller/` 下建立子目录 `v1/` 和 `v2/` 即可，执行时会自动查找，具体见 [多级控制器](/doc/3.0/controller.html#toc-04e)。

### Mongo 的 RESTful API

由于 Mongo 的 id 并不是纯数字的，所以处理 Mongo 的 RESTful API 时只需要修改下对应的正则即可（将 \d 改为 \w）：

```js
module.exports = [
  [/\/user(?:\/(\w+))?/, 'user?id=:1', 'rest']
]
```

### 常见问题

#### 怎么查看 RESTful API 的自定义路由已经生效？

有时候添加 RESTful Controller 和自定义路由后，访问并没有生效，这时候可以通过 `DEBUG=think-router npm start` 启动服务查看解析后的 controller 和 action 看其是否生效，具体请见[怎么查看当前地址解析后的 controller 和 action 分别对应什么？](/doc/3.0/router.html#toc-54f)


## 国际化与本地化

### 概述
国际化与本地化，或者说全球化，其目的是让你的站点支持多个国家和区域。其中国际化是指功能和代码设计能处理多种语言和文化习俗，能够在创建不同语言版本时，不需要重新设计源程序代码。国际化的英文单词是 Internationalization ，简称 I18N。 本地化是将站点按照特定国家、地区或语言市场的需要进行加工，使之满足特定用户对语言和文化的特殊要求。本地化的英文对应Localization，缩写为L10N。举例 Moment，其支持 `setLocale` 方法切换语言就是国际化，每一个 `locale` 的配置文件定义了具体区域时间格式就是本地化。

### think-i18n

[think-i18n](https://github.com/thinkjs/think-i18n) 是 ThinkJS 3.0 国际化方案的实现, 基于 [Jed](https://github.com/messageformat/Jed), [Moment](https://github.com/moment/moment/) 和 [Numeral](https://github.com/adamwdraper/Numeral-js).

### 安装
    npm install think-i18n --save

#### 配置 extends.js


```js
// ThinkJS config/extend.js

const createI18n = require('think-i18n');
const path = require('path');

module.exports = [
  createI18n({
    app: think.app, // 如果为空，__ 就不会被自动 `assign` 到 `think-view` 实例
    i18nFolder: path.resolve(__dirname, '../i18n'),
    localesMapping(locales) {return 'en';}
  })
];

```
[查看完整配置](#完整配置)

#### 配置 locale 文件

 每个 locale 一个文件，放在 i18nFolter 目录下。

- **dateFormat** 会应用到 moment.local(localeId, dateFormat); 如果不提供配置，默认使用 en
- **numeralFormat** 会应用到 numeral.locales[localeId] = numeralFormat; 如果不提供配置，默认使用 cn
- **translation** 相当于 [Jed](https://github.com/messageformat/Jed) 里面的 locale_data, 如果你是使用 po 文件管理翻译，jed 推荐使用 [po2json](https://www.npmjs.com/package/po2json)。

[查看配置详情](https://github.com/thinkjs/think-i18n/blob/master/i18n_example/en.js)


#### Controller 和 View (nunjucks)

#####  Controller

如果需要再controller 里面获取 I18n 的实例或者当前的 locale，可以调用

```js
    async indexAction(){
      const __ = this.getI18n(/*forceLocale*/));
      const locale = this.getLocale();
    }
```

#####  View

如果使用了 [think-view](https://github.com/thinkjs/think-view) 模块并配置了 app 参数， think-i18n 会自动调用注入一个实例到当前模板实例里，类似： this.assign('__', this.getI18n()), 这样在模板里面就可以使用直接使用 i18n 暴露的接口。

```js

{{ __('some key') }}
{{ __.jed.dgettext('domain', 'some key') }}
{{ __.moment().format('llll') }}
{{ __.numeral(1000).format('currency') }}numberFormat.formats)

```

#### 完整配置
- **app：think.app**
  如果配置了此参数，则会监听 viewInit 事件并把 i18n 实例注入到模板的 __ 参数里面。
- **i18nFolder:string**
  放置配置文件的目录
- **localesMapping:function(locales){return localeId;}**
  从一个可能的 locale 数组，返回唯一一个 localeId。比如 header['accept-language'].split(',') 可以得到一个locale 的数组，我们可以写一些逻辑并返回最终我们想要的 localeId。
- **getLocale**
  如果为空，默认逻辑是从 http 头的 accept-language 里面获取，并用 ',' 分割开。
  如果希望从 url 的 query 字段获取，设置为 {by: 'query', name: '字段名'}.
  如果希望从 cookie 里面的某个字段获取， 设置为 {by: 'cookie', name: '字段名'}
  也可以根据 controller.ctx 实现自己的逻辑, function([ctx](https://github.com/koajs/koa/blob/master/docs/api/context.md)) {return locale;}

- **debugLocale**
  用来调试某个 localeId

- **jedOptions**
  是一个对象，可以在里面配置 **domain** 和 **missing_key_callback**，具体请参考 [jed options 文档](http://messageformat.github.io/Jed/).

  默认的值是 {}, 最终用来实例化 jed 的 options 如下：

``` js
   Object.assign(jedOptions, {locale_data: <your locale translation>})
```

#### 背后的思考
- 你可能会觉得这个方案太复杂，但是 i18n 本来就很复杂，要想实现的好，你可能需要的只会更多。
- 既然基于 moment 和 numeral，为什么不直接使用它们自带的 i18n 配置？这里为的是配置的透明和可控制性，你可以灵活的组合在某一个 locale 下，分别使用什么样语言翻译，时间格式和数字格式。比如有一个在中国的购物网站，希望提供英文的翻译方便老外使用，但是货币数字和时间的格式仍然使用中国的标准。参考下面的配置：

```javascript
  // locale setting of en-CH.js
  module.exports = {
    localeId: 'en_CH',
    translation: require('../english.po.json'),
    dateFormat: require('../moment/en.json'),
    numeralFormat: require('../numeral/en.json')
  };
```
其中 `../moment/en.json` 是一个json，格式参考 moment 的i18n文件，一模一样。

其中 `../numeral/en.json` 是一个json，格式参考 numeral， 需要指出的是，额外的你可以在 numeral 的配置里面设置自定义的格式，并且这个是跟着locale走的，这个实现是个小小的黑魔法，但是对于 i18n 的最佳实践非常重要。

``` js
  {
    localeId: cn,
    ...
    formats: [{name: 'currency', format: '000.00$'}]
  }
```


### 最佳实践

总是使用自定义的格式，这样就可以通过配置定制不用locale下有不同的输出格式。同时也方便后期的维护，比如某天我们需要把所有长日期显示修改格式，不用到每个文件里面取修改，只需要改配置就好，相当于一层抽象。

  - 使用 **__.moment().format('llll')** 而不是 moment().format('YYYY-MM-dd HH:mm').
  - 使用 **__.numeral(value).format('customFormat')** 而不是 numeral(value).format('00.00$'), [Numeral](https://github.com/adamwdraper/Numeral-js) 是不支持对每个 locale 自定义格式的，类库里面通过额外的代码支持了这个功能（具体可以看源码），配置方式参考 locale.numeralFormat.formats。


### 注
如果定义了 **en** locale， 会覆盖 [Numeral](https://github.com/adamwdraper/Numeral-js) 默认的配置。

### 调试某个 locale
  默认情况下，是通过读取 header['accept-language'] 的值，然后通过 localesMapping 转换后作为某一时刻采纳的 locale。如果需要调试，在 view 配置里面设置 **debugLocal** = <locale>


# 扩展功能

## 多模块项目

一般的项目我们推荐使用单模块项目，如果项目较为复杂的话，可以使用[多级控制器](/doc/3.0/controller.html#toc-04e)来按功能划分。如果这些还不能满足项目复杂度的需求，那么可以创建多模块项目。

创建项目时可以指定 `--mode=module` 参数创建多模块项目。

```sh
thinkjs new demo --mode=module
```

### 项目结构

项目结构跟单模块项目结构上有一些差别：

* `src/common` 存放一些公共的代码
* `src/home` 默认的模块
* `src/xxx` 按照功能添加模块

## 线上部署

代码开发、测试完成后，需要部署到线上机器部署然后提供服务。

### 代码转译

如果项目中的代码是需要转译的，虽然在开发环境时会实时将 `src/` 目录转译到 `app/` 目录，但代码上线时建议执行 `npm run compile` 命令重新转译一下，避免一些意外的影响。或者在一个干净的目录拉取最新的代码，然后执行转译的命令。

如果修改了 [babel preset](/doc/3.0/babel.html#toc-2cb)，那么需要把 package.json 里的 compile 命令（babel src/ --presets think-node --out-dir app/）作对应的修改。

如果代码不需要转译，那么直接上线 `src/` 目录的代码即可。

### 生产环境

项目创建时，会自动在项目根目录下创建一个名为 `production.js` 的文件，该文件为生产环境运行的入口文件，定义的 `env` 为 `production`。切不可在生产环境把 `development.js` 作为入口文件来启动服务。

### 服务管理

#### PM2

PM2 是一款专业管理 Node.js 服务的模块，建议在线上使用。使用 PM2 需要以全局的方式安装，如： 
```
sudo npm install -g pm2
```
安装完成后，命令行下会有 `pm2` 命令。

创建项目时，会在项目目录下创建名为 `pm2.json` 的配置文件，内容类似如下：

```json
{
  "apps": [{
    "name": "demo",
    "script": "production.js",
    "cwd": "/Users/welefen/Develop/git/thinkjs/demo",
    "max_memory_restart": "1G",
    "autorestart": true,
    "node_args": [],
    "args": [],
    "env": {}
  }]
}
```
将 `name` 字段改为项目名，`cwd` 字段改为线上项目的具体路径。

##### 项目启动

可以在项目根目录下执行 `pm2 start pm2.json` 来启动项目，执行完成后会显示如下的信息：

![](https://p5.ssl.qhimg.com/t011347d36ca082a2e4.jpg)

##### 项目重启

由于 Node.js 是自身启动服务运行的，所以当有代码更新后，需要重启服务才能让其生效。

最简单的办法可以通过 `pm2 restart pm2.json` 重启服务，但这种方式会导致服务临时性的中断（重启服务需要时间，重启过程中会导致无法处理用户的请求从而导致服务中断）。如果不想服务中断，那么可以通过发送信号的方式来重启方式，具体命令为：

```
pm2 sendSignal SIGUSR2 pm2.json
```
通过发送 `SIGUSR2` 信号，pm2 会将这个信号派发给框架，框架主进程捕获到这个信号后，会 fork 一个新的子进程提供服务，然后逐渐将之前的子进程重启，从而达到不中断服务重启的目的。

##### cluster 模式

框架会强制使用 cluster，然后使用 master/worker 的方式提供服务，所以就不能开启 `pm2` 中的 cluster 模式（如果开启，那么启动服务会直接报错退出）。

#### 手动管理进程

##### 项目启动

如果生产环境不想使用 PM2 来管理服务，那么可以手工通过脚本来管理，可以先在项目根目录下执行 `node production.js` 启动服务。

当访问服务没问题后，可以通过 `nohup node production.js &` 启动服务，通过 `nohup` 和 `&` 将服务在后台运行，执行后会看到类似下面的日志：

```
$ nohup node production.js &
[2] 1114
appending output to nohup.out
``` 

看到输出后，回车，执行 `exit` 命令退出当前终端，这样服务就在后台运行了。

启动完成后，可以通过 `ps aux | grep node` 查看具体的 node 进程情况：

```text
welefen           3971   0.0  0.3  3106048  46244 s001  S+   11:14AM   0:00.65 /usr/local/bin/node /Users/welefen/demo/production.js
welefen           3970   0.0  0.3  3106048  46064 s001  S+   11:14AM   0:00.64 /usr/local/bin/node /Users/welefen/demo/production.js
welefen           3969   0.0  0.3  3106040  46248 s001  S+   11:14AM   0:00.65 /usr/local/bin/node /Users/welefen/demo/production.js
welefen           3968   0.0  0.3  3106048  46400 s001  S+   11:14AM   0:00.65 /usr/local/bin/node /Users/welefen/demo/production.js
welefen           3967   0.0  0.3  3106048  46608 s001  S+   11:14AM   0:00.65 /usr/local/bin/node /Users/welefen/demo/production.js
welefen           3966   0.0  0.3  3106048  46432 s001  S+   11:14AM   0:00.65 /usr/local/bin/node /Users/welefen/demo/production.js
welefen           3965   0.0  0.3  3106040  46828 s001  S+   11:14AM   0:00.65 /usr/local/bin/node /Users/welefen/demo/production.js
welefen           3964   0.0  0.3  3106048  46440 s001  S+   11:14AM   0:00.64 /usr/local/bin/node /Users/welefen/demo/production.js
welefen           3963   0.0  0.2  3135796  40960 s001  S+   11:14AM   0:00.31 node production.js
```

其中前面几个为 fork 出来的子进程，最后一个为主进程。

##### 重启服务

当代码修改后，需要重启服务，最简单的办法就是找到主进程的 pid，然后通过 `kill -9 PID` 杀死进程然后重新启动。如果不想中断服务，那么可以给主进程发送 `SIGUSR2` 信号来完成：

```
kill -s USR2 PID
```

比如上面打印出来的日志中主进程的 pid 为 3963，那么可以通过 `kill -s USR2 3963` 来无中断重启服务。当然每次这么执行比较麻烦，可以包装成一个简单的脚本来执行。

```sh
#!/bin/sh
cd PROJECT_PATH; # 进入项目根目录
nodepid=`ps auxww | grep node | grep production.js | grep -v grep | awk '{print $2}' `
if [ -z "$nodepid" ]; then
    echo 'node service is not running'
    nohup node production.js > ~/file.log 2>&1 & 
else
    echo 'node service is running'
    kill -s USR2 $nodepid 2>/dev/null
    echo 'gracefull restart'
fi
```

### 使用 nginx

虽然 Node.js 自身可以直接创建 HTTP(S) 服务，但生产环境不建议直接把 Node 服务可以对外直接访问，而是在前面用 WebServer（如：nginx） 来挡一层，这样有多个好处：

* 可以更好做负载均衡，比如：同一个项目，启动多个端口的服务，用 nginx 做负载
* 静态资源使用 nginx 直接提供服务性能更高
* HTTPS 服务用 nginx 提供性能更高

创建项目时，会在项目根目录下创建了一个名为 `nginx.conf` 的配置文件：

```
server {
    listen 80;
    server_name example.com www.example.com;
    root /Users/welefen/Downloads/demo/www;
    set $node_port 8360;

    index index.js index.html index.htm;
    if ( -f $request_filename/index.html ){
        rewrite (.*) $1/index.html break;
    }
    if ( !-f $request_filename ){
        rewrite (.*) /index.js;
    }
    location = /index.js {
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass http://127.0.0.1:$node_port$request_uri;
        proxy_redirect off;
    }

    location ~ /static/ {
        etag         on;
        expires      max;
    }
}
```

项目中需要将 `server_name`、`root`、`port` 字段值根据实际情况配置，然后将配置文件软链到 nginx 的配置文件目录下，最后重启 nginx 服务即可（可以通过 `nginx -s reload` 重新加载配置文件）。

--------

如果还是想直接通过 Node.js 提供服务，也是可以的，可以直接监听 80 或者 443 的端口（部分环境下需要 `sudo` 执行才能监听这二个端口）。

### HTTPS

现代网站强制建议使用 HTTPS 访问，这样可以提供网站内容的安全性，避免内容被监听、篡改等问题。如果不愿意支付证书的费用，可以使用 [Let's Encrypt](https://letsencrypt.org/) 提供的免费 SSL/TLS 证书，可以参见文章 [Let's Encrypt，免费好用的 HTTPS 证书](https://imququ.com/post/letsencrypt-certificate.html)。

### 常见问题

#### 为什么上线后静态资源访问不了？

创建项目时，会自动生成中间件配置 `src/config/middleware.js`（多模块项目文件为 `src/common/config/middleware.js`），里面有个 resource 中间件用来处理静态资源的请求，但这个中间件默认只在开发环境下开启的，线上环境是关闭的，所以会看到上线后静态资源访问不了的情况。

线上环境静态资源请求推荐用 nginx 来处理，这样性能会更高，对 Node 服务的压力也会小一些。如果非要框架处理静态资源请求，那么可以把 `src/config/middleware.js` 里的配置打开即可。

```js
module.exports = [
  ...
  {
    handle: 'resource',
    enable: true // 始终开启，默认为 `enable: isDev` 表示只再开发环境下开启
  },
  ...
]
```

## Crontab / 定时任务

项目在线上运行时，经常要定时去执行某个功能（如：定时去远程拉取一些数据、定时计算数据库里的一些数据进行汇总），这时候就需要使用定时任务来处理了。

框架提供了二种方式执行定时任务，一种是在当前启动的子进程中执行，另一种是用一个新的进程执行（命令行执行）。

### 当前子进程中执行

有些定时任务是拉取一些数据放在内存中，供用户请求过程中使用，这种定时任务就希望在当前进程中调用（由于框架启动服务时是多进程架构，所以定时任务只会在子进程中执行，不会在主进程中执行），该功能是通过 [think-crontab](https://github.com/thinkjs/think-crontab) 模块来完成的。

#### 配置

定时任务的配置文件为 `src/config/crontab.js`（多模块项目下配置文件为 `src/common/config/crontab.js`，也支持在每个模块下配置定时任务文件 `src/[module]/config/crontab.js`），配置项为一个数组。如：

```javascript
module.exports = [{
  interval: '10s',
  immediate: true,
  handle: () => {
    //do something
  }
}, {
  cron: '0 */1 * * *',
  handle: 'crontab/test',
  worker: 'all'
}]
```

每个配置项支持的参数如下：

* `interval` {String | Number} 执行的时间间隔

  支持数字和字符串二种格式，单位是毫秒。如果是字符串，那么会用 [think.ms](/doc/3.0/think.html#toc-35a) 方法解析为数字。
* `cron` {String} crontab 的格式，如 `0 */1 * * *`

  crontab 格式，具体见 <http://crontab.org/>。如果配置了 `interval` 属性，那么会忽略该属性。
* `worker` {String} 任务执行方式, *one* 或者 *all*, 默认是 *one*

  任务会在哪些子进程中执行，默认只在一个子进程中执行，`all` 为在所有子进程中执行。即使配置了一个子进程中执行，也只能保证一个机器下在一个子进程中执行，多台机器下还是会执行多次。如果跨机房、跨机器只希望执行一次，那么可以通过 `enable` 参数控制或者命令行执行来完成。
* `handle` {Function | String} 执行任务,执行相应函数或者是路由地址，如：`crontab/test`
  
  定时任务的执行方法，可以是一个具体的执行函数，也可以是一个路由地址（会根据路由解析，然后执行对应的 Action）。
* `immediate` {Boolean} 是否立即执行，默认是 `false`

  定时任务是否立即执行一次。
* `enable` {Boolean} 是否开启，默认是 `true`

  定时任务是否开启，设置为 `false` 则关闭该条定时任务规则。比如：多机器下只希望在一台机器下执行，那么可以通过机器名来判断：

  ```js
  const hostname = require('os').hostname();
  module.exports = [{
    interval: '10s',
    enable: hostname === 'host name',
    handle: () => {
      //do something
    }
  }]
  ```

#### 调试

如果想看到定时任务是否在成功运行，可以通过 `DEBUG=think-crontab npm start` 启动项目查看打印的调试信息。

### 命令行执行

如果有些定时任务跨机房、跨机器只希望执行一次，或者定时任务比较耗时，那么可以通过命令行来执行。命令行执行需要结合系统的 crontab 任务来完成。

命令行执行直接通过自动脚本和路由地址即可，如：`node production.js crontab/test`，其中 `crontab/test` 为路由地址，这样结合系统的 crontab 就可以定时执行了。

通过命令 `crontab -e` 来编辑定时任务，如：

```sh
0 */1 * * * /bin/sh (cd projectpath; node production.js crontab/test) # 1 小时执行一次
```

### 常见问题

#### 如何限制 Action 只能定时任务调用？

默认情况下，Action 不会限制哪些情况下才允许访问，这样定时任务对应的 Action 也可以通过输入 URL 来访问。但有时候我们并不希望这样，这时候可以通过 `this.isCli` 判断来阻止。如：

```js
module.exports = class extends think.Controller {
  testAction() {
    // 如果不是定时任务调用，则拒绝
    if(!this.isCli) return this.fail(1000, 'deny');
    ...
  }
}
```
定时任务执行 Action 时并不是一个正常的用户请求，而是通过模拟一个请求来完成的，模拟时会将请求类型修改为 `CLI`，`isCli` 就是通过判断请求类型是否为 `CLI` 来完成的。
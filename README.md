# RunnerGo-FE

> RunnerGo项目的前端部分, 基于React框架设计实现

## 本地使用

```shell
    # 克隆代码
    git clone https://github.com/Runner-Go-Team/RunnerGo-fe-open.git
    # 切换目录
    cd runnergo-fe-open
    # 下载依赖
    npm install
    # 启动开发环境项目
    npm start
```

## 相关配置

### 文件存储

如果想使用上传头像、上传场景内的csv、text文件等功能, 有两种选择

1. 阿里云OSS服务

在根目录的config文件夹中的oss文件中

`config/oss.js`

```js
export const OSS_Config = {
    region: 'Your Region',
    accessKeyId: 'Your AccessKeyId',
    accessKeySecret: 'Your AccessKeySecret',
    bucket: 'Your Bucket',
}
```

2. 使用文件本地存储的服务

在本项目开源总目录下有一个file-server服务, 部署运行一下, 然后在config目录里配置以下内容

`config/base.js`

```js
// 是否使用OSS服务做文件存储, 若使用将值设为true,  若不使用, 设为false, 会走另外一个文件本地存储服务filer-server的逻辑
export const USE_OSS = false;
```

`config/server.js`

```js
// 后端文件存储地址
export const RD_FileURL = 'file-server服务的地址';
```

### 配置服务地址

#### config/client

**主要用于存储cookie**

```js
    const FE_Host = {
        development: '',
        test: '测试环境主域',
        production: '线上环境主域',
    };
```

#### config/server

**http接口**

```js
    const RD_BaseURL = {
        development: '开发环境地址',
        test: '测试环境地址',
        production: '线上环境地址',
    };
```

**websocket接口**

```js
    const RD_websocketUrl = {
        development: '开发环境地址',
        test: '测试环境地址',
        production: '线上环境地址'
    };
```

**后台权限系统地址(主要用于工作台和后台的跳转)**

```js
    const RD_AdminURL = {
        development: '后台开发环境地址',
        test: '后台测试环境地址',
        production: '后台线上环境地址',
    };
```


## 技术栈

- react, 基于react 17.0.2 版本进行开发
- react-flow, 实现场景内API节点块的拖拉拽和连线等操作
- react-dnd, 实现接口管理、场景管理等目录区的拖拽排序等操作
- monaco-editor, 实现request、response等实现代码编写
- less, 基于css预处理less实现css的管理与编写
- arco-design, 基于字节开源组件库实现部分组件编写
- adesign-react, 基于apipost开源组件库实现部分组件编写
- react-i18next, 实现多语言切换


# RunnerGo-FE

> RunnerGo项目的前端部分, 基于React框架设计实现

## 本地使用

```shell
    # 克隆代码
    git clone https://github.com/Runner-Go-Team/RunnerGo-fe-open.git
    # 切换目录
    cd RunnerGo-fe-open
    # 下载依赖
    npm install
    # 启动开发环境项目
    npm start
```

## 相关配置

### OSS

如果想使用上传头像、上传场景内的csv、text文件等功能, 需要配置阿里云OSS服务

在根目录的config文件夹中的oss文件中

```js
export const OSS_Config = {
    region: 'Your Region',
    accessKeyId: 'Your AccessKeyId',
    accessKeySecret: 'Your AccessKeySecret',
    bucket: 'Your Bucket',
}
```

### 配置后端服务地址

在根目录的config文件夹中的server文件中

```js
    const RD_BaseURL = {
        development: '开发环境地址',
        test: '测试环境地址',
        production: '线上环境地址',
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


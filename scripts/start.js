const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.config');

const devConfig = {
    entry: path.resolve(__dirname, '../src/pages/index.jsx'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name]-[contenthash:8].js',
        publicPath: '/',
    },
    mode: 'development',
    optimization: {
        splitChunks: {
            chunks: 'async', // 2. 处理的 chunk 类型
            minSize: 20000, // 4. 允许新拆出 chunk 的最小体积
            minRemainingSize: 0,
            minChunks: 1, // 5. 拆分前被 chunk 公用的最小次数
            maxAsyncRequests: 30, // 7. 每个异步加载模块最多能被拆分的数量
            maxInitialRequests: 30, // 6. 每个入口和它的同步依赖最多能被拆分的数量
            enforceSizeThreshold: 50000, // 8. 强制执行拆分的体积阈值并忽略其他限制
            cacheGroups: { // 1. 缓存组
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/, // 1.1 模块路径/文件名匹配正则
                    priority: -10, // 1.2 缓存组权重
                    reuseExistingChunk: true, // 1.3 复用已被拆出的依赖模块，而不是继续包含在该组一起生成
                },
                default: {
                    minChunks: 2, // 5. default 组的模块必须至少被 2 个 chunk 共用 (本次分割前) 
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, '../dist'),
        },
        historyApiFallback: false,
        hot: true,
        proxy: {
            '/': {
                bypass(req, res, proxyOptions) {
                    if (req.headers.accept?.indexOf('html') !== -1) {
                        return '/index.html';
                    }
                },
            }
        }
    },
    devtool: 'eval-source-map',
    plugins: [
        new HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{ from: path.resolve(__dirname, '../public'), to: '../dist' }],
        }),
        new HtmlWebpackPlugin({
            title: 'RunnerGo-接口压力测试工具',
            filename: path.resolve(__dirname, '../dist/index.html'),
            template: path.resolve(__dirname, '../src/index.html')
        })
    ],
};

module.exports = merge(common, devConfig);
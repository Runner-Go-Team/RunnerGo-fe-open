const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.config');

const webpackConfig = {
    entry: {
        index: path.resolve(__dirname, '../src/pages/index.jsx'),
        vendors: ['react', 'classnames'],
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name]-[contenthash:8].js',
        publicPath: '/',
    },
    mode: 'production',
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'initial',
                },
            },
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'RunnerGo-接口压力测试工具',
            filename: path.resolve(__dirname, '../dist/index.html'),
            template: path.resolve(__dirname, '../src/index.html')
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: path.resolve(__dirname, '../public'), to: '../dist' }],
        }),
    ],
};

module.exports = merge(webpackConfig, common);

const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    module: {
        rules: [
            {
                use: 'babel-loader',
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
            },
            {
                use: ['style-loader', 'css-loader', 'less-loader'],
                test: /\.(css|less)$/,
            },
            {
                use: ['@svgr/webpack'],
                test: /\.svg$/,
            },
            {
                type: 'asset',
                test: /\.(png|jpg|jpeg|gif)$/i,
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        }),
        new NodePolyfillPlugin(),
        // new BundleAnalyzerPlugin()
    ],
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.ts', '.tsx', '.ico', '.less', '.css', '.svg'],
        alias: {
            '@assets': path.resolve(__dirname, '../src/assets'),
            '@pages': path.resolve(__dirname, '../src/pages'),
            '@constants': path.resolve(__dirname, '../src/constants'),
            '@components': path.resolve(__dirname, '../src/components'),
            '@config': path.resolve(__dirname, '../config'),
            '@utils': path.resolve(__dirname, '../src/utils'),
            '@rxUtils': path.resolve(__dirname, '../src/rxUtils'),
            '@hooks': path.resolve(__dirname, '../src/pages/hooks'),
            '@services': path.resolve(__dirname, '../src/services'),
            '@asyncTasks': path.resolve(__dirname, '../src/asyncTasks'),
            '@busLogics': path.resolve(__dirname, '../src/busLogics'),
            '@modals': path.resolve(__dirname, '../src/modals'),
        }
    },
    performance: {
        hints: false
    }
}
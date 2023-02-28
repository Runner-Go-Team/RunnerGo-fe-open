module.exports = {
    presets: [
        ['@babel/preset-env',
            { targets: "> 1% in AU and not dead", shippedProposals: true }
        ],
        [
            '@babel/preset-react',
            {
                runtime: 'automatic',
            },
        ],
    ],
    plugins: ['@babel/plugin-transform-runtime'],
};

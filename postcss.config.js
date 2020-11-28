module.exports = {
    plugins: {
        autoprefixer: {
            browsers: ['Android >= 4.1', 'iOS >= 8', "Chrome > 31",
                "ff > 31",
                "ie >= 8"
            ],
            grid: true
        },
        'postcss-pxtorem': {
            rootValue: 37.5,
            propList: ['*'],
        },
    },
};
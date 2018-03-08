const tsImportPluginFactory = require('ts-import-plugin')
const { getLoader } = require("react-app-rewired");
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
    const tsLoader = getLoader(
        config.module.rules,
        rule =>
            rule.loader &&
            typeof rule.loader === 'string' &&
            rule.loader.includes('ts-loader')
    );

    tsLoader.options = {
        getCustomTransformers: () => ({
            before: [tsImportPluginFactory({
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true,
            })]
        })
    };

    /**主题切换 */
    config = rewireLess.withLoaderOptions({
        modifyVars: {
            "@primary-color": "#1DA57A",
            '@icon-url': '"../../../../../compileLibs/iconfont/iconfont"'
        },
    })(config, env);

    if (env === 'production') {
        config.devtool = false;// 禁止输出sourcemap
    }
    
    // console.log(env)
    // console.log(config.module.rules)

    return config;
}
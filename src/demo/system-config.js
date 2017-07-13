
System.config({
    baseURL: '../..',
    transpiler: 'plugin-babel',

    meta: {
        '*.js': {
            presets: ['es2017']
        },
        '../../node_modules/bootstrap/dist/js/bootstrap.js': {
            format: 'global',
            deps: ['jquery'],
            presets: ['es2017']
        }
    },
    map: {
        'jquery': 'node_modules/jquery/dist/jquery.js',
        'plugin-babel': 'node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': 'node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',

        'react': 'node_modules/react/dist/react.js',
        'vue': 'node_modules/vue/dist/vue.min.js',
        'react-dom': 'node_modules/react-dom/dist/react-dom.js',

        'react-lite': 'node_modules/react-lite/dist/react-lite.min.js',
        'preact': 'node_modules/preact/dist/preact.js',

        'inferno': 'node_modules/inferno/dist/inferno.min.js',
        'inferno-component': 'node_modules/inferno-component/dist/inferno-component.min.js',
        'inferno-create-element': 'node_modules/inferno-create-element/dist/inferno-create-element.min.js',

        'js-spec': 'node_modules/js-spec/dist/js-spec.min.js',

        'js-surface': 'node_modules/js-surface/dist/standalone.js',
        'js-prelude': 'node_modules/js-prelude/dist/js-prelude/js-prelude.min.js',
    }
});

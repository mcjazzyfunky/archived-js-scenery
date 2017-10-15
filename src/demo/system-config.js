System.config({
    baseURL: '../..',
    transpiler: 'plugin-babel',
    
    packages: {
        '': {
            defaultExtension: 'js'
        }
    },

    meta: {
        '*.js': {
            presets: ['es2017']
        },
        'node_modules/jquery/dist/jquery.js': {
            format: 'global',
            exports: 'jQuery'
        },
        './3rd-party/kendo-ui/kendo.all.min.js': {
            format: 'global',
            deps: ['jquery']
        },
        '../../node_modules/bootstrap/dist/js/bootstrap.js': {
            format: 'global',
            deps: ['jquery'],
            presets: ['es2017']
        },
        'js-surface': {
            //deps: ['js-spec', 'preact']
            deps: ['js-spec', 'react', 'react-dom', 'preact', 'inferno', 'inferno-component', 'inferno-create-element']
        }
    },

    map: {
        'jquery': 'node_modules/jquery/dist/jquery.js',
        'plugin-babel': 'node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': 'node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',

        'react': 'node_modules/react/umd/react.production.min.js',
        'react-dom': 'node_modules/react-dom/umd/react-dom.production.min.js',
        'vue': 'node_modules/vue/dist/vue.min.js',

        'react-lite': 'node_modules/react-lite/dist/react-lite.min.js',
        'preact': 'node_modules/preact/dist/preact.js',

        'inferno': 'node_modules/inferno/dist/inferno.min.js',
        'inferno-component': 'node_modules/inferno-component/dist/inferno-component.min.js',
        'inferno-create-element': 'node_modules/inferno-create-element/dist/inferno-create-element.min.js',

        'js-spec': 'node_modules/js-spec/dist/js-spec.min.js',

        'js-surface': 'node_modules/js-surface/src/main/js-surface-inferno.js',
        //'js-surface': 'node_modules/js-surface/dist/inferno.js',
        //'js-surface': 'node_modules/js-surface/dist/react.js',
        'js-essential': 'node_modules/js-essential/dist/js-essential/js-essential.js'
    }
});

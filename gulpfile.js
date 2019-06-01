const path = require('path');
const fs = require('fs');
var gulp = require('gulp');

var webpack = require('webpack');
const webpackStream = require('webpack-stream');
const nodeExternals = require('webpack-node-externals');
var gls = require('gulp-live-server');
var browserSync = require('browser-sync').create();
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

var server = null;

const mode = process.env.NODE_ENV || 'development';
const dev = mode === 'development';
const prod = mode === 'production';

const commonModulejs = {
    rules: [
        /*
        {
            test: /\.(jpe?g|png|gif|svg)$/i,
            use: [
              'url-loader?limit=10000',
              'img-loader'
            ]
        },
        {
            test:/\.css$/,
            use:['style-loader','css-loader']
        },
        {
            test: /\.(ttf|eot|woff|woff2)$/,
            loader: "file-loader",
            options: {
              name: "fonts/[name].[ext]",
            },
        },
        {
            test: /\.scss$/,
            loaders: ['style-loader', 'raw-loader', 'sass-loader']
        },
        */
        /*
        {
            test: /\.js$/,
            include: [
                path.resolve(__dirname, 'src')
            ],
            loader: 'babel-loader',
            options: {
                //cacheDirectory: true,
                //babelrc: false,
                //presets: [['env', { targets: { browsers: ['last 2 versions'] } }]]
            },
        },
        */
        {
            test: /\.svelte$/,
            exclude: /node_modules/,
            use: {
                loader: 'svelte-loader',
                options: {
                    dev,
                    hydratable: true,
                    hotReload: false
                }
            }
        },
        {
            test: /\.css$/,
            use: [
                // MiniCssExtractPlugin doesn't support HMR.
                // For developing, use 'style-loader' instead.
                prod ? MiniCssExtractPlugin.loader : 'style-loader',
                'css-loader'
            ]
        },
        
    ]
}

const commonModule = {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    //presets: ['babel-preset-env'],
                },
            },
        },
    ],
};

/* FRONT-END CONFIG */
var frontWebpackConfig = {
    mode: mode,
    //mode: 'production',
    entry: ['./src/main.js'],
    resolve: {
        //alias: {},
        //extensions: ['*', '.js', '.mjs', '.svelte', '.json']
        extensions: ['.mjs', '.js', '.svelte']
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    //watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/
    },
    module: commonModulejs,//1910
    plugins: [
        //dev && new webpack.HotModuleReplacementPlugin(),
        
        new webpack.DefinePlugin({
            'process.browser': true,
            //'process.env.NODE_ENV': '"production"'
            'process.env.NODE_ENV': JSON.stringify(dev)
        }),
        
        new MiniCssExtractPlugin({
			filename: '[name].css'
		})
    ].filter(Boolean),
    devtool: prod ? false: 'source-map'
    
};

/* BACK-END CONFIG */
var backWebpackConfig = {
    mode: "development",
    target : 'node',
    entry: "./server.js",
    output: {
        path: path.resolve(__dirname, "./"),
        filename: "backend.js"
    },
    //watch:true,
    watchOptions : {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/
    },
    plugins: [
    ],
    module : commonModule,
    target: 'node',
    externals: [nodeExternals()],
}

function frontend_build(){
    return gulp.src(['./src/main.js'])
        .pipe(webpackStream(frontWebpackConfig), webpack)
        .pipe(gulp.dest('./public/'));
}

function backend_build(){
    return gulp.src('./server.js')
        .pipe(webpackStream(backWebpackConfig), webpack)
        .pipe(gulp.dest('./'));
}

function serve(done){
    //var server = gls.new('main.js');
    if (server == null){
        server = gls.new('./backend.js');
    }
    server.start();
    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch(['./public/bundle.js'], function (file) {
        //console.log("files change???");
        if (server != null){
            server.notify.apply(server, [file]);
            server.start.bind(server)();
        }
        browserSync.reload();
        file();
    });

    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch(['public/**/*.*'], function (file) {
        //console.log("files change?");
        if (server != null){
            server.notify.apply(server, [file]);
            server.start.bind(server)();
        }
        browserSync.reload();
        file();
    });
    // Note: try wrapping in a function if getting an error like `TypeError: Bad argument at TypeError (native) at ChildProcess.spawn`
    gulp.watch('./backend.js', function(donew) {
        server.start.bind(server)();
        donew();
    });

    return done();
}

function watch(done) {
    gulp.watch(['./main.js','./src/server/**/*.*'], backend_build);
    gulp.watch(['./src/client/**/*.*'], frontend_build);
    return done();
}

function browser_sync(done){
    browserSync.init({
        proxy: "localhost:8080"
        ,files:['pulbic/**/*.*']
        //,browser: 'chrome'
        //,browser: 'firefox'
    });
    return done();
}

exports.frontend_build = frontend_build;
exports.backend_build = backend_build;
exports.serve = serve;
exports.watch = watch;
exports.browser_sync = browser_sync;

const build = gulp.series(frontend_build, backend_build, watch, serve, browser_sync);
//const build = gulp.series( backend_build, watch, serve, browser_sync);

/*
 * Export a default task
 */
exports.default  = build;












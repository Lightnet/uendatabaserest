const path = require('path');
//const fs = require('fs');
var gulp = require('gulp');
var clean = require('gulp-clean');
var rename = require('gulp-rename');

var webpack = require('webpack');
const webpackStream = require('webpack-stream');
const nodeExternals = require('webpack-node-externals');
//var rollup = require('gulp-better-rollup')
var nodemon = require('gulp-nodemon');

const svelte = require('rollup-plugin-svelte');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const rollup = require('gulp-better-rollup');

//var gls = require('gulp-live-server');
var browserSync = require('browser-sync').create();
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//var server = gls.new('./backend.js');
//var server = gls.new('./backend.js', {env: {NODE_ENV: 'development'},livereload:false});

const mode = process.env.NODE_ENV || 'development';
const dev = mode === 'development';
const prod = mode === 'production';

//const timeout = ms => new Promise(res => setTimeout(res, ms));

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
                    //dev,
                    //hydratable: true,
                    //hotReload: false
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
    //devtool: prod ? false: 'source-map'
    
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

async function frontend_build(){
    //await timeout(5000);
    return gulp.src(['./src/main.js'])
        .pipe(webpackStream(frontWebpackConfig))
        //.pipe(webpackStream(frontWebpackConfig), webpack)
        .pipe(gulp.dest('./public/'));
}
//===============================================
// Rollup
//===============================================
var rollupconfig = {
    //input: 'src/main.js',
    plugins: [
        svelte({
			//dev: !mode,
			css: css => {
				css.write('public/bundle.css');
			}
        }),
        resolve(),
		commonjs(),
    ]
}

function rollupbuild(){
    return gulp.src('src/client/main.js')
    .pipe(rollup(rollupconfig, 'umd'))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('public/'));
}
//===============================================
//
//===============================================
function backend_build(){
    return gulp.src('./server.js')
        //.pipe(webpackStream(backWebpackConfig))
        .pipe(webpackStream(backWebpackConfig), webpack)
        .pipe(gulp.dest('./'));
}

async function cleanbundle(done){
    return gulp.src(['public/bundle.js','public/bundle.js.map'], {read: false, allowEmpty:true})
        .pipe(clean());
    //await timeout(5000);
    //return done();
}

var started = false;

function serve(cb){
    //return gulp.pipe(server.start());
    //server.start()
    //return done();

    return nodemon({
		script: 'backend.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});
}

function reload(cb){
    //return gulp.pipe(server.start.bind(server)())
        //.pipe(browserSync.reload());
    //await timeout(1000)
    console.log("reload...");
    //server.start.bind(server)();
    //await timeout(2000);
    //browserSync.reload();
    //await timeout(2000);
    //return cb();
    //var started = false;
	
	return nodemon({
		script: 'backend.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});
}

function refreshbrowser(cb){
    browserSync.reload();
    return cb();
}

function watch(done) {
    gulp.watch(['./server.js','./src/server/**/*.*'], gulp.series(backend_build));
    //gulp.watch(['./src/**/*.*'], gulp.series( cleanbundle, frontend_build));
    gulp.watch(['./src/client/**/*.*'], gulp.series( cleanbundle, rollupbuild, refreshbrowser));

    //use gulp.watch to trigger server actions(notify, start or stop)
    //gulp.watch(['./public/bundle.js'], (donesub)=> {
        //console.log("bundle change?");
        //server.start.bind(server)();
        //browserSync.reload();
        //donesub();
    //});

    // Note: try wrapping in a function if getting an error like `TypeError: Bad argument at TypeError (native) at ChildProcess.spawn`
    //gulp.watch('./backend.js', (donew)=> {
        //server.start.bind(server)();
        //donew();
    //});
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

exports.cleanbundle = cleanbundle;
exports.rollupbuild = rollupbuild;
exports.frontend_build = frontend_build;
exports.backend_build = backend_build;
exports.serve = serve;
exports.reload = reload;
exports.refreshbrowser = refreshbrowser;

exports.watch = watch;
exports.browser_sync = browser_sync;

const build = gulp.series(rollupbuild, backend_build, watch, serve, browser_sync);

const buildserver = gulp.series( backend_build, watch, serve);
exports.buildserver = buildserver;

/*
 * Export a default task
 */
exports.default = build;












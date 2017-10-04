const path = require("path")
const webpack = require("webpack") 
let CircularDependencyPlugin = require('circular-dependency-plugin')

if (process.env.NODE_ENV === "production") {
    plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
            },
            output: {
                comments: false,
            }
        })
    )
}

module.exports = {  
        entry:  "./src/app.js",
        output: { 
            filename: "public/app.js"
        },
        devtool:  "source-map",
        plugins: [
            new CircularDependencyPlugin({
                // exclude detection of files based on a RegExp
                exclude: /a\.js|node_modules/,
                // add errors to webpack instead of warnings
                failOnError: true
            }),
            ...plugins
        ],
        module: {
            rules: [
                {
                    test: /\.js$/, 
                    use: [
                        {
                            loader: "babel-loader"
                        }
                    ]
                }
            ]
        },
        resolve: {
            modules: [
                path.resolve("./src"),
                path.resolve("./node_modules")
            ]
        }
    } 

const path = require("path")
const webpack = require("webpack")  
const plugins = []

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
        plugins,
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
                path.resolve("./node_modules"),
                path.resolve("./resources")
            ],
            alias: {
                babylonjs$: process.env.NODE_ENV === "production" ? path.resolve("./resources/babylon.custom") : "babylonjs"
            } 
        }
    } 

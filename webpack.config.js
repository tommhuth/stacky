const path = require("path")
const webpack = require("webpack") 
let CircularDependencyPlugin = require('circular-dependency-plugin')

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
            })
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

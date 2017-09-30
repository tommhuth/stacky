const path = require("path")
const webpack = require("webpack") 

module.exports = {  
        entry:  "./src/app.js",
        output: { 
            filename: "public/app.js"
        },
        devtool:  "source-map",
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

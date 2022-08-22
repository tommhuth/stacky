const webpack = require("webpack")
const path = require("path")
const { nanoid } = require("nanoid")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WebpackPwaManifest = require("webpack-pwa-manifest")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const { InjectManifest } = require("workbox-webpack-plugin")
const { browserslist } = require("./package.json")
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default

module.exports = (env, options) => {
    const revision = nanoid()
    const plugins = [
        new webpack.DefinePlugin({
            "process.env.REGISTER_SERVICEWORKER": JSON.stringify(process.env.REGISTER_SERVICEWORKER),
            "process.env.BUILD_TIME": JSON.stringify(new Date().toISOString())
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:6].css"
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "assets/views", "index.html"),
            filename: "index.html",
            rev: revision
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(__dirname, "assets", "splashscreens"),
                    to: "splashscreens/[name]." + revision + ".[ext]"
                },
            ]
        }),
        new WebpackPwaManifest({
            name: "Stacky",
            short_name: "Stacky",
            background_color: "rgb(22, 26, 28)",
            theme_color: "rgb(22, 26, 28)",
            orientation: "portrait",
            start_url: "/",
            display: "fullscreen",
            inject: true,
            ios: {
                "apple-mobile-web-app-status-bar-style": "black-translucent"
            },
            filename: "./manifest-[contenthash:6].json",
            icons: [
                {
                    src: path.join("assets", "icons/pwa-icon.png"),
                    destination: "images",
                    sizes: [192, 512]
                },
                {
                    src: path.join("assets", "icons/pwa-icon.png"),
                    destination: "images",
                    ios: true,
                    sizes: [120, 180]
                }
            ]
        }),
        new HTMLInlineCSSWebpackPlugin()
    ]

    if (!options.watch) {
        plugins.push(new InjectManifest({
            swSrc: "./src/serviceworker.js",
            swDest: "serviceworker.js",
            exclude: ["serviceworker.js"],
        }))
    }

    return {
        entry: { app: "./src/root.js" },
        output: {
            path: path.resolve(__dirname, "public"),
            filename: "[name].bundle.[contenthash:6].js",
            publicPath: "/"
        },
        stats: {
            hash: false,
            version: false,
            timings: false,
            children: false,
            cached: false,
            errors: true,
            assetsSpace: 1,
        },
        module: {
            rules: [
                {
                    test: /\.glsl$/,
                    loader: "webpack-glsl-loader"
                },
                { test: /\.json$/, loader: "json" },
                {
                    test: /\.js$/,
                    exclude: /node_modules\/(?!(@huth)\/).*/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env", {
                                        targets: {
                                            browsers: browserslist
                                        }
                                    }
                                ]
                            ]
                        },
                    },
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: false,
                                postcssOptions: {
                                    path: "postcss.config.js"
                                }
                            }
                        },
                        "sass-loader"
                    ]
                }
            ]
        },
        resolve: {
            extensions: [".js"]
        },
        plugins,
    }
}

const webpack = require("webpack")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WebpackPwaManifest = require("webpack-pwa-manifest")
const uuid = require("uuid")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const { InjectManifest } = require("workbox-webpack-plugin")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")

let plugins = [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
        "process.env.REGISTER_SERVICEWORKER": JSON.stringify(process.env.REGISTER_SERVICEWORKER)
    }),
    new MiniCssExtractPlugin({
        filename: "css/[name].[hash:6].css"
    }),
    new HtmlWebpackPlugin({
        template: path.join(__dirname, "assets/views", "index.html"),
        filename: "index.html"
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
        filename: "./manifest-[hash:6].json",
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
    new InjectManifest({
        swSrc: "./src/serviceworker.js",
        swDest: "serviceworker.js",
        exclude: ["serviceworker.js", "index.html"],
        templatedURLs: {
            "/": uuid.v4()
        }
    }),
    //new BundleAnalyzerPlugin()
]

module.exports = {
    entry: { app: "./src/app.js" },
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "[name].bundle.[hash:6].js",
        publicPath: "/"
    },
    stats: {
        hash: false,
        version: false,
        timings: false,
        children: false,
        errors: true,
    },
    module: {
        rules: [
            { test: /\.json$/, loader: "json" },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "fonts/"
                    }
                }]
            },
        ]
    },
    resolve: {
        extensions: [".js"]
    },
    plugins,
}

// entry output module plugins resolve devtool devserver optimization externals

var path = require("path")
var glob = require("glob")
var fs = require("fs")
var HtmlWebpackPlugin = require("html-webpack-plugin")

var entries = glob.sync("src/views/**/script.js")
var entry = {}
var tailLength = "/script.js".length
var htmlPlugins = []
entries.forEach(function(item) {
    var reg = /src\/views\//
    var ret = reg.exec(item)
    var key = item.substr(ret[0].length)
    var newkey = key.substr(0, key.length - tailLength)
    var pathArr = newkey.split("/")
    var paths = ""
    var filename = ""
    if(pathArr.length <= 1) {
        paths = pathArr[0] + "/" + "scripts/script"
        filename = pathArr[0] + ".html"
    }else {
        pathArr.forEach(function(items, index) {
            if(index != pathArr.length - 1) {
                paths += items + "/"
                filename += items + "/"
            }else {
                paths += "scripts/" + items
                filename += items + ".html"
            }
        })
    }
    entry[paths] = path.join(__dirname, "..", item)
    var newitem = item.replace("script.js", "index.html")
    htmlPlugins.push(new HtmlWebpackPlugin({
        template: fs.readFileSync(path.join(__dirname, "..", newitem)).toString(),
        filename: filename,
        chunks: ["scripts/vendor", "scripts/manifest", "scripts/common", paths]
    }))
})

var output = {
    path: path.join(__dirname, "..", "dist"),
    filename: process.env.NODE_ENV == "development" ? "[name].js" : "[name].[chunkhash:8].js",
    publicPath: process.env.NODE_ENV == "development" ? process.env.DEV_PUBLIC_PATH : process.env.PROD_PUBLIC_PATH
}

var moduleOption = {
    rules: [
        {
            test: /\.html$/,
            loader: "html-loader"
        },
        {
            test: /\.js$/,
            loader: "babel-loader",
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            
        }
    ]
}
const express = require("express")
const serveStatic = require("serve-static")
const path = require("path")
const compression = require("compression")
const { version } = require("./package.json")

const PORT = process.env.PORT || "3000"
const NODE_ENV = process.env.NODE_ENV || "local"
const USE_CACHE_BUST = !process.env.NO_CACHE_BUST === "true" && NODE_ENV === "production"

const app = express()

app.use(compression())
app.use(serveStatic(path.join(__dirname, "public"), { maxAge: USE_CACHE_BUST ? "1 year" : 0 }))
app.set("views", path.join(__dirname, "public"))
app.set("view engine", "pug")

app.locals.cacheBuster = function (path) {
    if (NODE_ENV !== "production") {
        return path
    }

    return `${path}?=v${version}`
}

app.get("/", (req, res) => {
    res.render("index")
})

app.listen(PORT, () => {
    console.log(`[${NODE_ENV}] Server ready @ ${PORT}`)
})
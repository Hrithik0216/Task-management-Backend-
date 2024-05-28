const express = require("express")
const app = express()
const port = 8080
const router = require("./Routes/taskRoutes")
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use("/tasks", router)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
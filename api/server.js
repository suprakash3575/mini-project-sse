const express = require('express')
var routes = require('./routes')
const app = express()
const port = 3000
const cors = require('cors')


// parse requests of content-type: application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/', routes);

app.listen(port, '127.0.0.1', () => {
  console.log(`Example app listening at ${port}`)
})
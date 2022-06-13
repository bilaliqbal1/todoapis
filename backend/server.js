const http = require('http');
const app = require('./app');
//server port 
const port = process.env.PORT || 5000;

// const server = http.createServer(app);
// console.log(process.env);
// server.listen(port)
app.listen(port, () => console.log("server started"))
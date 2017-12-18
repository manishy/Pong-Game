const http = require("http");
let fs = require("fs");

const contentType = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".jpg": "img/jpg",
  ".pdf": "text/pdf",
  ".gif": "img/gif",
  ".jpeg": "img/jpeg"
}

const getExtension = function(url) {
  let indexOfExtension = url.lastIndexOf(".");
  let extension = url.slice(indexOfExtension);
  return extension;
}

const setExtension = function(res, url) {
  let header = contentType[getExtension(url)];
  res.setHeader("content-Type", header);
}

const requestHandler = function(req, res) {
  let url = req.url;
  if (url == "/") {
    url = "/index.html";
  }
  if (fs.existsSync("." + url)) {
    setExtension(res, url);
    contentToSend = fs.readFileSync("." + url);
    res.write(contentToSend);
  } else {
    res.write("<html><h1>page not found</h1></html>");
    res.statusCode = 404;
  }
  res.end();
};

const PORT = 8080;
const server = http.createServer(requestHandler);
server.listen(PORT);
console.log(`server is running...${PORT}`);

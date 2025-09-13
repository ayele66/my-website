const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";
const PUBLIC = path.join(__dirname, "public");

function sendFile(res, file) {
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    const ext = path.extname(file).toLowerCase();
    const mime = {".html":"text/html",".css":"text/css",".js":"application/javascript"}[ext] || "application/octet-stream";
    res.writeHead(200, {"Content-Type": mime});
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  let p = req.url.split("?")[0];
  if (p === "/") p = "/index.html";
  const file = path.join(PUBLIC, decodeURIComponent(p));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.stat(file, (err, st) => {
    if (!err && st.isFile()) return sendFile(res, file);
    if ((req.headers.accept || "").includes("text/html")) return sendFile(res, path.join(PUBLIC, "index.html"));
    res.writeHead(404); res.end("Not found");
  });
});

server.listen(PORT, HOST, () => console.log(`Listening on ${HOST}:${PORT}`));

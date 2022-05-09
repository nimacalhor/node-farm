const fs = require("fs")
const http = require("http");
const url = require("url")

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{{productName}}/g, product.productName);
    output = output.replace(/{{image}}/g, product.image);
    output = output.replace(/{{price}}/g, product.price);
    output = output.replace(/{{from}}/g, product.from);
    output = output.replace(/{{nutrients}}/g, product.nutrients);
    output = output.replace(/{{quantity}}/g, product.quantity);
    output = output.replace(/{{description}}/g, product.description);
    output = output.replace(/{{id}}/g, product.id);

    if (!product.organic) output = output.replace(/{{not-organic}}/g, 'not-organic');
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template.overview.html`, "utf-8")
const tempCard = fs.readFileSync(`${__dirname}/templates/template.card.html`, "utf-8")
const tempProduct = fs.readFileSync(`${__dirname}/templates/template.product.html`, "utf-8")

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")
const dataArr = JSON.parse(data);

const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true)
    switch (pathname) {
        case "/api": {
            res.writeHead(200, { "Content-type": "application/json" })
            res.end(data)
        } break;

        // overview ______________________________
        case "/overview" || "/": {
            res.writeHead(200, { "Content-type": "text/html" })
            const cardsHtml = dataArr.map(el => replaceTemplate(tempCard, el)).join("");
            const output = tempOverview.replace(/{{productCards}}/, cardsHtml)
            res.end(output)
        } break;

        // product ______________________________
        case "/product": {
            res.writeHead(200, { "Content-type": "text/html" })
            const productObj = dataArr[query.id]
            const output = replaceTemplate(tempProduct, productObj)
            res.end(output)
        } break;
        default: {
            res.writeHead(404);
            res.end("page not found")
        }
    }
});

server.listen(8000, "127.0.0.1", () => console.log("listening..."))
exports.hello = hello;

function hello(req, res, next){

    console.log(req.body);
    res.end("hello world");
}
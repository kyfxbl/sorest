exports.load = load;

function load(app){

    app.use("/svc/demo", function(req, res, next){

        console.log("demo middleware");
        next();
    });
}
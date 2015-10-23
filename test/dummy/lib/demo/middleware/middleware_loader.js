exports.load = load;

function load(app){

    app.use("/demo", function(req, res, next){

        console.log("demo middleware");
        next();
    });
}
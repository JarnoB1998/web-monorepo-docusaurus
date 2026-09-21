import express, {type Express} from "express";

const app : Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function parse(name: string, value: any) {
    if (typeof value !== "string") {
        throw new Error("Query parameter " + name + " is a mandatory field");
    }
    let number: number = parseInt(value);
    if (isNaN(number)) {
        throw new Error("Query parameter " + name + " is not a number");
    }
    return number;
}

app.get("/sum", (req, res) => {
    try {
        let a : number = parse("a", req.query.a);
        let b : number = parse("b", req.query.b);
        res.json({
            result: a + b
        });
    } catch (e : any) {
        res.status(400).send(e.message);
    }
});

app.post("/sum", (req, res) => {
    try {
        let a: number = parse("a", req.body.a);
        let b: number = parse("b", req.body.b);
        res.json({
            result: a + b
        });
    } catch (e: any) {
        res.status(400).send(e.message);
    }
});

export default app;
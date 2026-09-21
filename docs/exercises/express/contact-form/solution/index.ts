import express, { type Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("port", process.env.PORT || 3000);

app.get("/contact", (req, res) => {
    res.render("contact", {
        success: undefined,
        error: undefined,
        firstname: "",
        lastname: "",
        email: "",
        message: ""
    });
});

function assertNotEmpty(value: string, errorMessage: string) {
    if (value === "") {
        throw new Error(errorMessage);
    }
}

function assertTrue(value: boolean, errorMessage: string) {
    if (!value) {
        throw new Error(errorMessage);
    }
}

app.post("/contact", (req, res) => {
    let agree: boolean = req.body.agree === "agree";
    let firstname: string = req.body.firstname;
    let lastname: string = req.body.lastname;
    let email: string = req.body.email;
    let message: string = req.body.message;

    try {
        assertTrue(agree, "You must agree to the terms and conditions");
        assertNotEmpty(firstname, "First name cannot be empty!");
        assertNotEmpty(lastname, "Last name cannot be empty!");
        assertNotEmpty(email, "Email cannot be empty!");
        assertNotEmpty(message, "Message cannot be empty!");

        res.render("contact", {
            success: `Thank you for contacting us, ${firstname}! We will get back to you on the following email: ${email}`,
            error: undefined,
            firstname: "",
            lastname: "",
            email: "",
            message: ""
        });
    } catch (e: any) {
        res.render("contact", {
            success: undefined,
            error: e.message,
            firstname: firstname,
            lastname: lastname,
            email: email,
            message: message
        });
    
    } 
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});
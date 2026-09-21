import express, { type Express } from "express";
import path from "path";

const app: Express = express();

app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    const agree: boolean = req.body.agree === "agree";
    const firstname: string = req.body.firstname ?? "";
    const lastname: string = req.body.lastname ?? "";
    const email: string = req.body.email ?? "";
    const message: string = req.body.message ?? "";

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
            firstname,
            lastname,
            email,
            message
        });
    }
});

export default app;

const express = require("express")
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
const dotenv = require("dotenv")

const app = express();
dotenv.config();

const port = process.env.PORT || 3000

const username = process.env.USER_NAME;
const password = process.env.USER_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.ysaj1te.mongodb.net/registrationFormMongoDB`, {
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
});
//registration schema
const registrationschema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,

});
//model of regitration shema
const Registration = mongoose.model("Registration", registrationschema);
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());



//get the html file
app.get("/", (req, res) => {

    res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Registration.findOne({ email: email })
        if (!existingUser) {
            const regitrationdata = new Registration({
                name,
                email,
                password

            });
            await regitrationdata.save();
            res.redirect("/success")
        }
        else {
            console.log("User already exist")
            res.redirect("/error")

        }

    }

    catch (error) {
        console.log(error);

        res.redirect("error")

    }

})
app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
})

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
})















app.listen(port, () => {

    console.log(`server is running on port ${port}`);

})
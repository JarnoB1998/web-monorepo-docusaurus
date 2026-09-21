import express, { type Express } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));
app.set('views', path.join(import.meta.dirname, "views"));

app.set("port", process.env.PORT || 3000);

const WORDS = ["water", "bread", "frenzy","tower", "creepy", "donkey", "fruit", "bloom", "music", "pause", "sport", "market", "floor", "walking","prize", "chant", "swoop", "quill", "plume", "crisp", "sweep", "grace"];

let randomWord = "water";

app.get("/words", (req, res) => {
    
});

app.get("/guess", (req, res) => {
   
});

app.get("/restart", (req, res) => {
    
});

app.get("/", (req, res) => {
    res.render("index", {
    })
});

function createNewWord() {
}

function checkWord(guess: string, target: string): string[] {  
    guess = guess.toUpperCase();
    target = target.toUpperCase();
    let result = ['X', 'X', 'X', 'X', 'X']; // Initially set all to 'X' for gray
    let targetCopy = target.split('');
  
    // First pass for correct positions (Green)
    for (let i = 0; i < 5; i++) {
      if (guess[i] === target[i]) {
        result[i] = 'G'; // Green for correct position
        targetCopy[i] = '_'; // Mark as used
      }
    }
  
    // Second pass for correct letters in the wrong position (Yellow)
    for (let i = 0; i < 5; i++) {
      if (result[i] !== 'G' && targetCopy.includes(guess[i])) {
        result[i] = 'Y'; // Yellow for correct letter in wrong position
        targetCopy[targetCopy.indexOf(guess[i])] = '_'; // Mark as used
      }
    }

    return result.map(value => value === 'X' ? 'gray' : value === 'G' ? 'green' : 'yellow');
}

app.listen(app.get("port"), () => {
    createNewWord();
    console.log("Server started on http://localhost:" + app.get('port'));
});
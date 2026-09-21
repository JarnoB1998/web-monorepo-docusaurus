import express, { type Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { getFiveLetterWords, getRandomWord, toUpperCase } from "./words.ts";

// #### Possible Words API

// - [ ] Bij het opstarten van de web server moet de `WORDS` array gevuld worden met de woorden uit de API. Deze bevat een lijst van woorden die mogelijk geraden kunnen worden. Gebruik hiervoor een fetch op https://raw.githubusercontent.com/similonap/word-guess-api/main/words.json
// - [ ] Pas de code aan van de `guess` POST route zodat deze de `WORDS` array gebruikt om te controleren of het woord in deze lijst staat. Geef een foutmelding als het woord niet in de lijst staat. WIOHR is een voorbeeld van een woord dat niet in de lijst staat. KRUID is een voorbeeld van een woord dat wel in de lijst staat.
// - [ ] Pas de `/words` route aan zodat hij alleen de eerste 40 woorden van de WORDS array toont.
// - [ ] Voeg een query parameter `q` toe aan de `/words` route. Als deze aanwezig is toon je enkel de woorden die deze query parameter bevatten. (bv. /words?q=hello)
// - [ ] Sorteer de woorden alfabetisch. Als je de query parameter `direction` meegeeft kan je de sorteer richting bepalen (asc of desc).
// - [ ] Voorzie een form op de `words.ejs` pagina die de gebruiker toelaat om te zoeken naar woorden. (GET request)


dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));
app.set('views', path.join(import.meta.dirname, "views"));

app.set("port", process.env.PORT || 3000);

let WORDS = ["water", "bread", "frenzy","tower", "creepy", "donkey", "fruit", "bloom", "music", "pause", "sport", "market", "floor", "walking","prize", "chant", "swoop", "quill", "plume", "crisp", "sweep", "grace"];

let randomWord = "water";

app.get("/words", (req, res) => {
    let words : string[] = toUpperCase(WORDS);
    let q = (typeof req.query.q === "string") ? req.query.q : "";
    let sortDirection = (typeof req.query.sortDirection === "string") ? req.query.sortDirection : "asc";

    // words.sort((a, b) => {
    //     return 0.5 - Math.random();
    // });

    if (q) {
        words = words.filter(word => word.includes(q));
    }

    words.sort((a,b) => {
        if (sortDirection === "asc") {
            return a.localeCompare(b);
        } else {
            return b.localeCompare(a);
        }  
    });

    res.render("words", {
        words: words.slice(0,40),
        sortDirection: sortDirection,
        q: q
    });
});

app.get("/guess", (req, res) => {
    console.log(randomWord);
    res.render("guess", {
        guess: "",
        colors: [],
        error: "",
        success: ""
    });
});

app.get("/restart", (req, res) => {
    createNewWord();
    res.redirect("/guess");
});

app.post("/guess", (req, res) => {
    let guess : string = req.body.guess.toUpperCase();

    if (WORDS.indexOf(guess.toLowerCase()) === -1) {
        res.render("guess", {
            guess: "",
            colors: [],
            error: "The word is not in the list of possible words.",
            success: ""
        });
        return;
    }
    
    if (guess.length === 5) {
        let colors : string[] = checkWord(guess, randomWord);
        let allMatch : boolean = true;
        for (let color of colors) {
            if (color !== "green") {
                allMatch = false;
                break;
            }
        }
        res.render("guess", {
            guess: guess,
            colors: colors,
            error: "",
            success: allMatch ? "Congratulations! You guessed the word." : ""
        });
    } else {
        res.render("guess", {
            guess: "",
            colors: [],
            error: "You must enter a 5-letter word.",
            success: ""
        });
    
    }
});

app.get("/", (req, res) => {
    res.render("index", {
    })
});

function createNewWord() {
    randomWord = getRandomWord(getFiveLetterWords(WORDS));
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

app.listen(app.get("port"), async() => {
    let response = await fetch("https://raw.githubusercontent.com/similonap/word-guess-api/main/words.json");
    WORDS = await response.json();

    createNewWord();
    console.log("Server started on http://localhost:" + app.get('port'));
});
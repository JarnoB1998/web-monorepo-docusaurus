# Middleware

Middleware is een functie die toegang heeft tot de request en response objecten. Middleware kan de request en response objecten aanpassen, of de request doorsturen naar de volgende middleware functie in de stack. Je kan dus bijvoorbeeld een functie schrijven die wordt uitgevoerd voordat de request naar de route wordt gestuurd.

Je hebt al een aantal keer middleware gebruikt. Telkens je de `app.use()` functie gebruikt, voeg je middleware toe aan de stack. Je hebt bijvoorbeeld de `express.static()` functie gebruikt om statische bestanden te serveren. Deze functie is een middleware functie.

## Eigen middleware functie

### Logging voorbeeld

Wil je bijvoorbeeld een functie schrijven die een request logt voor elke request die binnenkomt? Dan kan je de volgende functie schrijven:

```typescript
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.get("/", (req, res) => {
    res.render("index");
})
```

Vergeet niet om de `next()` functie aan te roepen. Anders zal de request niet naar de volgende middleware functie in de stack gaan en zal deze request ook niet naar de route gaan.

import InteractiveMiddleware from '@site/src/components/InteractiveMiddleware';

<InteractiveMiddleware />

### Locals voorbeeld

Soms is het handig om bepaalde variabelen beschikbaar te maken in alle views. Je kan deze variabelen toevoegen aan de `res.locals` object. Deze variabelen zijn dan beschikbaar in alle views. Zo moet je niet elke keer dezelfde variabelen doorgeven aan de `render()` functie. Je moet deze dan wel toevoegen aan de `res.locals` object in een middleware functie.

```typescript
app.use((req, res, next) => {
    res.locals.title = "My website";
    next();
});

app.get("/", (req, res) => {
    res.render("index");
})
```

Je kan nu in de `index.ejs` view de `title` variabele gebruiken zonder deze mee te geven aan de render functie.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><%= title %></title>
</head>
<body>
    <h1><%= title %></h1>
</body>
</html>
```

Je zou eventueel ook een `user` object kunnen toevoegen aan de `res.locals` object. Zo kan je in alle views de `user` variabele gebruiken. Je kan deze variabele dan bijvoorbeeld gebruiken om te bepalen of de gebruiker is ingelogd of niet.


### Security token voorbeeld

Stel dat je een API hebt waarbij je een security token moet meesturen met elke request. Je kan dan een middleware functie schrijven die de security token controleert. Als de security token niet klopt, dan kan je een error terugsturen. Als de security token wel klopt, dan kan je de request doorsturen naar de volgende middleware functie in de stack. We zullen de authorization header gebruiken om de security token mee te sturen.

```typescript
app.use((req, res, next) => {
    const token = req.headers.authorization;
    if (token !== "my-secret-token") {
        res.status(401).send("Unauthorized");
    } else {
        next();
    }
});

app.get("/", (req, res) => {
    res.send("Hello world");
})
```

Hij zal hier dus eerst de security token controleren. Als de security token niet klopt, dan zal hij een 401 status code terugsturen met de tekst "Unauthorized". Als de security token wel klopt, dan zal hij de request doorsturen naar de volgende middleware functie in de stack. In dit geval is dat de route. Hij zal dus "Hello world" terugsturen. Alle andere routes zullen ook de security token controleren.

### Aparte middleware functie

Je kan ook een aparte middleware functie schrijven en deze dan toevoegen aan de stack. Dit is handig als je een complexe middleware functie hebt. Je kan dan de middleware functie in een apart bestand schrijven en deze dan toevoegen aan de stack.

We zullen een apart bestand maken voor de middleware functie. We zullen een bestand maken met de naam `verifyAuthToken.ts` in de `middleware` directory. Dit bestand zal er als volgt uitzien:

```typescript
import type { Request, Response, NextFunction } from "express";

export const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (token !== "my-secret-token") {
        res.status(401).send("Unauthorized");
    } else {
        next();
    }
}
```

en dan kunnen we deze middleware functie toevoegen aan de stack:

```typescript
import { verifyAuthToken } from "./middleware/verifyAuthToken";

app.use(verifyAuthToken);
```

### Voorbeeld EJS Utility Middleware

Een voorbeeld van een middleware functie die utility functies toevoegd aan de `res` object is de volgende:

```typescript
import type { Request, Response, NextFunction } from "express";

export function ejsUtility(req: Request, res: Response, next: NextFunction) {
    res.locals.formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
    }
    res.locals.formatCurrency = (amount: number) => {
        return amount.toLocaleString("nl-NL", { style: "currency", currency: "EUR" });
    }
    res.locals.random = (from: number, to: number) => {
        return Math.floor(Math.random() * (to - from) + from);
    }
    next();
}
```

en dan kan je deze middleware functie toevoegen aan de stack:

```typescript
import { ejsUtility } from "./middleware/ejsUtility";

app.use(ejsUtility);
```

In dit voorbeeld voegen we een aantal utility functies toe aan de `res.locals` object. Deze functies zijn dan beschikbaar in alle views. Je kan dan bijvoorbeeld de `formatDate` functie gebruiken om een datum te formatteren. Je kan de `formatCurrency` functie gebruiken om een bedrag te formatteren als een valuta. Je kan de `random` functie gebruiken om een willekeurig getal te genereren tussen twee getallen.

```
<%= formatDate(new Date()) %>
<%= formatCurrency(100) %>
<%= random(100,500) %>
```

### Error handling

We hadden al gezien dat we 404 pagina"s kunnen maken aan de hand van de volgende code:

```typescript
app.use((req, res, next) => {
    res.status(404).render("error", { message: "Page not found" });
});
```

Eigenlijk is dit ook een middleware functie. Deze middleware functie zal worden uitgevoerd als geen enkele route de request afhandelt. Hij zal dan een 404 status code terugsturen met de tekst "Page not found".

Je kan ook een middleware functie schrijven die errors afhandelt. Deze middleware functie moet 4 parameters hebben. De eerste parameter is de error, de tweede parameter is de request, de derde parameter is de response en de vierde parameter is de `next` functie. Als je een error hebt, dan kan je de `next` functie aanroepen met de error als parameter. De error zal dan worden afgehandeld door de error handling middleware functie.

We kunnen een nieuw bestand maken met de naam `handleError.ts` in de `middleware` directory. Dit bestand zal er als volgt uitzien:

```typescript
import type { Request, Response, NextFunction } from "express";

export const handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).render("error",
        {
            message: err.message,
            message: err.stack
        }
});
```

en dan kunnen we deze middleware functie toevoegen aan de stack:

```typescript
import { handleError } from "./middleware/handleError";

app.use(handleError);
```

In dit voorbeeld zal de error handling middleware functie de error afhandelen. Omdat dit een onafgehandelde error is, zal de error handling middleware functie worden uitgevoerd. Hij zal dan een 500 status code terugsturen en een error pagina renderen met de error message en de error stack.

De error pagina kan er als volgt uitzien:

```html
<h1><%= message %></h1>
<pre>
    <%= stack %>
</pre>
```

### Middleware functies per route

Je kan ook middleware functies toevoegen aan een specifieke route. Je kan dan ook een extra middleware functie toevoegen aan de route. Deze middleware functie zal dan eerst worden uitgevoerd voordat de route wordt uitgevoerd.

```typescript
const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.ip} ${req.method} ${req.path}`);
    next();
}

app.get("/", loggingMiddleware, (req, res) => {
    res.render("index");
});

app.get("/admin", (req, res) => {
    res.render("admin");
});
```

In het bovenstaande voorbeeld zal de `loggingMiddleware` functie alleen worden uitgevoerd voor de "/" route. De "/admin" route zal de `loggingMiddleware` functie niet uitvoeren.

### Configureerbare middleware

Je kan ook middleware functies maken die configureerbaar zijn. Je kan dan een functie schrijven die een parameter heeft. Deze functie zal dan op zijn beurt een middleware functie teruggeven. Je kan dan de parameter doorgeven aan de middleware functie.

We zullen een nieuwe middleware functie maken die een parameter heeft. Deze parameter zal de status code zijn. We zullen een bestand maken met de naam `errorHandler.ts` in de `middleware` directory. Dit bestand zal er als volgt uitzien:

```typescript
import type { Request, Response, NextFunction } from "express";

interface ErrorHandlerOptions {
    statusCode: number;
}

export const errorHandler = (options: ErrorHandlerOptions) => {
    return (err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(options.statusCode).render("error",
            {
                message: err.message,
                stack: err.stack
            }
    });
}
```

en dan kunnen we deze middleware functie toevoegen aan de stack:

```typescript
import { errorHandler } from "./middleware/errorHandler";

app.use(errorHandler({ statusCode: 500 }));
```

In dit voorbeeld zal de `errorHandler` functie een middleware functie teruggeven. Deze middleware functie zal de status code gebruiken die is doorgegeven aan de `errorHandler` functie. In dit geval is dat de 500 status code.

### Voorbeeld Request Limiter

Een voorbeeld van een configureerbare middleware functie is een request limiter. Je kan een middleware functie schrijven die een parameter heeft. Deze parameter zal aangeven hoeveel keer een request mag worden uitgevoerd door een bepaalde gebruiker via een bepaald IP adres. Als de gebruiker te veel requests doet, dan kan je een 429 status code terugsturen.

We zullen een nieuwe middleware functie maken die een parameter heeft. Deze parameter zal het aantal requests zijn dat een gebruiker mag doen. We zullen een bestand maken met de naam `requestLimiter.ts` in de `middleware` directory. Dit bestand zal er als volgt uitzien:

```typescript
import type { Request, Response, NextFunction } from "express";

let requestLog : Record<string, number> = {};

interface MaxRequestsConfig {
    maxRequests: number;
}

export function maxRequest(config : MaxRequestsConfig) {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log(`${req.ip} ${req.method} ${req.path}`);
        if (req.ip) {
            requestLog[req.ip] = requestLog[req.ip] ? requestLog[req.ip] + 1 : 1;

            if (requestLog[req.ip] > config.maxRequests) {
                res.status(429).send("Too many requests for this IP address");
                return;
            }
    
        }
        next();
    };
}
```

en dan kunnen we deze middleware functie toevoegen aan de stack:

```typescript
import { maxRequest } from "./middleware/requestLimiter";

app.use(maxRequest({ maxRequests: 10 }));
```

### Middleware volgorde

De volgorde van de middleware functies is belangrijk. De eerste middleware functie die wordt toegevoegd aan de stack zal als eerste worden uitgevoerd. De laatste middleware functie die wordt toegevoegd aan de stack zal als laatste worden uitgevoerd. 

Doe je bv het volgende:

```typescript
app.use(requestLimiter({ maxRequests: 10 }));
app.use(loggingMiddleware);
```

Dan zal er niet meer gelogd worden als er te veel requests zijn. De requestLimiter zal de request al afhandelen en de loggingMiddleware zal niet meer worden uitgevoerd.

Als je het andersom doet dan zal de loggingMiddleware eerst worden uitgevoerd en dan pas de requestLimiter en zal er dus nog gelogd worden als er te veel requests zijn.
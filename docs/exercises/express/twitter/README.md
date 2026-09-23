# Twitter

## 🗃️ Startbestanden

Je begint van een file <a href="/exercise-files/express/twitter/starter.zip">starter.zip</a>. Deze bevat een aantal belangrijke bestanden:

- `data.ts` - bevat alle tweets en gebruikersprofielen. Alsook de functies om deze op te halen.
- `index.ts` - bevat de basis van de Express applicatie. Hierin worden de routes aangemaakt en de templates geregeld.
- `types.ts` - bevat de types die gebruikt worden in de applicatie.
- `views` - bevat de EJS templates die gebruikt worden in de applicatie.
- `public` - bevat de static files die gebruikt worden in de applicatie.

Unzip alle bestanden van de zip file en installeer de nodige dependencies met `npm install`.

## 🛠️ Opdracht

Je begint met een start project waarin de basis van een twitter applicatie is uitgewerkt. Niet alle knoppen en delen van de applicatie zijn belangrijk voor de opgave. We gaan ons voornamelijk richten op de twitter feed, het posten van tweets en de gebruikersprofielen.

### Deel 1: Statische bestanden beschikbaar maken

In het begin zal de applicatie er als volgt uitzien:

![](2023-04-25-16-14-50.png)

Je ziet dat de afbeeldingen en de CSS niet geladen worden. Voer de volgende stappen uit om dit op te lossen:

- [ ] Zorg dat de public map beschikbaar gemaakt wordt voor de gebruiker.

### Deel 2: De feed 

Om de feed te laten werken, moet je de volgende stappen uitvoeren:

- [ ] Geef de variabele `tweets` door aan de `index.ejs` template zodat deze beschikbaar is in de template.
- [ ] Zorg dat de tweets in de feed worden weergegeven. 

### Deel 3: Het posten van tweets

Om een tweet te kunnen posten, moet je de volgende stappen uitvoeren:

- [ ] Maak een post route aan waarmee je een tweet kan posten. Kijk naar het formulier in de template om te zien welke data je moet ontvangen.
- [ ] Gebruik de `createTweet` functie om een tweet aan de feed toe te voegen. Deze functie is beschikbaar in de `data.ts` file.

### Deel 4: De gebruikersprofielen

Om de gebruikersprofielen te laten werken, moet je de volgende stappen uitvoeren:

- [ ] Pas de `app.get("/TheLichKing")` route aan dat je eender welke gebruikersnaam kan meegeven. Je kan dit doen aan de hand van een route parameter.
- [ ] Gebruik de `getProfileByHandle` functie om de juiste gebruiker op te halen. Deze functie is beschikbaar in de `data.ts` file.
- [ ] Haal de tweets van deze gebruiker op aan de hand van de `getTweetsByHandle` functie. Deze functie is beschikbaar in de `data.ts` file.
- [ ] Geef de tweets en de gebruiker door aan de `profile.ejs` template zodat deze beschikbaar is in de template.
- [ ] Zorg dat de tweets en de gebruikersprofiel informatie in de template worden weergegeven.

### Deel 5: Templates

Momenteel worden grote stukken HTML code herhaald in de templates. Maak gebruik van `include` om deze code te hergebruiken:

- [ ] Maak een `header.ejs` template aan waarin je de header van de pagina kan plaatsen. Dit omvat het openen van de html tag, de volledige head tag en het openen van de body tag.
- [ ] Maak een `nav.ejs` template aan waarin je de navigatie van de pagina kan plaatsen. Dit omvat de linkerkant van de applicatie. Dus alles wat in de nav `tag` staat.
- [ ] Maak een `aside.ejs` template aan waarin je de rechterkant van de applicatie kan plaatsen. Dit omvat de de rechterkant van de applicatie. Dus alles wat in de `aside` tag staat.
- [ ] Maak een `tweets.ejs` template aan waarin je de tweets kan plaatsen. Dit omvat de tweets die in de feed en op het profiel worden weergegeven.

# Guestbook

We beginnen in deze opgave met een bestaande node applicatie die een gastenboek bijhoudt. Als je de applicatie opstart wordt er achter een naam gevraagd en vervolgens wordt er een bericht ingevoerd. Deze gegevens worden opgeslagen in een MongoDB database en worden vervolgens getoond in de console.

Je kan het bestaande project vinden in het <a href="/exercise-files/mongodb/guestbook/starter.zip">starter.zip</a> bestand.

## Opdracht

Zorg ervoor dat deze applicatie werkt en dat de gegevens worden opgeslagen in de MongoDB database. Je moet hier enkel de URI van de database aanpassen in de `index.ts` file.

Zorg ervoor dat dit werkt voor zowel een lokale MongoDB database als een MongoDB Atlas database.

## Voorbeeld interactie

```
What is your name? Andie Similon
What is your message? I like mongoDB very much!
[4/13/2024, 8:05:08 PM] Andie Similon: Hey guys
[4/13/2024, 8:05:59 PM] Andie Similon: How are you?
[4/13/2024, 8:17:01 PM] Andie Similon: I like mongoDB very much!
```

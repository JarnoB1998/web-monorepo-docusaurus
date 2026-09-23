# Cowsay Mo(o)dule

Maak een nieuw project `cowsay-module` waarin je jouw bronbestanden voor deze oefening kan plaatsen.

Installeer de `cowsay` module via npm en maak een nieuw bestand `index.ts` aan. Lees eerst de documentatie van de module en importeer de module in je bestand. 

https://www.npmjs.com/package/cowsay

Maak een functie `say` die een string als argument neemt en de string doorgeeft aan de `say` functie van de `cowsay` module. Gebruik de readline-sync module om de gebruiker een string te laten invoeren. 

Als de gebruiker "Meow!" invoert, dan moet de `say` functie een error gooien met de boodschap "Cows don't meow!". Vang deze error op en geef de boodschap weer in de console.

## Voorbeeld interactie

```
What should the cow say? Meow!
Cows don't meow!
What should the cow say? Moo!
 ______
< Moo! >
 ------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
What should the cow say? exit
```

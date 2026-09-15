---
unlisted: true
---

# Milestone 2 - Express

## Opdracht Specificaties

###

:::warning
Vanaf nu is het verplicht om de data via een fetch in te lezen van je publiekelijk beschikbare json file!
:::

### Overzichtspagina met Objecten in een Tabel

Creëer een overzichtspagina waar alle objecten worden weergegeven in een tabelvorm. Je mag zelf kiezen welke vijf velden van de objecten niet getoond worden in de tabel. Dit betekent dat sommige informatie van de objecten bewust wordt weggelaten voor een overzichtelijker weergave.

#### Functionaliteiten:

* **Doorklikken naar Detailpagina**: Voor elk object in de tabel, moet er een optie zijn om door te klikken naar een gedetailleerde pagina waar alle informatie van het object zichtbaar is, inclusief een afbeelding van het object.
* **Filterfunctie op Naam**: Op de overzichtspagina moet een filterfunctie aanwezig zijn waarmee gebruikers kunnen filteren op de naam van de objecten. Dit filter checkt of de ingevoerde tekst aanwezig is in de namen van de objecten.
* **Sorteermogelijkheden**: Gebruikers moeten in staat zijn om de objecten in de tabel te sorteren op basis van elk veld, zowel in oplopende (asc) als in aflopende (desc) volgorde.
* **Doorklikken naar Gerelateerde Objecten**: Als een object verwijst naar een ander object, moet er een mogelijkheid zijn om vanuit de detailpagina van het eerste object door te klikken naar de detailpagina van het gerelateerde object.
* **Weergave van Subobjecten**: Op de detailpagina van een object moet er een lijst zijn van alle subobjecten die bij dit object horen. Deze lijst moet basisinformatie van de subobjecten bevatten en een optie om door te klikken naar de detailpagina's van deze subobjecten.
* **Navigatiebalk**: Introduceer een navigatiebalk die gebruikers in staat stelt gemakkelijk tussen de verschillende delen van de applicatie te navigeren, zoals de overzichtspagina's. De positie van de navigatiebalk is flexibel en kan worden aangepast aan de layout en het design van de applicatie.

#### Opmerkingen:

* **Styling**: Je bent vrij om zelf CSS te schrijven voor de styling van de pagina's. Daarnaast is het toegestaan om frameworks zoals **Tailwind** of **Bootstrap** te gebruiken voor het design. Zorg ervoor dat de interface gebruiksvriendelijk en overzichtelijk blijft.
* **Responsief Ontwerp**: Het wordt sterk aangemoedigd om een responsief ontwerp te hanteren voor de applicatie.
* **Herbruikbaarheid**: Implementeer de navigatiebalk met behulp van include files om hergebruik van code te bevorderen. Dit zorgt voor een consistent uiterlijk over alle pagina's heen, zonder dat er sprake is van code duplicatie, wat bijdraagt aan een meer gestructureerde en onderhoudbare codebase.
* **Server-side**: Alle filtering en sortering gebeurt server-side. 

Deze specificaties zijn bedoeld om een interactieve en gebruiksvriendelijke interface te bieden waarmee gebruikers gemakkelijk door de objecten en hun details kunnen navigeren, filteren en sorteren voor betere toegankelijkheid en overzicht.

### Voorbeeldproject: Trading Cards

Als onderdeel van deze opdracht is er een voorbeeldproject gemaakt dat de functionaliteiten illustreert met gebruik van trading cards. Dit voorbeeld dient als inspiratie en richtlijn voor het ontwikkelen van je eigen project.

#### Screenshots

Bij dit voorbeeldproject zijn screenshots inbegrepen om een visuele indruk te geven van hoe de functionaliteiten geïmplementeerd kunnen worden. Let op de volgende aspecten in de screenshots:

* **Tabelweergave**: Hoe de objecten in tabelvorm worden gepresenteerd, met aandacht voor welke velden zijn weggelaten voor overzichtelijkheid.
* **Detailpagina**: De vormgeving en inrichting van de detailpagina van een object, inclusief afbeelding.
* **Filter- en sorteeropties**: Hoe de filter- en sorteermogelijkheden zijn geïntegreerd in de gebruikersinterface.

Deze screenshots dienen als voorbeeld en zijn niet bedoeld om exact gekopieerd te worden. Gebruik ze als inspiratiebron en pas de ideeën toe binnen de context van je eigen project.

<figure><img src={require("/assets/image (6).png").default} alt="" /><figcaption><p>Navigatiebalk</p></figcaption></figure>

<figure><img src={require("/assets/image (12).png").default} alt="" /><figcaption><p>Overzichtspagina met navigatiebalk</p></figcaption></figure>

<figure><img src={require("/assets/image (3).png").default} alt="" /><figcaption><p>Overzichtpagina van de trading cards</p></figcaption></figure>

<figure><img src={require("/assets/image (4).png").default} alt="" /><figcaption><p>Sortering van velden</p></figcaption></figure>

<figure><img src={require("/assets/image (5).png").default} alt="" /><figcaption><p>Search functionaliteit</p></figcaption></figure>

<figure><img src={require("/assets/image (9).png").default} alt="" /><figcaption><p>Overzicht van de guilds (De gerelateerde objecten)</p></figcaption></figure>

<figure><img src={require("/assets/image (10).png").default} alt="" /><figcaption><p>Detail pagina van de trading cards (hoofdobjecten)</p></figcaption></figure>

<figure><img src={require("/assets/image (11).png").default} alt="" /><figcaption><p>Detail pagina van de gerelateerde guilds (geralateerde objecten)</p></figcaption></figure>

<figure><img src={require("/assets/milestone2.gif").default} alt="" /><figcaption></figcaption></figure>

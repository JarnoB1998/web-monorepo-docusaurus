---
sidebar_position: 1
---

# DOM Manipulatie

## Inleiding

Moderne web pagina's zijn opgebouwd met volgende technologie stack:

* HTML
* JavaScript (JS)
* Cascading Style Sheet (CSS)

Waarbij HTML gebruikt wordt om de content van de web pagina te beschrijven, met JavaScript logica wordt toegevoegd en via CSS de layout van de content wordt goed gezet.

Het is belangrijk om nogmaals te herhalen dat een browser wel JavaScript kan begrijpen maar géén TypeScript.&#x20;

Om TypeScript in de browser te gebruiken zal je dit steeds om moet zetten naar JavaScript. Gelukkig zijn er goede tools om ons hierbij te helpen.

## Communicatie tussen HTML en JavaScript

Om logica toe te voegen aan een web pagina moeten we in twee richtingen communicatie opzetten. Er moet vanuit de HTML code in JavaScript opgestart worden, bijvoorbeeld als je op een knop druk. En er moet van JavaScript informatie naar HTML gestuurd worden, bijvoorbeeld data die van een server komt tonen op het scherm.

Deze technieken noemen we respectievelijk : **event handling** en **DOM manipulatie**.

### Document Object Model (DOM)

Het Document Object Model is de representatie van de HTML pagina in het werkgeheugen van de browser.

Programmeurs gebruiken de DOM om een web pagina te veranderen zonder dat deze opnieuw ingeladen moet worden. We kunnen bijvoorbeeld :

* Tekst veranderen
* Kleuren aanpassen
* Een afbeelding laten verdwijnen en verschijnen

De DOM kan je tekenen als een boomstructuur.

Neem bijvoorbeeld volgende HTML pagina:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Mijn Webpagina</title>
  </head>
  <body>
    <h1>Welkom!</h1>
    <p id="intro">Dit is mijn eerste webpagina.</p>
    <button onclick="veranderTekst()">Klik hier</button>
  </body>
</html>

```

Hier is hoe de HTML pagina eruitziet in een boom schema:

```bash
html
├── head
│   └── title: "Mijn Webpagina"
└── body
    ├── h1: "Welkom!"
    ├── p (id="intro"): "Dit is mijn eerste webpagina."
    └── button: "Klik hier"

```

### Event handling

Deze techniek wordt gebruikt om informatie door te sturen vanuit HTML naar JavaScript. Als informatie vanuit HTML gestuurd wordt, zal dit steeds het gevolg zijn van user interactie. De gebruiker voert een actie uit op de pagina die een bepaalde logica in gang zet. Het meest voor de hand liggende voorbeeld is de gebruiker drukt op een knop en deze actie haalt gegevens op van een server. Er zijn ook iets minder voor de hand liggende voorbeelden die toch ook als een soort user interactie worden aanzien zoals bijvoorbeeld de HTML pagina is ingeladen.

Event handling kunnen we op twee manieren activeren: **inline event handling** en **event listening**.

#### Inline event handling

Met deze techniek wordt de HTML aangepast en voegen we op het HTML element een event toe.

```html
<button onclick="handleButtonClick()">Click me</button>
```

In dit voorbeeld voegen we aan de button tag een extra attribuut **`onclick`** toe gevolgd door de functienaam die we in de JavaScript code terugvinden.

Het is ook mogelijk om parameters aan de functie mee te geven.

```html
<div onmouseover="handleMouseOver('Hello World')"></div>
```

In bovenstaand voorbeeld zal de handleMouseOver functie in JavaScript één string parameter hebben en deze geven we al mee vanuit de HTML. Let hier wel héél goed op met de quotes! Zet je functie tussen double quotes ( " ) en de string parameter tussen single quotes ( ' ) om fouten te vermijden.

Deze techniek heeft als groot voordeel dat het zeer duidelijk is welk element welke functie zal oproepen.&#x20;

Maar daarnaast heeft het ook wel enkele zeer grote nadelen.

1. De HTML dient aangepast te worden. In sommige gevallen zal de HTML pagina aangeleverd worden en dan is het niet zo handig dat je deze zelf gaat bijwerken om de event handling toe te voegen. Als er dan een nieuwe versie van de HTML wordt aangeleverd dan kan je je event handlers opnieuw toevoegen.
2. Indien een element meer dan één event handler heeft kan het al snel onoverzichtelijk worden.
3. De event handler is er altijd, je hebt hier geen controle over. Als de case zou zijn dat een event handler er maar mag zijn onder bepaalde voorwaarden dan is dit moeilijker om te implementeren.

#### Event listener

Het alternatief voor inline event handling is de event listener techniek. Met deze techniek gaan we in de TypeScript / JavaScript code event listeners hangen aan HTML elementen.

```typescript
button.addEventListener("click", (event: Event) => {
    // do something
});
```

In bovenstaand voorbeeld hebben we een referentie naar het button HTML element (hoe dat gebeurd zien we verder door in het hoofdstuk DOM manipulatie). Op deze button referentie activeren we een event listener met de functie **`addEventListener`**. Deze functie heeft twee parameters : het event en de handler. Het event wordt in tekst formaat gegeven en is de naam van het event, bv "click". De handler is een functie met één parameter event van type Event. Deze handler wordt vaak als arrow function geschreven maar kan evengoed als externe functie worden meegegeven.

Met deze techniek lossen we alle nadelen op van de inline event handling: we moeten de HTML niet aanpassen, meerdere event listeners worden op een overzichtelijke manier toegevoegd én we hebben controle over wanneer we de event listener aan het element hangen en kunnen deze er zelfs terug af halen met de **`removeEventListener`** functie.

Echter we zijn wel een stuk overzicht kwijt omdat het nu net iets moeilijk is om te ontdekken welk element welke actie zal triggeren.

### DOM manipulatie

Om vanuit TypeScript / JavaScript zaken aan te passen op de HTML pagina hebben we de DOM structuur nodig want deze gaan we manipuleren.

Om de DOM te manipuleren hebben we het **`document`** object nodig. Dit object is de representatie van de DOM in ons script. Via document kunnen we alle elementen aanspreken.

#### Selectors

Om een element aan te spreken moeten we het eerst en vooral te pakken krijgen. Dit doen we via selectors.

We gaan twee selectors gebruiken : **querySelector** en **querySelectorAll**.&#x20;

Je zal in oudere voorbeeldcode ook nog getElementById, getElementsByTagName en getElementsByClassName vinden. Deze methodes zijn verouderd en **gebruiken we niet meer** !

De selectors worden als volgt gebruikt:

```typescript
let element = document.querySelector<HTMLElement>('key');
let elements = document.querySelectorAll<HTMLElement>('key');
```

Beide selectors nemen als input een key. Deze key volgt dezelfde logica als css keys, dwz:

* key = element naam, bv 'div' of 'ul' of 'button'
* key = id van element, bv '#mybutton'
* key = classname van element, bv '.myclass'

Samengevat : als er geen # of . voor de naam staat, is het een HTML element, gebruik je #naam dan is het de id van het HTML element (opgelet, een id is uniek op de pagina) en gebruik je .naam dan is het de css class van het HTML element (css class kan meermaals op de pagina voorkomen).

De **querySelector** zal het eerste element nemen dat voldoet aan de key. Deze geeft dus één element terug.

Met **querySelectorAll** neem je alle elementen die voldoen aan de key. Deze geeft dus een lijst van elementen terug.

Bijvoorbeeld, neem volgende HTML pagina:

```html
<body>
    <div>Hello world</div>
    <ul id='lijst'>
	<li class="item">één</li>
	<li class="item">twee</li>
	<li class="item">drie</li>
    </ul>
</body>
```

In het script spreken we op volgende manier de elementen aan:

```typescript
const div = document.querySelector<HTMLDivElement>('div');
```

We nemen het eerste element van type div, dat is dus:

```html
<div>Hello world</div>
```

Echter schrijven we dit:

```typescript
const li= document.querySelector<HTMLLIElement>('li');
```

Dan nemen we het eerste element van type li en dat is dan:

```html
<li class="item">één</li>
```

Je hebt dus li elementen twee en drie niet mee !

We kunnen ook via een id werken als volgt:

```typescript
const ul = document.querySelector<HTMLUListElement>('#lijst');
```

We vragen dus element met id 'lijst' op en dat is deze:

```html
<ul id='lijst'>
```

En de derde optie is via class en dat is als volgt:

```typescript
const li = document.querySelector<HTMLLIElement>('.item');
```

Merk hier op dat net zoals het voorbeeld met de querySelector op li we hier het éérste element met deze classname krijgen, wat opnieuw deze is:

```html
<li class="item">één</li>
```

Om in het voorbeeld hierboven alle HTML li elementen te pakken te krijgen , gebruiken we de querySelectorAll. En dat kan dan in bovenstaand geval op twee manieren:

```typescript
const list1 = document.querySelectorAll<HTMLLIElement>('li');
const list2 = document.querySelectorAll<HTMLLIElement>('.item');
```

Beide lijsten zullen in dit geval hetzelfde resultaat opleveren:  ze bevatten een array van de HTML li elementen.

Bij querySelectorAll heeft het geen zin om met de #notatie te werken (id) aangezien er steeds maar één element met dezelfde id op een pagina kan zijn, zal de querySelectorAll array maximaal 1 element bevatten.

#### Properties

Van zodra we een element geselecteerd hebben, kunnen we dit gaan manipuleren.

Bij de event handling hebben we al gezien dat we er volgende functies op kunnen gebruiken: addEventListener en removeEventListener.

Er zijn uiteraard nog enkele andere interessante eigenschappen die we kunnen aanpassen:

* style : van elk element kunnen we vanuit code de stijl aanpassen via de style property. Uiteraard passen we de stijl liefst aan via CSS maar soms kan het handig zijn om snel via de style property iets aan te passen bv:

```typescript
mydiv.style.backgroundColor = 'red';
```

* classList : om via CSS stijl aan te passen maken we eerst een CSS class aan in het CSS bestand en vervolgens kan je via de classList property deze class toevoegen en verwijderen, bv:

```typescript
mydiv.classList.add("mycssclass");
mydiv.classList.remove("mycssclass");
mydiv.classList.toggle("mycssclass"); //voeg toe als class niet in list zit, indien wel in list wordt deze verwijderd
```

* innerHTML : hiermee voeg je HTML tekst toe aan het element, bv:

```typescript
mydiv.innerHTML = "<b>Hello world</b>";
```

* innerText : hiermee voeg je plain tekst toe aan het element, bv:

```typescript
mydiv.innerText = "Hello world";
```

#### DOM elementen aanmaken

We kunnen nu al elementen selecteren en de eigenschappen aanpassen. Het is echter soms nodig om nieuwe elementen aan te kunnen maken, bijvoorbeeld lijnen van een tabel aanmaken met data die je van een server krijgt.

Om nieuwe elementen aan te maken hebben we twee zaken nodig : **createElement** en **appendChild**. Daarnaast is ook de functie **createTextNode** nuttig.

Neem dit voorbeeld:

```typescript
const body = document.querySelector<HTMLBodyElement>("body");
const mydiv = document.createElement("div");
const mytext =  document.createTextNode("Hello world");

mydiv.appendChild(mytext);
body.appendChild(mydiv);
```

Met de createElement functie van document maken we een nieuw HTML element aan van het type dat we meegeven als parameter van de functie. In het voorbeeld hierboven maken we een nieuw HTML div element aan.

Met appendChild wordt een element als kind toegevoegd aan een reeds bestaand element. In het voorbeeld hierboven vragen we via een querySelector eerst de body op en nadien voegen we ons nieuw aangemaakt div element toe aan de body via appendChild.

In bovenstaand voorbeeld maken we ook nog een text node aan met createTextNode. Dit is géén HTML element maar gedraagt zich wel op die manier zodat we ook de appendChild kunnen gebruiken om deze text aan het HTML element (in dit geval onze nieuwe div) te hangen. In dit geval zou je ook de eigenschap innerText hebben kunnen gebruiken om deze tekst op de div te zetten.&#x20;

De createTextNode manier is interessant als je in een loop meerdere tekstlijnen aan één element moet hangen. Met innerText is dit moeilijker, via appendChild wordt de node steeds onder de vorige toegevoegd.

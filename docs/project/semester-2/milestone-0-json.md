---
unlisted: true
---

# Milestone 0 - JSON

## JSON Aanmaken

We gaan een json bestand nodig hebben dat we gaan gebruiken als basis van een API. Iedereen mag zelf beslissen welke soort data hij/zij in het bestand steekt. Het is wel belangrijk dat het bestand aan een aantal voorwaarden voldoet:

* Het bestand moet een array van objecten bevatten (minimum 10).
* Elk object moet minstens de volgende soort properties bevatten :
* Een id property met een unieke waarde.
* Property met een korte string als waarde: Dit kan bijvoorbeeld een naam zijn.
* Property met een lange string als waarde: Dit kan bijvoorbeeld een beschrijving zijn.
* Property met een number als waarde: Dit kan bijvoorbeeld de leeftijd zijn.
* Property met een boolean als waarde: Dit kan aangeven of iemand bijvoorbeeld een actieve status heeft.
* Property met een datum als waarde: Dit kan de geboortedatum zijn.
* Property met een image URL als waarde: Dit kan de URL van een profielfoto zijn.
* Property waarvan de waarde een string is met een beperkt aantal mogelijke waarden.
* Property met een array van strings als waarde: Dit kunnen bijvoorbeeld hobby's zijn.
* Property met een ander object als waarde. Dit object moet op zijn beurt ook een aantal properties bevatten
  * Een id met een unieke waarde
  * Een aantal properties (mogen string, booleans, numbers, image url, ...)
  * Dit object is afkomstig van een 2de json bestand.

Let op dat dit een minimale vereiste is. Je mag gerust meer properties toevoegen als dat nodig is voor je idee.

:::info
Zorg vooral voor realistische data. Images kunnen eenvoudig worden gegenereerd via Gemini of ChatGPT.&#x20;
:::

**Voorbeelden:**

**Fantasy Card Game**

```json title="cards.json"
[
  {
    "id": "FTC-001",
    "name": "Aether Knight",
    "description": "A legendary knight who harnesses the ethereal powers of the Aether, wielding them to maintain balance across the realms.",
    "age": 457,
    "isActive": true,
    "birthDate": "1567-03-05",
    "imageUrl": "https://example.com/images/aether-knight.jpg",
    "rarity": "Legendary",
    "abilities": ["Teleportation", "Energy Manipulation", "Dimensional Travel"],
    "element": "Aether",
    "guildAffiliation": {
      "id": "GUILD-009",
      "name": "Order of the Cosmic Veil",
      "guildMaster": "Celestial Mage",
      "guildEmblemUrl": "https://example.com/images/guilds/cosmic-veil-emblem.jpg",
      "foundedYear": 1423,
      "motto": "Balance in All, All in Balance"
    }
  },
  {
    "id": "FTC-002",
    "name": "Shadow Enchantress",
    "description": "A mysterious sorceress cloaked in darkness, wielding shadow magic to manipulate the fabric of reality and ensnare her foes.",
    "age": 324,
    "isActive": false,
    "birthDate": "1699-10-31",
    "imageUrl": "https://example.com/images/shadow-enchantress.jpg",
    "rarity": "Epic",
    "abilities": ["Shadow Manipulation", "Illusion Casting", "Night Vision"],
    "element": "Shadow",
    "guildAffiliation": {
      "id": "GUILD-015",
      "name": "Brotherhood of the Dusk",
      "guildMaster": "Darkness Wielder",
      "guildEmblemUrl": "https://example.com/images/guilds/dusk-brotherhood-emblem.jpg",
      "foundedYear": 1578,
      "motto": "In Shadows, Truth"
    }
  }
]

```


```json
[
  {
    "id": "GUILD-009",
    "name": "Order of the Cosmic Veil",
    "guildMaster": "Celestial Mage",
    "guildEmblemUrl": "https://example.com/images/guilds/cosmic-veil-emblem.jpg",
    "foundedYear": 1423,
    "motto": "Balance in All, All in Balance"
  },
  {
    "id": "GUILD-015",
    "name": "Brotherhood of the Dusk",
    "guildMaster": "Darkness Wielder",
    "guildEmblemUrl": "https://example.com/images/guilds/dusk-brotherhood-emblem.jpg",
    "foundedYear": 1578,
    "motto": "In Shadows, Truth"
  }
]
```


**Music artists**


```json
[
  {
    "id": "ART-001",
    "name": "Elena Ray",
    "description": "Elena Ray is a visionary pop artist known for her electrifying performances and innovative soundscapes that blend electronic music with traditional pop.",
    "age": 28,
    "isActive": true,
    "birthDate": "1995-07-22",
    "imageUrl": "https://example.com/images/artists/elena-ray.jpg",
    "genre": "Pop/Electronic",
    "instruments": ["Vocals", "Keyboard", "Synthesizer"],
    "recordLabel": {
      "id": "LABEL-101",
      "name": "Neon Groove Records",
      "labelLogoUrl": "https://example.com/images/labels/neon-groove-logo.jpg",
      "foundedYear": 2010,
      "founder": "Maxwell Turner",
      "headquarters": "Los Angeles, California"
    }
  },
  {
    "id": "ART-002",
    "name": "The Midnight Howlers",
    "description": "An indie rock band hailing from Austin, Texas, known for their gritty guitar riffs and raw, emotional lyrics.",
    "age": 5, // This could represent the number of years the band has been together
    "isActive": true,
    "birthDate": "2019-05-16",
    "imageUrl": "https://example.com/images/artists/midnight-howlers.jpg",
    "genre": "Indie Rock",
    "instruments": ["Guitar", "Drums", "Bass"],
    "recordLabel": {
      "id": "LABEL-202",
      "name": "Lone Star Records",
      "labelLogoUrl": "https://example.com/images/labels/lone-star-logo.jpg",
      "foundedYear": 2005,
      "founder": "Elijah Reed",
      "headquarters": "Austin, Texas"
    }
  }
]
```



```json
[
  {
    "id": "LABEL-101",
    "name": "Neon Groove Records",
    "labelLogoUrl": "https://example.com/images/labels/neon-groove-logo.jpg",
    "foundedYear": 2010,
    "founder": "Maxwell Turner",
    "headquarters": "Los Angeles, California"
  },
  {
    "id": "LABEL-202",
    "name": "Lone Star Records",
    "labelLogoUrl": "https://example.com/images/labels/lone-star-logo.jpg",
    "foundedYear": 2005,
    "founder": "Elijah Reed",
    "headquarters": "Austin, Texas"
  }
]
```


## JSON Hosten

We gaan github gebruiken voor ons JSON bestand te hosten. Hoewel github gebruikt wordt kunnen we dit ook gebruiken om bestanden in op te slaan en publiekelijk te hosten (in beperkte mate)

* Maak **een nieuwe github** **repository** aan en zet deze publiek.
* Je kan deze clonen of gewoon via de web interface de bestanden toevoegen.
* Upload je image bestanden naar github (of push deze naar je repository)
* Update de image urls in je json file zodat deze naar github urls wijzen. Zorg zeker dat je de raw url gebruikt als image url. Bv: [https://raw.githubusercontent.com/similonap/fake-gpt/main/images/chatbot.png](https://raw.githubusercontent.com/similonap/fake-gpt/main/images/chatbot.png)
* Upload je json naar github (of push deze naar je repository)

Je mag uiteraard zelf ook hosting voorzien voor je json bestand en images. Zorg er gewoon voor dat je json publiekelijk beschikbaar is en je images.



## Interessante links

* [ChatGPT](https://chatgpt.com/)
* [Gemini](https://gemini.google.com/app)
* [https://perchance.org/ai-text-to-image-generator](https://perchance.org/ai-text-to-image-generator)

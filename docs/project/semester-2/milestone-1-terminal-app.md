---
unlisted: true
---

# Milestone 1 - Terminal App

## Interfaces

Maak een apart bestand aan waarin je de interfaces definieert voor de data die je hebt aangemaakt. Zorg ervoor dat alle interfaces zijn geexporteerd zodat je ze kan gebruiken in andere bestanden.

## Console App

Maak een console app aan die de data uit je json file inleest en deze op een overzichtelijke manier weergeeft in de console. Zorg ervoor dat je aan de hand van een menu de gebruiker de mogelijkheid geeft om de data te filteren op een id. Als de gebruiker een id ingeeft die niet bestaat in de data, geef je een gepaste melding.

De applicatie kan er als volgt uitzien:

```
Welcome to the JSON data viewer!

1. View all data
2. Filter by ID
3. Exit

Please enter your choice: 1

- Aether Knight (FTC-001)
- Shadow Enchantress (FTC-002)
- ...
```

```
Welcome to the JSON data viewer!

1. View all data
2. Filter by ID
3. Exit

Please enter your choice: 2
Please enter the ID you want to filter by: FTC-001

- Aether Knight (FTC-001)
  - Description: A legendary knight who harnesses the ethereal powers of the Aether, wielding them to maintain balance across the realms.
  - Age: 457
  - Active: true
  - Birthdate: 1567-03-05
  - Image: https://example.com/images/aether-knight.jpg
  - Rarity: Legendary
  - Abilities: Teleportation, Energy Manipulation, Dimensional Travel
  - Element: Aether
  - Guild: Order of the Cosmic Veil
    - Name: Order of the Cosmic Veil
    - Guild Master: Celestial Mage
    - Emblem: https://example.com/images/guilds/cosmic-veil-emblem.jpg
    - Founded: 1423
    - Motto: Balance in All, All in Balance
```

### Inzenden

Zorg ervoor dat je alles pushed naar je repository en de link naar je repository inzendt via digitap. De deadline vind je op digitap.

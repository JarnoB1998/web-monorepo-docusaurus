---
sidebar_position: 6
---

# Cocktail API met Vite

Download het [starterproject](/exercises/frontend/cocktail-api-met-vite/starter.zip) en pak het uit in een nieuwe map. Dit project bevat de HTML en CSS voor deze oefening. Voer `npm install` en `npm run dev` uit en werk de functionaliteit uit in `src/main.ts`.

In labo 4 zijn we al aan de slag gegaan met de cocktails api.

```text
https://www.thecocktaildb.com/api/json/v1/1/search.php?s=kiwi
```

Zorg er nu voor dat je de informatie van deze API op het scherm krijgt.

Eén JSON object in de resultaats array ziet er als volgt uit:

```json
{
  "idDrink": "14752",
  "strDrink": "Kiwi Lemon",
  "strDrinkAlternate": null,
  "strTags": null,
  "strVideo": null,
  "strCategory": "Ordinary Drink",
  "strIBA": null,
  "strAlcoholic": "Alcoholic",
  "strGlass": "Highball glass",
  "strInstructions": "Mix in highball glass. Stirr. Garnish with slice of kiwi.",
  "strInstructionsES": "Mezclar en un vaso highball. Remover. Decorar con una rodaja de kiwi.",
  "strInstructionsDE": "Im Highball-Glas untermischen. Rühren. Mit einer Scheibe Kiwi garnieren.",
  "strInstructionsFR": "Mélanger dans un verre de type highball. Remuer. Garnir d'une tranche de kiwi.",
  "strInstructionsIT": "Mescolare in un bicchiere highball.\r\nAgitare.\r\nGuarnire con una fetta di kiwi.",
  "strInstructionsZH-HANS": null,
  "strInstructionsZH-HANT": null,
  "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/tpupvr1478251697.jpg",
  "strIngredient1": "Kiwi liqueur",
  "strIngredient2": "Bitter lemon",
  "strIngredient3": "Ice",
  "strIngredient4": null,
  "strIngredient5": null,
  "strIngredient6": null,
  "strIngredient7": null,
  "strIngredient8": null,
  "strIngredient9": null,
  "strIngredient10": null,
  "strIngredient11": null,
  "strIngredient12": null,
  "strIngredient13": null,
  "strIngredient14": null,
  "strIngredient15": null,
  "strMeasure1": "1 part ",
  "strMeasure2": "2 parts ",
  "strMeasure3": "cubes",
  "strMeasure4": null,
  "strMeasure5": null,
  "strMeasure6": null,
  "strMeasure7": null,
  "strMeasure8": null,
  "strMeasure9": null,
  "strMeasure10": null,
  "strMeasure11": null,
  "strMeasure12": null,
  "strMeasure13": null,
  "strMeasure14": null,
  "strMeasure15": null,
  "strImageSource": null,
  "strImageAttribution": null,
  "strCreativeCommonsConfirmed": "No",
  "dateModified": "2016-11-04 09:28:17"
}
```

Toon op je scherm minstens de naam (`strDrink`), instructies (`strInstructions`) en foto (`strDrinkThumb`). Meer attributen tonen mag uiteraard.

Probeer als visuele representatie 'cards' te maken : [https://www.w3schools.com/howto/howto_css_cards.asp](https://www.w3schools.com/howto/howto_css_cards.asp)

Om andere ingrediënten te gebruiken ipv 'kiwi' kan je proberen om een invulveld te voorzien, maar het is ook al goed om met enkele knoppen te werken : 'kiwi cocktails' , 'lemon cocktails', 'banana cocktails' ...

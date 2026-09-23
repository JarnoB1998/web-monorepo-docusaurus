# Shopping Cookie

Voor deze oefening beginnen we met een <a href="/exercise-files/security/shopping-cookie/starter.zip">starter project</a>. Download dit project en pak het uit in een nieuwe folder.

Als we het starter project opstart krijg je de volgende situatie te zien:

![Starter](starter.png)

Geen van de functionaliteiten werkt momenteel. Het is aan jou om de applicatie te voorzien van de nodige functionaliteiten.

Voorzie de implementatie van de volgende endpoints:
- `GET /`: Toont de homepagina met een overzicht van de producten en de inhoud van de winkelwagen. De inhoud van de winkelwagen is een cookie die je kan uitlezen met `req.cookies.cart`. Deze cookie bevat een JSON object met als key de naam van het product en als value het aantal van dat product in de winkelwagen. 
- `POST /add`: Voegt een product toe aan de winkelwagen en vervolgens redirect naar de homepagina.
- `POST /remove`: Verwijdert een product van de winkelwagen en vervolgens redirect naar de homepagina.
- `POST /clear`: Verwijdert alle producten van de winkelwagen en vervolgens redirect naar de homepagina.

Let op dat ook producten die nog niet in de winkelwagen zitten ook getoond moeten worden op het scherm (met een aantal van 0).
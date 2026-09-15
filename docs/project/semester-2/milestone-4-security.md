---
unlisted: true
---

# Milestone 4 - Security

- Bij het opstarten van de applicatie voeg je twee default gebruikers toe: een admin en een user. Zorg ervoor dat de wachtwoorden van deze gebruikers veilig worden opgeslagen (hint: bcrypt). De admin gebruiker heeft een ADMIN role en de user een USER role.
- Voeg een login pagina toe aan de applicatie. De login pagina moet toegankelijk zijn voor iedereen. De login pagina moet een form bevatten met twee input velden: username en password. De login pagina moet ook een knop bevatten om het formulier te versturen.
- Zorg ervoor dat de gebruiker na het inloggen wordt doorgestuurd naar het overzicht je dashboard dat je in vorige milestones hebt gemaakt.
- Zorg ervoor dat de gebruiker niet bij de login pagina kan komen als hij al is ingelogd. Als de gebruiker al is ingelogd en hij gaat naar de login pagina, dan moet hij worden doorgestuurd naar het dashboard.
- Zorg ervoor dat de gebruiker niet bij de dashboard pagina kan komen als hij niet is ingelogd. Als de gebruiker niet is ingelogd en hij gaat naar het dashboard, dan moet hij worden doorgestuurd naar de login pagina.
- Alleen een ADMIN gebruiker mag de edit button zien op de dashboard pagina. Je kan dit doen door de button te verbergen voor de USER role. Zorg er ook voor dat de pagina zelf niet toegankelijk is voor de USER role.
- Zorg ervoor dat de gebruiker zich ook kan uitloggen. Voeg een logout knop toe aan de dashboard pagina. Als de gebruiker op de logout knop klikt, dan moet hij worden uitgelogd en worden doorgestuurd naar de login pagina.
- Zorg ervoor dat een gebruiker ook kan registreren. Dit moet gewoon een eenvoudige pagina zijn met een form met twee input velden: username en password. Als de gebruiker het formulier invult, dan moet hij worden geregistreerd en worden doorgestuurd naar de login pagina. Kijk ook of de gebruikersnaam al bestaat in de database. Als de gebruikersnaam al bestaat, geef dan een foutmelding. Zorg ervoor dat het wachtwoord veilig wordt opgeslagen.
- Zorg dat je applicatie wordt gehosted op een cloud provider naar keuze en dus je applicatie online is te bezoeken. Voeg de link toe aan je README.md bestand.

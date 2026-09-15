import React from 'react'
import ReactPlayer from 'react-player'

# Devcontainers

## Dev Environment

Een Dev Environment (ontwikkelomgeving) is simpelweg een systeem waar alle software, tools en hardware op geïnstalleerd zijn, zodat jij kunt programmeren aan een specifiek project. Met software en tools wordt echt alles bedoeld dat je gebruikt tijdens het programmeren:

* Code Editors (bv. VS Code of Visual Studio)
* Plugins (bv. een Markdown extension in VS Code)
* Compilers (bv. de .NET compiler voor C#)
* Sandbox omgevingen (bv. NodeJS)
* ...

Meestal heb je op één toestel meerdere Dev Environments geïnstalleerd. Het is nu eenmaal niet praktisch om rond te lopen met 5 laptops...

### Dev environment problemen

Een Dev Environment is dus vaak een complex systeem van allerlei software, tools en specifieke instellingen die samenwerken om een stuk software te ontwikkelen. Wat kan er allemaal misgaan?

**Oh Nee, mijn Laptop is Kapot!**

Je laptop gaat stuk, en je koopt een nieuwe. Nu moet je ALLE software en tools opnieuw installeren. Niet alleen dat, maar je zult er ook op moeten letten dat je EXACT dezelfde versie van die software en tools terug installeert! Weet jij nog of je versie 18.17.1 of versie 17.9.2 had geïnstalleerd op je laptop?

**Oh Nee, een Groepswerk!**

Je moet samenwerken met iemand anders. Het project werkt perfect op jouw Dev Environment, maar wilt om één of andere reden niet draaien op die van je teamgenoot. Tijd om ELKE tool en software die je gebruikt na te kijken op versie nummer!

**Oh Nee, een Oud Project Werkt Niet Meer!**

Voor je nieuwste projecten heb je NodeJS geupdate naar de nieuwste versie. Oeps! Nu werken je oude projecten, die gebruik maakten van een oude versie van NodeJS, niet meer!

**Deployment Hell**

Alles werkt perfect op jouw systeem, en ook op die van je teamgenoten. Maar tijdens het deployen naar de server, merk je dat je software niet werkt. Tijd om ELKE tool en software die je gebruikt (opnieuw) na te kijken op versie nummer!

### Docker to the Rescue!

We kunnen een Docker Container zo samenstellen dat alle tools en instellingen daarin geïnstalleerd staan. Je installeert niets meer op je eigen systeem, alles zit netjes verpakt in een Docker Container! Zo'n Docker Container waarin je je Dev Environment opslaat voor één specifiek project, dàt heet een DevContainer. In de volgende secties leggen we uit hoe je een DevContainer kan opzetten voor je project om zo aan de slag te gaan met je labo's.

### Dev environment setup

#### Installeer WSL

Open Powershell **als administrator**.

Gebruik het volgende commando om na te kijken of je WSL hebt geinstalleerd, en zo ja, welke versie.

```
wsl --version
```

Als WSL geinstalleerd is, zou je output moeten krijgen zoals deze (versie nummers kunnen verschillen).

```
WSL version: 2.4.10.0
Kernel version: 5.15.167.4
WSLg version: 1.0.65
MSRDC version: 1.2.5620
Direct3D version: 1.611.1-81528511
DXCore version: 10.0.26100.1-240331-1435.ge-release
Windows version: 10.0.26100.3037
```

Indien WSL dus geinstalleerd is, kan je WSL updaten met het volgende command:

```
wsl --update
```

**Als je WSL&#x20;**_**NIET**_**&#x20;geinstalleerd hebt, dan installeer je WSL met het volgende commando:**

```
wsl --install --no-distribution
```

Meer informatie vind je op:[ https://learn.microsoft.com/en-us/windows/wsl/install](https://learn.microsoft.com/en-us/windows/wsl/install)

#### Installeer Docker Desktop

Ga naar [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

Download het installie-programma en voer het programma uit.

:::danger
Je hoeft **GEEN** account te maken om docker desktop te installeren. Als je dit wel doet moet kijk dan in je email naar een verificatiemail.
:::

#### Installeer Git

Ga naar [https://git-scm.com/downloads](https://git-scm.com/downloads)

Download het installie-programma en voer het programma uit.

#### Maak een Github Account aan

Maak een GitHub-account aan met je AP e-mailadres, of log in op je bestaande account. Heb je al een GitHub-account met een persoonlijk e-mailadres? Dan kan je jouw AP e-mailadres als secundair adres toevoegen in de instellingen.

#### Maak een labo-repository aan

1. Ga naar Github en zorg dat je ingelogd bent.
2. Klik op de tab **Repositories** en vervolgens op **New repository**.
3. Geef je labo repository een naam bv. `webontwikkeling-labo`.
4. Kies voor een **Private** repository. De rest van de instellingen laat je op de standaardwaarden staan. Klik op **Create repository**.

#### Installeer Visual Studio Code

Ga naar [https://code.visualstudio.com/](https://code.visualstudio.com/)

Download het installatie-bestand en voer het uit.

#### VS Code Extensions

Open Visual Studio Code.

Open de Extensions tab vanuit de Sidebar.

Zoek naar het "Remote Development" extension pack van Microsoft. [https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)

Dit installeert 4 extensies in VS Code die je helpen met ontwikkeling in DevContainers.

Tenslotte installeer je nog de "Github Pull Request" extention: [https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github)

#### Authenticeer met Github in VS Code

Klik in Visual Studio Code in de linkeronderhoek op het "avatar" icoontje.

<figure><img src={require("/assets/Screenshot 2025-02-05 at 12.41.46.png").default} alt="" /><figcaption><p>De positie van het Accounts menu</p></figcaption></figure>

Kies vervolgens "Sign in to GitHub to use GitHub Pull Requests". Vervolgens zou er een browser venster moeten openen die je vraagt om te authenticeren via Github. Doe dit met je Github account.

:::info
Pro Tip: in hetzelfde menu vind je ook "Sign in to sync settings" terug. Indien je dit doet worden alle Visual Studio Code instellingen gesynchroniseerd met GitHub. Als je dus ooit Visual Studio Code installeert op een andere computer zal deze automatisch dezelfde instellingen krijgen.
:::

#### Labo devcontainer aanmaken

Zoek de labo-repo die je eerder aanmaakte op in Github.

1. Kopieer de HTTPS Git URL (vanuit de groene "Code" knop op de repo pagina).
2. Open VS Code.
3. Open het Command Palette (CTRL + SHIFT + P).
4. Zoek naar het command `Dev Containers: Clone Repository in Container Volume...` en druk Enter.
5. Plak de HTTPS Git URL die je kopieerde en druk Enter.
6. Kies `main` als branch.
7. Als er gevraagd wordt naar de container template: kies `Node JS & Typescript`.
8. Als er gevraagd wordt welke versie van Node JS je wil gebruiken: kies `24-trixie`.
9. Als er gevraagd wordt welke extra features je wil installeren: kies `ts-node`.
10. Vervolgens zal de devcontainer worden opgestart en kan je beginnen met het project. Kijk zeker na dat je een bestand kan pushen naar de repository.

Je kan nakijken of alles correct is ingesteld door het bestand `.devcontainer/devcontainer.json` te openen. Hierin zou je volgende code moeten zien:

```json
// For format details, see https://aka.ms/devcontainer.json. For config options, see the
// README at: https://github.com/devcontainers/templates/tree/main/src/typescript-node
{
  "name": "Node.js & TypeScript",
  // Or use a Dockerfile or Docker Compose file. More info: https://containers.dev/guide/dockerfile
  "image": "mcr.microsoft.com/devcontainers/typescript-node:5-24-trixie",
  "features": {
    "ghcr.io/devcontainers-extra/features/ts-node:1": {}
  }

  // Features to add to the dev container. More info: https://containers.dev/features.
  // "features": {},

  // Use 'forwardPorts' to make a list of ports inside the container available locally.
  // "forwardPorts": [],

  // Use 'postCreateCommand' to run commands after the container is created.
  // "postCreateCommand": "yarn install",

  // Configure tool-specific properties.
  // "customizations": {},

  // Uncomment to connect as root instead. More info: https://aka.ms/dev-containers-non-root.
  // "remoteUser": "root"
}
```

### Troubleshooting

#### Meerdere Github accounts

Als je meerdere Github accounts hebt, kan het zijn dat je problemen ondervindt bij het clonen van je private repo: je computer probeert dan in te loggen met het verkeerde account.

Het kan ook helpen om je github account te verwijderen uit de Windows Credential Manager. Zoek in Windows naar "Credential Manager" (in het Nederlands: Aanmeldingsgegevensbeheer of Referentiebeheer) en verwijder alle credentials die beginnen met "git:https://github.com".

De beste manier om dit probleem te vermijden is om slechts één Github account te gebruiken. Weet dat je meerdere e-mailadressen kan toevoegen aan je Github account, dus je kan je AP e-mailadres toevoegen aan je persoonlijke Github account.

#### WSL versie is niet up-to-date

Als je de DevContainer probeert te openen, maar je krijgt een foutmelding dat je WSL versie niet up-to-date is, dan moet je WSL updaten. Dit kan je doen door het volgende stappenplan te volgen:

* Open Powershell als administrator (rechtermuisknop op het Powershell icoontje, en kies voor Run as Administrator)
* Voer de volgende commando's uit:

```
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
wsl --set-default-version 2
wsl --update
```

* Hierna kan je best je computer herstarten om zeker te zijn dat alles goed werkt.

#### Docker e-mailadres niet geverifieerd

Het kan gebeuren dat de devcontainer niet opstart omdat je Docker account niet geverifieerd is. Je hoeft niet per se een Docker account te hebben, maar als je er wel één hebt **moet** je dit e-mailadres verifiëren. Doe dit door in te loggen op [https://hub.docker.com/](https://hub.docker.com/) en klik op de link in de verificatiemail die je van Docker kreeg.

#### Virtualisatie is niet ingeschakeld in BIOS

Als je de devcontainer probeert te openen, maar je krijgt een foutmelding dat virtualisatie niet ingeschakeld is in BIOS, dan moet je dit inschakelen. Hoe je dit kunt doen hangt af van je computer. Zoek op Google naar "enable virtualization in BIOS" en de naam van je computer of moederbord, of vraag hulp aan de lector.
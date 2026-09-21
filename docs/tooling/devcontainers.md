import {CardGrid, Card, StepList, Step, Diagram, DiagramBox, DiagramArrow} from '@site/src/components/Overview';

# Devcontainers

Op deze pagina zet je je volledige ontwikkelomgeving op voor de labo's en het project. Eerst lees je **waarom** we met devcontainers werken, daarna volg je het **stappenplan**. Loopt er iets mis? Kijk dan bij [Troubleshooting](#troubleshooting).

:::tip Wat heb je op het einde van deze pagina?
Een private labo-repository op GitHub, die je in VS Code opent in een devcontainer met Node.js en TypeScript. Je installeert daarvoor niets anders dan Docker, Git en VS Code op je eigen computer.
:::

## Waarom devcontainers?

### Wat is een dev environment?

Een Dev Environment (ontwikkelomgeving) is simpelweg een systeem waar alle software, tools en hardware op geïnstalleerd zijn, zodat jij kunt programmeren aan een specifiek project. Met software en tools wordt echt alles bedoeld dat je gebruikt tijdens het programmeren:

- **Code editors**, bv. VS Code of Visual Studio
- **Plugins**, bv. een Markdown extension in VS Code
- **Compilers**, bv. de .NET compiler voor C#
- **Sandbox omgevingen**, bv. Node.js
- ...

Meestal heb je op één toestel meerdere Dev Environments geïnstalleerd. Het is nu eenmaal niet praktisch om rond te lopen met 5 laptops...

### Wat kan er misgaan?

Een Dev Environment is dus vaak een complex systeem van allerlei software, tools en specifieke instellingen die samenwerken. Een paar herkenbare scenario's:

<CardGrid>
  <Card icon="💻" title="Oh nee, mijn laptop is kapot!">
    Je koopt een nieuwe en moet **alle** software opnieuw installeren, in **exact** dezelfde versie. Weet jij nog of je versie 18.17.1 of 17.9.2 had?
  </Card>
  <Card icon="👥" title="Oh nee, een groepswerk!">
    Het project werkt perfect bij jou, maar wil niet draaien bij je teamgenoot. Tijd om elke tool na te kijken op versienummer!
  </Card>
  <Card icon="🕰️" title="Oh nee, een oud project werkt niet meer!">
    Je hebt Node.js geüpdatet voor je nieuwste project. Oeps, je oude projecten die een oudere versie nodig hebben, werken niet meer.
  </Card>
  <Card icon="🔥" title="Deployment hell">
    Alles werkt bij jou en je teamgenoten, maar niet op de server. Opnieuw alle versienummers nakijken...
  </Card>
</CardGrid>

### Docker to the rescue!

We kunnen een Docker Container zo samenstellen dat alle tools en instellingen daarin geïnstalleerd staan. Je installeert niets meer op je eigen systeem, alles zit netjes verpakt in een Docker Container! Zo'n Docker Container waarin je je Dev Environment opslaat voor één specifiek project, dàt heet een **DevContainer**.

<Diagram>
  <DiagramBox variant="outer" icon="💻" title="Jouw computer">
    <DiagramBox variant="item" icon="📝" title="VS Code + Dev Containers extensie" />
    <DiagramBox variant="middle" icon="🐳" title="Docker Desktop">
      <DiagramBox variant="inner" icon="📦" title="Devcontainer">
        <DiagramBox variant="item" title="Node.js + TypeScript" />
        <DiagramBox variant="item" title="ts-node" />
        <DiagramBox variant="item" title="Code van je labo-repo" />
      </DiagramBox>
    </DiagramBox>
  </DiagramBox>
  <DiagramArrow label="push / pull" />
  <DiagramBox variant="remote" icon="☁️" title="GitHub">
    labo-repository
  </DiagramBox>
</Diagram>

Op je eigen computer staan dus enkel VS Code, Docker en Git. Alles wat specifiek is voor het project, zit in de devcontainer.

## Stappenplan in één oogopslag

Volg de stappen in deze volgorde. Klik op een stap om er meteen naartoe te springen.

<StepList>
  <Step title="Installeer de software" href="#stap-1-installeer-de-software">
    [WSL](#installeer-wsl) (enkel Windows), [Docker Desktop](#installeer-docker-desktop) en [Git installeren en configureren](#installeer-git)
  </Step>
  <Step title="Zet GitHub klaar" href="#stap-2-zet-github-klaar">
    [GitHub-account](#maak-een-github-account-aan) en een [private labo-repository](#maak-een-labo-repository-aan)
  </Step>
  <Step title="Stel Visual Studio Code in" href="#stap-3-stel-visual-studio-code-in">
    [VS Code installeren](#installeer-visual-studio-code), [extensies](#vs-code-extensies) en [aanmelden bij GitHub](#authenticeer-met-github-in-vs-code)
  </Step>
  <Step title="Maak je devcontainer aan" href="#stap-4-maak-je-devcontainer-aan">
    [Repository clonen in een container](#labo-devcontainer-aanmaken) en [je configuratie controleren](#controleer-je-configuratie)
  </Step>
</StepList>

## Stap 1: Installeer de software {#stap-1-installeer-de-software}

### WSL installeren {#installeer-wsl}

:::note Enkel voor Windows
Docker Desktop heeft WSL (Windows Subsystem for Linux) nodig op Windows. Werk je op een andere computer, dan sla je deze stap over.
:::

Open PowerShell **als administrator** en kijk na of WSL al geïnstalleerd is, en zo ja, welke versie:

```powershell
wsl --version
```

<details>
<summary>Voorbeeld van de output als WSL geïnstalleerd is</summary>

Je versienummers kunnen verschillen.

```
WSL version: 2.4.10.0
Kernel version: 5.15.167.4
WSLg version: 1.0.65
MSRDC version: 1.2.5620
Direct3D version: 1.611.1-81528511
DXCore version: 10.0.26100.1-240331-1435.ge-release
Windows version: 10.0.26100.3037
```

</details>

Afhankelijk van het resultaat voer je één van deze commando's uit:

| Situatie                      | Commando                          |
| ----------------------------- | --------------------------------- |
| WSL is **al geïnstalleerd**   | `wsl --update`                    |
| WSL is **niet geïnstalleerd** | `wsl --install --no-distribution` |

Meer informatie vind je op [learn.microsoft.com](https://learn.microsoft.com/en-us/windows/wsl/install).

### Docker Desktop installeren {#installeer-docker-desktop}

Download het installatieprogramma via [docker.com](https://www.docker.com/products/docker-desktop/) en voer het uit.

:::danger Geen account nodig
Je hoeft **GEEN** account te maken om Docker Desktop te installeren. Maak je er toch één aan, kijk dan in je mailbox naar de verificatiemail en bevestig je e-mailadres. Anders start je devcontainer later niet op (zie [Troubleshooting](#docker-e-mailadres-niet-geverifieerd)).
:::

### Git installeren en configureren {#installeer-git}

Download het installatieprogramma via [git-scm.com](https://git-scm.com/downloads) en voer het uit.

:::warning Vergeet Git niet te configureren
Na de installatie moet je Git nog vertellen wie je bent, met je naam en e-mailadres. Zonder die instellingen kan je niet committen. Hoe je dat doet, lees je op de Git-pagina onder [Git configureren](./git.md#git-configureren).
:::

## Stap 2: Zet GitHub klaar {#stap-2-zet-github-klaar}

### Maak een GitHub-account aan {#maak-een-github-account-aan}

Maak een GitHub-account aan met je AP e-mailadres, of log in op je bestaande account.

:::tip Al een persoonlijk GitHub-account?
Maak dan geen tweede account aan. Voeg je AP e-mailadres toe als secundair adres in de instellingen. Meerdere accounts zorgen vaak voor [problemen](#meerdere-github-accounts).
:::

### Maak een labo-repository aan {#maak-een-labo-repository-aan}

1. Ga naar GitHub en zorg dat je ingelogd bent.
2. Klik op de tab **Repositories** en vervolgens op **New repository**.
3. Geef je labo-repository een naam, bv. `webontwikkeling-labo`.
4. Kies voor een **Private** repository. De rest van de instellingen laat je op de standaardwaarden staan. Klik op **Create repository**.

## Stap 3: Stel Visual Studio Code in {#stap-3-stel-visual-studio-code-in}

### Installeer Visual Studio Code {#installeer-visual-studio-code}

Download het installatiebestand via [code.visualstudio.com](https://code.visualstudio.com/) en voer het uit.

### VS Code extensies {#vs-code-extensies}

Open Visual Studio Code en open de **Extensions**-tab in de sidebar. Installeer deze twee extensies:

<CardGrid>
  <Card icon="🧩" title="Remote Development">
    Extension pack van Microsoft dat 4 extensies installeert voor ontwikkeling in devcontainers.
    <br />[Bekijk in de Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
  </Card>
  <Card icon="🔀" title="GitHub Pull Requests">
    Koppelt VS Code aan je GitHub-account, zodat je kan aanmelden en met je repositories kan werken.
    <br />[Bekijk in de Marketplace](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github)
  </Card>
</CardGrid>

### Authenticeer met GitHub in VS Code {#authenticeer-met-github-in-vs-code}

1. Klik in Visual Studio Code in de linkeronderhoek op het **avatar**-icoontje.

   <figure><img src={require("/assets/Screenshot 2025-02-05 at 12.41.46.png").default} alt="Het Accounts-menu linksonder in VS Code" /><figcaption><p>De positie van het Accounts menu</p></figcaption></figure>

2. Kies **Sign in to GitHub to use GitHub Pull Requests**.
3. Er opent een browservenster dat je vraagt om te authenticeren. Meld je aan met je GitHub-account.

:::info Pro tip
In hetzelfde menu vind je ook **Sign in to sync settings**. Daarmee worden al je VS Code-instellingen gesynchroniseerd met GitHub. Installeer je ooit VS Code op een andere computer, dan krijgt die automatisch dezelfde instellingen.
:::

## Stap 4: Maak je devcontainer aan {#stap-4-maak-je-devcontainer-aan}

### Labo devcontainer aanmaken {#labo-devcontainer-aanmaken}

Zoek de labo-repository die je eerder aanmaakte op in GitHub en volg deze stappen:

1. Kopieer de **HTTPS Git URL** via de groene **Code**-knop op de repo-pagina.
2. Open VS Code.
3. Open het Command Palette met `CTRL + SHIFT + P`.
4. Zoek naar het command `Dev Containers: Clone Repository in Container Volume...` en druk Enter.
5. Plak de HTTPS Git URL die je kopieerde en druk Enter.
6. Beantwoord de vragen die VS Code stelt:

   | VS Code vraagt naar... | Jij kiest              |
   | ---------------------- | ---------------------- |
   | Branch                 | `main`                 |
   | Container template     | `Node JS & Typescript` |
   | Versie van Node.js     | `24-trixie`            |

7. De devcontainer wordt opgestart en je kan beginnen. Kijk zeker na dat je een bestand kan **pushen** naar de repository.

:::tip Even geduld
De eerste keer opstarten duurt een tijdje, omdat Docker de image moet downloaden. Daarna gaat het een pak sneller.
:::

### Controleer je configuratie {#controleer-je-configuratie}

Open het bestand `.devcontainer/devcontainer.json`. De gemarkeerde regels tonen de keuzes die je net maakte:

```json title=".devcontainer/devcontainer.json" {4,5,6,7,8}
// For format details, see https://aka.ms/devcontainer.json. For config options, see the
// README at: https://github.com/devcontainers/templates/tree/main/src/typescript-node
{
  "name": "Node.js & TypeScript",
  // Or use a Dockerfile or Docker Compose file. More info: https://containers.dev/guide/dockerfile
  "image": "mcr.microsoft.com/devcontainers/typescript-node:5-24-trixie",
  "features": {}

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

:::info Checklist: ben je klaar?

- ✅ De devcontainer start op in VS Code.
- ✅ `.devcontainer/devcontainer.json` bevat de image `typescript-node:5-24-trixie`.
- ✅ Je kan een bestand committen en pushen naar je labo-repository.
  :::

## Troubleshooting

Zoek je probleem op in de tabel en klik door naar de oplossing.

| Probleem                                                                              | Oplossing                                                                                 |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Clonen van je private repo lukt niet, of je wordt met het verkeerde account aangemeld | [Meerdere GitHub-accounts](#meerdere-github-accounts)                                     |
| Foutmelding dat je WSL-versie niet up-to-date is                                      | [WSL-versie is niet up-to-date](#wsl-versie-is-niet-up-to-date)                           |
| Devcontainer start niet en je hebt een Docker-account                                 | [Docker e-mailadres niet geverifieerd](#docker-e-mailadres-niet-geverifieerd)             |
| Foutmelding dat virtualisatie niet ingeschakeld is                                    | [Virtualisatie is niet ingeschakeld in BIOS](#virtualisatie-is-niet-ingeschakeld-in-bios) |

### Meerdere GitHub-accounts {#meerdere-github-accounts}

Als je meerdere GitHub-accounts hebt, kan het zijn dat je problemen ondervindt bij het clonen van je private repo: je computer probeert dan in te loggen met het verkeerde account.

**Oplossing:** verwijder je GitHub-account uit de Windows Credential Manager. Zoek in Windows naar "Credential Manager" (in het Nederlands: Aanmeldingsgegevensbeheer of Referentiebeheer) en verwijder alle credentials die beginnen met `git:https://github.com`.

**Voorkomen:** gebruik slechts één GitHub-account. Je kan meerdere e-mailadressen toevoegen aan je GitHub-account, dus je kan je AP e-mailadres gewoon toevoegen aan je persoonlijke account.

### WSL-versie is niet up-to-date {#wsl-versie-is-niet-up-to-date}

Je probeert de devcontainer te openen, maar krijgt een foutmelding dat je WSL-versie niet up-to-date is.

**Oplossing:**

1. Open PowerShell als administrator (rechtermuisknop op het PowerShell-icoontje, kies **Run as Administrator**).
2. Voer de volgende commando's uit:

   ```powershell
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   wsl --set-default-version 2
   wsl --update
   ```

3. Herstart je computer om zeker te zijn dat alles goed werkt.

### Docker e-mailadres niet geverifieerd {#docker-e-mailadres-niet-geverifieerd}

De devcontainer start niet op omdat je Docker-account niet geverifieerd is. Je hoeft niet per se een Docker-account te hebben, maar als je er wel één hebt, **moet** je dat e-mailadres verifiëren.

**Oplossing:** log in op [hub.docker.com](https://hub.docker.com/) en klik op de link in de verificatiemail die je van Docker kreeg.

### Virtualisatie is niet ingeschakeld in BIOS {#virtualisatie-is-niet-ingeschakeld-in-bios}

Je probeert de devcontainer te openen, maar krijgt een foutmelding dat virtualisatie niet ingeschakeld is in BIOS.

**Oplossing:** schakel virtualisatie in via de BIOS. Hoe dat moet, hangt af van je computer. Zoek op Google naar "enable virtualization in BIOS" en de naam van je computer of moederbord, of vraag hulp aan de lector.

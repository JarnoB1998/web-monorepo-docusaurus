# Projectopdracht webontwikkeling

## Jouw repo in de Github Organisatie

1. Maak een GitHub-account aan met je AP e-mailadres, of log in op je bestaande account. Heb je al een GitHub-account met een persoonlijk e-mailadres? Dan kan je jouw AP e-mailadres als secundair adres toevoegen in de instellingen.
2. Ga naar de [uitnodigingslink](https://github-inviter-webontwikkeling-2026.vercel.app/?key=i-love-ts) van onze GitHub-organisatie.
3. Vul je `ap.student.be` e-mailadres in en klik op **Request invite**.
4. Je ontvangt een e-mail van GitHub met een uitnodiging om lid te worden van de organisatie. Klik op **Join**.
5. Klik op GitHub op je profielfoto rechtsboven en kies **Your organizations**. De organisatie van dit vak heet **`webontwikkeling-<academiejaar>`**, met het lopende academiejaar in de vorm `jjjj-jjjj`. Klik erop.
6. Klik op de tab **Repositories** en vervolgens op **New repository**.
7. Kies een naam volgens deze naamgevingsconventie: `projectopdracht-webontwikkeling-<je naam>`. Vervang `<je naam>` door je eigen naam.
8. Kies voor een **Private** repository. De rest van de instellingen laat je op de standaardwaarden staan. Klik op **Create repository**.

## Devcontainer

1. Clone de repository in een container volume. (ctrl-shift-p -> `Remote-Containers: Clone Repository in Container Volume...`)&#x20;
2. Kies `main` als branch
3. Als er gevraagd wordt achter de container template: Kies `Node JS & Typescript`
4. Als er gevraagd wordt welke versie van Node JS je wil gebruiken: Kies `24-trixie`
5. Als er gevraagd wordt welke extra features je wil installeren: Kies dan `ts-node`
6. Vervolgens zal de devcontainer worden opgestart en kan je beginnen met het project. Kijk zeker na dat je een bestand kan pushen naar de repository.

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


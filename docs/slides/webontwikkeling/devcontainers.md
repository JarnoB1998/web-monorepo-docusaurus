---
marp: true
theme: gaia
class: lead
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.svg')
style: |
  section &#123;
    font-size: 24px;
    text-align: left;
  &#125;
  h1 &#123;
    color: #e63946;
  &#125;
  h2 &#123;
    color: #457b9d;
  &#125;
  strong &#123;
    color: #e63946;
  &#125;
---

# Devcontainers

Webontwikkeling 2024

---

## Dev Environment

Een **Dev Environment** is een systeem waar alle software, tools en hardware op geïnstalleerd zijn om te programmeren.

* **Code Editors** (bv. VS Code, Visual Studio)
* **Plugins** (bv. Markdown extension, ESLint)
* **Compilers & Runtimes** (bv. .NET, NodeJS)
* **Sandbox omgevingen**
* ...

---

## Het Probleem

Dev Environments zijn complex en fragiel.

* **Laptop Kapot?** Alles opnieuw installeren en configureren.
* **Groepswerk?** "It works on my machine!" (versieconflicten).
* **Oude Projecten?** Nieuwere Node versie breekt oude projecten.
* **Deployment Hell?** Verschil tussen dev en productie omgeving.

---

## Docker to the Rescue!

Gebruik een **Docker Container** waarin alle tools en instellingen vooraf geïnstalleerd zijn.

* Je installeert **niets** op je eigen host systeem (behalve Docker & VS Code).
* Alles zit verpakt in de container.
* Iedereen gebruikt **exact** dezelfde omgeving.
* Dit heet een **DevContainer**.

---

## Wat heb je nodig?

Slechts 3 programma's:

1. **Git** (Versiebeheer)
2. **Docker Desktop** (De container engine)
   * *Op Windows heb je ook WSL (Windows Subsystem for Linux) nodig.*
3. **Visual Studio Code** (Code Editor)

---

## Installatie (Windows)

Eerst checken of het al geïnstalleerd is:
```powershell
wsl --version
```

Je kan best altijd de laatste WSL versie installeren:
```powershell
wsl --update
```

Als je nog niets geïnstalleerd hebt, volg dan deze stappen:

```powershell
wsl --install --no-distribution
```

---

## Docker Desktop Installeren

1. Ga naar: https://www.docker.com/products/docker-desktop
2. Download de Windows of Mac versie.
3. Installeer Docker Desktop.
4. Herstart je computer indien gevraagd.

**Je hoeft GEEN account aan te maken of in te loggen. Doe je dit wel dan MOET je je mail verifiëren.**


---

## VS Code Extensions

Installeer de volgende extensies voor een vlotte werking:

1. **Remote Development Extension Pack** (Microsoft)
   * Bevat o.a. *Dev Containers*, *Remote - SSH*, ...
2. **GitHub Pull Request**
   * Voor makkelijke integratie met GitHub.

---

## Authenticatie

Log in Visual Studio Code in met GitHub.

1. Klik op het **Accounts** icoon (linker onderhoek).
2. Kies **Sign in to GitHub**.

---

## Eigen Repository Aanmaken

- Ga naar Github en zorg dat je ingelogd bent.
- Klik op de tab **Repositories** en vervolgens op **New repository**.
- Kies een naam en een **Private** repository.
- Klik op **Create repository**.

---

## Een DevContainer Starten

**Vanuit een bestaande Repo:**

1. Kopieer de HTTPS Git URL van de repo.
2. Open VS Code Command Palette (`F1` of `Ctrl/Cmd + Shift + P`).
3. Zoek commando: **Dev Containers: Clone Repository in Container Volume...**
4. Plak de URL en druk op Enter.

Docker zal nu de container bouwen (duurt even de eerste keer).

---

---
name: publish
description: Commit, push en publiceer de cursussite. Gebruik dit wanneer de gebruiker vraagt om wijzigingen te committen, te pushen of online te zetten ("publish", "deploy", "zet online").
---

# Committen, pushen en publiceren

Er is geen aparte deploy-stap: **pushen naar `main` = publiceren**. Een push
start automatisch drie deploys:

| Doel | Hoe | URL |
| --- | --- | --- |
| **Vercel (productie)** | Vercel GitHub-integratie | `https://webontwikkeling.cloud-ap.be/` |
| GitHub Pages | workflow `.github/workflows/deploy.yml` | `https://similonap.github.io/webontwikkeling-docusaurus/` |
| Cloudflare Workers | Cloudflare GitHub-integratie | zie Cloudflare-dashboard |

Volg deze stappen in volgorde. Stop en meld het aan de gebruiker als een stap faalt.

## 1. Bekijk wat er gecommit wordt

```bash
git status --short
git diff --stat
git log --oneline -5
```

- Commit enkel bestanden die bij de gevraagde wijziging horen. Laat losse
  bestanden (bv. `build_output.log`, `.idea/`) buiten de commit.
- Werk rechtstreeks op `main`: dat is de werkwijze in deze repo, en enkel
  `main` wordt gepubliceerd.

## 2. Commit

- Commitboodschap in het Nederlands, gebiedende wijs, zoals de bestaande
  historie (bv. "Voeg ... toe", "Maak ... overzichtelijker").
- Korte titelregel, optioneel een witregel en wat uitleg.
- Voeg de attributieregel toe die de harness voorschrijft.

## 3. Controleer de build lokaal

De CI-build moet slagen, anders wordt er niets gepubliceerd. Bouw daarom eerst
lokaal, naar een tijdelijke map zodat `build/` niet wijzigt:

```bash
npx docusaurus build --out-dir /tmp/docu-build-check > /tmp/docu-build-check.log 2>&1; echo "exit=$?"
grep -iE "error|broken|Generated static" /tmp/docu-build-check.log
rm -rf /tmp/docu-build-check
```

- `exit=0` is vereist.
- Broken-link warnings zijn geen fout (`onBrokenLinks: 'warn'`). Deze vier
  bestonden al en mag je negeren:
  `/exercises/mongodb/pet-shelter-express-test`, `/labos/labo10`,
  `/labos/labo6`, `/mongodb/gebruik-in-express.js`.
  Nieuwe warnings op pagina's die je net aanpaste, los je eerst op.
- Draait er al een dev server, gebruik dan geen poort die botst; de build
  heeft geen poort nodig.

## 4. Push

```bash
git fetch -q origin
git status -sb | head -1        # verwacht: "ahead N", niet "behind"
git push origin main
```

Staat `main` achter op `origin/main`, doe dan eerst `git pull --rebase origin main`
en herhaal stap 3. Nooit force-pushen.

## 5. Volg de deploys op

GitHub Pages-workflow:

```bash
gh run list --workflow deploy.yml --branch main --limit 1
gh run watch <run-id> --exit-status
```

Vercel en Cloudflare verschijnen als deployment of check run op de commit:

```bash
gh api "repos/similonap/webontwikkeling-docusaurus/deployments?per_page=3" \
  --jq '.[] | {environment, sha: .sha[0:8], creator: .creator.login}'
gh api repos/similonap/webontwikkeling-docusaurus/commits/<sha>/check-runs \
  --jq '.check_runs[] | {name, status, conclusion}'
```

Wacht in de achtergrond met een poll-lus, niet met een losse `sleep`. Faalt de
GitHub-run, haal dan de logs op met `gh run view <run-id> --log-failed`.

## 6. Controleer de live site

`trailingSlash: false` laat Docusaurus `pagina.html` genereren. Op Vercel geeft
de propere URL (`/tooling/devcontainers`) daardoor een 404 bij rechtstreeks
openen; navigeren vanaf de homepagina werkt wel. Controleer daarom met `.html`
en zoek naar een tekst die je net toevoegde:

```bash
curl -s https://webontwikkeling.cloud-ap.be/tooling/devcontainers.html | grep -c "<nieuwe tekst>"
```

## 7. Rapporteer

Meld kort welke commits gepusht zijn, hoe elke deploy afliep en of de nieuwe
inhoud live staat.

## Opmerking

`.claude/` staat in de globale gitignore van de gebruiker. Deze skill wordt
daardoor niet mee gecommit, tenzij de gebruiker vraagt om hem te forceren.

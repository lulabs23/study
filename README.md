# Études

Notes, fiches de cours, QCM et emploi du temps Unicaen. Même construction que Finances : React + Vite, données dans le téléphone, sauvegarde dans un Gist GitHub privé.

## 1. Mise en ligne

1. Créer un dépôt **public** `etudes` sur GitHub et y déposer tout le contenu de ce dossier (Add file → Upload files), dossier `.github` compris.
2. Settings → Pages → Source : **GitHub Actions**.
3. Le déploiement se lance tout seul. L'application est à l'adresse `https://<compte>.github.io/etudes/`.
4. Sur l'iPhone : Safari → Partager → **Sur l'écran d'accueil**. Elle fonctionne ensuite hors ligne.

## 2. Synchronisation entre appareils (Gist)

1. Créer un token : github.com/settings/personal-access-tokens/new
   - Repository access : *Only select repositories* → `etudes`
   - Repository permissions : **Actions → Read and write** (bouton Actualiser de l'EDT)
   - Account permissions : **Gists → Read and write**
2. Dans l'application : Paramètres → Synchronisation Gist → coller le token → Connecter.
3. Sur les autres appareils, coller le même token : le Gist existant est retrouvé.

Le plus récent l'emporte : une modification faite hors ligne est envoyée au retour du réseau.

## 3. Emploi du temps Unicaen

L'emploi du temps est lu dans l'agenda « Emploi du temps » du webmail Unicaen, par le workflow `EDT Unicaen` (toutes les 3 heures, de 5 h à 20 h environ). Le résultat est écrit dans le Gist (`edt.json`), que l'application lit.

Le mot de passe n'est jamais dans l'application ni dans le Gist : il est rangé chiffré dans les secrets du dépôt, que seul ce workflow peut lire. Ne le communiquer à personne.

1. Settings → Secrets and variables → Actions → **New repository secret**, trois fois :
   | Nom | Valeur |
   | --- | --- |
   | `UNICAEN_USER` | identifiant de l'ENT |
   | `UNICAEN_PASSWORD` | mot de passe de l'ENT |
   | `GIST_TOKEN` | le token de l'étape 2 |
2. Actions → **EDT Unicaen** → Run workflow (première récupération).
3. Dans l'application, le bouton Actualiser relance le workflow puis recharge l'EDT (environ 30 s).

Si le journal du workflow affiche une erreur 401, l'identifiant ou le mot de passe est refusé. GitHub suspend les tâches planifiées d'un dépôt sans activité depuis 60 jours : il suffit alors de relancer le workflow à la main.

Sans ces secrets, un fichier `.ics` peut être importé depuis Paramètres → Emploi du temps.

Réglages facultatifs (secrets ou variables d'environnement du workflow) : `GIST_ID`, `EDT_SEMAINES_AVANT` (2), `EDT_SEMAINES_APRES` (16), `UNICAEN_AGENDA` (« Emploi du temps »).

## 4. Notes

La maquette du S1 BUT GEA (UE, ressources, coefficients du relevé ScoDoc) est préremplie ; Notes → Maquette pour l'ajuster ou créer le S2 (« Dupliquer » recopie la structure).

- Moyenne de ressource : moyenne des évaluations pondérée par leur coefficient (notes ramenées sur 20).
- Moyenne d'UE : moyenne des ressources notées pondérée par leurs coefficients, plus bonus, moins malus.
- « À viser » : note à obtenir partout où il reste à évaluer pour finir l'UE à 10. Une note laissée vide compte comme évaluation à venir ; une ressource sans évaluation compte comme entièrement à venir.

## 5. Formats d'import

QCM (fichier `.json` ou texte collé, plusieurs QCM possibles dans une liste) :

```json
{
  "titre": "Bilan",
  "matiere": "Comptabilité",
  "questions": [
    {
      "enonce": "Où figure le capital social ?",
      "propositions": ["Actif immobilisé", "Capitaux propres", "Dettes"],
      "reponses": [1],
      "explication": "Apport des associés : capitaux propres.",
      "theme": "Bilan"
    }
  ]
}
```

`reponses` contient les indices des bonnes propositions (0 = la première) ; les lettres (`"B"`) et plusieurs bonnes réponses sont acceptées. `matiere` peut être un code (`R1.07`) ou un intitulé.

Fiches : fichiers `.md` / `.txt` (le titre `# …` devient le titre de la fiche) ou JSON `{ "titre", "matiere", "contenu" }`. Mise en forme reconnue : `##` titres, `**gras**`, `==surligné==`, listes, `> encadré`, tableaux, `- [ ]` cases à cocher.

## Développement

```bash
npm install
npm run dev
```

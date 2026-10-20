# Gestion Scolaire — Applications natives (Windows, macOS, Android)

Ce dossier contient les projets nécessaires pour transformer l'application web
`gestion-ecole.html` en **vraies applications installables** :

- `electron/` → application **Windows (.exe)** et **macOS (.dmg)**
- `android/` → application **Android (.apk)**

Dans les deux cas, c'est **exactement la même application** (mêmes données,
mêmes écrans, mêmes fonctionnalités) — seulement emballée pour s'installer et
se lancer comme un vrai logiciel, avec son icône, sans passer par un
navigateur.

---

## ⚠️ Point important : les données ne sont PAS partagées automatiquement

Chaque version de l'application (le navigateur, l'app Windows, l'app Mac,
l'app Android) **stocke ses données séparément**, sur l'appareil où elle
tourne. Si vous saisissez des élèves dans l'app Windows de l'ordinateur du
bureau, ces données **n'apparaîtront pas automatiquement** dans l'app Android
du téléphone d'un enseignant, ni dans la version navigateur.

**Solution : utilisez la fonction d'export/import déjà présente dans
l'application** (menu de sauvegarde → exporter un fichier JSON → le
transférer (clé USB, email, etc.) → l'importer dans l'autre appareil). C'est
le même mécanisme qui vous permet déjà de sauvegarder vos données.

➡️ Si plusieurs personnes doivent voir les **mêmes données en même temps**
(par exemple plusieurs enseignants saisissant les présences), il faudra à
terme une version "serveur" centralisée — ce n'est pas ce que ces
applications natives font : elles restent, comme l'app web actuelle, des
applications **offline, à données locales**.

---

## Comment obtenir les vrais fichiers installables (.exe, .dmg, .apk)

Construire un vrai `.exe` nécessite Windows (ou un outillage Windows),
un vrai `.dmg` nécessite macOS, et un vrai `.apk` nécessite tout
l'environnement Android (SDK, Gradle, Java). Rien de tout cela n'est
disponible dans l'environnement où j'ai préparé ces projets. La solution
pratique et gratuite est **GitHub Actions** : un service qui met à
disposition de vraies machines Windows/Mac/Linux pour compiler le projet, et
vous rend les fichiers finis.

Le fichier `.github/workflows/build-apps.yml` est déjà prêt pour ça.

### Étapes à suivre

1. Créez un dépôt GitHub (gratuit) si vous n'en avez pas, par exemple
   `gestion-ecole-apps`.
2. Poussez (uploadez) tout le contenu de ce dossier `app-native/` dans ce
   dépôt (en gardant la structure des sous-dossiers `electron/`, `android/`,
   `.github/`).
3. Allez dans l'onglet **Actions** du dépôt sur github.com → le workflow
   « Construire les applications » apparaît → cliquez **Run workflow**.
4. Patientez quelques minutes : trois constructions tournent en parallèle
   (Windows, macOS, Android).
5. Une fois terminé, ouvrez le résultat (le "run") → en bas, section
   **Artifacts** → téléchargez :
   - `GestionScolaire-Windows` → contient le `.exe`
   - `GestionScolaire-macOS` → contient le `.dmg`
   - `GestionScolaire-Android` → contient le `.apk`

Je peux aussi créer ce dépôt GitHub et lancer la construction moi-même si
vous me le demandez et que vous avez un compte GitHub accessible depuis
cette session.

### Alternative : construire localement

Si un jour vous avez accès à un vrai Mac ou PC Windows :

```bash
cd electron
npm install
npm run dist:win     # sur Windows → produit un .exe (installeur + portable)
npm run dist:mac      # sur Mac → produit un .dmg et un .zip
```

Pour Android, il faut Android Studio installé, puis :

```bash
cd android
npm install
npx cap add android
npx cap open android   # ouvre Android Studio, puis Build > Build APK
```

---

## À savoir avant d'installer ces applications

Ces applications ne sont **pas signées numériquement** (la signature de code
coûte un abonnement payant chez Microsoft/Apple/Google que je ne peux pas
souscrire à votre place). Résultat, au premier lancement :

- **Windows** : SmartScreen affichera un avertissement « Éditeur inconnu ».
  Cliquez sur **« Informations complémentaires »** puis **« Exécuter quand
  même »**.
- **macOS** : Gatekeeper bloquera l'ouverture au double-clic. Faites un
  **clic droit sur l'app → Ouvrir**, puis confirmez. (Ou : Réglages Système →
  Confidentialité et sécurité → « Ouvrir quand même ».)
- **Android** : il faudra autoriser **« Installer des applications de
  sources inconnues »** pour le navigateur ou le gestionnaire de fichiers
  utilisé pour installer le `.apk`.

Ce sont des avertissements normaux pour une application non publiée sur un
store officiel — ils n'empêchent pas d'utiliser l'application, et ils ne
signifient pas qu'elle est dangereuse.

---

## Contenu technique (pour référence)

- `electron/` — projet Electron (Node.js + Chromium) qui encapsule
  `gestion-ecole.html` dans une fenêtre d'application de bureau, avec une
  icône personnalisée et des menus en français. Construit avec
  `electron-builder`.
- `android/` — projet Capacitor qui encapsule la même page HTML dans une
  WebView Android native, avec icône et nom d'application personnalisés.
- `.github/workflows/build-apps.yml` — pipeline de construction automatique
  pour les trois plateformes.

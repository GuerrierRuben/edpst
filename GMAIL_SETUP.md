# Configuration Gmail SMTP pour l'envoi d'emails

## 🚀 Étapes pour configurer Gmail SMTP

### 1. Activer la vérification en 2 étapes
1. Allez sur [myaccount.google.com](https://myaccount.google.com)
2. **Sécurité** → **Vérification en 2 étapes**
3. Activez la vérification en 2 étapes si ce n'est pas déjà fait

### 2. Générer un mot de passe d'application
1. Toujours dans **Sécurité** → **Vérification en 2 étapes**
2. En bas : **Mots de passe d'application**
3. Sélectionnez **Mail** et **Autre (nom personnalisé)**
4. Entrez "EDPST Website" comme nom
5. Copiez le mot de passe généré (16 caractères)

### 3. Mettre à jour le fichier .env
Remplacez `votre_mot_de_passe_application_ici` par le mot de passe copié :

```env
GMAIL_USER=eglisededieusalutpourtous@gmail.com
GMAIL_APP_PASSWORD=abcd-efgh-ijkl-mnop
```

### 4. Test
Une fois configuré, vous pourrez envoyer des emails à n'importe quelle adresse !

## 📧 Fonctionnalités incluses

- **Template HTML responsive** avec le design de l'église
- **Version texte** pour les clients email basiques
- **Message original inclus** dans la réponse
- **Logs détaillés** pour le debugging
- **Gestion d'erreurs** complète

## 🧪 Test

Une fois configuré :
1. Envoyez un message de test depuis le site
2. Y répondez depuis l'admin
3. Vérifiez que l'email arrive dans votre boîte mail

## 💡 Conseils

- **Sécurité** : Le mot de passe d'application est spécifique à cette application
- **Limites Gmail** : 500 emails/jour maximum
- **Anti-spam** : Gmail peut marquer les premiers emails comme spam

## 🔄 Migration depuis Resend

Si vous migrez depuis Resend :
- ✅ Désinstallation de Resend effectuée
- ✅ Installation de Nodemailer terminée
- ✅ Code mis à jour pour Gmail SMTP
- 🔄 Il suffit de configurer le mot de passe d'application Gmail

---

**Note** : Avec Gmail SMTP, vous pouvez envoyer à n'importe quelle adresse email !
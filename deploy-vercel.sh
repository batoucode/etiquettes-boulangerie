#!/bin/bash
# ============================================================================
# Script de déploiement automatisé Vercel via GitHub
# Utilisation: ./deploy-vercel.sh [nom-du-projet] [chemin-du-projet]
# ============================================================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Charger les tokens
echo -e "${BLUE}⚙️  Chargement des tokens...${NC}"

if [ ! -f ~/.env.claude ]; then
  echo -e "${RED}❌ ~/.env.claude non trouvé${NC}"
  exit 1
fi

source ~/.env.claude

# Configuration
PROJECT_NAME="${1:-etiquettes-boulangerie}"
PROJECT_PATH="${2:-.}"
REPO_NAME=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g')

echo "  Projet: $REPO_NAME"
cd "$PROJECT_PATH" || exit 1

# Vérifier repo existant
echo -e "${BLUE}⚙️  Vérification repo GitHub...${NC}"
REPO_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/$GITHUB_USER/$REPO_NAME")

if [ "$REPO_EXISTS" == "200" ]; then
  echo "  Suppression repo existant..."
  curl -s -X DELETE \
    -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/$GITHUB_USER/$REPO_NAME" > /dev/null
  sleep 2
fi

# Créer repo
echo -e "${BLUE}⚙️  Création repo GitHub...${NC}"
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\":\"$REPO_NAME\",
    \"private\":false,
    \"auto_init\":true,
    \"description\":\"Déployé avec Claude\"
  }")

if echo "$RESPONSE" | grep -q '"id"'; then
  echo -e "${GREEN}✅ Repo créé${NC}"
else
  echo -e "${RED}❌ Erreur repo${NC}"
  exit 1
fi

# Valider vercel.json
echo -e "${BLUE}⚙️  Vérification vercel.json...${NC}"
if [ ! -f "vercel.json" ]; then
  cat > vercel.json << 'EOFJ'
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [{"source": "/", "destination": "/index.html"}]
}
EOFJ
fi

if ! jq empty vercel.json 2>/dev/null; then
  cat > vercel.json << 'EOFJ'
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [{"source": "/", "destination": "/index.html"}]
}
EOFJ
  echo -e "${YELLOW}⚠️  vercel.json corrigé${NC}"
fi

# Pousser fichiers
echo -e "${BLUE}⚙️  Envoi fichiers GitHub...${NC}"
for FILE in *.html *.css *.js vercel.json .gitignore README.md; do
  [ -f "$FILE" ] || continue
  
  CONTENT=$(base64 -w 0 "$FILE")
  curl -s -X PUT \
    -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/$GITHUB_USER/$REPO_NAME/contents/$FILE" \
    -d "{\"message\":\"Deploy: $FILE\",\"content\":\"$CONTENT\"}" > /dev/null 2>&1
  
  echo "  ✅ $FILE"
done

# Créer projet Vercel
echo -e "${BLUE}⚙️  Création projet Vercel...${NC}"
RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  https://api.vercel.com/v10/projects \
  -d "{\"name\":\"$REPO_NAME\",\"gitRepository\":{\"type\":\"github\",\"repo\":\"$GITHUB_USER/$REPO_NAME\"}}")

PROJECT_ID=$(echo "$RESPONSE" | jq -r '.id' 2>/dev/null)
[ -z "$PROJECT_ID" ] && PROJECT_ID=$(curl -s \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v9/projects?search=$REPO_NAME" | jq -r '.projects[0].id' 2>/dev/null)

echo -e "${GREEN}✅ Projet créé${NC}"

# Créer déploiement
echo -e "${BLUE}⚙️  Déploiement Vercel...${NC}"
sleep 2

DEPLOY=$(curl -s -X POST \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.vercel.com/v13/deployments?skipAutoDetectionConfirmation=1&forceNew=1" \
  -d "{
    \"name\":\"$REPO_NAME\",
    \"project\":\"$PROJECT_ID\",
    \"public\":true,
    \"files\":[
      {\"file\":\"index.html\",\"data\":$(base64 -w 0 < index.html | jq -Rs .)},
      {\"file\":\"style.css\",\"data\":$(base64 -w 0 < style.css | jq -Rs .)},
      {\"file\":\"script.js\",\"data\":$(base64 -w 0 < script.js | jq -Rs .)},
      {\"file\":\"vercel.json\",\"data\":$(base64 -w 0 < vercel.json | jq -Rs .)}
    ]
  }")

DEPLOY_ID=$(echo "$DEPLOY" | jq -r '.id' 2>/dev/null)
DEPLOY_URL=$(echo "$DEPLOY" | jq -r '.url' 2>/dev/null)

if [ -z "$DEPLOY_ID" ] || [ "$DEPLOY_ID" == "null" ]; then
  echo -e "${RED}❌ Erreur déploiement${NC}"
  exit 1
fi

# Résumé
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ DÉPLOIEMENT RÉUSSI !${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📁 GitHub${NC}   https://github.com/$GITHUB_USER/$REPO_NAME"
echo -e "${BLUE}🚀 Vercel${NC}   https://$DEPLOY_URL"
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"

# Polymarket Trading Bot - Credential Generation

Génère les credentials CLOB pour trader sur Polymarket.

## Format .env (entrée)

```env
# Ethereum Private Key
# Format: hex (64 caractères) avec préfixe 0x = 66 caractères
# Longueur: 256 bits / 32 bytes
# blockchain: Ethereum (ou EVM compatible)
PRIVATE_KEY=0x...
```

## Format .credentials.json (sortie)

```json
{
  "POLYMARKET_PRIVATE_KEY": "0x...",
  "POLYMARKET_CLOB_API_KEY": "...",
  "POLYMARKET_CLOB_API_SECRET": "...",
  "POLYMARKET_CLOB_API_PASSPHRASE": "...",
  "address": "0x...",
  "generatedAt": "2025-..."
}
```

## Utilisation

```bash
# 1. Configurer la clé privée dans .env
echo "PRIVATE_KEY=0x_votre_cle" > .env

# 2. Générer les credentials
npm run generate-credentials
```

## Commandes

| Commande | Description |
|----------|-------------|
| `npm run generate-credentials` | Génère les credentials CLOB |
| `npm run build` | Compile TypeScript |

## Sécurité

- Ne jamais commiter `.env` et `.credentials.json` dans git
- Garder la clé privée sécurisée
- Les credentials peuvent être regénérés (système déterministe)
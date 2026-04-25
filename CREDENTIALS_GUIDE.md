# Polymarket CLOB Credentials Guide

## Overview

This guide explains how CLOB API credentials work for authenticated trading operations on Polymarket.

## Input Format (.env)

```env
PRIVATE_KEY=0x...  # 64 caractères hex
```

## Output Format (.credentials.json)

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

## Credential Components

| Component | Purpose | Security Level |
|-----------|---------|----------------|
| **POLYMARKET_CLOB_API_KEY** | Public identifier | Low (safe to share) |
| **POLYMARKET_CLOB_API_SECRET** | Signs API requests | Critical |
| **POLYMARKET_CLOB_API_PASSPHRASE** | Additional authentication | Critical |

## Operations Enabled

- Placing market and limit orders
- Canceling open orders
- Querying order history
- Accessing authenticated market data endpoints

## The Deterministic Derivation System

The same private key always produces the same set of credentials:
- **Idempotency**: Multiple runs produce identical credentials
- **Recoverability**: Lost credentials can be regenerated
- **Wallet-Specific**: Each wallet has unique credentials

## Generation Process

```bash
# 1. Set your private key
echo "PRIVATE_KEY=0x_votre_cle" > .env

# 2. Generate credentials
npm run generate-credentials
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Private key not provided" | Ensure `.env` contains `PRIVATE_KEY=0x...` |
| "Failed to generate credentials" | Check network connection |
| "Authentication failed" | Verify private key format |

## Security Rules

1. Never commit `.env` or `.credentials.json` to version control
2. Keep your private key secure
3. Credentials can be regenerated at any time
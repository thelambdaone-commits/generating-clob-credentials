import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { ethers } from "ethers";
import { ClobClient } from "@polymarket/clob-client";

dotenv.config();

interface Credentials {
  POLYMARKET_PRIVATE_KEY: string;
  POLYMARKET_CLOB_API_KEY: string;
  POLYMARKET_CLOB_API_SECRET: string;
  POLYMARKET_CLOB_API_PASSPHRASE: string;
  address: string;
  generatedAt: string;
}

async function checkExistingCredentials(): Promise<boolean> {
  const credPath = path.join(__dirname, "..", ".credentials.json");
  return fs.existsSync(credPath);
}

async function generateCredentials(): Promise<void> {
  console.log("======================================================================");
  console.log("🔑 Polymarket CLOB Credentials Generator");
  console.log("======================================================================");

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey === "your_private_key_here" || privateKey.trim() === "") {
    console.error("\n❌ ERROR: Private key not provided or using placeholder value.");
    console.error("   Please set your actual private key in the .env file.");
    console.error("   Usage: PRIVATE_KEY=0x... npm run generate-credentials");
    process.exit(1);
  }

  console.log("\n📍 Step 1: Creating Wallet...");
  let wallet: ethers.Wallet;
  try {
    wallet = new ethers.Wallet(privateKey);
    console.log(`✅ Wallet Address: ${wallet.address}`);
  } catch (error) {
    console.error("\n❌ ERROR: Failed to create wallet from private key.");
    console.error("   Please ensure PRIVATE_KEY is a valid 64-character hex string.");
    process.exit(1);
  }

  console.log("\n📍 Step 2: Connecting to Polymarket CLOB...");
  const host = "https://clob.polymarket.com";
  const chainId = 137;

  let clobClient: ClobClient;
  try {
    clobClient = new ClobClient(host, chainId, wallet);
    console.log("✅ Connected to CLOB API");
  } catch (error) {
    console.error("\n❌ ERROR: Failed to connect to Polymarket CLOB API.");
    process.exit(1);
  }

  const exists = await checkExistingCredentials();
  if (exists) {
    console.log("\n📝 Existing credentials detected. Using createOrDeriveApiKey...");
  }

  console.log("\n📍 Step 3: Generating API Credentials...");
  console.log("   (This will sign a message with your wallet)");

  let credentials: Credentials;
  try {
    const apiKeyCreds = await clobClient.createOrDeriveApiKey();

    credentials = {
      POLYMARKET_PRIVATE_KEY: privateKey,
      POLYMARKET_CLOB_API_KEY: apiKeyCreds.key,
      POLYMARKET_CLOB_API_SECRET: apiKeyCreds.secret,
      POLYMARKET_CLOB_API_PASSPHRASE: apiKeyCreds.passphrase,
      address: wallet.address,
      generatedAt: new Date().toISOString(),
    };

    console.log("✅ API Credentials Generated Successfully!");
    console.log("======================================================================");
    console.log("📋 Your CLOB API Credentials:");
    console.log("======================================================================");
    console.log(`POLYMARKET_CLOB_API_KEY:        ${credentials.POLYMARKET_CLOB_API_KEY}`);
    console.log(`POLYMARKET_CLOB_API_SECRET:     ${credentials.POLYMARKET_CLOB_API_SECRET}`);
    console.log(`POLYMARKET_CLOB_API_PASSPHRASE: ${credentials.POLYMARKET_CLOB_API_PASSPHRASE}`);
    console.log("======================================================================");
  } catch (error: any) {
    console.error("\n❌ ERROR: Failed to generate API credentials.");
    console.error(`   Error: ${error.message || "Unknown error"}`);
    console.error("\n   Possible causes:");
    console.error("   - Network connectivity issues");
    console.error("   - Invalid private key");
    console.error("   - API server issues");
    process.exit(1);
  }

  console.log("\n💾 Saving credentials to: .credentials.json");
  const credPath = path.join(__dirname, "..", ".credentials.json");
  try {
    fs.writeFileSync(credPath, JSON.stringify(credentials, null, 2));
    console.log("✅ Credentials saved successfully!");
  } catch (error) {
    console.error("\n❌ ERROR: Failed to save credentials to file.");
    process.exit(1);
  }

  console.log("\n📍 Step 4: Testing Credentials...");
  try {
    const testClient = new ClobClient(
      host,
      chainId,
      wallet,
      {
        key: credentials.POLYMARKET_CLOB_API_KEY,
        secret: credentials.POLYMARKET_CLOB_API_SECRET,
        passphrase: credentials.POLYMARKET_CLOB_API_PASSPHRASE,
      }
    );

    const serverTime = await testClient.getServerTime();
    console.log(`✅ Authentication successful! Server time: ${serverTime}`);
  } catch (error: any) {
    console.warn("\n⚠️  WARNING: Credential verification failed.");
    console.warn(`   Error: ${error.message || "Unknown error"}`);
    console.warn("\n   Your credentials were generated but may not work correctly.");
    console.warn("   Try regenerating them or check your network connection.");
  }

  console.log("\n======================================================================");
  console.log("🎉 Credential generation complete!");
  console.log("======================================================================");
  console.log("\nNext steps:");
  console.log("  1. Check your wallet balance");
  console.log("  2. Set token allowances if needed");
  console.log("  3. Start trading with the bot");
  console.log("\n======================================================================");
}

generateCredentials().catch((error) => {
  console.error("\n❌ Unexpected error:", error);
  process.exit(1);
});
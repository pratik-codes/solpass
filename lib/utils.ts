import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as bip39 from "bip39";
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import crypto from "crypto";
import bs58 from "bs58";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a 16-word seed phrase (mnemonic).
 * @returns {string} Seed phrase
 */
export const generateSeedPhrase = (): string => {
  return bip39.generateMnemonic();
};

/**
 * Generates a Solana-compatible keypair (public/private key) from a seed phrase.
 * @param {string} seedPhrase - The seed phrase to generate keys from
 * @returns {object} An object containing the privateKey and publicKey
 */
export const generateKeysFromSeedPhrase = (
  seedPhrase: string,
): { privateKey: string; publicKey: string } => {
  // Validate seed phrase
  if (!bip39.validateMnemonic(seedPhrase)) {
    throw new Error("Invalid seed phrase");
  }

  // Convert mnemonic to seed buffer
  const seedBuffer = bip39.mnemonicToSeedSync(seedPhrase); // Generate seed buffer

  // Derive keypair using Solana's derivation path (44'/501'/0'/0')
  const derivedSeed = derivePath(
    "m/44'/501'/0'/0'",
    seedBuffer.toString("hex"),
  ).key;

  // Generate the keypair using the derived seed (Keypair expects 32-byte seed)
  const keypair = Keypair.fromSeed(derivedSeed.slice(0, 32)); // Take the first 32 bytes

  // Extract only the first 32 bytes for the private key seed
  const privateKeySeed = keypair.secretKey.slice(0, 32); // First 32 bytes are the seed

  // Encode the private key seed in Base58
  const secretKeyBase58 = bs58.encode(Buffer.from(privateKeySeed));

  return {
    privateKey: secretKeyBase58, // Only 32-byte private key seed in bs58
    publicKey: keypair.publicKey.toBase58(), // Public key in Base58 encoding
  };
};

/**
 * Encrypts a message using the user's public and private keys (as base58 strings).
 *
 * @param {string} message - The message to encrypt (normal string)
 * @param {string} userPublicKeyBase58 - The user's public key as a base58 encoded string
 * @param {string} userPrivateKeyBase58 - The user's private key as a base58 encoded string
 * @returns {string} - The base58 encoded encrypted message with nonce
 */
export const encryptMessage = (
  message: string,
  userPublicKeyBase58: string | undefined,
  userPrivateKeyBase58: string | undefined,
): string => {
  // console.log("userPublicKeyBase58", userPublicKeyBase58);
  // console.log("userPrivateKeyBase58", userPrivateKeyBase58);
  // console.log("message", message);

  if (!userPublicKeyBase58 || !userPrivateKeyBase58) {
    return "";
  }

  try {
    // Convert the message string to Uint8Array
    const messageUint8 = new TextEncoder().encode(message);

    // Decode the Base58-encoded public and private keys
    let userPublicKey = new Uint8Array(bs58.decode(userPublicKeyBase58));
    let userPrivateKey = new Uint8Array(bs58.decode(userPrivateKeyBase58));

    // console.log({ userPublicKey, userPrivateKey });

    // If the private key is 64 bytes, use only the first 32 bytes
    if (userPrivateKey.length === 64) {
      userPrivateKey = userPrivateKey.slice(0, 32);
    }

    // if the public key is 64 bytes, use only the first 32 bytes
    if (userPublicKey.length === 64) {
      userPublicKey = userPublicKey.slice(0, 32);
    }

    // console.log({ userPublicKey, userPrivateKey });

    // Ensure the keys are 32 bytes long
    if (userPublicKey.length !== 32 || userPrivateKey.length !== 32) {
      throw new Error(
        "Invalid key size: Public and private keys must be 32 bytes long",
      );
    }

    // Generate a random nonce
    const nonce = nacl.randomBytes(nacl.box.nonceLength);

    // Encrypt the message
    const encrypted = nacl.box(
      messageUint8,
      nonce,
      userPublicKey,
      userPrivateKey,
    );

    // Combine nonce and encrypted message
    const fullMessage = new Uint8Array(nonce.length + encrypted.length);
    fullMessage.set(nonce);
    fullMessage.set(encrypted, nonce.length);

    // Encode to Base58
    return bs58.encode(fullMessage);
  } catch (error) {
    // console.error("Encryption failed:", error);
    return "";
  }
};

/**
 * Decrypts an encrypted message using the user's private key.
 *
 * @param {string} encryptedMessage - The base64 encoded encrypted message with nonce
 * @param {string} userPrivateKeyBase58 - The Base58 encoded user's private key
 * @param {string} userPublicKeyBase58 - The Base58 encoded user's public key
 * @returns {string} - The decrypted message
 */
export const decryptMessage = (
  encryptedMessage: string,
  userPrivateKeyBase58: string,
  userPublicKeyBase58: string,
): string => {
  try {
    // Decode Base58 keys
    let userPrivateKey = new Uint8Array(bs58.decode(userPrivateKeyBase58));
    const userPublicKey = new Uint8Array(bs58.decode(userPublicKeyBase58));

    // Ensure the keys are 32 bytes long
    if (userPublicKey.length !== 32 || userPrivateKey.length !== 32) {
      console.log(userPublicKey.length, userPrivateKey.length);
      throw new Error(
        "Invalid key size: Public and private keys must be 32 bytes long",
      );
    }

    // Decode the encrypted message from Base58
    const messageWithNonce = new Uint8Array(bs58.decode(encryptedMessage));

    // Extract nonce and encrypted message
    const nonce = messageWithNonce.slice(0, nacl.box.nonceLength);
    const encrypted = messageWithNonce.slice(nacl.box.nonceLength);

    // Decrypt the message
    const decrypted = nacl.box.open(
      encrypted,
      nonce,
      userPublicKey,
      userPrivateKey,
    );

    if (!decrypted) {
      throw new Error("Decryption failed");
    }

    // Convert decrypted Uint8Array back to a UTF-8 string
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
};

/**
 * Encrypts the private key using AES-CBC.
 *
 * @param {string} privateKey - The private key to encrypt (in Base58)
 * @param {string} encryptionKey - The key used for encryption (from environment variable)
 * @returns {string} - The Base58 encoded encrypted private key
 */
export const encryptPrivateKey = (
  privateKey: string,
  encryptionKey: string,
): string => {
  // Decode the private key from Base58
  const privateKeyBuffer = bs58.decode(privateKey);

  // Generate a random initialization vector (IV)
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "hex"),
    iv,
  );

  // Encrypt the private key
  const encrypted = Buffer.concat([
    cipher.update(privateKeyBuffer),
    cipher.final(),
  ]);

  // Combine IV and encrypted data
  const fullEncryptedData = Buffer.concat([iv, encrypted]);

  // Return the encrypted private key as a Base58 string
  return bs58.encode(fullEncryptedData);
};

/**
 * Decrypts the private key using AES-CBC.
 *
 * @param {string} encryptedPrivateKey - The base64 encoded encrypted private key with IV
 * @param {string} encryptionKey - The key used for decryption (from environment variable)
 * @returns {string | null} - The decrypted private key or null if decryption fails
 */
export const decryptPrivateKey = (
  encryptedPrivateKey: string,
  encryptionKey: string,
): string | null => {
  try {
    // Decode the base64-encoded encrypted data
    const fullEncryptedData = Buffer.from(encryptedPrivateKey, "base64");

    // Extract IV and encrypted data
    const iv = fullEncryptedData.slice(0, 16); // First 16 bytes are IV
    const encrypted = fullEncryptedData.slice(16);

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(encryptionKey, "hex"),
      iv,
    );

    // Decrypt the private key
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch (error) {
    // console.error('Decryption failed:', error);
    return null;
  }
};

// TODO: move to AES-CBC mode
export const saveKeys = (seed: string, encryptionKey: string | undefined) => {
  if (!encryptionKey) {
    return false;
  }
  const keys = generateKeysFromSeedPhrase(seed);
  console.log({ keys });
  const encryptedPublickKey = encryptPrivateKey(keys.publicKey, encryptionKey);
  const encryptedPrivateKey = encryptPrivateKey(keys.privateKey, encryptionKey);

  sessionStorage.setItem("pk", encryptedPrivateKey);
  sessionStorage.setItem("pbk", encryptedPublickKey);

  return true;
};

export const validatePin = (enteredPin: string, pbk: string, pk: string) => {
  if (!enteredPin || !pbk || !pk) {
    console.error("missing pin or pbk or pk");
    return false;
  }

  const currentEncryptedPin = localStorage.getItem("pin") || "";

  if (!currentEncryptedPin) {
    console.error("missing current pin");
    return false;
  }

  const currentPin = decryptMessage(currentEncryptedPin, pk, pbk);

  if (currentPin === enteredPin) {
    return true;
  }

  return false;
};

export const copyToClipboard = (textToCopy: string) => {
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      toast("Copied to clipboard");
      console.log("Seed phrases copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
};

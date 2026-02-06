---
title: "Introduction"
description: "A simplified primer on encrypting messages for time-travel validation using OpenSSL."
section: "Getting Started"
order: 1
draft: false
---

Welcome to the **Asterisk Pound** communications protocol field guide. This guide explains how to use public-key encryption to securely communicate with yourself (or others) across time.

## TL;DR: Quick Commands

If you already have a public key and just need the commands, here they are:

### 1. Encrypt a message
```bash
# Encrypt 'message.txt' using 'public_key.pem' into 'message.enc'
openssl pkeyutl -encrypt -pubin -inkey public_key.pem -in message.txt -out message.enc
```

### 2. Decrypt a message
```bash
# Decrypt 'message.enc' using 'private_key.pem' back into 'decrypted.txt'
openssl pkeyutl -decrypt -inkey private_key.pem -in message.enc -out decrypted.txt
```

### 3. Create a pre-shared key Hash
```bash
echo -n "randomized-words-and-numbers" | sha256sum | awk '{print $1}' > pre-shared-key.hash
```

### 4. Create an HMAC
```bash
# Create an HMAC for 'message.txt' using a secret key
openssl dgst -sha256 -hmac pre-shared-key.hash < message.txt | awk '{print $2}' > hmac.txt
```

### 4. Verify an HMAC
```bash
# Compare the recomputed HMAC with the one saved in 'hmac.txt'
[ "$(openssl dgst -sha256 -hmac pre-shared-key.hash < decrypted.txt | awk '{print $2}')" == "$(cat hmac.txt)" ] && echo "SUCCESS" || echo "ERROR"
```

---

## How it Works: A Primer

Encryption might seem like magic, but for our purposes, it's just a digital lock and key system. We use **Asymmetric Encryption** (RSA), which involves two different keys:

1.  **Public Key:** Think of this as an open padlock. You give it to anyone (or publish it on this site). Anyone can use it to "lock" (encrypt) a message, but they cannot use it to "unlock" (decrypt) it.
2.  **Private Key:** This is the physical key that fits the padlock. Only the person who created the key pair has this. It is used to "unlock" (decrypt) messages locked by the corresponding public key.

### Why OpenSSL?
OpenSSL is the industry-standard toolkit for TLS and general-purpose cryptography. It's available on almost every Linux/Unix system and is the tool we use for our [Time Travel Validation](/blog/time-travel-validation-with-encryption) process.

## Step-by-Step Guide

### Step 1: Obtain a Public Key and Pre-Shared Key
To send a message that can be verified in the past, you need the public key to encrypt with and a Pre-Shared Secret
that was active at that specific point in time. You can find the 10 most recent keys on our [Public Key History](/docs/public-key-history) page.

Copy the key (including the `BEGIN` and `END` lines) into a file named `public.pem`.
Copy the pre-shared key into a file named `pre-shared-key.hash`.

### Step 2: Prepare Your Message
#### 2.1. Create the Message
```bash
echo "The winning numbers are 4, 8, 15, 16, 23, 42" > message.txt
```

#### 2.2. Create the HMAC
```bash
openssl dgst -sha256 -hmac pre-shared-key.hash < message.txt | awk '{print $2}' > hmac.txt
#f338273f7204756b3a0dfae516209975b18b8d81f56ecc1036bd44710321d412
```
using the stdin will help avoid confusion later in case file names change

### Step 3: Encrypt the Message
Use OpenSSL to encrypt the file. The `-pubin` flag tells OpenSSL you are providing a public key.
```bash
openssl pkeyutl -encrypt -pubin -inkey public.pem -in message.txt -out message.enc
```
The resulting `message.enc` file is now a binary blob that is unreadable without the corresponding private key.

### Step 4: Deliver The Message and Establish a Pre Shared Key
Travel to the time before the key was created and deliver the `message.enc` file to the recipient.

At this time or before, depending on the recipient's familiarity with the protocol, generate a pre-shared key together with random words, or numbers. Hash the list of words as the pre shared key.
```bash
echo -n "randomized-words-and-numbers" | sha256sum | awk '{print $1}' > pre-shared-key.hash
# 78b6809417d78e08fdc14df8d329e50a8a897effc9be0f58974ce7e134d15d4b
```
While encryption hides the message content, an **HMAC (Hash-based Message Authentication Code)** allows you to prove that a message hasn't been tampered with using a pre-shared secret key.

### Step 5: Decrypt the Message
The recipient now has the `message.enc` file and the pre-shared key, and needs to create the private key to decrypt the message and complete the 
```bash
# Decrypt 'message.enc' using 'private_key.pem' back into 'decrypted.txt'
openssl pkeyutl -decrypt -inkey private_key.pem -in message.enc -out decrypted.txt
```


#### 2. Verify the HMAC
To verify the message, the recipient can run a simple comparison. If the HMAC matches the one saved in `hmac.txt`, it will display "SUCCESS".

```bash
# Compare the recomputed HMAC with the content of hmac.txt
[ "$(openssl dgst -sha256 -hmac pre-shared-key.hash < decrypted.txt | awk '{print $2}')" == "$(cat hmac.txt)" ] && echo "SUCCESS" || echo "ERROR"
```


You would also provide the HMAC hash to the recipient so they can verify the integrity of the decrypted message.

## Security Note
**Never share your private key.** If you are generating your own key pairs for testing, keep the `.pem` file containing the private key in a secure location. If someone else gets your private key, they can decrypt any message sent to you.


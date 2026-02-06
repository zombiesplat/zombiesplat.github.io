---
title: "Chrono-Cipher Field Guide"
description: "Communications Protocol"
section: "Getting Started"
order: 2
draft: false
---

Version 1.0 – Draft
---

### 1. Purpose & Scope
The Chrono‑Cipher protocol describes a method for receiving an encrypted message **today** whose decryption key will only be generated **later** by the recipient. The out‑of‑sequence creation of the private/public key pair serves as a proof‑of‑origin that the sender is operating from a point **after** the message was received – i.e., from the recipient’s future.

---

### 2. High‑Level Concept
As seen from the perspective of the recipient, the Chrono‑Cipher protocol operates in four distinct phases, each involving specific actors and actions:

| Phase                              | Actor                  | Action                                                                                                                                                                                                                                                                                                                                               |
|------------------------------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **A – Message Creation**           | Sender (future)        | Compose plaintext; obtain a public key and a pre-shared private key-hash from a public _chronology‑anchored_ ledger that exists after the intended delivery date; generate HMAC of the plaintext with the pre shared key; encrypt the plaintext with the public key                                                                                  |
| **B – Message Delivery**           | Transport (any medium) | Deliver the ciphertext plus digest hash to the intended recipient in the present. Communicate the sender's contribution to the pre-shared private key.                                                                                                                                                                                               |
| **C – Key Generation**             | Recipient (present)    | At a predetermined later moment, generate a fresh asymmetric key pair (private + public). Determine recipient's portions of the pre-shared private key and generate randomly mix sender's contributions before generating the pre-shared private key hash. Publish the public key and pre-shared private key hash to a _chronology‑anchored_ ledger. |
| **D – Decryption & Verification**  | Recipient (present+)   | Decrypt the message with the fresh private key. Validate message authenticity by creating a digest hash of the plaintext and comparing it with the digest hash received earlier.                                                                                                                                                                     |

---

### 3. Assumptions & Preconditions
1. **Trusted Ledger** – A tamper‑evident, time‑stamped ledger (e.g., a blockchain, notarized log, or secure archival service) that records when a public key is published.
2. **Deterministic Token** – The sender includes a unique identifier (UUID, hash of the plaintext, or a nonce) that the future recipient can reference when publishing the public key.
3. **Secure Storage** – The recipient must be able to store the private key securely for the duration between generation and eventual decryption.
4. **Clock Synchronisation** – Both parties agree on a common notion of “present” and “future” (e.g., UTC timestamps) to avoid ambiguity.
5. **Key‑Pair Algorithm** – Any standard asymmetric algorithm (RSA, ECC, Ed25519, etc.) may be used, provided the private key can be generated independently of the public key publication.

---

### 4. Detailed Procedure
#### 4.1. Sender Side (Future)
1. **Compose Plaintext**
2. **Create a Hash-based Message Authentication Code (HMAC)**
   - _Purpose_: uniquely binds the forthcoming public key to this specific message.
3. **Select a Public Key**
   - Use a public key that exists for the recipient for a time that exists after the planned delivery (e.g., a service‑wide “chronology‑anchor” key).
4. **Select a Pre Shared Private Key Hash**
   - Use a private key that exists for the recipient for a time that exists after the planned delivery (e.g., a service‑wide “chronology‑anchor” key).
5. **Encrypt the Plaintext**
   - Apply the chosen asymmetric encryption scheme (or hybrid encryption: symmetric key encrypted with the public key).
   - Store the resulting ciphertext together with the `token`.
6. **Transmit the Ciphertext Package**
   - Send via any channel (email, physical drop, quantum‑secure link, etc.).
   - Include clear instructions for the future recipient: “When you generate your key pair, publish the public key with this token.”

#### 4.2. Recipient Side (Present)
1. **Determine the Trigger Moment**
   - Could be a fixed interval (e.g., 30 days after receipt) or an event‑driven trigger (e.g., after a mission milestone).
   - Having a stream of regularly occurring publishing events is advisable to avoid conspicuous meta data leakage.
2. **Generate Asymmetric Key Pair**
   - Run the chosen key‑generation algorithm locally.
   - **Immediately** store the private key in a secure vault (hardware security module, air‑gapped device, etc.).
3. **Decrypt**
   - Use the locally stored private key to decrypt the ciphertext (or the symmetric session key, if hybrid).
   - Successful decryption demonstrates that the public key was created **after** the message arrived, satisfying the “future‑origin” claim.
4. **Validate Authenticity**
   - Ensure the public key’s metadata (publisher signature, hash of token) matches expectations.
5. **Publish the Public Key**
   - Submit a transaction to the trusted ledger containing:
   - `public_key`
   - `pre-shared-private-key-hash`
   - `timestamp` (ledger‑verified)

---

### 5. Security Considerations
   | Threat                                                                                                                                                                                               | Mitigation                                                                                                       |
   |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
   | **Stream Sniping** – An adversary knows to be watching the sender before a certain date because they suddenly appear on the ledger with minimal activity.                                            | Saturation; A recipient with a regular schedule of activity does not leak meta data thru activity alone.         | 
   | **Evil Maid Attack** – An attack on an unattended device, in which an attacker with physical access alters it in some undetectable way so that they can later access the device, or the data on it.  | Physical security protocols including but not limited to a dead man switch.                                      | 
   | **Ledger Manipulation** – Attempt to back‑date a public‑key entry.                                                                                                                                   | Choose a ledger with strong consensus guarantees (Proof‑of‑Work or Proof‑of‑Stake) and immutable timestamps.     | 
   | **Token Collision** – Two messages accidentally share the same token.                                                                                                                                | Use a sufficiently large random nonce (≥128 bits) and hash the full plaintext to minimise collision probability. | 
   | **Side‑Channel Leakage** – Timing or power analysis during key generation.                                                                                                                           | Perform key generation on air‑gapped hardware; introduce constant‑time operations where feasible.                | 

---

### 6. Example Narrative Walk‑through
> **Day 0 – Present**
> <br>Dr. Aria writes a briefing for her future self, encrypts it with the Chrono‑Anchor public key, and attaches the token c3f9…. She ships the sealed data capsule to the underground lab.
> <br>**Day 30 – Future**
> <br>The lab’s quantum‑secure server generates an Ed25519 key pair, stores the private half in a cold‑storage vault, and publishes the public key to the Temporal Ledger with the token c3f9…. The ledger records a timestamp of “2026‑03‑01 12:00 UTC”.
> <br>**Day 31 – Present (still “now”)**
> <br>Aria’s monitoring script detects the ledger entry, verifies the timestamp is later than the capsule’s arrival, pulls the public key, and decrypts the briefing. The successful decryption proves the message originated from her own future timeline.

---


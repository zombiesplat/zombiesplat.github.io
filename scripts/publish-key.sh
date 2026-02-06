#!/bin/bash

# Configuration
KEYS_DIR="$HOME/keys"
WORDS_DIR="$HOME/random_words"
TEMPLATE_FILE="scripts/templates/key-entry.md.template"
DOCS_PAGE="src/content/docs/public-key-ledger.md"
HASHES_DOCS_PAGE="src/content/docs/pre-shared-key-ledger.md"

# ISO 8601-like timestamp for filenames
TIMESTAMP_ID=$(date +"%Y-%m-%dT%H-%M-%S")
TODAY=$(date +"%Y-%m-%d")

PUBLIC_KEY_FILE="$KEYS_DIR/public_$TIMESTAMP_ID.pem"
PRIVATE_KEY_FILE="$KEYS_DIR/private_$TIMESTAMP_ID.pem"

# Check if a key for today already exists
if [ -d "$KEYS_DIR" ] && ls "$KEYS_DIR"/public_"$TODAY"*.pem 1> /dev/null 2>&1; then
    echo "A public key for today ($TODAY) already exists. Skipping generation."
else
    # Create directories if they don't exist
    mkdir -p "$KEYS_DIR"

    # Generate a new RSA 4096-bit key pair
    echo "Generating new RSA key pair..."
    openssl genrsa -out "$PRIVATE_KEY_FILE" 4096
    openssl rsa -in "$PRIVATE_KEY_FILE" -pubout -out "$PUBLIC_KEY_FILE"
fi

# Check if word files for today already exist
mkdir -p "$WORDS_DIR"
echo "Generating 10 random word files..."
for i in {1..10}; do
    if ls "$WORDS_DIR"/words_"$TODAY"_"$i".txt 1> /dev/null 2>&1; then
        echo "Word files for today (${TODAY}_${i}) already exist. Skipping generation."
    else
        # Use /dev/urandom to generate some random alphanumeric strings as "words"
        # We'll generate 20 "words" per file
        random_content=""
        for j in {1..20}; do
            word=$(tr -dc 'a-z0-9' < /dev/urandom | head -c 8)
            random_content="$random_content $word"
        done
        echo "$random_content" > "$WORDS_DIR/words_${TODAY}_${i}.txt"
    fi
    # No longer creating individual hash files as per new requirement
done

# Generate daily hash content for the ledger
echo "Generating daily hashes..."
DAILY_HASHES_FILE="$WORDS_DIR/hashes_$TODAY.txt"
sha256sum "$WORDS_DIR"/words_"$TODAY"_*.txt | awk '{print $1}' > "$DAILY_HASHES_FILE"

# Update the docs page
echo "Updating $DOCS_PAGE..."

if [ -f "$DOCS_PAGE" ]; then
    # Create the new content in a temporary file
    NEW_DOCS_FILE=$(mktemp)
    
    # Write the header (everything up to and including KEY_LIST_START)
    sed '/<!-- KEY_LIST_START -->/q' "$DOCS_PAGE" > "$NEW_DOCS_FILE"
    echo "" >> "$NEW_DOCS_FILE"

    # Get the 10 most recent public keys
    # Sort by name descending (since they have timestamp in filename)
    LATEST_KEYS=$(ls -1 "$KEYS_DIR"/public_*.pem | sort -r | head -n 10)

    for KEY_PATH in $LATEST_KEYS; do
        # Extract timestamp from filename for display (e.g., public_2026-02-04T23-23-38.pem)
        # We'll convert 2026-02-04T23-23-38 to 2026-02-04 23:23:38
        FILE_TS=$(basename "$KEY_PATH" | sed 's/public_//; s/.pem//')
        DISPLAY_DATE=$(echo "$FILE_TS" | sed 's/\([0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}\)T\([0-9]\{2\}\)-\([0-9]\{2\}\)-\([0-9]\{2\}\)/\1 \2:\3:\4/')
        
        # Format the entry using the template
        sed -e "s|{{CREATION_DATE}}|$DISPLAY_DATE|g" \
            -e "/{{PUBLIC_KEY_CONTENT}}/{r $KEY_PATH" -e "d}" \
            "$TEMPLATE_FILE" >> "$NEW_DOCS_FILE"
        
        echo "---" >> "$NEW_DOCS_FILE"
        echo "" >> "$NEW_DOCS_FILE"
    done

    # Write the footer (everything from KEY_LIST_END onwards)
    sed -n '/<!-- KEY_LIST_END -->/,$p' "$DOCS_PAGE" >> "$NEW_DOCS_FILE"

    # Overwrite the original doc page
    cat "$NEW_DOCS_FILE" > "$DOCS_PAGE"
    rm "$NEW_DOCS_FILE"
else
    echo "Error: $DOCS_PAGE not found. Please create it first with markers."
    exit 1
fi

# Update the hashes docs page
echo "Updating $HASHES_DOCS_PAGE..."

if [ -f "$HASHES_DOCS_PAGE" ]; then
    NEW_HASHES_FILE=$(mktemp)
    
    # Write the header
    sed '/<!-- HASH_LIST_START -->/q' "$HASHES_DOCS_PAGE" > "$NEW_HASHES_FILE"
    echo "" >> "$NEW_HASHES_FILE"

    # Get the 10 most recent daily hash files
    LATEST_DAILY_HASH_FILES=$(ls -1 "$WORDS_DIR"/hashes_*.txt | sort -r | head -n 10)

    for HASH_FILE in $LATEST_DAILY_HASH_FILES; do
        FILE_DATE=$(basename "$HASH_FILE" | sed 's/hashes_//; s/.txt//')
        
        echo "### $FILE_DATE" >> "$NEW_HASHES_FILE"
        echo '```text' >> "$NEW_HASHES_FILE"
        cat "$HASH_FILE" >> "$NEW_HASHES_FILE"
        echo '```' >> "$NEW_HASHES_FILE"
        echo "" >> "$NEW_HASHES_FILE"
    done

    # Write the footer
    sed -n '/<!-- HASH_LIST_END -->/,$p' "$HASHES_DOCS_PAGE" >> "$NEW_HASHES_FILE"

    # Overwrite
    cat "$NEW_HASHES_FILE" > "$HASHES_DOCS_PAGE"
    rm "$NEW_HASHES_FILE"
else
    echo "Warning: $HASHES_DOCS_PAGE not found. Skipping hash update."
fi

echo "Success! Documentation updated."

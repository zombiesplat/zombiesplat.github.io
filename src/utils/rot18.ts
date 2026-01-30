/**
 * ROT18 Cipher implementation
 * ROT13 for letters (a-z, A-Z)
 * ROT5 for numbers (0-9)
 */
export function rot18(str: string): string {
  return str.replace(/[a-zA-Z0-9]/g, (char) => {
    const code = char.charCodeAt(0);

    // Uppercase A-Z (65-90)
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + 13) % 26) + 65);
    }
    // Lowercase a-z (97-122)
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + 13) % 26) + 97);
    }
    // Numbers 0-9 (48-57)
    if (code >= 48 && code <= 57) {
      return String.fromCharCode(((code - 48 + 5) % 10) + 48);
    }

    return char;
  });
}

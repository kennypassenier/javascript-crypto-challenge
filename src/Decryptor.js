// Docs: https://libsodium.gitbook.io/doc/quickstart#how-do-i-encrypt-data
// Include dependencies
const nacl = require("libsodium-wrappers");

module.exports = async (key) => {
    // Wait for the library to become 
    await nacl.ready;
    // Throw error if there is no key
    if(!key){
        throw "no key";
    }
    return ({
        decrypt: (ciphertext, nonce) => nacl.crypto_secretbox_open_easy(ciphertext, nonce, key),
    })
}

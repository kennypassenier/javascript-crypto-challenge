// Docs: https://libsodium.gitbook.io/doc/quickstart#how-do-i-encrypt-data
// Include dependencies
const nacl = require("libsodium-wrappers");

module.exports = async (key) => {
    await nacl.ready;
    // Throw error if there is no key
    if(!key){
        throw "no key";
    }
    return Object.freeze({
        encrypt: (msg) => {
            return{
                nonce: nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES),
                ciphertext: nacl.crypto_secretbox_easy(msg, nonce, key),
            }
        }
    });
}
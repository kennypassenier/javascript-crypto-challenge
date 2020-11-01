// Docs: https://libsodium.gitbook.io/doc/public-key_cryptography/public-key_signatures
// Include dependencies
const nacl = require('libsodium-wrappers');

module.exports = async () => {
    await nacl.ready;
    // Create a public and private key and store them into a variable
    const key = nacl.crypto_sign_keypair();
    return Object.freeze({
        verifyingKey: key.publicKey,
        sign: (msg) => {
            return nacl.crypto_sign(msg, key.privateKey);
        }
    });
}
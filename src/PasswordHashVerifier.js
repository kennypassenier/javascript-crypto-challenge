// Docs: https://libsodium.gitbook.io/doc/quickstart#how-do-i-safely-store-and-later-verify-a-password
// Include dependencies
const nacl = require('libsodium-wrappers');

module.exports = async () => {
    await nacl.ready;
    return({
        verify: (hashedPassword, password) => {
            return nacl.crypto_pwhash_str_verify(hashedPassword, password);
        }
    });
}
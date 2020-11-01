// Include dependencies
const nacl = require('libsodium-wrappers');
const Decryptor = require("../src/Decryptor");
const Encryptor = require("../src/Encryptor");

let client, server = null;
module.exports = async () => {
    await nacl.ready;
    let isClient = null;

    if(!server){
        isClient = false;
        const keys = nacl.crypto_kx_keypair();
        server = {
            publicKey: keys.publicKey,
            privateKey: keys.privateKey,
        }
    }
    else{
        isClient = true;
        const keys = nacl.crypto_kx_keypair();
        const clientSessionKeys = nacl.crypto_kx_client_session_keys(keys.publicKey, keys.privateKey, server.publicKey);
        const serverSessionKeys = nacl.crypto_kx_server_session_keys(server.publicKey, server.privateKey, keys.publicKey);
        client = {
            encryptor: await Encryptor(clientSessionKeys.sharedTx),
            decryptor: await Decryptor(clientSessionKeys.sharedRx),
            publicKey: keys.publicKey,
            privateKey: keys.privateKey, 
        }
        server.encryptor = await Encryptor(serverSessionKeys.sharedTx);
        server.decryptor = await Decryptor(serverSessionKeys.sharedRx);        
    }
    
    return Object.freeze({
        publicKey: isClient ? client.publicKey : server.publicKey,
        encrypt: (msg) => {
            return isClient ? client.encryptor.encrypt(msg) : server.encryptor.encrypt(msg);
        },
        decrypt: (ciphertext, nonce) => {
            return isClient ? client.decryptor.decrypt(ciphertext, nonce) : server.decryptor.decrypt(ciphertext, nonce);
        },
        send: (msg) => {
            isClient ? server.message = client.encryptor.encrypt(msg) : client.message = server.encryptor.encrypt(msg);;
        },
        receive: () => {
            return isClient ? client.decryptor.decrypt(client.message.ciphertext, client.message.nonce) : server.decryptor.decrypt(server.message.ciphertext, server.message.nonce);
        },
    });
    
}

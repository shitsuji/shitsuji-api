import { Component, Inject } from '@nestjs/common';
import {
  Cipher,
  createCipher,
  createDecipher,
  Decipher,
  HexBase64BinaryEncoding,
  Utf8AsciiBinaryEncoding
} from 'crypto';
import * as fs from 'fs';
import { pki, ssh } from 'node-forge';
import * as util from 'util';
import { CONFIG } from '../../constants';
import { ShitsujiConfig } from '../../models/config.model';
import { Keypair } from '../../models/keypair.model';

@Component()
export class CryptoService {
  private inputEncoding: Utf8AsciiBinaryEncoding = 'utf8';
  private outputEncoding: HexBase64BinaryEncoding = 'hex';

  constructor(@Inject(CONFIG) private config: ShitsujiConfig) {}

  async generateKeypair(): Promise<Keypair> {
    const asyncGen = util.promisify(pki.rsa.generateKeyPair);
    console.log(new Date());
    const keypair = await asyncGen({
      bits: 4096,
      workers: 4
    });
    console.log(new Date());

    const privateKey = pki.privateKeyToPem(keypair.privateKey);
    const publicKey = ssh.publicKeyToOpenSSH(keypair.publicKey);

    console.log(new Date());
    return {
      privateKey,
      publicKey
    };
  }

  encrypt(privateKey: string) {
    const cipher = createCipher('aes256', this.config.secret);
    const ciphered = cipher.update(privateKey, this.inputEncoding, this.outputEncoding);

    return ciphered + cipher.final(this.outputEncoding);
  }

  decrypt(privateKeyHash: string) {
    const decipher = createDecipher('aes256', this.config.secret);
    const deciphered = decipher.update(privateKeyHash, this.outputEncoding, this.inputEncoding);

    return deciphered + decipher.final(this.inputEncoding);
  }
}

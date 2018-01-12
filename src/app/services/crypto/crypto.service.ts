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
import * as jsjws from 'jsjws';
import { pki, ssh } from 'node-forge';
import { CONFIG } from '../../constants';
import { ShitsujiConfig } from '../../models/config.model';
import { Keypair } from '../../models/keypair.model';

@Component()
export class CryptoService {
  private inputEncoding: Utf8AsciiBinaryEncoding = 'utf8';
  private outputEncoding: HexBase64BinaryEncoding = 'hex';

  constructor(@Inject(CONFIG) private config: ShitsujiConfig) {}

  async generateKeypair(): Promise<Keypair> {
    const keypair = jsjws.generatePrivateKey(4096, 65537);
    const privateKey = keypair.toPrivatePem();
    const publicKey = ssh.publicKeyToOpenSSH(pki.publicKeyFromPem(keypair.toPublicPem()));

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

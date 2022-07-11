import { Eip1193Bridge } from '@ethersproject/experimental/lib/eip1193-bridge';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ethers } from 'ethers';

Cypress.Commands.overwrite('visit', (original, url, options) => {
  let rinkebyProvider = ethers.getDefaultProvider('rinkeby');
  return original(url, {
    ...options,
    onBeforeLoad(win) {
      options && options.onBeforeLoad && options.onBeforeLoad(win);
      win.localStorage.clear();
      const provider = new JsonRpcProvider(rinkebyProvider, 4);  // Ropsten Test Network
      const signer = new Wallet(Cypress.env('wallet_private_key'), provider);
      win.ethereum = new Eip1193Bridge(signer, provider);
    },
  });
});

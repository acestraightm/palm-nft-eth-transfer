import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { TransactionReceipt } from "@ethersproject/abstract-provider/src.ts";

import { networkChainId, networkName } from "const";
import { wei2Number } from "utils/helper";
import { ERROR_WALLET_DISCONNECTED, msgSwitchToNetwork } from "const/messages";
import toast from "react-hot-toast";

type Provider = Web3Provider | null;

interface WalletContextInterface {
  provider: Provider;
  connect: () => Promise<Provider>;
  walletAddress: string | null;
  ethBalance: number | null;
  sendETHs: (address: string, amount: number) => Promise<TransactionReceipt|null>;
}

const defaultContext = {
  provider: null,
  connect: () => Promise.resolve(null),
  walletAddress: null,
  ethBalance: null,
  sendETHs: () => Promise.resolve(null),
};

const WalletContext = React.createContext<WalletContextInterface>(defaultContext);

interface WalletContextProviderProps {
  children?: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<Provider>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<number | null>(null);

  // Initialize context with provider
  const initializeProvider = async (provider: Web3Provider) => {
    const accounts = await provider.listAccounts();

    // If no account is connected to wallet, just ignore the provider.
    if (accounts.length === 0) {
      return;
    }

    const network = await provider.getNetwork();

    if (network.chainId !== networkChainId) {
      toast.error(msgSwitchToNetwork(networkName));
      return;
    }

    setWalletAddress(accounts[0]);
    setProvider(provider);
  };

  // Shows web3 modal for connecting wallet.
  const connect = useCallback(async () => {
    const modal = new Web3Modal();

    try {
      const connection = await modal.connect();
      const provider = new Web3Provider(connection);

      initializeProvider(provider);
      return provider;
    } catch (err: any) {
      toast.error(err.message || "Failed to connect Wallet");
    }

    return null;
  }, []);

  // Send transaction
  const sendETHs = useCallback(
    async (address: string, amount: number) => {
      if (!provider || !walletAddress) {
        toast.error("Provider not initialized");
        return;
      }
      try {
        const tx = {
          to: address,
          value: ethers.utils.parseUnits(amount.toString(), "ether").toHexString(),
        };

        const transaction = await provider.getSigner().sendTransaction(tx);
        const txReceipt = await transaction.wait();

        updateBalance();
        return txReceipt;
      } catch (err: any) {
        toast.error(err.message || "Failed to send transaction");
      }
      return null;
    },
    [provider, walletAddress]
  );

  // Update ETH balance.
  const updateBalance = useCallback(async () => {
    if (!provider || !walletAddress) {
      return;
    }

    const eth = await provider.getBalance(walletAddress);
    setEthBalance(wei2Number(eth));
  }, [provider, walletAddress]);

  // Restore provider if wallet had been connected.
  useEffect(() => {
    try {
      const provider = new Web3Provider(window.ethereum, "any");
      initializeProvider(provider);
    } catch {}
  }, []);

  // Update balance when account is changed.
  useEffect(() => {
    if (walletAddress) {
      updateBalance();
    } else {
      setEthBalance(null);
    }
  }, [walletAddress]);

  useEffect(() => {
    // Monitor wallet disconnection.
    const { ethereum } = window;

    if (!ethereum) {
      return;
    }

    const onAccountChange = (accounts: string[]) => {
      if (accounts.length === 0) {
        toast.error(ERROR_WALLET_DISCONNECTED);

        setWalletAddress(null);
        setProvider(null);
        return;
      }

      setWalletAddress(accounts[0]);
    };

    const onChainChange = (chainId: string) => {
      if (Number(chainId) === networkChainId) {
        return;
      }

      toast.error(msgSwitchToNetwork(networkName));

      setWalletAddress(null);
      setProvider(null);
    };

    ethereum.on("accountsChanged", onAccountChange);
    ethereum.on("chainChanged", onChainChange);

    return () => {
      ethereum.removeListener("accountsChanged", onAccountChange);
      ethereum.removeListener("chainChanged", onChainChange);
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connect,
        provider,
        walletAddress,
        ethBalance,
        sendETHs
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => React.useContext(WalletContext);

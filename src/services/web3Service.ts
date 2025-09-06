import { ethers } from 'ethers';
import { createPublicClient, createWalletClient, http, webSocket } from 'viem';
import { mainnet, sepolia, polygon, arbitrum } from 'viem/chains';

// Web3 Configuration
export const SUPPORTED_CHAINS = {
  mainnet,
  sepolia,
  polygon,
  arbitrum,
} as const;

export type SupportedChain = keyof typeof SUPPORTED_CHAINS;

// Contract Addresses (you'll need to deploy these contracts)
export const CONTRACT_ADDRESSES = {
  sepolia: {
    identityVerifier: '0x...', // Replace with actual contract address
    nftCollection: '0x...', // Replace with actual contract address
  },
  polygon: {
    identityVerifier: '0x...', // Replace with actual contract address
    nftCollection: '0x...', // Replace with actual contract address
  },
} as const;

// Web3 Service Class
export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private publicClient: any = null;
  private walletClient: any = null;

  constructor() {
    this.initializeProviders();
  }

  private async initializeProviders() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        
        // Initialize Viem clients
        this.publicClient = createPublicClient({
          chain: sepolia, // Default to Sepolia testnet
          transport: http(),
        });

        this.walletClient = createWalletClient({
          chain: sepolia,
          transport: http(),
        });
      } catch (error) {
        console.error('Failed to initialize Web3 providers:', error);
      }
    }
  }

  async connectWallet(): Promise<string | null> {
    if (!window.ethereum) {
      throw new Error('MetaMask not detected');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length > 0) {
        await this.initializeProviders();
        return accounts[0];
      }
      
      return null;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async getAccount(): Promise<string | null> {
    if (!this.signer) {
      return null;
    }

    try {
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Failed to get account:', error);
      return null;
    }
  }

  async getBalance(address?: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const targetAddress = address || await this.getAccount();
      if (!targetAddress) {
        throw new Error('No address available');
      }

      const balance = await this.provider.getBalance(targetAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  async switchChain(chainId: string): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask not detected');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error) {
      console.error('Failed to switch chain:', error);
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer not initialized');
    }

    try {
      return await this.signer.signMessage(message);
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  }

  async sendTransaction(to: string, value: string, data?: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer not initialized');
    }

    try {
      const tx = await this.signer.sendTransaction({
        to,
        value: ethers.parseEther(value),
        data,
      });

      return tx.hash;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  getProvider() {
    return this.provider;
  }

  getSigner() {
    return this.signer;
  }

  getPublicClient() {
    return this.publicClient;
  }

  getWalletClient() {
    return this.walletClient;
  }
}

// Singleton instance
export const web3Service = new Web3Service();

// Utility functions
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatBalance = (balance: string): string => {
  const num = parseFloat(balance);
  if (num < 0.001) return '< 0.001';
  return num.toFixed(4);
};

export const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

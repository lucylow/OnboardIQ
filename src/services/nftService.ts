import { ethers } from 'ethers';
import { web3Service } from './web3Service';

// NFT Service for managing NFTs in OnboardIQ
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
  animation_url?: string;
}

export interface NFT {
  id: string;
  tokenId: number;
  contractAddress: string;
  owner: string;
  metadata: NFTMetadata;
  createdAt: number;
  price?: string;
  forSale: boolean;
}

export interface NFTCollection {
  id: string;
  name: string;
  description: string;
  contractAddress: string;
  totalSupply: number;
  floorPrice: string;
  volumeTraded: string;
  image: string;
  createdAt: number;
}

export class NFTService {
  private nftContract: ethers.Contract | null = null;
  private marketplaceContract: ethers.Contract | null = null;

  constructor() {
    this.initializeContracts();
  }

  private async initializeContracts() {
    try {
      const provider = web3Service.getProvider();
      if (!provider) return;

      // Mock contract addresses - replace with actual deployed contracts
      const nftContractAddress = '0x...'; // NFT Collection Contract
      const marketplaceContractAddress = '0x...'; // Marketplace Contract

      // Mock ABI - replace with actual contract ABIs
      const nftABI = [
        'function mint(address to, string memory tokenURI) external returns (uint256)',
        'function tokenURI(uint256 tokenId) external view returns (string)',
        'function ownerOf(uint256 tokenId) external view returns (address)',
        'function balanceOf(address owner) external view returns (uint256)',
        'function totalSupply() external view returns (uint256)',
        'function setApprovalForAll(address operator, bool approved) external',
        'function isApprovedForAll(address owner, address operator) external view returns (bool)',
        'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
      ];

      const marketplaceABI = [
        'function listNFT(uint256 tokenId, uint256 price) external',
        'function buyNFT(uint256 tokenId) external payable',
        'function cancelListing(uint256 tokenId) external',
        'function getListing(uint256 tokenId) external view returns (address seller, uint256 price, bool active)',
        'event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price)',
        'event NFTSold(uint256 indexed tokenId, address indexed buyer, uint256 price)',
      ];

      this.nftContract = new ethers.Contract(nftContractAddress, nftABI, provider);
      this.marketplaceContract = new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider);
    } catch (error) {
      console.error('Failed to initialize NFT contracts:', error);
    }
  }

  // Mint a new NFT
  async mintNFT(to: string, metadata: NFTMetadata): Promise<string> {
    try {
      const signer = web3Service.getSigner();
      if (!signer || !this.nftContract) {
        throw new Error('Contract not initialized');
      }

      // Upload metadata to IPFS (mock implementation)
      const tokenURI = await this.uploadMetadata(metadata);

      const tx = await this.nftContract.connect(signer).mint(to, tokenURI);
      const receipt = await tx.wait();

      // Extract token ID from events
      const transferEvent = receipt.logs.find(log => {
        try {
          const parsed = this.nftContract!.interface.parseLog(log);
          return parsed.name === 'Transfer' && parsed.args.from === ethers.ZeroAddress;
        } catch {
          return false;
        }
      });

      if (transferEvent) {
        const parsed = this.nftContract!.interface.parseLog(transferEvent);
        return parsed.args.tokenId.toString();
      }

      throw new Error('Failed to extract token ID');
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      throw error;
    }
  }

  // Upload metadata to IPFS (mock implementation)
  private async uploadMetadata(metadata: NFTMetadata): Promise<string> {
    // In a real implementation, this would upload to IPFS
    // For demo purposes, we'll return a mock URI
    const mockHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(metadata)));
    return `ipfs://${mockHash}`;
  }

  // Get NFT metadata
  async getNFTMetadata(tokenId: number): Promise<NFTMetadata> {
    try {
      if (!this.nftContract) {
        // Return mock metadata for demo
        return {
          name: `OnboardIQ Achievement #${tokenId}`,
          description: `A unique achievement NFT for completing onboarding milestones`,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${tokenId}`,
          attributes: [
            { trait_type: 'Rarity', value: 'Common' },
            { trait_type: 'Category', value: 'Achievement' },
            { trait_type: 'Token ID', value: tokenId },
          ],
        };
      }

      const tokenURI = await this.nftContract.tokenURI(tokenId);
      
      // In a real implementation, you would fetch from IPFS
      // For demo, we'll return mock metadata
      return {
        name: `OnboardIQ Achievement #${tokenId}`,
        description: `A unique achievement NFT for completing onboarding milestones`,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${tokenId}`,
        attributes: [
          { trait_type: 'Rarity', value: 'Common' },
          { trait_type: 'Category', value: 'Achievement' },
          { trait_type: 'Token ID', value: tokenId },
        ],
      };
    } catch (error) {
      console.error('Failed to get NFT metadata:', error);
      throw error;
    }
  }

  // Get NFT owner
  async getNFTOwner(tokenId: number): Promise<string> {
    try {
      if (!this.nftContract) {
        return web3Service.getAccount() || '';
      }

      return await this.nftContract.ownerOf(tokenId);
    } catch (error) {
      console.error('Failed to get NFT owner:', error);
      throw error;
    }
  }

  // Get user's NFTs
  async getUserNFTs(userAddress: string): Promise<NFT[]> {
    try {
      // Mock data for demo
      const mockNFTs: NFT[] = [
        {
          id: '1',
          tokenId: 1,
          contractAddress: '0x...',
          owner: userAddress,
          metadata: {
            name: 'OnboardIQ Welcome Badge',
            description: 'Welcome to the OnboardIQ platform!',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=welcome',
            attributes: [
              { trait_type: 'Rarity', value: 'Common' },
              { trait_type: 'Category', value: 'Welcome' },
              { trait_type: 'Milestone', value: 'First Login' },
            ],
          },
          createdAt: Date.now() - 86400000,
          forSale: false,
        },
        {
          id: '2',
          tokenId: 2,
          contractAddress: '0x...',
          owner: userAddress,
          metadata: {
            name: 'Profile Completion Master',
            description: 'Completed 100% of your profile setup',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=profile',
            attributes: [
              { trait_type: 'Rarity', value: 'Rare' },
              { trait_type: 'Category', value: 'Achievement' },
              { trait_type: 'Milestone', value: 'Profile Complete' },
            ],
          },
          createdAt: Date.now() - 172800000,
          forSale: true,
          price: '0.01',
        },
      ];

      return mockNFTs;
    } catch (error) {
      console.error('Failed to get user NFTs:', error);
      return [];
    }
  }

  // List NFT for sale
  async listNFT(tokenId: number, price: string): Promise<string> {
    try {
      const signer = web3Service.getSigner();
      if (!signer || !this.marketplaceContract) {
        throw new Error('Contract not initialized');
      }

      // First, approve the marketplace contract
      if (this.nftContract) {
        const approveTx = await this.nftContract.connect(signer).setApprovalForAll(
          this.marketplaceContract.target,
          true
        );
        await approveTx.wait();
      }

      // List the NFT
      const tx = await this.marketplaceContract.connect(signer).listNFT(
        tokenId,
        ethers.parseEther(price)
      );
      await tx.wait();

      return tx.hash;
    } catch (error) {
      console.error('Failed to list NFT:', error);
      throw error;
    }
  }

  // Buy NFT
  async buyNFT(tokenId: number, price: string): Promise<string> {
    try {
      const signer = web3Service.getSigner();
      if (!signer || !this.marketplaceContract) {
        throw new Error('Contract not initialized');
      }

      const tx = await this.marketplaceContract.connect(signer).buyNFT(tokenId, {
        value: ethers.parseEther(price),
      });
      await tx.wait();

      return tx.hash;
    } catch (error) {
      console.error('Failed to buy NFT:', error);
      throw error;
    }
  }

  // Cancel NFT listing
  async cancelListing(tokenId: number): Promise<string> {
    try {
      const signer = web3Service.getSigner();
      if (!signer || !this.marketplaceContract) {
        throw new Error('Contract not initialized');
      }

      const tx = await this.marketplaceContract.connect(signer).cancelListing(tokenId);
      await tx.wait();

      return tx.hash;
    } catch (error) {
      console.error('Failed to cancel listing:', error);
      throw error;
    }
  }

  // Get NFT collections
  async getCollections(): Promise<NFTCollection[]> {
    try {
      // Mock data for demo
      const mockCollections: NFTCollection[] = [
        {
          id: '1',
          name: 'OnboardIQ Achievements',
          description: 'NFTs earned through completing onboarding milestones',
          contractAddress: '0x...',
          totalSupply: 1000,
          floorPrice: '0.005',
          volumeTraded: '2.5',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=collection',
          createdAt: Date.now() - 2592000000, // 30 days ago
        },
        {
          id: '2',
          name: 'OnboardIQ Badges',
          description: 'Special badges for platform contributors',
          contractAddress: '0x...',
          totalSupply: 500,
          floorPrice: '0.01',
          volumeTraded: '1.2',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=badges',
          createdAt: Date.now() - 1728000000, // 20 days ago
        },
      ];

      return mockCollections;
    } catch (error) {
      console.error('Failed to get collections:', error);
      return [];
    }
  }

  // Get marketplace listings
  async getMarketplaceListings(): Promise<NFT[]> {
    try {
      // Mock data for demo
      const mockListings: NFT[] = [
        {
          id: '1',
          tokenId: 1,
          contractAddress: '0x...',
          owner: '0x...',
          metadata: {
            name: 'OnboardIQ Welcome Badge',
            description: 'Welcome to the OnboardIQ platform!',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=welcome',
            attributes: [
              { trait_type: 'Rarity', value: 'Common' },
              { trait_type: 'Category', value: 'Welcome' },
            ],
          },
          createdAt: Date.now() - 86400000,
          forSale: true,
          price: '0.005',
        },
        {
          id: '2',
          tokenId: 2,
          contractAddress: '0x...',
          owner: '0x...',
          metadata: {
            name: 'Profile Completion Master',
            description: 'Completed 100% of your profile setup',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=profile',
            attributes: [
              { trait_type: 'Rarity', value: 'Rare' },
              { trait_type: 'Category', value: 'Achievement' },
            ],
          },
          createdAt: Date.now() - 172800000,
          forSale: true,
          price: '0.01',
        },
      ];

      return mockListings;
    } catch (error) {
      console.error('Failed to get marketplace listings:', error);
      return [];
    }
  }

  // Create achievement NFT
  async createAchievementNFT(userAddress: string, achievement: string): Promise<string> {
    try {
      const metadata: NFTMetadata = {
        name: `OnboardIQ Achievement: ${achievement}`,
        description: `Earned for completing: ${achievement}`,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${achievement}`,
        attributes: [
          { trait_type: 'Achievement', value: achievement },
          { trait_type: 'Platform', value: 'OnboardIQ' },
          { trait_type: 'Rarity', value: 'Common' },
        ],
      };

      return await this.mintNFT(userAddress, metadata);
    } catch (error) {
      console.error('Failed to create achievement NFT:', error);
      throw error;
    }
  }
}

// Singleton instance
export const nftService = new NFTService();

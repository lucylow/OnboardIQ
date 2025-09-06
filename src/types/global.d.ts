// Global type declarations

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
  };
}

// Extend BaseContract for blockchain services
declare module 'ethers' {
  interface BaseContract {
    mint?: (...args: any[]) => Promise<any>;
    setApprovalForAll?: (...args: any[]) => Promise<any>;
    listNFT?: (...args: any[]) => Promise<any>;
    buyNFT?: (...args: any[]) => Promise<any>;
    cancelListing?: (...args: any[]) => Promise<any>;
    registerIdentity?: (...args: any[]) => Promise<any>;
  }
}
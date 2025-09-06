import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { web3Service, formatAddress, formatBalance, SUPPORTED_CHAINS } from '@/services/web3Service';
import { toast } from 'sonner';

const WalletConnection: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChain, setCurrentChain] = useState<string>('sepolia');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const address = await web3Service.getAccount();
      if (address) {
        setIsConnected(true);
        setUserAddress(address);
        await updateBalance(address);
      }
    } catch (error) {
      console.error('Failed to check connection:', error);
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const address = await web3Service.connectWallet();
      if (address) {
        setIsConnected(true);
        setUserAddress(address);
        await updateBalance(address);
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setUserAddress('');
    setBalance('0');
    toast.success('Wallet disconnected');
  };

  const updateBalance = async (address: string) => {
    try {
      const bal = await web3Service.getBalance(address);
      setBalance(bal);
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(userAddress);
    toast.success('Address copied to clipboard');
  };

  const switchChain = async (chainId: string) => {
    try {
      setIsLoading(true);
      const chain = SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS];
      if (chain) {
        await web3Service.switchChain(`0x${chain.id.toString(16)}`);
        setCurrentChain(chainId);
        toast.success(`Switched to ${chain.name}`);
      }
    } catch (error) {
      toast.error('Failed to switch chain');
      console.error('Failed to switch chain:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalance = async () => {
    if (userAddress) {
      await updateBalance(userAddress);
      toast.success('Balance updated');
    }
  };

  const openExplorer = () => {
    const chain = SUPPORTED_CHAINS[currentChain as keyof typeof SUPPORTED_CHAINS];
    if (chain && userAddress) {
      const explorerUrl = chain.blockExplorers?.default?.url;
      if (explorerUrl) {
        window.open(`${explorerUrl}/address/${userAddress}`, '_blank');
      }
    }
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-6 w-6" />
            Connect Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Connect your wallet to access blockchain features
          </p>
          <Button 
            onClick={connectWallet} 
            disabled={isLoading} 
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </>
            )}
          </Button>
          <div className="text-xs text-gray-500 text-center">
            We support MetaMask and other Web3 wallets
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            Connected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Address</label>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <span className="text-sm font-mono flex-1">{formatAddress(userAddress)}</span>
            <Button size="sm" variant="ghost" onClick={copyAddress}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={openExplorer}>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Balance */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Balance</label>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <span className="text-sm font-mono flex-1">{formatBalance(balance)} ETH</span>
            <Button size="sm" variant="ghost" onClick={refreshBalance}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chain Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Network</label>
          <Select value={currentChain} onValueChange={switchChain}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SUPPORTED_CHAINS).map(([key, chain]) => (
                <SelectItem key={key} value={key}>
                  {chain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            onClick={disconnectWallet}
            className="flex-1"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </div>

        {/* Status */}
        <div className="text-xs text-gray-500 text-center">
          Connected to {SUPPORTED_CHAINS[currentChain as keyof typeof SUPPORTED_CHAINS]?.name}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnection;

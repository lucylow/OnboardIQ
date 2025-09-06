import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Award, 
  Network, 
  Wallet, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Eye,
  Lock,
  Unlock,
  Zap,
  Star,
  Trophy,
  FileText,
  Building,
  Globe,
  GraduationCap,
  Loader2
} from 'lucide-react';
import { web3Service } from '@/services/web3Service';
import { zkIdentityService, IdentityClaim } from '@/services/zkIdentityService';
import { nftService, NFT } from '@/services/nftService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const BlockchainDashboard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [identityClaims, setIdentityClaims] = useState<IdentityClaim[]>([]);
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const address = await web3Service.getAccount();
      if (address) {
        setIsConnected(true);
        setUserAddress(address);
        await loadUserData(address);
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
        await loadUserData(address);
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async (address: string) => {
    try {
      const [balanceData, claimsData, nftsData] = await Promise.all([
        web3Service.getBalance(address),
        zkIdentityService.getIdentityClaims(address),
        nftService.getUserNFTs(address),
      ]);

      setBalance(balanceData);
      setIdentityClaims(claimsData);
      setUserNFTs(nftsData);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const getClaimIcon = (type: string) => {
    switch (type) {
      case 'age': return <Users className="h-4 w-4" />;
      case 'citizenship': return <Globe className="h-4 w-4" />;
      case 'employment': return <Building className="h-4 w-4" />;
      case 'education': return <GraduationCap className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getClaimColor = (type: string) => {
    switch (type) {
      case 'age': return 'bg-blue-100 text-blue-800';
      case 'citizenship': return 'bg-green-100 text-green-800';
      case 'employment': return 'bg-purple-100 text-purple-800';
      case 'education': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNFTRarity = (nft: NFT) => {
    const rarity = nft.metadata.attributes.find(attr => attr.trait_type === 'Rarity');
    return rarity?.value || 'Common';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'uncommon': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Network className="h-6 w-6" />
                Blockchain Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Connect your wallet to access the complete blockchain experience with zero-knowledge identity verification and NFT achievements.
              </p>
              <Button onClick={connectWallet} disabled={isLoading} size="lg">
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
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Blockchain Dashboard
          </h1>
          <p className="text-gray-600">
            Your complete Web3 identity and NFT portfolio
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
            </Badge>
            <Badge variant="outline">
              {identityClaims.length} Identity Claims
            </Badge>
            <Badge variant="outline">
              {userNFTs.length} NFTs Owned
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
                  <p className="text-2xl font-bold text-green-600">{parseFloat(balance).toFixed(4)} ETH</p>
                </div>
                <Wallet className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Identity Claims</p>
                  <p className="text-2xl font-bold text-blue-600">{identityClaims.length}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">NFTs Owned</p>
                  <p className="text-2xl font-bold text-purple-600">{userNFTs.length}</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verification Score</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.min(100, identityClaims.length * 25)}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="identity">Identity</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'Connected Wallet', time: '2 minutes ago', icon: Wallet, color: 'text-green-500' },
                      { action: 'Generated Age Proof', time: '5 minutes ago', icon: Shield, color: 'text-blue-500' },
                      { action: 'Minted Achievement NFT', time: '10 minutes ago', icon: Award, color: 'text-purple-500' },
                      { action: 'Verified Identity', time: '1 hour ago', icon: CheckCircle, color: 'text-orange-500' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <activity.icon className={`h-5 w-5 ${activity.color}`} />
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => navigate('/zk-identity')} 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Verify Identity
                    </Button>
                    <Button 
                      onClick={() => navigate('/nft-gallery')} 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      View NFT Gallery
                    </Button>
                    <Button 
                      onClick={() => navigate('/wallet')} 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Manage Wallet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Verification Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Identity Verification Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{Math.min(100, identityClaims.length * 25)}%</span>
                  </div>
                  <Progress value={Math.min(100, identityClaims.length * 25)} className="h-2" />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {[
                      { name: 'Age Verification', completed: identityClaims.some(c => c.type === 'age'), icon: Users },
                      { name: 'Citizenship', completed: identityClaims.some(c => c.type === 'citizenship'), icon: Globe },
                      { name: 'Employment', completed: identityClaims.some(c => c.type === 'employment'), icon: Building },
                      { name: 'Education', completed: identityClaims.some(c => c.type === 'education'), icon: GraduationCap },
                    ].map((item, index) => (
                      <div key={index} className="text-center">
                        <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          item.completed ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <item.icon className={`h-6 w-6 ${
                            item.completed ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <Badge variant={item.completed ? 'default' : 'outline'} className="mt-1">
                          {item.completed ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="identity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Identity Claims</CardTitle>
              </CardHeader>
              <CardContent>
                {identityClaims.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No identity claims yet</p>
                    <p className="text-sm text-gray-400">Start verifying your identity to build your Web3 profile</p>
                    <Button 
                      onClick={() => navigate('/zk-identity')} 
                      className="mt-4"
                    >
                      Verify Identity
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {identityClaims.map((claim) => (
                      <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getClaimIcon(claim.type)}
                          <div>
                            <p className="font-medium capitalize">{claim.type}</p>
                            <p className="text-sm text-gray-600">{claim.value}</p>
                            <p className="text-xs text-gray-400">Issued by: {claim.issuer}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getClaimColor(claim.type)}>
                            {claim.verified ? 'Verified' : 'Pending'}
                          </Badge>
                          {claim.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nfts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My NFTs</CardTitle>
              </CardHeader>
              <CardContent>
                {userNFTs.length === 0 ? (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No NFTs owned yet</p>
                    <p className="text-sm text-gray-400">Complete achievements or mint NFTs to build your collection</p>
                    <Button 
                      onClick={() => navigate('/nft-gallery')} 
                      className="mt-4"
                    >
                      View Gallery
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userNFTs.map((nft) => (
                      <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-square relative">
                          <img
                            src={nft.metadata.image}
                            alt={nft.metadata.name}
                            className="w-full h-full object-cover"
                          />
          <Badge 
            className={`absolute top-2 right-2 ${getRarityColor(String(getNFTRarity(nft)))}`}
          >
            {String(getNFTRarity(nft))}
          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold truncate mb-1">{nft.metadata.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {nft.metadata.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">
                              Token #{nft.tokenId}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievement Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { 
                      name: 'Identity Master', 
                      description: 'Complete all identity verifications',
                      icon: Shield,
                      progress: Math.min(100, (identityClaims.length / 4) * 100),
                      completed: identityClaims.length >= 4
                    },
                    { 
                      name: 'NFT Collector', 
                      description: 'Own 5 or more NFTs',
                      icon: Award,
                      progress: Math.min(100, (userNFTs.length / 5) * 100),
                      completed: userNFTs.length >= 5
                    },
                    { 
                      name: 'Web3 Pioneer', 
                      description: 'Connect wallet and verify identity',
                      icon: Network,
                      progress: isConnected ? 100 : 0,
                      completed: isConnected
                    },
                    { 
                      name: 'Achievement Hunter', 
                      description: 'Earn 3 achievement NFTs',
                      icon: Trophy,
                      progress: Math.min(100, (userNFTs.filter(nft => 
                        nft.metadata.attributes.some(attr => attr.trait_type === 'Category' && attr.value === 'Achievement')
                      ).length / 3) * 100),
                      completed: userNFTs.filter(nft => 
                        nft.metadata.attributes.some(attr => attr.trait_type === 'Category' && attr.value === 'Achievement')
                      ).length >= 3
                    },
                    { 
                      name: 'Verification Expert', 
                      description: 'Generate 5 ZK proofs',
                      icon: Lock,
                      progress: Math.min(100, (identityClaims.length / 5) * 100),
                      completed: identityClaims.length >= 5
                    },
                    { 
                      name: 'Platform Veteran', 
                      description: 'Use all blockchain features',
                      icon: Star,
                      progress: 75, // Mock progress
                      completed: false
                    },
                  ].map((achievement, index) => (
                    <Card key={index} className={`${achievement.completed ? 'border-green-200 bg-green-50' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            achievement.completed ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <achievement.icon className={`h-6 w-6 ${
                              achievement.completed ? 'text-green-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{Math.round(achievement.progress)}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-2" />
                        </div>

                        {achievement.completed && (
                          <Badge className="mt-3 bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BlockchainDashboard;

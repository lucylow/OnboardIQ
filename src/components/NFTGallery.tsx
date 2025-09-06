import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Image, 
  Loader2, 
  Plus, 
  ShoppingCart, 
  Eye, 
  Heart,
  TrendingUp,
  Users,
  DollarSign,
  Filter,
  Search,
  ExternalLink,
  Award,
  Star,
  FileText,
  Shield,
  Trophy
} from 'lucide-react';
import { web3Service } from '@/services/web3Service';
import { nftService, NFT, NFTCollection, NFTMetadata } from '@/services/nftService';
import { toast } from 'sonner';

const NFTGallery: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [marketplaceNFTs, setMarketplaceNFTs] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Mint dialog states
  const [isMintDialogOpen, setIsMintDialogOpen] = useState(false);
  const [mintForm, setMintForm] = useState({
    name: '',
    description: '',
    image: '',
    achievement: '',
  });

  // Listing dialog states
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [listPrice, setListPrice] = useState('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const address = await web3Service.getAccount();
      if (address) {
        setIsConnected(true);
        setUserAddress(address);
        await loadData(address);
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
        await loadData(address);
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async (address: string) => {
    try {
      setIsLoading(true);
      const [userNFTsData, collectionsData, marketplaceData] = await Promise.all([
        nftService.getUserNFTs(address),
        nftService.getCollections(),
        nftService.getMarketplaceListings(),
      ]);

      setUserNFTs(userNFTsData);
      setCollections(collectionsData);
      setMarketplaceNFTs(marketplaceData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const mintNFT = async () => {
    if (!mintForm.name || !mintForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const metadata: NFTMetadata = {
        name: mintForm.name,
        description: mintForm.description,
        image: mintForm.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mintForm.name}`,
        attributes: [
          { trait_type: 'Achievement', value: mintForm.achievement || 'Custom' },
          { trait_type: 'Platform', value: 'OnboardIQ' },
          { trait_type: 'Rarity', value: 'Common' },
        ],
      };

      const tokenId = await nftService.mintNFT(userAddress, metadata);
      toast.success(`NFT minted successfully! Token ID: ${tokenId}`);
      
      // Reset form and reload data
      setMintForm({ name: '', description: '', image: '', achievement: '' });
      setIsMintDialogOpen(false);
      await loadData(userAddress);
    } catch (error) {
      toast.error('Failed to mint NFT');
      console.error('Failed to mint NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const listNFT = async () => {
    if (!selectedNFT || !listPrice) {
      toast.error('Please select an NFT and enter a price');
      return;
    }

    try {
      setIsLoading(true);
      const txHash = await nftService.listNFT(selectedNFT.tokenId, listPrice);
      toast.success(`NFT listed successfully! Transaction: ${txHash}`);
      
      setIsListDialogOpen(false);
      setSelectedNFT(null);
      setListPrice('');
      await loadData(userAddress);
    } catch (error) {
      toast.error('Failed to list NFT');
      console.error('Failed to list NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buyNFT = async (nft: NFT) => {
    if (!nft.price) {
      toast.error('NFT price not available');
      return;
    }

    try {
      setIsLoading(true);
      const txHash = await nftService.buyNFT(nft.tokenId, nft.price);
      toast.success(`NFT purchased successfully! Transaction: ${txHash}`);
      
      await loadData(userAddress);
    } catch (error) {
      toast.error('Failed to buy NFT');
      console.error('Failed to buy NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createAchievementNFT = async (achievement: string) => {
    try {
      setIsLoading(true);
      const tokenId = await nftService.createAchievementNFT(userAddress, achievement);
      toast.success(`Achievement NFT created! Token ID: ${tokenId}`);
      await loadData(userAddress);
    } catch (error) {
      toast.error('Failed to create achievement NFT');
      console.error('Failed to create achievement NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNFTs = marketplaceNFTs.filter(nft => {
    const matchesSearch = nft.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.metadata.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollection = selectedCollection === 'all' || nft.contractAddress === selectedCollection;
    return matchesSearch && matchesCollection;
  });

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price || '0') - parseFloat(b.price || '0');
      case 'price-high':
        return parseFloat(b.price || '0') - parseFloat(a.price || '0');
      case 'newest':
        return b.createdAt - a.createdAt;
      case 'oldest':
        return a.createdAt - b.createdAt;
      default:
        return 0;
    }
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Image className="h-6 w-6" />
                NFT Gallery & Marketplace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Connect your wallet to view, mint, and trade NFTs on the OnboardIQ platform.
                Earn achievement NFTs for completing onboarding milestones.
              </p>
              <Button onClick={connectWallet} disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect Wallet'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            NFT Gallery & Marketplace
          </h1>
          <p className="text-gray-600">
            Discover, mint, and trade NFTs on the OnboardIQ platform
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3 text-blue-500" />
              Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
            </Badge>
            <Badge variant="outline">
              {userNFTs.length} Owned NFTs
            </Badge>
            <Badge variant="outline">
              {collections.length} Collections
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search NFTs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Collections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Collections</SelectItem>
                      {collections.map((collection) => (
                        <SelectItem key={collection.id} value={collection.contractAddress}>
                          {collection.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* NFT Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))
              ) : sortedNFTs.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No NFTs found</p>
                  <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                </div>
              ) : (
                sortedNFTs.map((nft) => (
                  <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative">
                      <img
                        src={nft.metadata.image}
                        alt={nft.metadata.name}
                        className="w-full h-full object-cover"
                      />
                      {nft.forSale && (
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          For Sale
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate mb-1">{nft.metadata.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {nft.metadata.description}
                      </p>
                      <div className="flex items-center justify-between">
                        {nft.price ? (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="font-semibold text-green-600">{nft.price} ETH</span>
                          </div>
                        ) : (
                          <Badge variant="outline">Not for sale</Badge>
                        )}
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {nft.forSale && nft.price && (
                            <Button 
                              size="sm" 
                              onClick={() => buyNFT(nft)}
                              disabled={isLoading}
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-nfts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My NFTs</h2>
              <Dialog open={isMintDialogOpen} onOpenChange={setIsMintDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Mint NFT
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Mint New NFT</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={mintForm.name}
                        onChange={(e) => setMintForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter NFT name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={mintForm.description}
                        onChange={(e) => setMintForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter NFT description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">Image URL (optional)</Label>
                      <Input
                        id="image"
                        value={mintForm.image}
                        onChange={(e) => setMintForm(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="Enter image URL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="achievement">Achievement Type</Label>
                      <Input
                        id="achievement"
                        value={mintForm.achievement}
                        onChange={(e) => setMintForm(prev => ({ ...prev, achievement: e.target.value }))}
                        placeholder="Enter achievement type"
                      />
                    </div>
                    <Button onClick={mintNFT} disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Minting...
                        </>
                      ) : (
                        'Mint NFT'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userNFTs.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No NFTs owned</p>
                  <p className="text-sm text-gray-400">Mint your first NFT or complete achievements</p>
                </div>
              ) : (
                userNFTs.map((nft) => (
                  <Card key={nft.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={nft.metadata.image}
                        alt={nft.metadata.name}
                        className="w-full h-full object-cover"
                      />
                      {nft.forSale && (
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          Listed
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate mb-1">{nft.metadata.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {nft.metadata.description}
                      </p>
                      <div className="flex items-center justify-between">
                        {nft.forSale && nft.price ? (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="font-semibold text-green-600">{nft.price} ETH</span>
                          </div>
                        ) : (
                          <Badge variant="outline">Not listed</Badge>
                        )}
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!nft.forSale && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedNFT(nft);
                                setIsListDialogOpen(true);
                              }}
                            >
                              <TrendingUp className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            <h2 className="text-2xl font-bold">Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{collection.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {collection.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Supply:</span>
                        <span className="font-medium">{collection.totalSupply}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Floor Price:</span>
                        <span className="font-medium text-green-600">{collection.floorPrice} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Volume:</span>
                        <span className="font-medium">{collection.volumeTraded} ETH</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Collection
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <h2 className="text-2xl font-bold">Achievement NFTs</h2>
            <p className="text-gray-600">
              Earn special NFTs by completing onboarding milestones and achievements.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Welcome Badge', description: 'Complete your first login', icon: Award },
                { name: 'Profile Master', description: 'Complete 100% of your profile', icon: Star },
                { name: 'Document Expert', description: 'Upload all required documents', icon: FileText },
                { name: 'Verification Pro', description: 'Complete identity verification', icon: Shield },
                { name: 'Onboarding Champion', description: 'Complete the full onboarding process', icon: Trophy },
              ].map((achievement, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <achievement.icon className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                    <h3 className="font-semibold mb-2">{achievement.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                    <Button 
                      onClick={() => createAchievementNFT(achievement.name)}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Earn NFT'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* List NFT Dialog */}
        <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>List NFT for Sale</DialogTitle>
            </DialogHeader>
            {selectedNFT && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <img
                    src={selectedNFT.metadata.image}
                    alt={selectedNFT.metadata.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-medium">{selectedNFT.metadata.name}</h4>
                    <p className="text-sm text-gray-600">Token ID: {selectedNFT.tokenId}</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="price">Price (ETH)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.001"
                    value={listPrice}
                    onChange={(e) => setListPrice(e.target.value)}
                    placeholder="Enter price in ETH"
                  />
                </div>
                <Button onClick={listNFT} disabled={isLoading || !listPrice} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Listing...
                    </>
                  ) : (
                    'List for Sale'
                  )}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default NFTGallery;

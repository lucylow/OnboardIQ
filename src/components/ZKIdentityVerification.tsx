import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff,
  User,
  FileText,
  Building,
  GraduationCap,
  Globe
} from 'lucide-react';
import { web3Service } from '@/services/web3Service';
import { zkIdentityService, IdentityClaim, ZKProof } from '@/services/zkIdentityService';
import { toast } from 'sonner';

const ZKIdentityVerification: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [identity, setIdentity] = useState<any>(null);
  const [claims, setClaims] = useState<IdentityClaim[]>([]);
  const [proofs, setProofs] = useState<ZKProof[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('verify');

  // Form states
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [minimumAge, setMinimumAge] = useState('18');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const address = await web3Service.getAccount();
      if (address) {
        setIsConnected(true);
        setUserAddress(address);
        await loadIdentity(address);
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
        await loadIdentity(address);
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadIdentity = async (address: string) => {
    try {
      const userIdentity = await zkIdentityService.getIdentity(address);
      if (userIdentity) {
        setIdentity(userIdentity);
        setClaims(userIdentity.claims);
        setProofs(userIdentity.proofs);
      } else {
        // Create new identity if none exists
        const newIdentity = await zkIdentityService.createIdentity(address, []);
        setIdentity(newIdentity);
        setClaims([]);
        setProofs([]);
      }
    } catch (error) {
      console.error('Failed to load identity:', error);
    }
  };

  const generateAgeProof = async () => {
    if (!age || !minimumAge) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const proof = await zkIdentityService.generateAgeProof(parseInt(age), parseInt(minimumAge));
      const isValid = await zkIdentityService.verifyProof(proof);
      
      if (isValid) {
        setProofs(prev => [...prev, proof]);
        toast.success('Age verification proof generated successfully!');
      } else {
        toast.error('Proof verification failed');
      }
    } catch (error) {
      toast.error('Failed to generate age proof');
      console.error('Failed to generate age proof:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCitizenshipProof = async () => {
    if (!country) {
      toast.error('Please select a country');
      return;
    }

    try {
      setIsLoading(true);
      const proof = await zkIdentityService.generateCitizenshipProof(country, 'United States');
      const isValid = await zkIdentityService.verifyProof(proof);
      
      if (isValid) {
        setProofs(prev => [...prev, proof]);
        toast.success('Citizenship verification proof generated successfully!');
      } else {
        toast.error('Proof verification failed');
      }
    } catch (error) {
      toast.error('Failed to generate citizenship proof');
      console.error('Failed to generate citizenship proof:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEmploymentProof = async () => {
    if (!company || !position) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const proof = await zkIdentityService.generateEmploymentProof(company, position);
      const isValid = await zkIdentityService.verifyProof(proof);
      
      if (isValid) {
        setProofs(prev => [...prev, proof]);
        toast.success('Employment verification proof generated successfully!');
      } else {
        toast.error('Proof verification failed');
      }
    } catch (error) {
      toast.error('Failed to generate employment proof');
      console.error('Failed to generate employment proof:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addClaim = async (type: string, value: string) => {
    try {
      const newClaim: IdentityClaim = {
        id: Date.now().toString(),
        type: type as any,
        value,
        issuer: 'OnboardIQ Platform',
        timestamp: Date.now(),
        verified: true,
      };

      await zkIdentityService.updateIdentityClaims(userAddress, [newClaim]);
      setClaims(prev => [...prev, newClaim]);
      toast.success('Identity claim added successfully!');
    } catch (error) {
      toast.error('Failed to add identity claim');
      console.error('Failed to add identity claim:', error);
    }
  };

  const getClaimIcon = (type: string) => {
    switch (type) {
      case 'age': return <User className="h-4 w-4" />;
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

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Shield className="h-6 w-6" />
                Zero-Knowledge Identity Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Connect your wallet to start verifying your identity using zero-knowledge proofs.
                Your personal data remains private while proving your credentials.
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Zero-Knowledge Identity Verification
          </h1>
          <p className="text-gray-600">
            Verify your identity credentials without revealing sensitive information
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
            </Badge>
            <Badge variant="outline">
              {claims.length} Claims
            </Badge>
            <Badge variant="outline">
              {proofs.length} Proofs
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="verify">Verify Credentials</TabsTrigger>
            <TabsTrigger value="claims">My Claims</TabsTrigger>
            <TabsTrigger value="proofs">ZK Proofs</TabsTrigger>
          </TabsList>

          <TabsContent value="verify" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Age Verification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Age Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="age">Your Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Enter your age"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minimumAge">Minimum Required Age</Label>
                    <Input
                      id="minimumAge"
                      type="number"
                      value={minimumAge}
                      onChange={(e) => setMinimumAge(e.target.value)}
                      placeholder="18"
                    />
                  </div>
                  <Button 
                    onClick={generateAgeProof} 
                    disabled={isLoading || !age || !minimumAge}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Age Proof'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Citizenship Verification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Citizenship Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Japan">Japan</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={generateCitizenshipProof} 
                    disabled={isLoading || !country}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Citizenship Proof'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Employment Verification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Employment Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="Enter your position"
                    />
                  </div>
                  <Button 
                    onClick={generateEmploymentProof} 
                    disabled={isLoading || !company || !position}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Employment Proof'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Zero-knowledge proofs allow you to prove you meet certain criteria without revealing 
                the actual values. Your personal information remains private and secure.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="claims" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Identity Claims</CardTitle>
              </CardHeader>
              <CardContent>
                {claims.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No identity claims yet</p>
                    <p className="text-sm text-gray-400">Generate proofs to create claims</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {claims.map((claim) => (
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

          <TabsContent value="proofs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Zero-Knowledge Proofs</CardTitle>
              </CardHeader>
              <CardContent>
                {proofs.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No proofs generated yet</p>
                    <p className="text-sm text-gray-400">Generate proofs in the Verify Credentials tab</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {proofs.map((proof, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Proof #{index + 1}</h4>
                          <Badge variant="outline">
                            {new Date(proof.timestamp).toLocaleDateString()}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Proof:</span>
                            <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                              {proof.proof.slice(0, 20)}...
                            </code>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Public Signals:</span>
                            <div className="ml-2 text-xs text-gray-600">
                              {proof.publicSignals.map((signal, i) => (
                                <div key={i} className="bg-gray-50 px-2 py-1 rounded mt-1">
                                  {signal.slice(0, 20)}...
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ZKIdentityVerification;

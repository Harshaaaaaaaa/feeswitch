import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useReadContract } from '@/hooks/useReadContract';
import { useWriteContractLifecycle } from '@/hooks/useWriteContractLifecycle';
import { getDeployedContract } from '@/blockchain-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { formatUnits, parseUnits, type Address } from 'viem';
import { sdk } from '@/lib/farcaster';

const CHAIN_ID = 8453;
const POSITION_MANAGER_ADDRESS = '0x03a520b32c04bf3beef7beb72e919cf822ed34f1' as Address;
const WETH_ADDRESS = '0x4200000000000000000000000000000000000006' as Address;
const USDC_ADDRESS = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as Address;

const POSITION_MANAGER = getDeployedContract({
  chainId: CHAIN_ID,
  contractAddress: POSITION_MANAGER_ADDRESS,
});

const WETH = getDeployedContract({
  chainId: CHAIN_ID,
  contractAddress: WETH_ADDRESS,
});

const USDC = getDeployedContract({
  chainId: CHAIN_ID,
  contractAddress: USDC_ADDRESS,
});

const FEE_TIERS = [
  { value: 500, label: '0.05%', description: 'Stablecoins' },
  { value: 3000, label: '0.3%', description: 'Most pairs' },
  { value: 10000, label: '1%', description: 'Exotic pairs' },
];

const TICK_SPACINGS: Record<number, number> = {
  500: 10,
  3000: 60,
  10000: 200,
};

function priceToTick(price: number): number {
  return Math.floor(Math.log(price) / Math.log(1.0001));
}



function nearestUsableTick(tick: number, tickSpacing: number): number {
  return Math.round(tick / tickSpacing) * tickSpacing;
}

export default function UniswapV3LP() {
  const { address, isConnected, connect } = useWallet();
  const [activeTab, setActiveTab] = useState('positions');
  const [isFarcasterContext, setIsFarcasterContext] = useState(false);
  

  const [feeTier, setFeeTier] = useState(3000);
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [priceRange, setPriceRange] = useState([80, 120]);
  
  const [token0Address, setToken0Address] = useState(WETH_ADDRESS);
  const [token1Address, setToken1Address] = useState(USDC_ADDRESS);
  const [token0Decimals, setToken0Decimals] = useState(18);
  const [token1Decimals, setToken1Decimals] = useState(6);
  const [token0Symbol, setToken0Symbol] = useState('WETH');
  const [token1Symbol, setToken1Symbol] = useState('USDC');

  useEffect(() => {
    const initFarcaster = async () => {
      try {
        await sdk.actions.ready();
        const context = await sdk.context;
        if (context) {
          setIsFarcasterContext(true);
          console.log('Running in Farcaster mini app:', context);
        }
      } catch (error) {
        console.log('Not in Farcaster context', error);
        try {
          await sdk.actions.ready();
        } catch (readyError) {
          console.log('Ready failed', readyError);
        }
      }
    };
    initFarcaster();
  }, []);

  const { data: balance } = useReadContract({
    contractAddress: POSITION_MANAGER_ADDRESS,
    chainId: CHAIN_ID,
    abi: POSITION_MANAGER.abi,
    functionName: 'balanceOf',
    args: address ? [address as Address] : undefined,
    options: {
      enabled: !!address,
    },
  });

  const { data: tokenOfOwnerByIndex } = useReadContract({
    contractAddress: POSITION_MANAGER_ADDRESS,
    chainId: CHAIN_ID,
    abi: POSITION_MANAGER.abi,
    functionName: 'tokenOfOwnerByIndex',
    args: address && balance && Number(balance) > 0 ? [address as Address, 0n] : undefined,
    options: {
      enabled: !!address && !!balance && Number(balance) > 0,
    },
  });

  const { data: token0Balance } = useReadContract({
    contractAddress: token0Address,
    chainId: CHAIN_ID,
    abi: WETH.abi,
    functionName: 'balanceOf',
    args: address ? [address as Address] : undefined,
    options: {
      enabled: !!address,
    },
  });

  const { data: token1Balance } = useReadContract({
    contractAddress: token1Address,
    chainId: CHAIN_ID,
    abi: USDC.abi,
    functionName: 'balanceOf',
    args: address ? [address as Address] : undefined,
    options: {
      enabled: !!address,
    },
  });

  const { data: positionData } = useReadContract({
    contractAddress: POSITION_MANAGER_ADDRESS,
    chainId: CHAIN_ID,
    abi: POSITION_MANAGER.abi,
    functionName: 'positions',
    args: tokenOfOwnerByIndex ? [tokenOfOwnerByIndex as bigint] : undefined,
    options: {
      enabled: !!tokenOfOwnerByIndex,
    },
  });

  const { write: approveWETH, state: approveWETHState } = useWriteContractLifecycle({
    successMessage: 'WETH approved',
    errorMessage: 'Failed to approve WETH',
  });

  const { write: approveUSDC, state: approveUSDCState } = useWriteContractLifecycle({
    successMessage: 'USDC approved',
    errorMessage: 'Failed to approve USDC',
  });

  const { write: mintPosition, state: mintState } = useWriteContractLifecycle({
    onSuccess: () => {
      toast.success('Position created successfully');
      setAmount0('');
      setAmount1('');
    },
    successMessage: 'Position minted',
    errorMessage: 'Failed to mint position',
  });

  const { write: collectFees, state: collectState } = useWriteContractLifecycle({
    successMessage: 'Fees collected',
    errorMessage: 'Failed to collect fees',
  });

  const handleApproveToken0 = async () => {
    if (!amount0) return;
    const amount = parseUnits(amount0, token0Decimals);
    
    await approveWETH({
      contractAddress: token0Address,
      chainId: CHAIN_ID,
      abi: WETH.abi,
      functionName: 'approve',
      args: [POSITION_MANAGER_ADDRESS as Address, amount],
    });
  };

  const handleApproveToken1 = async () => {
    if (!amount1) return;
    const amount = parseUnits(amount1, token1Decimals);
    
    await approveUSDC({
      contractAddress: token1Address,
      chainId: CHAIN_ID,
      abi: USDC.abi,
      functionName: 'approve',
      args: [POSITION_MANAGER_ADDRESS as Address, amount],
    });
  };

  const handleMintPosition = async () => {
    if (!address || !amount0 || !amount1) return;

    const amount0Desired = parseUnits(amount0, token0Decimals);
    const amount1Desired = parseUnits(amount1, token1Decimals);
    const amount0Min = (amount0Desired * 95n) / 100n;
    const amount1Min = (amount1Desired * 95n) / 100n;

    const currentPrice = 2000;
    const minPrice = (currentPrice * priceRange[0]) / 100;
    const maxPrice = (currentPrice * priceRange[1]) / 100;

    const tickLower = nearestUsableTick(priceToTick(minPrice), TICK_SPACINGS[feeTier]);
    const tickUpper = nearestUsableTick(priceToTick(maxPrice), TICK_SPACINGS[feeTier]);

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200);

    await mintPosition({
      contractAddress: POSITION_MANAGER_ADDRESS,
      chainId: CHAIN_ID,
      abi: POSITION_MANAGER.abi,
      functionName: 'mint',
      args: [
        {
          token0: token0Address,
          token1: token1Address,
          fee: feeTier,
          tickLower,
          tickUpper,
          amount0Desired,
          amount1Desired,
          amount0Min,
          amount1Min,
          recipient: address as Address,
          deadline,
        },
      ],
    });
  };

  const handleCollectFees = async () => {
    if (!address || !tokenOfOwnerByIndex) return;

    const MAX_UINT128 = 2n ** 128n - 1n;

    await collectFees({
      contractAddress: POSITION_MANAGER_ADDRESS,
      chainId: CHAIN_ID,
      abi: POSITION_MANAGER.abi,
      functionName: 'collect',
      args: [
        {
          tokenId: tokenOfOwnerByIndex as bigint,
          recipient: address as Address,
          amount0Max: MAX_UINT128,
          amount1Max: MAX_UINT128,
        },
      ],
    });
  };

  if (!isConnected) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Fee Switch</CardTitle>
            <CardDescription>Concentrated liquidity positions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={connect} className="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Fee Switch</h1>
            <p className="text-muted-foreground">Manage concentrated liquidity positions</p>
            {isFarcasterContext && (
              <div className="text-xs text-accent mt-1">Running in Farcaster</div>
            )}
          </div>
          <div className="text-right text-sm">
            <div className="text-muted-foreground">Base</div>
            <div className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">{token0Symbol} Balance</div>
              <div className="text-2xl font-bold">
                {token0Balance ? formatUnits(token0Balance as bigint, token0Decimals) : '0.00'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">{token1Symbol} Balance</div>
              <div className="text-2xl font-bold">
                {token1Balance ? formatUnits(token1Balance as bigint, token1Decimals) : '0.00'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="create">Create Position</TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Positions</CardTitle>
                <CardDescription>
                  {balance ? `${balance.toString()} position${Number(balance) !== 1 ? 's' : ''}` : 'No positions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {balance && Number(balance) > 0 ? (
                  <div className="space-y-4">
                     {positionData && tokenOfOwnerByIndex !== undefined && (
                      <div className="space-y-4 p-4 border rounded-lg bg-card">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground">Position #{String(tokenOfOwnerByIndex)}</div>
                            <div className="font-mono text-lg">{token0Symbol}/{token1Symbol}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Fee Tier</div>
                            <div className="font-bold">{Array.isArray(positionData) && positionData[4] ? Number(positionData[4]) / 10000 : 0}%</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Liquidity</div>
                            <div className="font-mono">{Array.isArray(positionData) && positionData[7] ? positionData[7].toString() : '0'}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Fees Earned</div>
                            <div className="font-mono">
                              {Array.isArray(positionData) && positionData[10] && positionData[11] 
                                ? `${formatUnits(positionData[10] as bigint, token0Decimals)} / ${formatUnits(positionData[11] as bigint, token1Decimals)}`
                                : '0 / 0'}
                            </div>
                          </div>
                        </div>

                        <Button 
                          onClick={handleCollectFees} 
                          className="w-full" 
                          disabled={collectState.status === 'pending'}
                          size="lg"
                        >
                          {collectState.status === 'pending' ? 'Collecting Fees...' : 'Collect All Fees'}
                        </Button>
                      </div>
                    )}
                    
                    {Number(balance) > 1 && (
                      <div className="text-xs text-muted-foreground text-center">
                        You have {balance.toString()} positions. Showing first position.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No positions yet. Create your first position to get started.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Position</CardTitle>
                <CardDescription>Add liquidity to any token pair on Base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="token0">Token 0 Address</Label>
                    <Input
                      id="token0"
                      placeholder="0x..."
                      value={token0Address}
                      onChange={(e) => setToken0Address(e.target.value as Address)}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Symbol"
                        value={token0Symbol}
                        onChange={(e) => setToken0Symbol(e.target.value)}
                        className="w-24"
                      />
                      <Input
                        type="number"
                        placeholder="Decimals"
                        value={token0Decimals}
                        onChange={(e) => setToken0Decimals(Number(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="token1">Token 1 Address</Label>
                    <Input
                      id="token1"
                      placeholder="0x..."
                      value={token1Address}
                      onChange={(e) => setToken1Address(e.target.value as Address)}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Symbol"
                        value={token1Symbol}
                        onChange={(e) => setToken1Symbol(e.target.value)}
                        className="w-24"
                      />
                      <Input
                        type="number"
                        placeholder="Decimals"
                        value={token1Decimals}
                        onChange={(e) => setToken1Decimals(Number(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fee Tier</Label>
                  <Select value={feeTier.toString()} onValueChange={(v) => setFeeTier(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FEE_TIERS.map((tier) => (
                        <SelectItem key={tier.value} value={tier.value.toString()}>
                          {tier.label} - {tier.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-mono">{priceRange[0]}%</div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={50}
                      max={150}
                      step={5}
                      className="flex-1"
                    />
                    <div className="text-sm font-mono">{priceRange[1]}%</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Current price range: {priceRange[0]}% - {priceRange[1]}%
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount0">{token0Symbol} Amount</Label>
                  <Input
                    id="amount0"
                    type="number"
                    placeholder="0.0"
                    value={amount0}
                    onChange={(e) => setAmount0(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount1">{token1Symbol} Amount</Label>
                  <Input
                    id="amount1"
                    type="number"
                    placeholder="0.0"
                    value={amount1}
                    onChange={(e) => setAmount1(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleApproveToken0}
                    className="w-full"
                    variant="outline"
                    disabled={!amount0 || approveWETHState.status === 'pending'}
                  >
                    {approveWETHState.status === 'pending' ? `Approving ${token0Symbol}...` : `Approve ${token0Symbol}`}
                  </Button>
                  <Button
                    onClick={handleApproveToken1}
                    className="w-full"
                    variant="outline"
                    disabled={!amount1 || approveUSDCState.status === 'pending'}
                  >
                    {approveUSDCState.status === 'pending' ? `Approving ${token1Symbol}...` : `Approve ${token1Symbol}`}
                  </Button>
                  <Button
                    onClick={handleMintPosition}
                    className="w-full"
                    disabled={!amount0 || !amount1 || mintState.status === 'pending'}
                  >
                    {mintState.status === 'pending' ? 'Creating Position...' : 'Create Position'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

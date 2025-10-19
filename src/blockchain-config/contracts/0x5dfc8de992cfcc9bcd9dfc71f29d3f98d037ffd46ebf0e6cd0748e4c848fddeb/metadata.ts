import { type ContractSourceCodeMetadata } from "@/blockchain-config/types";

export const metadata = {
  "name": "NonfungiblePositionManager",
  "primaryContract": "code/contracts/NonfungiblePositionManager.sol:NonfungiblePositionManager",
  "abiFile": "abi.ts",
  "methods": {
    "name()": {
      "details": "See {IERC721Metadata-name}."
    },
    "symbol()": {
      "details": "See {IERC721Metadata-symbol}."
    },
    "baseURI()": {
      "details": "Returns the base URI set via {_setBaseURI}. This will be automatically added as a prefix in {tokenURI} to each token's URI, or to the token ID if no specific URI is set for that token ID."
    },
    "refundETH()": {
      "details": "Useful for bundling with mint or increase liquidity that uses ether, or exact output swaps that use ether for the input amount",
      "notice": "Refunds any ETH balance held by this contract to the `msg.sender`"
    },
    "burn(uint256)": {
      "params": {
        "tokenId": "The ID of the token that is being burned"
      },
      "notice": "Burns a token ID, which deletes it from the NFT contract. The token must have 0 liquidity and all tokens must be collected first."
    },
    "totalSupply()": {
      "details": "See {IERC721Enumerable-totalSupply}."
    },
    "ownerOf(uint256)": {
      "details": "See {IERC721-ownerOf}."
    },
    "DOMAIN_SEPARATOR()": {
      "returns": {
        "_0": "The domain seperator used in encoding of permit signature"
      },
      "notice": "The domain separator used in the permit signature"
    },
    "balanceOf(address)": {
      "details": "See {IERC721-balanceOf}."
    },
    "multicall(bytes[])": {
      "params": {
        "data": "The encoded function data for each of the calls to make to this contract"
      },
      "details": "The `msg.value` should not be trusted for any method callable from multicall.",
      "returns": {
        "results": "The results from each of the calls passed in via data"
      },
      "notice": "Call multiple functions in the current contract and return the data from all of them if they all succeed"
    },
    "positions(uint256)": {
      "params": {
        "tokenId": "The ID of the token that represents the position"
      },
      "details": "Throws if the token ID is not valid.",
      "returns": {
        "fee": "The fee associated with the pool",
        "nonce": "The nonce for permits",
        "token0": "The address of the token0 for a specific pool",
        "token1": "The address of the token1 for a specific pool",
        "operator": "The address that is approved for spending",
        "liquidity": "The liquidity of the position",
        "tickLower": "The lower end of the tick range for the position",
        "tickUpper": "The higher end of the tick range for the position",
        "tokensOwed0": "The uncollected amount of token0 owed to the position as of the last computation",
        "tokensOwed1": "The uncollected amount of token1 owed to the position as of the last computation",
        "feeGrowthInside0LastX128": "The fee growth of token0 as of the last action on the individual position",
        "feeGrowthInside1LastX128": "The fee growth of token1 as of the last action on the individual position"
      },
      "notice": "Returns the position information associated with a given token ID."
    },
    "getApproved(uint256)": {
      "details": "Returns the account approved for `tokenId` token. Requirements: - `tokenId` must exist."
    },
    "tokenByIndex(uint256)": {
      "details": "See {IERC721Enumerable-tokenByIndex}."
    },
    "approve(address,uint256)": {
      "details": "See {IERC721-approve}."
    },
    "supportsInterface(bytes4)": {
      "details": "See {IERC165-supportsInterface}. Time complexity O(1), guaranteed to always use less than 30 000 gas."
    },
    "unwrapWETH9(uint256,address)": {
      "params": {
        "recipient": "The address receiving ETH",
        "amountMinimum": "The minimum amount of WETH9 to unwrap"
      },
      "details": "The amountMinimum parameter prevents malicious contracts from stealing WETH9 from users.",
      "notice": "Unwraps the contract's WETH9 balance and sends it to recipient as ETH."
    },
    "setApprovalForAll(address,bool)": {
      "details": "See {IERC721-setApprovalForAll}."
    },
    "isApprovedForAll(address,address)": {
      "details": "See {IERC721-isApprovedForAll}."
    },
    "sweepToken(address,uint256,address)": {
      "params": {
        "token": "The contract address of the token which will be transferred to `recipient`",
        "recipient": "The destination address of the token",
        "amountMinimum": "The minimum amount of token required for a transfer"
      },
      "details": "The amountMinimum parameter prevents malicious contracts from stealing the token from users",
      "notice": "Transfers the full amount of a token held by this contract to recipient"
    },
    "tokenOfOwnerByIndex(address,uint256)": {
      "details": "See {IERC721Enumerable-tokenOfOwnerByIndex}."
    },
    "transferFrom(address,address,uint256)": {
      "details": "See {IERC721-transferFrom}."
    },
    "safeTransferFrom(address,address,uint256)": {
      "details": "See {IERC721-safeTransferFrom}."
    },
    "collect((uint256,address,uint128,uint128))": {
      "params": {
        "params": "tokenId The ID of the NFT for which tokens are being collected, recipient The account that should receive the tokens, amount0Max The maximum amount of token0 to collect, amount1Max The maximum amount of token1 to collect"
      },
      "returns": {
        "amount0": "The amount of fees collected in token0",
        "amount1": "The amount of fees collected in token1"
      },
      "notice": "Collects up to a maximum amount of fees owed to a specific position to the recipient"
    },
    "uniswapV3MintCallback(uint256,uint256,bytes)": {
      "params": {
        "data": "Any data passed through by the caller via the IUniswapV3PoolActions#mint call",
        "amount0Owed": "The amount of token0 due to the pool for the minted liquidity",
        "amount1Owed": "The amount of token1 due to the pool for the minted liquidity"
      },
      "details": "In the implementation you must pay the pool tokens owed for the minted liquidity. The caller of this method must be checked to be a UniswapV3Pool deployed by the canonical UniswapV3Factory.",
      "notice": "Called to `msg.sender` after minting liquidity to a position from IUniswapV3Pool#mint."
    },
    "safeTransferFrom(address,address,uint256,bytes)": {
      "details": "See {IERC721-safeTransferFrom}."
    },
    "permit(address,uint256,uint256,uint8,bytes32,bytes32)": {
      "params": {
        "r": "Must produce valid secp256k1 signature from the holder along with `v` and `s`",
        "s": "Must produce valid secp256k1 signature from the holder along with `r` and `v`",
        "v": "Must produce valid secp256k1 signature from the holder along with `r` and `s`",
        "spender": "The account that is being approved",
        "tokenId": "The ID of the token that is being approved for spending",
        "deadline": "The deadline timestamp by which the call must be mined for the approve to work"
      },
      "notice": "Approve of a specific token ID for spending by spender via signature"
    },
    "selfPermit(address,uint256,uint256,uint8,bytes32,bytes32)": {
      "params": {
        "r": "Must produce valid secp256k1 signature from the holder along with `v` and `s`",
        "s": "Must produce valid secp256k1 signature from the holder along with `r` and `v`",
        "v": "Must produce valid secp256k1 signature from the holder along with `r` and `s`",
        "token": "The address of the token spent",
        "value": "The amount that can be spent of token",
        "deadline": "A timestamp, the current blocktime must be less than or equal to this timestamp"
      },
      "details": "The `owner` is always msg.sender and the `spender` is always address(this).",
      "notice": "Permits this contract to spend a given token from `msg.sender`"
    },
    "decreaseLiquidity((uint256,uint128,uint256,uint256,uint256))": {
      "params": {
        "params": "tokenId The ID of the token for which liquidity is being decreased, amount The amount by which liquidity will be decreased, amount0Min The minimum amount of token0 that should be accounted for the burned liquidity, amount1Min The minimum amount of token1 that should be accounted for the burned liquidity, deadline The time by which the transaction must be included to effect the change"
      },
      "returns": {
        "amount0": "The amount of token0 accounted to the position's tokens owed",
        "amount1": "The amount of token1 accounted to the position's tokens owed"
      },
      "notice": "Decreases the amount of liquidity in a position and accounts it to the position"
    },
    "selfPermitAllowed(address,uint256,uint256,uint8,bytes32,bytes32)": {
      "params": {
        "r": "Must produce valid secp256k1 signature from the holder along with `v` and `s`",
        "s": "Must produce valid secp256k1 signature from the holder along with `r` and `v`",
        "v": "Must produce valid secp256k1 signature from the holder along with `r` and `s`",
        "nonce": "The current nonce of the owner",
        "token": "The address of the token spent",
        "expiry": "The timestamp at which the permit is no longer valid"
      },
      "details": "The `owner` is always msg.sender and the `spender` is always address(this)",
      "notice": "Permits this contract to spend the sender's tokens for permit signatures that have the `allowed` parameter"
    },
    "createAndInitializePoolIfNecessary(address,address,uint24,uint160)": {
      "params": {
        "fee": "The fee amount of the v3 pool for the specified token pair",
        "token0": "The contract address of token0 of the pool",
        "token1": "The contract address of token1 of the pool",
        "sqrtPriceX96": "The initial square root price of the pool as a Q64.96 value"
      },
      "details": "This method can be bundled with others via IMulticall for the first action (e.g. mint) performed against a pool",
      "returns": {
        "pool": "Returns the pool address based on the pair of tokens and fee, will return the newly created pool address if necessary"
      },
      "notice": "Creates a new pool if it does not exist, then initializes if not initialized"
    },
    "increaseLiquidity((uint256,uint256,uint256,uint256,uint256,uint256))": {
      "params": {
        "params": "tokenId The ID of the token for which liquidity is being increased, amount0Desired The desired amount of token0 to be spent, amount1Desired The desired amount of token1 to be spent, amount0Min The minimum amount of token0 to spend, which serves as a slippage check, amount1Min The minimum amount of token1 to spend, which serves as a slippage check, deadline The time by which the transaction must be included to effect the change"
      },
      "returns": {
        "amount0": "The amount of token0 to acheive resulting liquidity",
        "amount1": "The amount of token1 to acheive resulting liquidity",
        "liquidity": "The new liquidity amount as a result of the increase"
      },
      "notice": "Increases the amount of liquidity in a position, with tokens paid by the `msg.sender`"
    },
    "selfPermitIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)": {
      "params": {
        "r": "Must produce valid secp256k1 signature from the holder along with `v` and `s`",
        "s": "Must produce valid secp256k1 signature from the holder along with `r` and `v`",
        "v": "Must produce valid secp256k1 signature from the holder along with `r` and `s`",
        "token": "The address of the token spent",
        "value": "The amount that can be spent of token",
        "deadline": "A timestamp, the current blocktime must be less than or equal to this timestamp"
      },
      "details": "The `owner` is always msg.sender and the `spender` is always address(this). Can be used instead of #selfPermit to prevent calls from failing due to a frontrun of a call to #selfPermit",
      "notice": "Permits this contract to spend a given token from `msg.sender`"
    },
    "selfPermitAllowedIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)": {
      "params": {
        "r": "Must produce valid secp256k1 signature from the holder along with `v` and `s`",
        "s": "Must produce valid secp256k1 signature from the holder along with `r` and `v`",
        "v": "Must produce valid secp256k1 signature from the holder along with `r` and `s`",
        "nonce": "The current nonce of the owner",
        "token": "The address of the token spent",
        "expiry": "The timestamp at which the permit is no longer valid"
      },
      "details": "The `owner` is always msg.sender and the `spender` is always address(this) Can be used instead of #selfPermitAllowed to prevent calls from failing due to a frontrun of a call to #selfPermitAllowed.",
      "notice": "Permits this contract to spend the sender's tokens for permit signatures that have the `allowed` parameter"
    },
    "mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))": {
      "params": {
        "params": "The params necessary to mint a position, encoded as `MintParams` in calldata"
      },
      "details": "Call this when the pool does exist and is initialized. Note that if the pool is created but not initialized a method does not exist, i.e. the pool is assumed to be initialized.",
      "returns": {
        "amount0": "The amount of token0",
        "amount1": "The amount of token1",
        "tokenId": "The ID of the token that represents the minted position",
        "liquidity": "The amount of liquidity for this position"
      },
      "notice": "Creates a new position wrapped in a NFT"
    },
    "PERMIT_TYPEHASH()": {
      "notice": "The permit typehash used in the permit signature"
    }
  },
  "errors": {},
  "bytecodeHash": "0x5dfc8de992cfcc9bcd9dfc71f29d3f98d037ffd46ebf0e6cd0748e4c848fddeb",
  "contractFileTree": {
    "code": {
      "contracts": {
        "base": {
          "Multicall.sol": "",
          "SelfPermit.sol": "",
          "ERC721Permit.sol": "",
          "BlockTimestamp.sol": "",
          "PoolInitializer.sol": "",
          "PeripheryPayments.sol": "",
          "LiquidityManagement.sol": "",
          "PeripheryValidation.sol": "",
          "PeripheryImmutableState.sol": ""
        },
        "libraries": {
          "ChainId.sol": "",
          "PoolAddress.sol": "",
          "PositionKey.sol": "",
          "TransferHelper.sol": "",
          "LiquidityAmounts.sol": "",
          "CallbackValidation.sol": ""
        },
        "interfaces": {
          "IMulticall.sol": "",
          "ISelfPermit.sol": "",
          "IERC721Permit.sol": "",
          "external": {
            "IWETH9.sol": "",
            "IERC1271.sol": "",
            "IERC20PermitAllowed.sol": ""
          },
          "IPoolInitializer.sol": "",
          "IPeripheryPayments.sol": "",
          "IPeripheryImmutableState.sol": "",
          "INonfungiblePositionManager.sol": "",
          "INonfungibleTokenPositionDescriptor.sol": ""
        },
        "NonfungiblePositionManager.sol": ""
      },
      "@openzeppelin": {
        "contracts": {
          "math": {
            "SafeMath.sol": ""
          },
          "utils": {
            "Address.sol": "",
            "Context.sol": "",
            "Strings.sol": "",
            "EnumerableMap.sol": "",
            "EnumerableSet.sol": ""
          },
          "token": {
            "ERC20": {
              "IERC20.sol": ""
            },
            "ERC721": {
              "ERC721.sol": "",
              "IERC721.sol": "",
              "IERC721Metadata.sol": "",
              "IERC721Receiver.sol": "",
              "IERC721Enumerable.sol": ""
            }
          },
          "drafts": {
            "IERC20Permit.sol": ""
          },
          "introspection": {
            "ERC165.sol": "",
            "IERC165.sol": ""
          }
        }
      },
      "@uniswap": {
        "v3-core": {
          "contracts": {
            "interfaces": {
              "pool": {
                "IUniswapV3PoolImmutables.sol": "",
                "IUniswapV3PoolDerivedState.sol": "",
                "IUniswapV3PoolOwnerActions.sol": "",
                "IUniswapV3PoolState.sol": "",
                "IUniswapV3PoolEvents.sol": "",
                "IUniswapV3PoolActions.sol": ""
              },
              "callback": {
                "IUniswapV3MintCallback.sol": ""
              },
              "IUniswapV3Pool.sol": "",
              "IUniswapV3Factory.sol": ""
            },
            "libraries": {
              "FullMath.sol": "",
              "TickMath.sol": "",
              "FixedPoint96.sol": "",
              "FixedPoint128.sol": ""
            }
          }
        }
      }
    }
  }
} as const satisfies ContractSourceCodeMetadata;
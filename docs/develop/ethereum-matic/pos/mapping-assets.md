---
id: mapping-assets
title: Mapping Assets using POS
description: Build your next blockchain app on Matic.
keywords:
  - docs
  - matic
image: https://matic.network/banners/matic-network-16x9.png
---

### Introduction

Mapping is necessary in order to transfer your assets to and fro the Ethereum and Matic Network.

- **Root chain** :: referring to either Goerli or Ethereum Mainnet
- **Child chain** :: refers to either Matic Mumbai or Matic Matic Mainnet

If you already have your token contract deployed on Root chain and want to move it to Child chain, then this walkthorugh can be followed. But If you intend to deploy your contract on Matic Mainnet first, mint the tokens on Child chain fitst and then move it back to the Root chain, then you need to follow this [guide](/docs/develop/ethereum-matic/mintable-assets)

## Standard Child Token

If you just need a standard ERC20/ERC721/ERC1155 contract, then you can go ahead and submit a mapping request at https://mapper.matic.today/ and we will auto deploy the standard child token contract for you. 

Standard Child Token contract will look like these:-
1. [ERC20](https://github.com/maticnetwork/pos-portal/blob/master/flat/ChildERC20.sol#L1492-#L1508)
2. [ERC721](https://github.com/maticnetwork/pos-portal/blob/master/flat/ChildERC721.sol#L2157-#L2238)
3. [ERC1155](https://github.com/maticnetwork/pos-portal/blob/master/flat/ChildERC1155.sol#L1784-#L1818)

Please visit this [link](/docs/develop/ethereum-matic/submit-mapping-request) to understand how to create a new mapping request. 

## Custom Child Token

But, if you need a custom child token contract which has additional functions to the standard functions, **then you will have to deploy your token contracts on the Child chain** and submit a mapping request [here](https://mapper.matic.today/) by mentioning the address of your deployed child token contract. Let us now see an example of creating a custom child token contract.

**Your custom child contract should follow certain guidelines before you deploy it on the child chain.**

`deposit` method should be present in your custom child contract. This function is called by the `ChildChainManagerProxy`  contract whenever a deposit is initiated from the root chain. This deposit function internally mints the token on the child chain.

`withdraw` method should be present in your custom child contract. It can be called to burn your tokens on the child chain. Burning is the first step of your withdrawal process. This withdraw function internally burns the token on the child chain.

These rules need to followed to maintain proper balance of assets between two chains.

> Note: No token minting in constructor of child token contract.

#### Implementation

As we now know, why we need to implement `deposit` & `withdraw` methods in child token contract, we can proceed for implementing it.

```js title="ChildERC20.sol"
pragma solidity 0.6.6;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract ChildERC20 is ERC20,
{
    using SafeMath for uint256;

    constructor(string memory name, string memory symbol, uint8 decimals) public ERC20(name, symbol) {
        
        _setupDecimals(decimals);
        // can't mint here, because minting in child chain smart contract's constructor not allowed
        // _mint(msg.sender, 10 ** 27);
    
    }

    function deposit(address user, bytes calldata depositData) external {
        uint256 amount = abi.decode(depositData, (uint256));

        // `amount` token getting minted here & equal amount got locked in RootChainManager
        _totalSupply = _totalSupply.add(amount);
        _balances[user] = _balances[user].add(amount);
        
        emit Transfer(address(0), user, amount);
    }

    function withdraw(uint256 amount) external {
        _balances[msg.sender] = _balances[msg.sender].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        
        emit Transfer(msg.sender, address(0), amount);
    }

}
```

But one thing you might notice, The `deposit` function, in the above implementation can be called by anyone, which must not happen. So we're going to make sure it can only be called by `ChildChainManagerProxy`. (ChildChainManagerProxy - on [Mumbai](https://explorer-mumbai.maticvigil.com/address/0xb5505a6d998549090530911180f38aC5130101c6/transactions) , on [Matic Mainnet](https://explorer-mainnet.maticvigil.com/address/0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa/) )

```js title="ChildERC20.sol"
pragma solidity 0.6.6;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract ChildERC20 is ERC20,
{
    using SafeMath for uint256;
    // keeping it for checking, whether deposit being called by valid address or not
    address public childChainManagerProxy;
    address deployer;

    constructor(string memory name, string memory symbol, uint8 decimals, address _childChainManagerProxy) public ERC20(name, symbol) {
        
        _setupDecimals(decimals);
        childChainManagerProxy = _childChainManagerProxy;
        deployer = msg.sender;

        // Can't mint here, because minting in child chain smart contract's constructor not allowed
        //
        // In case of mintable tokens it can be done, there can be external mintable function too
        // which can be called by some trusted parties
        // _mint(msg.sender, 10 ** 27);
    
    }

    // being proxified smart contract, most probably childChainManagerProxy contract's address
    // is not going to change ever, but still, lets keep it 
    function updateChildChainManager(address newChildChainManagerProxy) external {
        require(newChildChainManagerProxy != address(0), "Bad ChildChainManagerProxy address");
        require(msg.sender == deployer, "You're not allowed");

        childChainManagerProxy = newChildChainManagerProxy;
    }

    function deposit(address user, bytes calldata depositData) external {
        require(msg.sender == childChainManagerProxy, "You're not allowed to deposit");

        uint256 amount = abi.decode(depositData, (uint256));

        // `amount` token getting minted here & equal amount got locked in RootChainManager
        _totalSupply = _totalSupply.add(amount);
        _balances[user] = _balances[user].add(amount);
        
        emit Transfer(address(0), user, amount);
    }

    function withdraw(uint256 amount) external {
        _balances[msg.sender] = _balances[msg.sender].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        
        emit Transfer(msg.sender, address(0), amount);
    }

}
```

This updated implementation can be used for mapping.

Steps :

- First deploy root token on root chain i.e. {Goerli, Ethereum Mainnet}
- Ensure your child token has the `deposit` & `withdraw` functions
- deploy the child token on child chain i.e. {Matic Mumbai, Matic Mainnet}
- Then submit a mapping request, to be resolved by team.

### Request Submission

Please go through [this](/docs/develop/ethereum-matic/submit-mapping-request).

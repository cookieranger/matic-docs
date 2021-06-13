---
id: verification
title: Verifying Contracts
description: Verifying your contracts on polygon scan
keywords:
  - docs
  - matic
  - verification
  - polygonscan
image: https://matic.network/banners/matic-network-16x9.png 
---

The first and foremost requirement is to flatten the solidity contract into a single file.

## **Flatten your solidity contract**

Install [truffle-flattener](https://github.com/nomiclabs/truffle-flattener) or [sol-merger](https://github.com/RyuuGan/sol-merger)


Flatten using command

```sol-merger \"./contracts/*.sol\" ./build```

## **Verifying on Polygonscan**

Navigate to your contract's polygonscan page and then click verify and publish

<img src={useBaseUrl("img/verification/verify-publish.png")} />


- Select ```Solidity (Single File)``` in compiler type
- Select appropriate compiler version
- Choose the license type of your contract

Onto the next section, paste your flattended contract here.

If you had enabled optimization then adjust the  `optimization` section accordingly.

Constructor arguments should have been filled in automatically, if not, they can be retrieved from the trailing bytes of the deployment transaction, they resemble something like ```000000000000000000000000a6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa```

That's it, you are done. 
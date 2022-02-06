# Hyphal Network

## Introduction

We are Hyphal, a network for a deeper connection. Our focus is initially on soil sampling and other aspects of natures health. Our intention is to make this data easier to collect, maintain, and more accessible for everyone.

By geotagging the samples, we can co-relate them with others taken over time and show a historical overview of different indicators representing the overall quality of the land and the measures taken to improve it.

Our broader vision is to integrate Hyphal into other aspects that compose the land ecosystem, from soil to trees, plants, lakes, streams, the air, wildlife, and other natural elements.

Hyphal's goal is to collaborate with nature and other like-minded projects. Giving these natural entities to hold value in our network which can be spent in care for themselves.

## Pre Requisites

Before running any command, you need to create a `.env` file and set a BIP-39 compatible mnemonic as an environment
variable. Follow the example in `.env.example`.

Then, proceed with installing dependencies:

```sh
yarn
```

## Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

## Lint Solidity

Lint the Solidity code:

```sh
$ yarn lint:sol
```

## Lint TypeScript

Lint the TypeScript code:

```sh
$ yarn lint:ts
```

# Tasks

Important: For all tasks make sure the right values are set in `./tasks/constants/sampleConstants.ts`

## Deploy Sample Smart Contract

`yarn hardhat --network [networkName] sample:deploy`

example:

```sh
yarn hardhat --network moonbase soiltoken:deploy
```

## Owner

### Get current owner of the Sample Smart Contract

`yarn hardhat --network [networkName] sample:owner`

example:

```
yarn hardhat --network moonbase sample:owner
```

### Transfer owner

`yarn hardhat --network [networkName] sample:transferOwner --o [newOwnerAddress]`

example:

```sh
yarn hardhat --network moonbase sample:transferOwner --o 0x7777777D1432e8bB290a8B282E31231A201C738F
```

## Deploy SoilToken Smart Contract

`yarn hardhat --network [networkName] soiltoken:deploy`

example:

```sh
yarn hardhat --network moonbase sample:deploy
```

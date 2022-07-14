# XCM-tools

A set if scripts to help XCM initialization, asset registration and chanel set up

## Install dependencies

From this directory

`yarn install`

## Register-asset script

Script that allows to register an asset in a Moonbeam runtime. It particulary does three things:

- Registers the asset
- Sets the asset units per second to be charged
- Sets the revert code in the asset precompile

The script accepts these inputs fields:
- `--ws-provider or -w`, which specifies the websocket provider to which we will be issuing our requests
- `--asset or -a`, the MultiLocation identifier of the asset to be registered
- `--units-per-second or -u`, optional, specifies how much we should charge per second of execution in the registered asset.
- `--name or -n`, the name of the asset
- `--symbol or --sym`, the symbol of the asset
- `--decimals or -d`, the number of decimals of the asset
- `--existential-deposit or --ed`, the existential deposit of the registered asset
- `--sufficient or --suf`, boolean indicating whether the asset should exist without a provider reference
- `--revert-code or --revert`, boolean specifying whether we want register the revert code in the evm
- `--account-priv-key or -a`, which specifies the account that will submit the proposal
- `--send-preimage-hash or -h`, boolean specifying whether we want to send the preimage hash    
- `--send-proposal-as or -s`, optional, but if providede needs to be "democracy" or "council-external" specifying whether we want to send the proposal through regular democracy or as an external proposal that will be voted by the council
- `--collective-threshold or -c`, Optional, number specifying the number of council votes that need to aprove the proposal. If not provided defautls to 1.
- `--at-block`, Optional, number specifying the block number at which the call should get executed.

### Examples to note Pre-Image and propose

`yarn register-asset -w ws://127.0.0.1:34102  --asset  '{ "parents": 1, "interior": "Here" }' -u 1 --name "DOT" --sym "DOT" -d 12 --ed 1 --sufficient true --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" -h true -s democracy --revert-code true`

`yarn register-asset -w ws://127.0.0.1:34102  --asset '{ "parents": 1, "interior": {"X2": [ { "Parachain": 1001 }, { "GeneralIndex": 8 }]}}' -u 13000000000 --name "xcRMRK" --sym "xcRMRK" -d 10 --ed 1 --sufficient true --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" -h true -s democracy --revert-code true`

`yarn register-asset -w ws://127.0.0.1:34102  --asset '{ "parents": 1, "interior": {"X1": { "Parachain": 1001 }}}' -u 13000000000 --name "xcBNC" --sym "xcBNC" -d 12 --ed 1 --sufficient true --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" -h true -s democracy --revert-code true`

`yarn register-asset -w ws://127.0.0.1:34102 --asset '{ "parents": 1, "interior": {"X2": [ { "Parachain": 1002 }, { "GeneralKey": "0x000b" }]}}' --name "Kintsugi Wrapped BTC" --sym "xcKBTC" -d 8 --ed 1 --sufficient true --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" -h true -s democracy --revert-code true`

### Example to note Pre-Image and propose through council

`yarn register-asset -w ws://127.0.0.1:34102  --asset  '{ "parents": 1, "interior": "Here" }' -u 1 --name "Parent" --sym "DOT" -d 12 --ed 1 --sufficient true --account-priv-key "0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b" -h true -s council-external -c 2`

## XCM-initializer script

Script that allows to initialize XCM in a Moonbeam runtime. It particularly does:

- Sets the default XCM version to be used if we dont know the version supported by the other end
- Sets the revert code in the xtokens precomipe
- Sets the revert code in the XCM-transactor precompile

The script accepts these inputs fields:
- `--ws-provider or -w`, which specifies the websocket provider to which we will be issuing our requests
- `--default-xcm-version or -d`, optional, provides the new default XCM version we want to set
- `--xtokens-address or --xt`, optional, if provided, it will set the revert code at that address.
- `--xcm-transactor-address or --xcmt`, optional, if provided, it will set the revert code at that address.
- `--relay-encoder-address or --re`, optional, if provided, it will set the revert code at that address.
- `--account-priv-key or -a`, which specifies the account that will submit the proposal
- `--send-preimage-hash or -h`, boolean specifying whether we want to send the preimage hash
- `--send-proposal-as or -s`, optional, but if providede needs to be "democracy" or "council-external" specifying whether we want to send the proposal through regular democracy or as an external proposal that will be voted by the council
- `--collective-threshold or -c`, Optional, number specifying the number of council votes that need to aprove the proposal. If not provided defautls to 1.
- `--at-block`, Optional, number specifying the block number at which the call should get executed.


### Example to note Pre-Image and propose

`yarn initialize-xcm --ws-provider ws://127.0.0.1:34102  --default-xcm-version 2 --xcm-transactor-address "0x0000000000000000000000000000000000000806" --xtokens-address "0x0000000000000000000000000000000000000804" --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" --send-preimage-hash true --send-proposal-as democracy`

### Example to note Pre-Image and propose through council

`yarn initialize-xcm --ws-provider ws://127.0.0.1:34102  --default-xcm-version 2 --xcm-transactor-address "0x0000000000000000000000000000000000000806" --xtokens-address "0x0000000000000000000000000000000000000804" --account-priv-key "0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b" --send-preimage-hash true --send-proposal-as council-external --collective-threshold 2`

## HRMP-manipulator script

Script that allows to initiate an HRMP action in the relay from the parachain. In particular, the script allows to open a channel, accept an existing open channel request, cancel an existing open channel request, or closing an existing HRMP channel.

The script accepts these inputs fields:
- `--parachain-ws-provider or --wp`, which specifies the parachain websocket provider to which we will be issuing our requests
- `--relay-ws-provider or --wr`, which specifies the relay websocket provider to which we will be issuing our requests
- `--hrmp-action or --hrmp`, one of "accept", "close", "cancel", or "open".
- `--target-para-id or -p`, The target paraId with which we interact.
- `--max-capacity or --mc`, Optional, only for "open". The max capacity in messages that the channel supports.
- `--max-message-size or -mms`, Optional, only for "open". The max message size that the channel supports.
- `--account-priv-key or -a`, which specifies the account that will submit the proposal
- `--send-preimage-hash or -h`, boolean specifying whether we want to send the preimage hash
- `--send-proposal-as or -s`, optional, but if providede needs to be "democracy" or "council-external" specifying whether we want to send the proposal through regular democracy or as an external proposal that will be voted by the council
- `--collective-threshold or -c`, Optional, number specifying the number of council votes that need to aprove the proposal. If not provided defautls to 1.
- `--at-block`, Optional, number specifying the block number at which the call should get executed.

### Example to note Pre-Image and propose

`yarn hrmp-manipulator --parachain-ws-provider ws://127.0.0.1:34102  --relay-ws-provider ws://127.0.0.1:34002 --hrmp-action accept --target-para-id 2003 --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" --send-preimage-hash true --send-proposal-as  democracy`

### Example to note Pre-Image and propose through council

`yarn hrmp-manipulator --parachain-ws-provider ws://127.0.0.1:34102  --relay-ws-provider ws://127.0.0.1:34002 --hrmp-action accept --target-para-id 2003 --account-priv-key "0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b" --send-preimage-hash true  --send-proposal-as council-external -c 2`

`yarn hrmp-manipulator --parachain-ws-provider ws://127.0.0.1:34102  --relay-ws-provider ws://127.0.0.1:34002 --hrmp-action open --target-para-id 2003 --mc 8 --mms 512 --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" --send-preimage-hash true --send-proposal-as democracy`

## XCM-transactor-info-setter script

Script that allows to set the transactor info in the XCM-transactor pallet. For a given chain, this allows to set:

- The amount of extra weight involved in the transact operations
- The amount of fee the chain charges per weight unit.

The script accepts these inputs fields:
- `--ws-provider or -w`, which specifies the websocket provider to which we will be issuing our requests
- `--destination or --d`, the MultiLocation identifier of the destination for which to set the transact info
- `--fee-per-weight or --fw`, the amount of fee the destination will charge per weight
- `--extra-weight or --ew`, the amount of extra weight that sending the transact XCM message involves
- `--account-priv-key or -a`, which specifies the account that will submit the proposal
- `--send-preimage-hash or -h`, boolean specifying whether we want to send the preimage hash
- `--send-proposal or -s`, optional, but if providede needs to be "democracy" or "council-external" specifying whether we want to send the proposal through regular democracy or as an external proposal that will be voted by the council
- `--collective-threshold or -c`, Optional, number specifying the number of council votes that need to aprove the proposal. If not provided defautls to 1.
- `--at-block`, Optional, number specifying the block number at which the call should get executed.

### Example to note Pre-Image and propose
`yarn set-transact-info --ws-provider ws://127.0.0.1:34102  --destination  '{ "parents": 1, "interior": "Here" }' --fee-per-second 8 --extra-weight 3000000000 --max-weight 20000000000 --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" --send-preimage-hash true --send-proposal-as  democracy`

### Example to note Pre-Image and propose through council
`yarn set-transact-info --ws-provider ws://127.0.0.1:34102  --destination  '{ "parents": 1, "interior": "Here" }' --fee-per-second 8 --extra-weight 3000000000 --max-weight 20000000000 --account-priv-key "0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b" --send-preimage-hash true --send-proposal-as council-external -c 2`

### Example to note Pre-Image and propose through democracy with index registration
`yarn set-transact-info --ws-provider ws://127.0.0.1:34102  --destination  '{ "parents": 1, "interior": "Here" }' --fee-per-second 8 --extra-weight 3000000000 --max-weight 20000000000 --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" --send-preimage-hash true --send-proposal-as  democracy --register-index true --owner "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac" --index 0`


## XCM-derivative-index-registrator script

Script that allows to register a parachain account for a derivative index usage in a sovereign account. This will allows the parachain account to issue transact commands to a derivative index of the sovereign account

The script accepts these inputs fields:
- `--ws-provider or -w`, which specifies the websocket provider to which we will be issuing our requests
- `--owner or --o`, the parachain account that will own the derivative index
- `--index or --i`, the index that the owner will own
- `--account-priv-key or -a`, which specifies the account that will submit the proposal
- `--send-preimage-hash or -h`, boolean specifying whether we want to send the preimage hash
- `--send-proposal-as or -s`, optional, but if providede needs to be "democracy" or "council-external" specifying whether we want to send the proposal through regular democracy or as an external proposal that will be voted by the council
- `--collective-threshold or -c`, Optional, number specifying the number of council votes that need to aprove the proposal. If not provided defautls to 1.
- `--at-block`, Optional, number specifying the block number at which the call should get executed.

### Example to note Pre-Image and propose

`yarn register-derivative-index -w ws://127.0.0.1:34102  --index  0 --owner "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac" --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" --send-preimage-hash true --send-proposal-as democracy`

### Example to note Pre-Image and propose through council

`yarn register-derivative-index -w ws://127.0.0.1:34102  --index  0 --owner "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac" --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" --send-preimage-hash true --send-proposal-as council-external --collective-threshold 2`


## Statemint-HRMP-relay-proposal-generator script

Script that allows to build and send the relay call necessary to make statemine accept an already open channel request target-para-id -> statemine and open a new one in the opposite direction. This is meant to be proposed/executed in the relay.

The script accepts these inputs fields:
- `--statemint-ws-provider or -ws`, which specifies the statemint websocket provider
- `--relay-ws-provider or --wr`, which specifies the relay websocket -provider
- `--target-para-id or -p`, The target paraId to which the proposal from statemint will be sent.
- `--max-capacity or --mc`, The max capacity in messages that the channel supports.
- `--max-message-size or --mms`, The max message size that the channel supports.
- `--send-deposit-from or -s`, where the deposit of KSM to statemint sovereign account will be made.  one of "sovereign" or "external-account".
- `--external--account or -e`, Optional, only for "external-account" choices in the previous argument. The account from which we will send the KSM
- `--account-priv-key or -a`, which specifies the account that will submit the preimage
- `--send-preimage-hash or -h`, boolean specifying whether we want to send the preimage hash
- `--send-proposal-as or -s`, Optional, whether we want to submit the proposal. Choices are "democracy" or "sudo"

### Example to note Pre-Image with external account

` yarn statemint-hrmp-propose --statemint-ws-provider wss://statemine-rpc.polkadot.io  --relay-ws-provider wss://kusama-rpc.polkadot.io --target-para-id 2000 --max-capacity  1000 --max-message-size 102400 --send-deposit-from "external-account" --external-account 0x6d6f646c70792f74727372790000000000000000000000000000000000000000  --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" -h true`

### Example to note Pre-Image with sovereign

` yarn statemint-hrmp-propose --statemint-ws-provider wss://statemine-rpc.polkadot.io  --relay-ws-provider wss://kusama-rpc.polkadot.io --target-para-id 2000 --max-capacity 1000 --max-message-size 102400 --send-deposit-from "sovereign"  --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" -h true`

### Example to send sudo as call with external account

` yarn statemint-hrmp-propose --statemint-ws-provider wss://statemine-rpc.polkadot.io  --relay-ws-provider wss://kusama-rpc.polkadot.io --target-para-id 2000 --mc 1000 --mms 102400 --send-deposit-from "external-account" --external-account 0x6d6f646c70792f74727372790000000000000000000000000000000000000000  --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" --send-preimage-hash false --send-proposal-as sudo`

## Generic Call script

Script that allows to propose one or several generic Calls to be executed in a chain. If several calls are provided, these are joint with batchAll from pallet-utility

The script accepts these inputs fields:
- `--ws-provider or -w`, which specifies the websocket provider to which we will be issuing our requests
- `--generic-call or --call`, the call (as hex string) that should be proposed through democracy. Can be passed many times, if we want to batch several together
- `--account-priv-key or -a`, which specifies the account that will submit the proposal
- `--send-preimage-hash or -h`, boolean specifying whether we want to send the preimage hash
- `--send-proposal-as or -s`, optional, but if providede needs to be "democracy" or "council-external" specifying whether we want to send the proposal through regular democracy or as an external proposal that will be voted by the council
- `--collective-threshold or -c`, Optional, number specifying the number of council votes that need to aprove the proposal. If not provided defautls to 1.
- `--at-block`, Optional, number specifying the block number at which the call should get executed.

### Example through democracy

`yarn generic-call-propose -w ws://127.0.0.1:34102  --call "0x0302f24ff3a9cf04c71dbc94d0b566f7a27b94566cacc0f0f4ab324c46e55d02d0033343b4be8a55532d28" --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" --send-preimage-hash true --send-proposal-as democracy`

### Example through council

`yarn generic-call-propose -w ws://127.0.0.1:34102  --call "0x0302f24ff3a9cf04c71dbc94d0b566f7a27b94566cacc0f0f4ab324c46e55d02d0033343b4be8a55532d28" --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" --send-preimage-hash true --send-proposal-as council-external --collective-threshold 2`

### Example through democracy but batching 2 txs

`yarn generic-call-propose -w ws://127.0.0.1:34102  --call "0x0302f24ff3a9cf04c71dbc94d0b566f7a27b94566cacc0f0f4ab324c46e55d02d0033343b4be8a55532d28" --call "0x0302f24ff3a9cf04c71dbc94d0b566f7a27b94566cacc0f0f4ab324c46e55d02d0033343b4be8a55532d28" --account-priv-key "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133" --send-preimage-hash true --send-proposal-as democracy`

## Derivated Address Calculator script

Script that allows to calculate what the derivative address will be for a specific multilocation in a given parachain

The script accepts these inputs fields:
- `--parachain-ws-provider or --wr`, which specifies the websocket provider of the parachain in which the address should be calculated
- `--multilocation or -m`, the multilocation for which we want to calculate the derivated address
- `--length or -l`, the desired length for the resulting address

### Example

`yarn xcm-derivated-address-calculator --wp  ws://127.0.0.1:34102  --multilocation '{ "parents": 1, "interior": {"X2": [ { "Parachain": 1000 }, { "AccountKey20": {"network": "Any", "key": "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"} }]}}' -l 20`

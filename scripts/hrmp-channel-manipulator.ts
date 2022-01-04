// Import
import { ApiPromise, WsProvider } from '@polkadot/api';
import {u8aToHex, hexToU8a} from '@polkadot/util';
import { BN } from "@polkadot/util";

import {blake2AsHex, xxhashAsU8a, blake2AsU8a} from '@polkadot/util-crypto';
import yargs from 'yargs';
import { Keyring } from "@polkadot/api";
import { ParaId } from '@polkadot/types/interfaces';

const args = yargs.options({
    'parachain-ws-provider': {type: 'string', demandOption: true, alias: 'wp'},
    'relay-ws-provider': {type: 'string', demandOption: true, alias: 'wr'},
    'hrmp-action': {choices: ['accept', 'cancel', 'close', 'open'], demandOption: true, alias: 'hrmp'},
    'target-para-id': {type: 'number', demandOption: true, alias: 'p'},
    'max-capacity': {type: 'number', demandOption: false, alias: 'mc'},
    'max-message-size': {type: 'number', demandOption: false, alias: 'mms'},
    'account-priv-key': {type: 'string', demandOption: false, alias: 'account'},
    'send-preimage-hash': {type: 'boolean', demandOption: false, alias: 'h'},
    'send-proposal-as': {choices: ['democracy', 'council-external'], demandOption: false, alias: 's'},
    'collective-threshold': {type: 'number', demandOption: false, alias: 'c'},
  }).argv;
 
const PROPOSAL_AMOUNT = 1000000000000000000000n
// Construct
const wsProvider = new WsProvider(args['parachain-ws-provider']);
const relayProvider = new WsProvider(args['relay-ws-provider']);

async function main () {
    const api = await ApiPromise.create({ provider: wsProvider });
    const relayApi = await ApiPromise.create({ provider: relayProvider });

    const collectiveThreshold = (args['collective-threshold']) ? args['collective-threshold'] :1;

    const keyring = new Keyring({ type: "ethereum" });
    const selfParaId: ParaId = await api.query.parachainInfo.parachainId() as any;

    let relayCall;
    if (args['hrmp-action'] == "accept") {
        relayCall = relayApi.tx.hrmp.hrmpAcceptOpenChannel(
            args["target-para-id"]
        )
    }
    else if (args['hrmp-action'] == "open") {
        relayCall = relayApi.tx.hrmp.hrmpInitOpenChannel(
            args["target-para-id"],
            args["max-capacity"],
            args["max-message-size"]
        )
    }
    else if (args['hrmp-action'] == "cancel") {
        relayCall = relayApi.tx.hrmp.hrmpCancelOpenRequest(
            {
                sender: selfParaId,
                recipient:  args["target-para-id"],
            }
        )
    }
    else {
        relayCall = relayApi.tx.hrmp.hrmpCloseChannel(
            {
                sender: selfParaId,
                recipient:  args["target-para-id"],
            }
        )
    }

    let relayCall2 = relayCall?.method.toHex() || "";
    // Sovereign account is b"para" + encode(parahain ID) + trailling zeros
    let para_address = u8aToHex((new Uint8Array([ ...new TextEncoder().encode("para"), ...selfParaId.toU8a()]))).padEnd(66, "0");

    const batchTx =  api.tx.polkadotXcm.send(
        { V1: { parents: new BN(1), interior: "Here"} },
        { V2: [
            { WithdrawAsset: [
                { id: { Concrete: { parents: new BN(0), interior: "Here"} },
                  fun: { Fungible: new BN(1000000000000) }
                }
            ]
            },
            { BuyExecution:  {
                fees:
                    { id: { Concrete: { parents: new BN(0), interior: "Here"} },
                    fun: { Fungible: new BN(1000000000000) }
                    },
                weightLimit: {Limited: new BN(5000000000)}
                }
            },
            { Transact:  {
                originType: "Native",
                requireWeightAtMost: new BN(1000000000),
                call: {
                    encoded: relayCall2
                   }
                }
            },
            { DepositAsset:  {
                assets: {Wild: "All"},
                max_assets: 1,
                beneficiary: { parents: new BN(0), interior: { X1: { AccountId32: { network: "Any", id: para_address } } }}
                }
            },
            ]
        });

    const account =  await keyring.addFromUri(args['account-priv-key'], null, "ethereum");
    const { nonce: rawNonce, data: balance } = await api.query.system.account(account.address) as any;
    let nonce = BigInt(rawNonce.toString());

    // We just prepare the proposals
    let encodedProposal = batchTx?.method.toHex() || "";
    let encodedHash = blake2AsHex(encodedProposal);
    console.log("Encoded proposal hash for complete is %s", encodedHash);
    console.log("Encoded length %d", encodedProposal.length);

    if (args["send-preimage-hash"]) {
        await api.tx.democracy
        .notePreimage(encodedProposal)
        .signAndSend(account, { nonce: nonce++ });

        if (args["send-proposal-as"] == 'democracy') {
            await api.tx.democracy
            .propose(encodedHash, PROPOSAL_AMOUNT)
            .signAndSend(account, { nonce: nonce++ });
        }
        else if (args["send-proposal-as"] == 'council-external') {
            let external =  api.tx.democracy.externalProposeMajority(encodedHash)
            
            await api.tx.councilCollective
            .propose(collectiveThreshold, external, external.length)
            .signAndSend(account, { nonce: nonce++ });
        }
    }
}


main().catch(console.error).finally(() => process.exit());
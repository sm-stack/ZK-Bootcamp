import { initialize } from "zokrates-js";
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// vitalik's address (goerli)
const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

async function main(address) {

    const provider = ethers.getDefaultProvider('goerli');
    const balance = (await provider.getBalance(address)).toString();
    console.log(`balance: ${balance}`);
    // convert a currency unit from wei to ether
    const balanceInEth = ethers.formatEther(balance);
    console.log(`balance: ${balanceInEth} ETH`);


    const zokratesProvider = await initialize();
    const source = "def main(private field a) { assert(a > 1000000000000000000); return;}";

    // compilation
    const artifacts = zokratesProvider.compile(source);
    // computation
    const { witness, output } = zokratesProvider.computeWitness(artifacts, [balance]);
    // run setup
    const keypair = zokratesProvider.setup(artifacts.program);

    // generate proof
    const proof = zokratesProvider.generateProof(
        artifacts.program,
        witness,
        keypair.pk
    );
    console.log(proof);
    // export solidity verifier
    const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk);
    console.log(verifier);
    fs.writeFile('lesson3.sol', verifier, (err) => {
        if (err) throw err;
        console.log('File written successfully.');
    });

    const inputProof = zokratesProvider.utils.formatProof(proof)
    console.log(inputProof)
    // await deploy(inputProof)
}


async function deploy(proof) {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const verifier = await ethers.deployContract("Verifier");
  
    console.log("Verifier address:", await verifier.getAddress());
}

main(address)


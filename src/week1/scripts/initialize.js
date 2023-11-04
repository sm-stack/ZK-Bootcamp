const hre = require("hardhat");
const { transform, hexToBigInt } = require('./utils.js');
// vitalik's address (goerli)
const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

async function main(address) {
    let { initialize } = await import("zokrates-js");

    const provider = hre.ethers.getDefaultProvider('goerli');
    const balance = (await provider.getBalance(address)).toString();
    // convert a currency unit from wei to ether
    const balanceInEth = hre.ethers.formatEther(balance);
    console.log(`Target Balance: ${balanceInEth} ETH`);

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
    
    console.log('Proof: ', proof);
    const inputProof = await zokratesProvider.utils.formatProof(proof);
    console.log('Input Proof: ', inputProof[0]);
    // deploy verifier contract and verify proof
    // await deployAndVerify(keypair.vk, inputProof[0]);
}

async function deployAndVerify(vk, proof) {
    const keysToTransform = ['alpha', 'beta', 'gamma', 'delta', 'gamma_abc'];
    keysToTransform.forEach(key => transform(vk, key, hexToBigInt));
   
    const deployment = await hre.ethers.deployContract("Verifier", 
        [
            vk.alpha[0],
            vk.alpha[0],
            vk.beta[0],
            vk.beta[1],
            vk.gamma[0],
            vk.gamma[1],
            vk.delta[0],
            vk.delta[1],
            vk.gamma_abc[0][0],
            vk.gamma_abc[0][1],
        ],
    );
    await deployment.waitForDeployment();
    console.log('Verifier Contract Deployed to: ', deployment.target);
    
    const verifier = await hre.ethers.getContractAt("Verifier", deployment.target);
    const result = await verifier.verifyTx(proof);
    console.log('Verification Result: ', result);
}

main(address)


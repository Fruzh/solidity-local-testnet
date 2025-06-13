// scripts/deploy.js
const hre = require("hardhat");

async function main() {
    const TokoDigital = await hre.ethers.getContractFactory("TokoDigital");
    const kontrak = await TokoDigital.deploy();

    await kontrak.waitForDeployment();

    console.log("Alamat kontrak:", await kontrak.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

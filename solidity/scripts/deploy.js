const fs = require("fs");
const path = require("path");

async function main() {
    const [deployer] = await ethers.getSigners();
    const TokoDigital = await ethers.getContractFactory("TokoDigital");
    const toko = await TokoDigital.deploy();
    await toko.waitForDeployment();

    const deployedAddress = await toko.getAddress();
    console.log("✅ Deployed at:", deployedAddress);

    // === Path tujuan frontend ===
    const outDir = path.resolve(__dirname, "../../react-dapp/src/contracts");
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    // === Simpan contract address ===
    const addressData = {
        address: deployedAddress,
        network: "localhost", // bisa diganti "sepolia" dll
    };
    fs.writeFileSync(
        path.join(outDir, "contract-address.json"),
        JSON.stringify(addressData, null, 2)
    );

    // === Salin ABI dari artifacts ke frontend ===
    const artifactPath = path.resolve(__dirname, "../artifacts/contracts/TokoDigital.sol/TokoDigital.json");
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const abiData = {
        abi: artifact.abi,
    };
    fs.writeFileSync(
        path.join(outDir, "TokoDigital.json"),
        JSON.stringify(abiData, null, 2)
    );

    console.log("📁 ABI dan alamat contract disimpan di:", outDir);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

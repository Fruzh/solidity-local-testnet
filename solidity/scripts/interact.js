const hre = require("hardhat");

async function main() {
    const [user] = await hre.ethers.getSigners();

    const TokoDigital = await hre.ethers.getContractFactory("TokoDigital");
    const toko = await TokoDigital.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3"); // ganti kalau perlu

    const produk = await toko.produk();
    const harga = await toko.harga();
    const statusSebelum = await toko.cekStatusBeli(user.address);

    console.log(`📘 Produk: ${produk}`);
    console.log(`💰 Harga: ${hre.ethers.formatEther(harga)} ETH`);
    console.log(`🧾 Status sebelum beli: ${statusSebelum ? "Sudah beli" : "Belum beli"}`);

    const tx = await toko.connect(user).beliProduk({ value: harga });
    await tx.wait();

    const statusSesudah = await toko.cekStatusBeli(user.address);
    console.log(`✅ Transaksi sukses! Status setelah beli: ${statusSesudah ? "Sudah beli" : "Belum beli"}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

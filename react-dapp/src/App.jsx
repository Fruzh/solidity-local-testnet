import { useEffect, useState } from "react";
import { BrowserProvider, Contract, parseEther } from "ethers";

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [sudahBeli, setSudahBeli] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const harga = "0.01";
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const abi = [
    "function beliProduk() external payable",
    "function produk() view returns (string)",
    "function harga() view returns (uint256)",
    "function cekStatusBeli(address) view returns (bool)",
    "function resetPembeli(address user) external",
    "function getPemilik() view returns (address)",
  ];

  const init = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setUserAddress(address);
    const toko = new Contract(contractAddress, abi, signer);
    const status = await toko.cekStatusBeli(address);
    setSudahBeli(status);
    const owner = await toko.getPemilik();
    setIsOwner(address.toLowerCase() === owner.toLowerCase());
  };

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletConnected(true);
        init();
      } catch {
        setStatus("❌ Gagal konek ke wallet.");
      }
    } else {
      setStatus("❌ Metamask tidak ditemukan.");
    }
  };

  const handleBeli = async () => {
    try {
      setLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const toko = new Contract(contractAddress, abi, signer);
      const tx = await toko.beliProduk({ value: parseEther(harga) });
      await tx.wait();
      setStatus("✅ Pembelian berhasil!");
      setSudahBeli(true);
    } catch (err) {
      setStatus("❌ Transaksi gagal: " + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const toko = new Contract(contractAddress, abi, signer);
      const tx = await toko.resetPembeli(userAddress);
      await tx.wait();
      setStatus("✅ Status pembelian berhasil di-reset.");
      setSudahBeli(false);
    } catch (err) {
      setStatus("❌ Reset gagal: " + (err.reason || err.message));
    }
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setWalletConnected(true);
      init();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center transform transition-all hover:scale-105 duration-300">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
          <span>🛍️</span> Toko Digital
        </h1>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-lg text-gray-700 font-medium">
            Produk: <span className="font-bold text-blue-600">E-Book JavaScript</span>
          </p>
          <p className="text-lg text-gray-700">
            Harga: <span className="font-semibold text-purple-600">{harga} ETH</span>
          </p>
        </div>

        {walletConnected ? (
          sudahBeli ? (
            <>
              <p className="text-green-600 font-medium mb-4 bg-green-100 rounded-lg p-3">
                ✅ Kamu sudah membeli produk ini.
              </p>
              {isOwner && (
                <button
                  onClick={handleReset}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-full transition duration-200"
                >
                  🔁 Reset Pembelian
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleBeli}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "⏳ Membeli..." : "🛒 Beli Sekarang"}
            </button>
          )
        ) : (
          <button
            onClick={handleConnectWallet}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition duration-200"
          >
            🔌 Hubungkan Wallet
          </button>
        )}

        {status && (
          <p className="mt-4 text-sm text-gray-600 bg-gray-100 rounded-lg p-2">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
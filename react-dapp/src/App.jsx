import { useEffect, useState } from "react";
import { BrowserProvider, Contract, parseEther } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import contractData from "./contracts/contract-address.json";
import TokoDigital from "./contracts/TokoDigital.json";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [sudahBeli, setSudahBeli] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const harga = "0.01";
  const contractAddress = contractData.address;
  const abi = TokoDigital.abi;

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const init = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);

      const toko = new Contract(contractAddress, abi, signer);
      const status = await toko.cekStatusBeli(address);
      setSudahBeli(status);

      const owner = await toko.getPemilik();
      setIsOwner(address.toLowerCase() === owner.toLowerCase());
    } catch (error) {
      console.error("❌ Gagal inisialisasi:", error);
      toast.error("Gagal inisialisasi koneksi.", { icon: "🚫" });
    }
  };

  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      toast.error("Metamask tidak ditemukan.", { icon: "🚫" });
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletConnected(true);
      await init();
      toast.success("Wallet berhasil terhubung!", { icon: "🔗" });
    } catch {
      toast.error("Gagal konek ke wallet.", { icon: "🚫" });
    }
  };

  const handleBeli = async () => {
    try {
      setLoading(true);
      toast.info("Menyiapkan transaksi...", { icon: "⏳" });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const toko = new Contract(contractAddress, abi, signer);

      const tx = await toko.beliProduk({ value: parseEther(harga) });
      toast.info(`Transaksi dikirim: ${tx.hash}`, { icon: "📤" });

      await tx.wait();
      setShowParticles(true);
      toast.success("Pembelian berhasil! 🎉", { icon: "✅" });
      setSudahBeli(true);
      setTimeout(() => setShowParticles(false), 3000);
    } catch (err) {
      console.error("❌ Error transaksi:", err);
      toast.error(`Gagal beli: ${err.reason || err.message}`, { icon: "🚫" });
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

      toast.success("Status pembelian berhasil di-reset.", { icon: "🔄" });
      setSudahBeli(false);
    } catch (err) {
      console.error("❌ Gagal reset:", err);
      toast.error(`Reset gagal: ${err.reason || err.message}`, { icon: "🚫" });
    }
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setWalletConnected(true);
      init();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center px-4">
      {showParticles && (
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            particles: {
              number: { value: 50 },
              color: { value: "#4B5563" },
              shape: { type: "circle" },
              opacity: { value: 0.5, random: true },
              size: { value: 2, random: true },
              move: {
                enable: true,
                speed: 3,
                direction: "top",
                random: true,
                outModes: { default: "out" },
              },
            },
            interactivity: { events: {} },
            retina_detect: true,
          }}
          className="absolute inset-0 pointer-events-none"
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-gray-800 mb-6"
        >
          🛍️ Toko Digital
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-700 text-lg mb-2 font-medium"
        >
          Produk: <span className="font-semibold">E-Book JavaScript</span>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 mb-8"
        >
          Harga: <span className="font-semibold text-gray-800">{harga} ETH</span>
        </motion.p>

        <AnimatePresence>
          {walletConnected ? (
            sudahBeli ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="purchased"
              >
                <p className="text-green-600 font-medium mb-6 text-lg">
                  ✅ Kamu sudah membeli produk ini!
                </p>
                {isOwner && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleReset}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200"
                  >
                    🔄 Reset Pembelian
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="buy"
                onClick={handleBeli}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm disabled:opacity-50 transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Membeli...
                  </span>
                ) : (
                  "🛒 Beli Sekarang"
                )}
              </motion.button>
            )
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="connect"
              onClick={handleConnectWallet}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200"
            >
              🔌 Hubungkan Wallet
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
        toastClassName="bg-white shadow-md rounded-lg p-4 flex items-center text-gray-800 font-medium border border-gray-200"
        bodyClassName="flex items-center"
        progressClassName="bg-blue-500"
      />
    </div>
  );
}

export default App;
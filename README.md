# 🛍️ Web3 DApp

Aplikasi Web3 (Decentralized Application) simple yang memungkinkan pengguna membeli produk digital (E-Book JavaScript) menggunakan Ethereum di jaringan lokal Hardhat.

## 📁 Struktur Folder

```
project-root/
├── react-dapp/       # Frontend React (dApp)
└── solidity/         # Smart contract + script deploy
```

---

## 🚀 Fitur

- 🔐 Autentikasi via wallet (Metamask)
- 💸 Beli produk menggunakan ETH (0.01 ETH)
- 🔄 Reset status pembelian (oleh pemilik contract)
- 📦 Smart contract sudah lengkap dengan ABI & auto-deploy address

---

## 🧰 Persyaratan

Pastikan sudah meng-install:

- [Node.js](https://nodejs.org/) v16 atau lebih
- [Metamask](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) di browser (Chrome/Brave/Edge)
- Git
- VS Code atau text editor lain

---

## 🔧 Cara Setup dari Awal

### 1. Clone Project

```bash
git clone https://github.com/Fruzh/solidity-local-testnet.git
cd solidity-local-testnet
```

### 2. 📦 Install Dependency
**Untuk smart contract (Hardhat):**
```bash
cd solidity
npm install
```

**Jika belum pernah install Hardhat di proyek ini:**
```bash
npm install --save-dev hardhat
```

**Untuk frontend React:**
```bash
cd ../react-dapp
npm install
```

Ini akan menjalankan jaringan lokal di `http://127.0.0.1:8545` dan menampilkan 20 akun beserta private key-nya.

Contoh akun:

```
Account #0: 0x5Fb... (Private Key: 0xabc...)
```

---

## 🦊 Hubungkan Metamask

1. **Install Extension Metamask** di [metamask.io](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
2. **Import Akun** dari terminal Hardhat:
   - Import akun dengan Private Key:
   **Account → Import Account**
   - Tempelkan salah satu Private Key dari Hardhat

3. **Tambahkan Network Lokal:**

   - Network Name: `Hardhat`
   - New RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

4. Pilih jaringan "Hardhat" di Metamask.

---

## 📦 Deploy Smart Contract

```bash
cd solidity
npx hardhat node
```

Buka terminal baru:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Ini akan:

- Deploy `TokoDigital.sol`
- Generate file `contract-address.json` dan `contract-abi.json`
- Simpan alamat contract ke: `react-dapp/src/contracts/contract-address.json`
- Simpan ABI ke:  `react-dapp/src/contracts/contract-abi.json`

---

### 4. Jalankan Frontend (React dApp)

```bash
cd ../react-dapp
npm install
npm run dev
```

Aplikasi akan tersedia di `http://localhost:5173`

---

## 🛒 Cara Pakai Aplikasi

1. Buka `http://localhost:5173`
2. Klik **"🔌 Hubungkan Wallet"**
3. Klik **"🛒 Beli Sekarang"** untuk membeli produk
4. Jika kamu pemilik contract, tombol **Reset Pembelian** akan muncul

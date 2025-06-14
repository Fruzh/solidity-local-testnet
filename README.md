# 🛍️ TokoDigital dApp

Aplikasi Web3 sederhana yang memungkinkan pengguna membeli produk digital (E-Book JavaScript) menggunakan Ethereum di jaringan lokal Hardhat.

## 📁 Struktur Folder

```
project-root/
├── solidity/         # Smart contract + script deploy
└── react-dapp/       # Frontend React (dApp)
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
- [Metamask](https://metamask.io/) di browser (Chrome/Brave/Edge)
- Git
- VS Code atau text editor lain

---

## 🔧 Cara Setup dari Awal

### 1. Clone Project

```bash
git clone https://github.com/Fruzh/solidity-local-testnet.git
cd solidity-local-testnet
```

### 2. Jalankan Local Blockchain (Hardhat)

```bash
cd solidity
npm install
npx hardhat node
```

Ini akan menjalankan jaringan lokal di `http://127.0.0.1:8545` dan menampilkan 20 akun beserta private key-nya.

Contoh akun:

```
Account #0: 0x5Fb... (Private Key: 0xabc...)
```

**Jangan tutup terminal ini!**

---

### 3. Deploy Smart Contract

Buka terminal baru:

```bash
cd solidity
npx hardhat run scripts/deploy.js --network localhost
```

Ini akan:

- Deploy `TokoDigital.sol`
- Generate file `contract-address.json`
- Simpan alamat contract ke: `react-dapp/src/contracts/contract-address.json`

---

### 4. Jalankan Frontend (React dApp)

```bash
cd ../react-dapp
npm install
npm run dev
```

Aplikasi akan tersedia di `http://localhost:5173`

---

## 🦊 Hubungkan Metamask

1. **Install Metamask** di [metamask.io](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
2. **Import Akun** dari terminal Hardhat:

   - Import Account
   - Tempelkan salah satu Private Key dari Hardhat

3. **Tambahkan Network Lokal:**

   - Network Name: `Hardhat`
   - New RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

4. Pilih jaringan "Hardhat" di Metamask.

---

## 🛒 Cara Pakai Aplikasi

1. Buka `http://localhost:5173`
2. Klik **"🔌 Hubungkan Wallet"**
3. Klik **"🛒 Beli Sekarang"** untuk membeli produk
4. Jika kamu pemilik contract, tombol **Reset Pembelian** akan muncul
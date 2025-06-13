// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TokoDigital {
    string public produk = "E-Book JavaScript";
    uint256 public harga = 0.01 ether;
    address public pemilik;
    mapping(address => bool) public sudahBeli;

    constructor() {
        pemilik = msg.sender;
    }

    function beliProduk() external payable {
        require(msg.value == harga, "Harga tidak sesuai");
        require(!sudahBeli[msg.sender], "Sudah beli");
        sudahBeli[msg.sender] = true;
    }

    function cekStatusBeli(address user) external view returns (bool) {
        return sudahBeli[user];
    }

    function resetPembeli(address user) external {
        require(msg.sender == pemilik, "Hanya pemilik yang bisa reset");
        sudahBeli[user] = false;
    }

    function getPemilik() external view returns (address) {
        return pemilik;
    }
}

// src/ethLocal.js
import { ethers } from "ethers";
import abiFile from "./abi.json";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet   = new ethers.Wallet(
  process.env.REACT_APP_PRIVATE_KEY,   // 64-char hex, **no 0x**
  provider
);

export const account  = wallet.address;
export const contract = new ethers.Contract(
  process.env.REACT_APP_CONTRACT_ADDRESS,
  (abiFile.abi ?? abiFile),            // works whether wrapped or bare
  wallet
);

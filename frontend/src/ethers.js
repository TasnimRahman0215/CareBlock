import { ethers } from 'ethers';
import abi from './abi.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

export async function getContract() {
  // Prompt user to connect MetaMask
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer   = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
}

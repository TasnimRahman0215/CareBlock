// Tell TypeScript about window.ethereum
export {};

declare global {
  interface Window {
    ethereum?: any;
  }
}

// window.d.ts
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

declare global {
  interface Window {
    solana: {
      isConnected: boolean;
      signAndSendTransaction(transaction: Transaction): Promise<{ signature: string }>;
      on(event: string, callback: (args: any) => void): void;
      connect(): Promise<void>;
      disconnect(): Promise<void>;
    };
  }
}

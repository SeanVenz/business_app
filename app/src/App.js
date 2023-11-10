// App.jsx
import React from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import BusinessComponent from './BusinessComponent';

require('@solana/wallet-adapter-react-ui/styles.css');

const App = () => {
  const wallet = useWallet();
  const endpoint = clusterApiUrl('devnet');
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {wallet.connected ? (
            <BusinessComponent />
          ) : (
            <WalletMultiButton />
          )}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;

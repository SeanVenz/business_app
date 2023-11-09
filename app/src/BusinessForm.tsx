import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import idl from './idl.json'; // Ensure this path is correct

// Assuming idl.json is the IDL file for your Anchor program and it has an instruction `createBusiness`

const BusinessForm: React.FC = () => {
  const wallet = useWallet();
  const connection = useConnection().connection;
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');

  // Function to create the provider
  const getProvider = () => {
    if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
      throw new Error('Wallet is not connected');
    }
    const anchorWallet = {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
    };
    return new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: 'processed',
    });
  };

  // Function to create a business
  const createBusiness = async () => {
    const provider = getProvider();
    const programId = new PublicKey(idl.metadata.address);
    const program = new Program(idl, programId, provider);
    const newAccountKeypair = Keypair.generate();

    try {
      await program.rpc.createBusiness(businessName, businessType, businessAddress, {
        accounts: {
          business: newAccountKeypair.publicKey, // This should be a PDA generated for the business account
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [newAccountKeypair],
      });

      console.log('Business created successfully');
    } catch (error) {
      console.error('Error creating business:', error);
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    await createBusiness();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        placeholder="Business Name"
      />
      <input
        type="text"
        value={businessType}
        onChange={(e) => setBusinessType(e.target.value)}
        placeholder="Business Type"
      />
      <input
        type="text"
        value={businessAddress}
        onChange={(e) => setBusinessAddress(e.target.value)}
        placeholder="Business Address"
      />
      <button type="submit" disabled={!wallet.connected}>
        Create Business
      </button>
    </form>
  );
};

export default BusinessForm;

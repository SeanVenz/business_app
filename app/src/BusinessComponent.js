// BusinessComponent.jsx
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, web3, utils } from '@project-serum/anchor';
import idl from './idl.json'; // path to your idl.json file

const { LAMPORTS_PER_SOL } = web3;

// Your program ID and generated IDL file
const programID = new PublicKey(idl.metadata.address);

const BusinessComponent = () => {
  const wallet = useWallet();
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');

  // Function to get a new provider
  const getProvider = () => {
    const rpcHost = "https://api.devnet.solana.com"; // Change this to your cluster
    const connection = new web3.Connection(rpcHost, 'confirmed');
    const provider = new AnchorProvider(connection, wallet, 'confirmed');
    return provider;
  };

  // Function to create a business
  const createBusiness = async () => {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    const businessAccount = web3.Keypair.generate();

    await program.rpc.createBusiness(businessName, businessType, businessAddress, {
      accounts: {
        business: businessAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [businessAccount],
    });

    console.log(`Business created with public key: ${businessAccount.publicKey}`);
  };

  return (
    <div>
      <h1>Add New Business</h1>
      <input
        placeholder="Business Name"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
      />
      <input
        placeholder="Business Type"
        value={businessType}
        onChange={(e) => setBusinessType(e.target.value)}
      />
      <input
        placeholder="Business Address"
        value={businessAddress}
        onChange={(e) => setBusinessAddress(e.target.value)}
      />
      <button onClick={createBusiness}>Create Business</button>
    </div>
  );
};

export default BusinessComponent;

import React, { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, ConfirmedSignatureInfo, ParsedInstruction, ParsedTransaction } from '@solana/web3.js';

const TransactionsList = () => {
  const { connection } = useConnection();
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);
  const programId = new PublicKey('2cE9Naq1VKCKTt2DvYoLfR1U6jS5tBpa8PFckbj8aB3p'); // Replace with actual program ID

  useEffect(() => {
    const fetchTransactions = async () => {
      // Get the signatures of all transactions involving the program ID
      const signatures = await connection.getSignaturesForAddress(programId);

      // Fetch and parse detailed transaction information for each signature
      const detailedTransactions = await Promise.all(
        signatures.map(async (signatureInfo) => {
          const transaction = await connection.getParsedConfirmedTransaction(signatureInfo.signature);
          return transaction;
        })
      );

      setTransactions(detailedTransactions.filter((tx): tx is ParsedTransaction => tx !== null));
    };

    fetchTransactions();
  }, [connection, programId]);

  // Function to render the transaction information
  const renderTransactionInfo = (transaction: ParsedTransaction) => {
    // Loop through all the instructions and find ones that are relevant to your program
    const businessInstructions = transaction.transaction.message.instructions.filter(
      (instr): instr is ParsedInstruction => 
        'parsed' in instr && 
        instr.programId.equals(programId) &&
        instr.parsed.info.name === 'createBusiness' // Adjust if necessary to match your actual instruction name
    );

    // Map the instructions to JSX elements
    return businessInstructions.map((instr, index) => (
      <div key={index}>
        <p>Business Name: {instr.parsed.info.name}</p>
        {/* Render other business information here */}
      </div>
    ));
  };

  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        {transactions.map((tx, index) => (
          <li key={index}>
            {tx.transaction.signatures[0]}
            {renderTransactionInfo(tx)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsList;

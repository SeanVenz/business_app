import React, { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, ParsedTransaction } from '@solana/web3.js';

const TransactionsList: React.FC = () => {
  const { connection } = useConnection();
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);
  const programId = new PublicKey('2cE9Naq1VKCKTt2DvYoLfR1U6jS5tBpa8PFckbj8aB3p');

  useEffect(() => {
    const fetchTransactions = async () => {
      const signatures = await connection.getSignaturesForAddress(programId);
      const detailedTransactions = await Promise.all(
        signatures.map(async (signatureInfo) => {
          return connection.getParsedConfirmedTransaction(signatureInfo.signature);
        })
      );
      setTransactions(detailedTransactions.filter((tx): tx is ParsedTransaction => tx !== null));
    };

    fetchTransactions();
  }, [connection, programId]);

  const renderTransactionInfo = (instruction: any, index: number) => {
    console.log('Parsed Instruction:', instruction); // Add this to check the structure of the parsed instruction

    if (instruction.parsed && instruction.parsed.type === 'createBusiness') {
      const info = instruction.parsed.info;
      return (
        <div key={index}>
          <p>Business Name: {info.name}</p>
          <p>Business Type: {info.businessType}</p>
          <p>Business Address: {info.address}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h2>Transactions</h2>
      {transactions.map((tx, index) => (
        <div key={index}>
          <p>Transaction Signature: {tx.transaction.signatures[0]}</p>
          {tx.transaction.message.instructions
            .filter(instr => instr.programId.equals(programId))
            .map((instr, idx) => renderTransactionInfo(instr, idx))}
        </div>
      ))}
    </div>
  );
};

export default TransactionsList;

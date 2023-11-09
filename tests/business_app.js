const anchor = require('@coral-xyz/anchor');
const assert = require('assert');

describe('business_app', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.BusinessApp;

  it('Creates a business', async () => {
    // Generate a new Keypair for the business account
    const business = anchor.web3.Keypair.generate();

    // The data to send to our create_business function
    const name = 'Test Business';
    const businessType = 'Restaurant';
    const address = '123 Test St, Testville, TS';

    // Call the create_business function
    await program.rpc.createBusiness(name, businessType, address, {
      accounts: {
        business: business.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [business],
    });

    // Fetch the newly created business account
    const businessAccount = await program.account.business.fetch(business.publicKey);

    // Ensure it has the data we sent
    assert.strictEqual(businessAccount.name, name);
    assert.strictEqual(businessAccount.businessType, businessType);
    assert.strictEqual(businessAccount.address, address);
  });

  // Additional tests can be added here...
});
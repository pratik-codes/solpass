import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contract } from "../target/types/contract";
import { expect, assert } from "chai";

describe("contract", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.Contract as Program<Contract>;

  let user: anchor.web3.Keypair;
  let payerAccount: anchor.web3.Keypair;
  let vaultAccount: anchor.web3.Keypair;

  before(async () => {
    // Generate keypairs for user and payer account
    user = anchor.web3.Keypair.generate();
    payerAccount = anchor.web3.Keypair.generate();

    // Airdrop SOL to user and payer account for testing
    const provider = anchor.getProvider();
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user.publicKey, anchor.web3.LAMPORTS_PER_SOL),
      "confirmed"
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(payerAccount.publicKey, anchor.web3.LAMPORTS_PER_SOL),
      "confirmed"
    );
  });

  // creates a wallet successfully
  it("Creates a vault successfully!", async () => {
    vaultAccount = anchor.web3.Keypair.generate(); // Generate a new vault account

    let initAccount = {
      vault: vaultAccount.publicKey,
      user: user.publicKey,
      payerAccount: payerAccount.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }

    // Call the create_vault method
    const tx = await program.methods
      .createVault("my_secret_data", "121212")
      .accounts(initAccount)
      .signers([vaultAccount, user, payerAccount])
      .rpc();

    // Retrieve the vault data to verify
    const vaultData = await program.account.vault.fetch(vaultAccount.publicKey);
    expect(vaultData.owner.toBase58()).to.equal(user.publicKey.toBase58());
    expect(vaultData.encryptedData).to.equal("my_secret_data");
    expect(vaultData.pin).to.equal("121212");
    expect(vaultData.subscribed.toNumber()).to.equal(0);

  });

  // Call the update_vault method
  it("Updates the vault successfully!", async () => {
    const account = {
      vault: vaultAccount.publicKey,
      owner: user.publicKey,
    };


    const tx = await program.methods
      .updateVault("new_secret_data", "5678", new anchor.BN(1))
      .accounts(account)
      .signers([user]) // Only the owner signs the transaction
      .rpc();


    // Retrieve the vault data to verify the update
    const vaultData = await program.account.vault.fetch(vaultAccount.publicKey);
    expect(vaultData.encryptedData).to.equal("new_secret_data");
    expect(vaultData.pin).to.equal("5678");
    expect(vaultData.subscribed.toNumber()).to.equal(1);

  });


  it("Fails to update the vault as unauthorized user!", async () => {
    const unauthorizedUser = anchor.web3.Keypair.generate();
    const account = {
      vault: vaultAccount.publicKey,
      owner: unauthorizedUser.publicKey,
    };

    try {
      // Attempt to update the vault as an unauthorized user
      await program.methods
        .updateVault("hacked_data", "0000", new anchor.BN(200))
        .accounts(account)
        .signers([unauthorizedUser]) // Unauthorized user signs the transaction
        .rpc();

      // If the transaction does not throw an error, the test should fail
      assert.fail("Expected error but none was thrown");
    } catch (error) {
      // Ensure the error message matches what we expect
      expect(error.message).to.include("Error Code: ConstraintHasOne");
    }
  });

  it("Retrieves the vault data successfully!", async () => {
    const account = {
      vault: vaultAccount.publicKey,
      owner: user.publicKey, // This might be required to sign
    }


    // Make sure the transaction includes the necessary signers (user)
    const tx = await program.methods.getVault()
      .accounts(account)
      .signers([user]) // Add the user as a signer
      .rpc();


    // Fetch and verify the vault data
    const data = await program.account.vault.fetch(vaultAccount.publicKey);

    expect(data.encryptedData).to.equal("new_secret_data");
  });

  it("Fails to retrieve the vault data as unauthorized user!", async () => {
    const unauthorizedUser = anchor.web3.Keypair.generate();
    const account = {
      vault: vaultAccount.publicKey,
      owner: unauthorizedUser.publicKey,
    };

    let errorThrown = false;

    try {
      // Attempt to retrieve the vault as an unauthorized user
      await program.methods
        .getVault()
        .accounts(account)
        .signers([unauthorizedUser])
        .rpc();

      // If no error was thrown, we set the flag to false
      errorThrown = false;
    } catch (error) {
      // Ensure the error message matches what we expect
      expect(error.message).to.include("Error Code: ConstraintHasOne");
      errorThrown = true;
    }

    // If no error was thrown, the test should fail
    assert.isTrue(errorThrown, "Expected error but none was thrown");
  });

});

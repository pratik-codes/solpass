use anchor_lang::prelude::*;

declare_id!("5a8GDe4RnezBGUYzXHgzAhDLbZB4gAeWppwzzWTJw1rW");

#[program]
pub mod contract {
    use super::*;

    // Function to create a new vault (Solana account) for storing encrypted data
    pub fn create_vault(
        ctx: Context<CreateVault>,
        encrypted_data: String,
        pin: String,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.owner = *ctx.accounts.user.key; // Store the owner's public key
        vault.encrypted_data = encrypted_data; // Store the encrypted password data
        vault.pin = pin; // Store the PIN for the vault in encrypted form
        vault.subscribed = 0; // Initialize the payment amount to zero
        Ok(())
    }

    // Function to update the existing vault with new encrypted data
    pub fn update_vault(
        ctx: Context<UpdateVault>,
        encrypted_data: String,
        pin: String,
        subscribed: u64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;

        // Check that the vault belongs to the correct user
        if vault.owner != *ctx.accounts.owner.key {
            return Err(ErrorCode::Unauthorized.into());
        }

        vault.encrypted_data = encrypted_data; // Update the stored encrypted data
        vault.pin = pin; // Update the encrypted PIN
        vault.subscribed = subscribed; // Update the payment amount
        Ok(())
    }

    // Function to retrieve the encrypted data from the vault
    pub fn get_vault(ctx: Context<GetVault>) -> Result<String> {
        let vault = &ctx.accounts.vault;
        Ok(vault.encrypted_data.clone()) // Return the encrypted data
    }
}

// Define the structure of the vault
#[account]
pub struct Vault {
    pub owner: Pubkey,          // Public key of the owner (user)
    pub encrypted_data: String, // Encrypted password data
    pub pin: String,            // Encrypted pin for the vault
    pub subscribed: u64,        // Payment amount for the vault
}

#[derive(Accounts)]
pub struct CreateVault<'info> {
    // Allocate space for the vault account
    #[account(init, payer = payer_account, space = 8 + 32 + 4 + 64 + 4 + 32)]
    pub vault: Account<'info, Vault>, // Create the vault account
    #[account(mut)]
    pub user: Signer<'info>, // User creating the vault
    #[account(mut)] // The app account that will pay for the transaction
    pub payer_account: Signer<'info>, // The payer (controlled by Solpass app)
    pub system_program: Program<'info, System>, // System program for account creation
}

// Context for updating a vault
#[derive(Accounts)]
pub struct UpdateVault<'info> {
    #[account(mut, has_one = owner)]
    // Ensure the vault belongs to the user (checks owner field and if some else try to update the vault, it will throw an error)
    pub vault: Account<'info, Vault>, // Vault account to update
    pub owner: Signer<'info>, // User (owner of the vault)
}

// Context for retrieving the vault
#[derive(Accounts)]
pub struct GetVault<'info> {
    #[account(mut, has_one = owner)]
    pub vault: Account<'info, Vault>, // Vault account to read from
    pub owner: Signer<'info>,         // Owner of the vault
}

// Error codes for unauthorized access
#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
}

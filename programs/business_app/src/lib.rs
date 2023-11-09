use anchor_lang::prelude::*;

declare_id!("2cE9Naq1VKCKTt2DvYoLfR1U6jS5tBpa8PFckbj8aB3p");

#[program]
pub mod business_app {
    use super::*;
    pub fn create_business(ctx: Context<CreateBusiness>, name: String, business_type: String, address: String) -> Result<()> {
        let business = &mut ctx.accounts.business;
        business.name = name;
        business.business_type = business_type;
        business.address = address;
        Ok(())
    }

    pub fn get_business(ctx: Context<GetBusiness>) -> Result<()> {
        let business = &ctx.accounts.business;
        msg!("Name: {}", business.name);
        msg!("Type: {}", business.business_type);
        msg!("Address: {}", business.address);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateBusiness<'info> {
    #[account(init, payer = user, space = 8 + 80)] // adjust space according to your data needs
    pub business: Account<'info, Business>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetBusiness<'info> {
    pub business: Account<'info, Business>,
}

#[account]
pub struct Business {
    pub name: String,
    pub business_type: String,
    pub address: String,
}

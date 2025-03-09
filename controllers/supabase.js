const supabase = require("../supabase");

const Database = {
  fetchDeposit: async (reference) => {
    try {
      const { data, error } = await supabase
        .from("deposits")
        .select()
        .eq("reference", reference);

      return { data, error };
    } catch (error) {
      return { data: null, error: error };
    }
  },

  updateDeposits: async (reference) => {
    try {
      const { data, error } = await supabase
        .from("deposits")
        .insert([{ reference }])
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error: error };
    }
  },

  fetchUser: async (email) => {
    try {
      const { data } = await supabase.from("users").select().eq("email", email);

      return data;
    } catch (error) {
      return { data: null, error: error };
    }
  },

  recharge: async (email, amount) => {
    try {
      const userData = await Database.fetchUser(email);

      const { balance } = userData[0];

      const newBalance = parseInt(balance) + parseInt(amount);

      const { data, error } = await supabase
        .from("users")
        .update({ balance: newBalance })
        .eq("email", email)
        .select();

      return { data, error };
    } catch (error) {
      return { data: null, error: error };
    }
  },

  deduct: async (email, amount) => {
    try {
      const userData = await Database.fetchUser(email);

      const { balance } = userData[0];

      const newBalance = parseInt(balance) - parseInt(amount);

      const { data, error } = await supabase
        .from("users")
        .update({ balance: newBalance })
        .eq("email", email)
        .select();

      return { data, error };
    } catch (error) {
      return { data: null, error: error };
    }
  },
  setTransaction: async (transaction) => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            email: transaction.email,
            amount: transaction.amount,
            purpose: transaction.purpose,
            status: transaction.status,
            transaction_id: transaction.transactionId,
            phone: transaction.phone,
            network: transaction.network,
            plan_size: transaction.planSize,
            previous_balance: transaction.previousBalance,
            new_balance: transaction.newBalance,
          },
        ])
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error: error };
    }
  },

  redeemBonus: async (data) => {
    const email = data.email;
    const referralBonus = parseInt(data.referral_bonus);
    try {
      Database.recharge(email, referralBonus);

      const { data, error } = await supabase
        .from("users")
        .update({ referral_bonus: 0 })
        .eq("email", email)
        .select();

      return { data, error };
    } catch (error) {
      return { data: null, error: error };
    }
  },

  postUserAccounts: async (accountInfo) => {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .insert([accountInfo])
        .select();
    } catch (error) {
      console.log(error);
    }
    console.log({ data: data, error: error });
  },
};

module.exports = Database;

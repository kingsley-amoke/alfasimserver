const supabase = require("./supabase");

const fetchDeposit = async (reference) => {
  try {
    const { data, error } = await supabase
      .from("deposits")
      .select()
      .eq("reference", reference);

    return { data, error };
  } catch (error) {
    console.log(error);
  }
};

const updateDeposits = async (reference) => {
  try {
    const { data, error } = await supabase
      .from("deposits")
      .insert([{ reference }])
      .select();
    return { data, error };
  } catch (error) {
    console.log(error);
  }
};

const fetchUser = async (email) => {
  try {
    const { data } = await supabase.from("users").select().eq("email", email);

    return data;
  } catch (error) {
    console.log(error);
  }
};

const recharge = async (email, amount) => {
  try {
    const userData = await fetchUser(email);

    const { balance } = userData[0];

    const newBalance = parseInt(balance) + parseInt(amount);

    const { data, error } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("email", email)
      .select();

    return { data, error };
  } catch (error) {
    console.log(error);
  }
};

const deduct = async (email, amount) => {
  try {
    const userData = await fetchUser(email);

    const { balance } = userData[0];

    const newBalance = parseInt(balance) - parseInt(amount);

    const { data, error } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("email", email)
      .select();

    return { data, error };
  } catch (error) {
    console.log(error);
  }
};

const setTransaction = async (transaction) => {
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
    console.log(error);
  }
};

module.exports = {
  fetchUser,
  updateDeposits,
  fetchDeposit,
  recharge,
  deduct,
  setTransaction,
};

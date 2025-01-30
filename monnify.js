const { fetchDeposit, updateDeposits, recharge } = require("./helpers");

const creditUser = async (data) => {
  const ref = data.eventData.transactionReference;
  const amount = data.eventData.amountPaid;
  const email = data.eventData.customer.email;
  const res = await fetchDeposit(ref);
  if (res.data.length > 0) {
    console.log(res);
    return;
  } else {
    const { error } = await updateDeposits(ref);
    if (!error) {
      recharge(email, amount);
    }
  }
};

module.exports = {
  creditUser,
};

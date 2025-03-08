const axios = require("axios");

const { Database } = require("./supabase");

const monnifySecretKey = process.env.MONNIFY_SECRETKEY;
const monnifyUrl = process.env.MONNIFY_BASEURL;

const monnifyApiKey = process.env.MONNIFY_APIKEY;

const monnifyEncodedKey = btoa(monnifyApiKey + ":" + monnifySecretKey);

const bvn = process.env.BVN;

const contractCode = process.env.MONNIFY_CONTRACT_CODE;

async function getToken() {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Basic ${monnifyEncodedKey}`,
    },
  };

  const response = await axios.post(`${monnifyUrl}/api/v1/auth/login`, options);

  const token = response.data.responseBody?.accessToken;

  return token;
}

const MonnifyController = {
  creditUser: async (data) => {
    const ref = data.eventData.transactionReference;
    const amount = data.eventData.amountPaid;
    const email = data.eventData.customer.email;
    const res = await Database.fetchDeposit(ref);
    if (res.data.length > 0) {
      console.log(res);
      return;
    } else {
      const { error } = await Database.updateDeposits(ref);
      if (!error) {
        Database.recharge(email, amount);
      }
    }
  },

  getCustomerAccount: async (config) => {
    let response = {};
    const token = await getToken();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const data = {
      accountReference: config.username,
      accountName: "Alfasimdata Reserved Account",
      currencyCode: "NGN",
      contractCode: contractCode,
      customerEmail: config.email,
      bvn: bvn,
      customerName: config.name,
      getAllAvailableBanks: true,
    };

    const body = JSON.stringify(data);

    if (!token) {
      response = {
        status: 401,
        message: "Authorization denied",
      };
      return response;
    }

    try {
      const result = await axios.post(
        `${monnifyUrl}/api/v2/bank-transfer/reserved-accounts`,
        body,
        options
      );
      if (result.data.requestSuccessful) {
        const data = res.data;
        console.log("data" + data);
        const userAccount = {
          account_name: data.accountName,
          account_reference: data.accountReference,
          accounts: data.accounts,
          bvn: "",
          currency: data.currencyCode,
          customer_email: data.customerEmail,
          customer_name: data.customerName,
        };
        Database.postUserAccounts(userAccount);
        response = {
          data: data,
          error: null,
          status: 201,
          message: "Account created successfully",
        };
      }
    } catch (e) {
      console.log("error" + e);
      response = {
        data: null,
        error: "",
        status: 400,
        message: "An error occured",
      };
    }

    return response;
  },
};

module.exports = MonnifyController;

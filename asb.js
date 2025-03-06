const axios = require("axios");
const { fetchUser, deduct, setTransaction } = require("./helpers");
require("dotenv").config();

const baseUrl = process.env.BASE_URL;
const apiKey = process.env.API_KEY;
const getASBHeaders = () => ({
  Authorization: `Token ${apiKey}`,
  "Content-Type": "application/json",
});

const buyData = async (data) => {
  const email = data.email;
  const price = data.price;

  const userData = await fetchUser(email);
  if (!userData)
    return { data: null, error: "", message: "No user found", status: 404 };

  const { balance } = userData[0];

  let response = {};
  const transaction = {
    email: email,
    amount: price,
    purpose: "data",
    status: "",
    transactionId: "",
    phone: data.mobile_number,
    network: "",
    planSize: "",
    previousBalance: balance,
    newBalance: "",
  };

  if (parseInt(balance) > price) {
    const body = {
      network: data.network,
      mobile_number: data.mobile_number,
      plan: data.plan,
      Ported_number: true,
    };

    const options = {
      method: "POST",
      headers: getASBHeaders(),
    };
    await axios
      .post(`${baseUrl}/data/`, JSON.stringify(body), options)
      .then((data) => {
        response = {
          status: 200,
          data: data.data,
          error: null,
          message: "Successful",
        };
        deduct(email, price);

        transaction.status = response.data.Status;
        transaction.transactionId = response.data.ident;
        transaction.network = response.data.plan_network;
        transaction.planSize = response.data.plan_name;
        transaction.newBalance = (parseInt(balance) - price).toString();
        setTransaction(transaction);
      })
      .catch((e) => {
        response = {
          status: 400,
          data: null,
          error: "",
          message: "Server error",
        };

        transaction.status = "failed";
        transaction.newBalance = balance;
        setTransaction(transaction);
      });
  } else {
    response = {
      status: 403,
      data: null,
      error: null,
      message: "Insufficient funds",
    };
  }

  return response;
};

const buyAirtime = async (data) => {
  let response = {};

  const email = data.email;
  const price = data.price;

  const userData = await fetchUser(email);

  if (!userData)
    return { data: null, error: "", message: "No user found", status: 404 };

  const { balance } = userData[0];

  if (parseInt(balance) > price) {
    const body = {
      network: data.network,
      mobile_number: data.mobile_number,
      amount: data.amount,
      airtime_type: "VTU",
      Ported_number: true,
    };

    const options = {
      method: "POST",
      headers: getASBHeaders(),
    };
    await axios
      .post(`${baseUrl}/topup/`, JSON.stringify(body), options)
      .then((data) => {
        response = {
          status: 200,
          data: data.data,
          error: null,
          message: "Successful",
        };
        deduct(email, price);
      })
      .catch((e) => {
        response = {
          status: e.status,
          data: null,
          error: e.response.data,
          message: "Server error",
        };
      });
  } else {
    response = {
      status: 403,
      data: null,
      error: null,
      message: "Insufficient funds",
    };
  }

  return response;
};

module.exports = {
  buyData,
  buyAirtime,
};

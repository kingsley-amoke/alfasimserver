const axios = require("axios");
const { fetchUser, deduct } = require("./helpers");
require("dotenv").config();

const baseUrl = process.env.BASE_URL;
const apiKey = process.env.API_KEY;
const getASBHeaders = () => ({
  Authorization: `Token ${apiKey}`,
  "Content-Type": "application/json",
});

const buyData = async (data) => {
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
      })
      .catch((e) => {
        response = {
          status: 400,
          data: null,
          error: e.response.data,
          message: "Server error",
        };
      })
      .finally(() => {
        return response;
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
  console.log(userData);

  // const { balance } = userData[0];

  const balance = "10";

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
      })
      .finally(() => {
        return response;
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

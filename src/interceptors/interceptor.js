const onError = async function (error) {
  console.error("Response Error Interceptor:", error);
  return error;
};

const onResponse = function (response) {
  console.log("Response Interceptor:", response.data);
  return response;
};

export default {
  onResponse,
  onError,
};

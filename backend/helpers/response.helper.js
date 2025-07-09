const createResponse = (data, message) => {
  return {
    success: true,
    message,
    data,
  };
};

module.exports = {
  createResponse
};
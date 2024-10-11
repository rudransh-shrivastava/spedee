import axios from "axios";

async function createProduct(product: FormData) {
  const response = await axios.post("/api/v1/vendor/product/create", product);
  return response.data;
}

const mutations = {
  createProduct: {
    mutationFn: createProduct,
  },
};

export { mutations };

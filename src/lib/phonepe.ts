import PhonepeGateway from "phonepepg";

export const paymentGateway = new PhonepeGateway({
  merchantId: "PGTESTPAYUAT",
  saltKey: "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399",
  isDev: true, // Set to false for production
});

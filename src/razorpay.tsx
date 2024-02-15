import { Razorpay } from "razorpay-checkout";

const handlePayment = async (amount: number) => {
  const options = {
    key: "rzp_test_IsJsix4K1puY6N",
    amount: amount * 100, // Amount in paise
    currency: "INR",
    name: "DonateHub",
    description: "Make Payment And Help Other",
    image: "donatehublogo.png",
    handler: function (response: any) {
      // Handle success
      console.log(response);
    },
    prefill: {
      name: "Donor Name",
      email: "donor@example.com",
      contact: "1234567890",
    },
    theme: {
      color: "#674CC4",
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
};

export default handlePayment;

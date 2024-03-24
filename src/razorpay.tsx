import { Razorpay } from "razorpay-checkout";

const handlePayment = async (amount: number) => {
  const options: {
    key: string;
    amount: number;
    currency: string;
    name?: string;
    description?: string;
    image?: string;
    order_id?: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: {
      [key: string]: string;
    };
    theme?: {
      color?: string;
    };
    handler?: (response: any) => void;
    modal?: {
      ondismiss?: () => void;
    };
    readonly?: boolean;
  } = {
    key: "rzp_test_IsJsix4K1puY6N",
    amount: amount * 100,
    currency: "INR",

    name: "DonateHub",
    description: "Make Payment And Help Other",
    image: "donatehublogo.png",
    handler: function (response: any) {
      // Handle success
    },
    prefill: {
      name: "Donor Name",
      email: "donor@example.com",
      contact: "1234567890",
    },
    theme: {
      color: "#674CC4",
    },
    order_id: "pay_123",
  };

  const rzp = new Razorpay(options as any);
  rzp.open();
};

export default handlePayment;

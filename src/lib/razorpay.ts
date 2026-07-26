declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export const loadRazorpayScript = () =>
  new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Razorpay is unavailable on the server"));
      return;
    }

    if (window.Razorpay) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        resolve();
        return;
      }

      existingScript.addEventListener(
        "load",
        () => {
          existingScript.dataset.loaded = "true";
          resolve();
        },
        { once: true }
      );
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Unable to load Razorpay script")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("Unable to load Razorpay script"));
    document.body.appendChild(script);
  });

export const openRazorpayCheckout = async (options: Record<string, any>) => {
  await loadRazorpayScript();

  if (typeof window === "undefined" || !window.Razorpay) {
    throw new Error("Razorpay is not available right now");
  }

  const rzp = new window.Razorpay(options);
  rzp.open();
  return rzp;
};

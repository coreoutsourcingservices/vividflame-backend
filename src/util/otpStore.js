const otpStore = new Map()

export const saveOTP = (email, otp) => {

   const finalData = {
        ...otp,
        attempts: 0,
        expires: Date.now() + 10 * 60 * 1000
    };

    otpStore.set(email, finalData);

    return finalData;
}

export const getOTPData = (email) => {

  return otpStore.get(email);
};

export const increaseAttempt = (email) => {

    const data = otpStore.get(email);

    if (!data) return null;

    data.attempts = data.attempts + 1;

    otpStore.set(email, data);

    return data.attempts;
};

export const deleteOTP = (email) => {
  return otpStore.delete(email);
};


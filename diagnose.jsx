import API from "../api";

export const sendDiagnosis = async (symptoms, lat, lon) => {
  const payload = { symptoms, lat, lon };

  try {
    const response = await API.post("/diagnose", payload);
    return response.data;
  } catch (err) {
    console.error("Diagnosis API error:", err.response?.data || err.message);
    throw err.response?.data || { msg: "Something went wrong" };
  }
};

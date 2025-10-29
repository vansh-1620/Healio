// frontend/src/api/diagnose.js
import API from "./index";

export async function sendDiagnosis(symptoms, lat, lon) {
  // sanity: ensure symptoms is object
  const res = await API.post("/diagnose", { symptoms, lat, lon });
  return res.data;
}

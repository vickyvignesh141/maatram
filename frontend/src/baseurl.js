let BASE_URL = "http://localhost:5000/api"; // default local

const host = window.location.hostname;

if (host.includes("devtunnels.ms")) {
  // Frontend running on Dev Tunnel
  BASE_URL = "https://qv1xd7v0-5000.inc1.devtunnels.ms/";
} 
else if (host === "localhost" || host === "127.0.0.1") {
  // Frontend running locally
  BASE_URL = "http://localhost:5000/api";
} 
else {
  // Accessing from another device in same network (mobile / another PC)
  BASE_URL = "http://10.93.97.32:5000/api";
}

export default BASE_URL;

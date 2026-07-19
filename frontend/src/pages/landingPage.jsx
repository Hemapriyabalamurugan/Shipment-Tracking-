
import { useNavigate } from "react-router-dom";
import landingImage from "../assets/landingpage.png";
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Image from Public Folder */}
      <img
        src={landingImage}
        alt="ShipTrackPro"
        className="max-w-4xl w-full mb-8"
      />

      {/* Signup Button */}
      <button
        onClick={() => navigate("/register")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition"
      >
        Sign Up to Continue
      </button>
    </div>
  );
}

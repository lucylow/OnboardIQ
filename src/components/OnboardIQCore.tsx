import React, { useState, useEffect } from "react";
import onboardIQService from "../services/onboardiqService";

// OnboardIQ Frontend Core Flow

const OnboardIQ = () => {
  // Application states for input and progression
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [sessionId, setSessionId] = useState(null); // For video API session
  const [token, setToken] = useState(null); // For video API token
  const [pdfUrl, setPdfUrl] = useState(null); // Generated PDF document url
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle sending Vonage Verify request (Step 1)
  const sendVerificationRequest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await onboardIQService.sendVerification(phoneNumber);
      if (response.status === "verification_sent" && response.requestId) {
        setRequestId(response.requestId);
        setVerificationSent(true);
      } else {
        throw new Error("Failed to send verification SMS");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Handle submitting verification code (Step 2)
  const submitVerificationCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await onboardIQService.verifyCode(requestId, verificationCode);
      if (response.status === "verified") {
        setIsVerified(true);
        // Trigger the onboarding process: get video session and generated PDF URL
        await fetchOnboardingResources();
      } else {
        throw new Error("Verification code incorrect");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fetch video sessionId, token, and generated PDF URL from backend
  const fetchOnboardingResources = async () => {
    try {
      const response = await onboardIQService.fetchOnboardingResources();
      if (response.sessionId && response.token && response.pdfUrl) {
        setSessionId(response.sessionId);
        setToken(response.token);
        setPdfUrl(response.pdfUrl);
      } else {
        throw new Error("Failed to fetch onboarding resources");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Render initial phone number entry form
  const renderPhoneInput = () => (
    <div className="phone-input-container">
      <h2>Step 1: Enter Your Phone Number</h2>
      <input
        type="tel"
        placeholder="+1 123 456 7890"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        disabled={loading || verificationSent}
        pattern="^\+\d{1,3}\s\d{3}\s\d{3}\s\d{4}$"
        title="Enter phone in E.164 format like +1 123 456 7890"
      />
      <button
        onClick={sendVerificationRequest}
        disabled={!phoneNumber || loading || verificationSent}
      >
        {loading ? "Sending..." : "Send Verification Code"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );

  // Render verification code entry form
  const renderCodeVerification = () => (
    <div className="code-verification-container">
      <h2>Step 2: Enter Verification Code</h2>
      <input
        type="text"
        placeholder="Enter SMS code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        maxLength={6}
        disabled={loading || isVerified}
      />
      <button
        onClick={submitVerificationCode}
        disabled={verificationCode.length !== 6 || loading || isVerified}
      >
        {loading ? "Verifying..." : "Verify Code"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );

  // Render personalized onboarding video tour
  // Assuming a Vonage Video session is embedded via iframe or custom integration
  const renderVideoTour = () => {
    if (!sessionId || !token) return <p>Loading video tour...</p>;

    return (
      <div className="video-tour-container">
        <h2>Step 3: Personalized Video Onboarding Tour</h2>
        {/* Typically Vonage Video embedded using their JS SDK - this is a placeholder */}
        <VonageVideoSession sessionId={sessionId} token={token} />
      </div>
    );
  };

  // Component simulating Vonage Video Session embed (You need actual SDK implementation)
  const VonageVideoSession = ({ sessionId, token }) => {
    // Implementation would initialize OpenTok session with API key
    // For hackathon demo, can show a dummy video or pre-recorded welcome video
    return (
      <div className="vonage-video-frame" style={{ border: "1px solid black", height: "500px" }}>
        <iframe
          src="/welcome-tour.html"
          title="Welcome Video Session"
          style={{ width: "100%", height: "100%", border: "none" }}
          allowFullScreen
        />
      </div>
    );
  };

  // Render Foxit PDF Embed viewer for the personalized welcome document
  const renderPdfViewer = () => {
    if (!pdfUrl) return <p>Loading welcome document...</p>;

    return (
      <div className="pdf-viewer-container">
        <h2>Step 4: Your Personalized Welcome Document</h2>
        <FoxitPdfEmbed pdfUrl={pdfUrl} />
      </div>
    );
  };

  // Basic Foxit PDF Embed using iframe (replace with full JS SDK if needed)
  const FoxitPdfEmbed = ({ pdfUrl }) => (
    <iframe
      src={pdfUrl}
      title="Welcome Document"
      style={{ width: "100%", height: "600px", border: "none" }}
      allowFullScreen
    ></iframe>
  );

  // Main render logic according to state
  return (
    <div className="onboardiq-container" style={{ maxWidth: 800, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1>OnboardIQ: Secure & Personalized Onboarding</h1>
      {!verificationSent && renderPhoneInput()}
      {verificationSent && !isVerified && renderCodeVerification()}
      {isVerified && (
        <>
          {renderVideoTour()}
          {renderPdfViewer()}
        </>
      )}
      <style>{`
        .error {
          color: red;
          margin-top: 8px;
        }
        input[type="tel"], input[type="text"] {
          font-size: 1rem;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
          margin-top: 8px;
          margin-bottom: 8px;
        }
        button {
          font-size: 1rem;
          padding: 10px 20px;
          cursor: pointer;
        }
        button:disabled {
          cursor: not-allowed;
          background: #ccc;
        }
      `}</style>
    </div>
  );
};

export default OnboardIQ;

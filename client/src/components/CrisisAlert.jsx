/**
 * CrisisAlert - displays crisis resources when crisis keywords detected
 */
export function CrisisAlert() {
  return (
    <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 mb-4">
      <h3 className="text-red-800 font-bold text-lg mb-2">We're here for you 💙</h3>
      <p className="text-red-700 text-sm mb-3">
        If you're having thoughts of self-harm, please reach out to one of these resources:
      </p>
      <div className="space-y-2">
        <div className="bg-white p-2 rounded">
          <p className="text-red-800 font-semibold text-sm">iCall</p>
          <p className="text-red-600 text-sm">📞 9152987821 (Mon–Sat, 8am–10pm)</p>
        </div>
        <div className="bg-white p-2 rounded">
          <p className="text-red-800 font-semibold text-sm">AASRA 24/7</p>
          <p className="text-red-600 text-sm">📞 9820466627</p>
        </div>
        <div className="bg-white p-2 rounded">
          <p className="text-red-800 font-semibold text-sm">Vandrevala Foundation</p>
          <p className="text-red-600 text-sm">📞 1860-2662-345 (24/7)</p>
        </div>
      </div>
      <p className="text-red-700 text-xs mt-3">
        Our AI friend is here to listen, but please reach out to trained professionals who can help.
      </p>
    </div>
  );
}

export default CrisisAlert;

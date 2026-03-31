import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * Onboarding page - first-time user welcome screen
 */
export function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md text-center space-y-6">
        {/* Welcome */}
        <div>
          <div className="text-6xl mb-4">💙</div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome!</h1>
          <p className="text-gray-600 mt-2">
            {user.isAnonymous
              ? "You're in guest mode. Your chats won't be saved."
              : `Nice to meet you, ${user.email}!`}
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 text-left">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <h3 className="font-bold text-gray-900">Chat with Yaar</h3>
              <p className="text-sm text-gray-600">
                Talk about anything. I'm here to listen without judgment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">😊</span>
            <div>
              <h3 className="font-bold text-gray-900">Track Your Mood</h3>
              <p className="text-sm text-gray-600">
                Check in with yourself throughout the day. See patterns over time.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <h3 className="font-bold text-gray-900">Get Support</h3>
              <p className="text-sm text-gray-600">
                Crisis resources available 24/7 if you need additional help.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-bold text-gray-900">Personal Connection</h3>
              <p className="text-sm text-gray-600">
                I learn your communication style and adapt to be a better friend.
              </p>
            </div>
          </div>
        </div>

        {/* Ground rules */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <h4 className="font-bold text-gray-900 mb-2">A few things to know:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ I'm a friend, not a doctor or therapist</li>
            <li>✓ In crisis? I have resources to help</li>
            <li>✓ Your privacy matters</li>
            <li>✓ Be yourself—no judgment here</li>
          </ul>
        </div>

        {/* Call to action */}
        <button
          onClick={() => navigate("/chat")}
          className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition text-lg"
        >
          Let's Chat 💙
        </button>
      </div>
    </div>
  );
}

export default Onboarding;

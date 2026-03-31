import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useChat from "../hooks/useChat";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import MoodCheckIn from "../components/MoodCheckIn";

/**
 * Chat page - main conversation interface
 */
export function Chat() {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const {
    messages,
    loading: chatLoading,
    error: chatError,
    crisisDetected,
    messagesEndRef,
    sendMessage,
    loadHistory,
    clearMessages,
  } = useChat();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  // Load chat history on mount
  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, loadHistory]);

  const handleLogout = () => {
    logout();
    clearMessages();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-5xl mb-4">💙</div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💙</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Yaar</h1>
              <p className="text-xs text-gray-500">Your supportive friend</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && !user.isAnonymous && (
              <div className="text-right text-sm">
                <p className="text-gray-600">Logged in as</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            )}

            {user?.isAnonymous && (
              <div className="text-right text-sm">
                <p className="text-gray-600">Guest session</p>
              </div>
            )}

            <MoodCheckIn />

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 flex flex-col overflow-hidden max-w-4xl w-full mx-auto bg-white rounded-lg m-4 shadow">
        {/* Chat window */}
        <ChatWindow
          messages={messages}
          loading={chatLoading}
          crisisDetected={crisisDetected}
          messagesEndRef={messagesEndRef}
        />

        {/* Error message */}
        {chatError && (
          <div className="bg-red-100 border-t border-red-400 text-red-700 px-4 py-2">
            <p className="text-sm">{chatError}</p>
          </div>
        )}

        {/* Message input */}
        <MessageInput onSend={sendMessage} disabled={chatLoading} />
      </main>

      {/* Footer hint */}
      <footer className="text-center py-2 text-xs text-gray-500">
        <p>💙 Remember: Yaar is a friend, not a therapist. For serious concerns, please reach out to a professional.</p>
      </footer>
    </div>
  );
}

export default Chat;

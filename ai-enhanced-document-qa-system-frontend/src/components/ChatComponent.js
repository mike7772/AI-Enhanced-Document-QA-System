import { useEffect } from "react";

const ChatComponent = ({conversation}) => {
  
  useEffect(() => {
    console.log('Conversation prop updated:', conversation);
  }, [conversation]);

  return (
    <div className="flex flex-col w-full h-full border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="flex-1 px-40 py-4 overflow-y-auto bg-gray-50">
        {conversation.length > 0 && conversation.map((msg, index) => (
          <>
          <div
            key={index}
            className={` flex justify-end mt-5 py-3 px-5 max-w-[50%] rounded-lg ${
              msg.isUser
                ? "bg-[#d0eaff] ml-auto text-right"
                : "bg-[#f1f1f1] text-left"
            }`}
          >
            <div
              className={`py-3 px-5 rounded-lg ${
                msg.isUser
                  ? "bg-[#d0eaff] text-right"
                  : "bg-[#f1f1f1] text-left"
              }`}
            >
              {msg.text}
            </div>
            {msg.isUser && (
              <div className="w-10 h-10 px-2 flex items-center pb-1 text-black bg-blue-300 text-white rounded-full mr-3">
                you
              </div>
            )}
          </div>
            {!msg.isUser && msg.score && (<div className={`flex justify-end py-1 px-2 max-w-[50%] font-bold text-md ${msg.score < 0.4 ? "text-[#f22416]" : msg.score >= 0.4 && msg.score < 0.6 ? "text-[#f29e16]" : "text-[#04d450]"} `}>{msg.score*100}%</div>)}
            </>

        ))}
      </div>
    </div>
  );
};

export default ChatComponent;

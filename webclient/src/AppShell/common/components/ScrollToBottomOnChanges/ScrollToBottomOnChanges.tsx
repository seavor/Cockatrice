import React, { useEffect, useRef } from 'react';

const ScrollToBottomOnChanges = ({ content, changes }) => {
  const messagesEndRef = useRef(null);

  // @TODO (2)
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [changes]);

  return (
    <div>
      {content}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ScrollToBottomOnChanges;
"use client";

import React, { useState, useEffect, useRef } from 'react';

const Typewriter = ({ text, onComplete, speed = 10, messageId = null, completedMessages = {} }) => {
  const [displayText, setDisplayText] = useState('');
  const typingIntervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  // Update the ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // If this message was already completed, show it immediately
    if (messageId && completedMessages[messageId]) {
      setDisplayText(text);
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }

    let currentIndex = 0;
    setDisplayText('');

    const typeNextCharacter = () => {
      currentIndex++;
      const newText = text.slice(0, currentIndex);
      setDisplayText(newText);

      if (currentIndex >= text.length) {
        clearInterval(typingIntervalRef.current);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    };

    // Speed up the typing by reducing the interval to 10ms
    typingIntervalRef.current = setInterval(typeNextCharacter, speed);

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [text, speed, messageId]);

  // Preserve formatting by rendering as HTML with proper line breaks
  const formattedText = displayText
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
    .replace(/```([\s\S]*?)```/g, '<pre style="background: #f5f5f5; padding: 12px; border-radius: 6px; margin: 8px 0; overflow-x: auto;"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px;">$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

export default Typewriter;

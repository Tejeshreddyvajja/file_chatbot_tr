import React, { useEffect, useRef, useState } from 'react';
import './FluidText.css';

const FluidText = () => {
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (!textRef.current || !containerRef.current) return;
      
      const text = textRef.current;
      const textRect = text.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Check if mouse is over the text
      if (
        e.clientX >= textRect.left &&
        e.clientX <= textRect.right &&
        e.clientY >= textRect.top &&
        e.clientY <= textRect.bottom
      ) {
        setIsDragging(true);
        
        // Calculate offset from text center
        const textCenterX = textRect.left + textRect.width / 2;
        const textCenterY = textRect.top + textRect.height / 2;
        
        setDragOffset({
          x: e.clientX - textCenterX,
          y: e.clientY - textCenterY
        });
        
        // Add dragging class for visual feedback
        text.classList.add('dragging');
        
        e.preventDefault();
      }
    };

    const handleMouseMove = (e) => {
      if (!textRef.current || !containerRef.current) return;

      const container = containerRef.current;
      const text = textRef.current;
      const rect = container.getBoundingClientRect();
      
      if (isDragging) {
        // Calculate new position relative to container center
        const containerCenterX = rect.left + rect.width / 2;
        const containerCenterY = rect.top + rect.height / 2;
        
        const newX = e.clientX - dragOffset.x - containerCenterX;
        const newY = e.clientY - dragOffset.y - containerCenterY;
        
        // Constrain movement within container bounds
        const maxX = rect.width / 2 - 50; // Account for text width
        const maxY = rect.height / 2 - 30; // Account for text height
        
        const constrainedX = Math.max(-maxX, Math.min(maxX, newX));
        const constrainedY = Math.max(-maxY, Math.min(maxY, newY));
        
        setPosition({ x: constrainedX, y: constrainedY });
        
        // Apply transform with physics effects
        const distance = Math.sqrt(constrainedX * constrainedX + constrainedY * constrainedY);
        const rotation = Math.atan2(constrainedY, constrainedX) * (180 / Math.PI) * 0.1;
        const scale = 1 + (distance * 0.003);
        
        text.style.transform = `translate(${constrainedX}px, ${constrainedY}px) rotate(${rotation}deg) scale(${Math.min(scale, 1.4)})`;
      }
    };

    const handleMouseUp = () => {
      if (!textRef.current) return;
      
      if (isDragging) {
        setIsDragging(false);
        
        const text = textRef.current;
        text.classList.remove('dragging');
        text.classList.add('dropping');
        
        // Animate back to center with bounce effect
        setTimeout(() => {
          setPosition({ x: 0, y: 0 });
          text.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';
          
          setTimeout(() => {
            text.classList.remove('dropping');
          }, 800);
        }, 100);
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div ref={containerRef} className="fluid-text-container">
      <div className="fluid-text-box">
        <div ref={textRef} className="fluid-text">
          Hello
        </div>
        <div className="fluid-background"></div>
      </div>
    </div>
  );
};

export default FluidText;

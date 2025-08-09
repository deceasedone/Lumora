"use client"

import React, { useEffect, useState } from "react"

interface BrowserWarningPopupProps {
  onClose: () => void
}

export const BrowserWarningPopup: React.FC<BrowserWarningPopupProps> = ({ onClose }) => {
  // Check if user is on Chromium browser
  const isChromiumBrowser = () => {
    const userAgent = navigator.userAgent
    return /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor)
  }

  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Auto-close after 5 seconds if not hovered
    if (!isHovered) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [onClose, isHovered])

  if (!isChromiumBrowser()) {
    return null
  }

  return (
    <div 
      className="fixed top-4 right-4 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-500/50 rounded-md p-3 shadow-lg max-w-xs">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-2">
            <h3 className="text-xs font-medium text-yellow-400">Browser Performance Notice</h3>
            <div className="mt-1 text-xs text-gray-200">
              <p>
                The landing page may experience slight lag on Chrome browser due to 3D animations. 
                Everything else works perfectly fine!
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-200 transition-colors">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

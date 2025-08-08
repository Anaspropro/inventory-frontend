import React from 'react'

const Loading = () => {
  return (
    <div className="loading-responsive text-responsive font-semibold w-full text-center flex justify-center items-center space-x-1">
       <span className="animate-pulse">Loading</span>
       <span className="animate-bounce1">.</span>
       <span className="animate-bounce2">.</span>
       <span className="animate-bounce3">.</span>
     </div>
  )
}

export default Loading
import React from 'react'
import { useSelector } from 'react-redux'

const Messages = () => {

  const { messages } = useSelector(store => store.chat)
  const { user } = useSelector(store => store.auth)

  return (
    <div className="space-y-3">

      {messages?.map((msg) => (

        <div
          key={msg._id}
          className={
            msg.senderId === user?._id
              ? "flex justify-end"
              : "flex justify-start"
          }
        >
          <div
            className={
              msg.senderId === user?._id
                ? "bg-orange-500 text-white px-4 py-2 rounded-2xl max-w-xs"
                : "bg-gray-200 text-black px-4 py-2 rounded-2xl max-w-xs"
            }
          >
            {msg.message}
          </div>
        </div>

      ))}

    </div>
  )
}

export default Messages
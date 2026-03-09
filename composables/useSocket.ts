import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'

let socket: Socket | null = null 

export function useSocket() {
  const connected = ref(false)

  function connect() {
    if (socket) return socket
    
    socket = io()

    socket.on('connect', () => {
      connected.value = true
    })

    return socket
  }
  
  function join(name: string) {
    socket?.emit('join', name) 
  }

  function move(payload: { roomId: string, index: number }) {
    socket?.emit('move', payload)
  }

  function leave(roomId: string) {
    socket?.emit('leave', { roomId })
  }

  return { connect, connected, join, move, leave, socket }
}
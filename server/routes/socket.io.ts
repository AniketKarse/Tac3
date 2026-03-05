import { Server } from 'socket.io'
import { defineEventHandler } from 'h3'

interface Player {
  id: string
  name: string
}

let io: Server | null = null
let waitingPlayer: Player | null = null

export default defineEventHandler((event) => {
  // @ts-ignore
  const req = event.node?.req || event.req
  // @ts-ignore
  const res = event.node?.res || event.res

  if (!io) {
    console.log('🚀 Initializing unified Socket.IO server...')
    const httpServer = (req.socket as any)?.server

    io = new Server(httpServer, {
      path: '/socket.io/',
      cors: { origin: '*' },
    })

    io.on('connection', (socket) => {
      console.log('🔌 Client connected:', socket.id)

      socket.on('join', (name: string) => {
        const player: Player = { id: socket.id, name }

        if (waitingPlayer) {
          const roomId = `${waitingPlayer.id}-${player.id}`
          socket.join(roomId)
          
          const waitingSocket = io!.sockets.sockets.get(waitingPlayer.id)
          if (waitingSocket) {
            waitingSocket.join(roomId)
          }

          io!.to(roomId).emit('game.start', {
            roomId,
            players: [waitingPlayer, player],
            turn: waitingPlayer.id,
          })

          waitingPlayer = null
        } else {
          waitingPlayer = player
          socket.emit('waiting', 'Waiting for opponent...')
        }
      })

      socket.on('move', ({ roomId, index }) => {
        io!.to(roomId).emit('move', { playerId: socket.id, index })
      })

      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id)
        if (waitingPlayer?.id === socket.id) waitingPlayer = null 
      })
    })
  }

  io.engine.handleRequest(req as any, res)
  event._handled = true
})
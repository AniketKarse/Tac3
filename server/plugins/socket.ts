import { Server } from 'socket.io'
import { createServer } from 'http'

interface Player {
  id: string
  name: string
}

console.log('📦 Socket plugin loaded')

export default defineNitroPlugin(() => {
  console.log('🚀 Nitro plugin running') // aandar aagaya mane nitro chalra

  const httpServer = createServer()
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  })

  httpServer.listen(4000, () => {
    console.log('✅ Socket.IO server running on http://localhost:4000')
  })

  let waitingPlayer: Player | null = null

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id)

    socket.on('join', (name: string) => {
      const player: Player = { id: socket.id, name }

      if (waitingPlayer) {
        // Pair players into a room
        const roomId = `${waitingPlayer.id}-${player.id}`
        socket.join(roomId)
        io.to(waitingPlayer.id).socketsJoin(roomId)

        io.to(roomId).emit('game.start', {
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
      io.to(roomId).emit('move', { playerId: socket.id, index })
    })

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id)
      if (waitingPlayer?.id === socket.id) waitingPlayer = null // this checks if waitingPlayer is null or not , if not then waitingPlayer.id is accessed else the whole thing becomes undefine and does not cause an error(crazy type script things)
    })
  })
})
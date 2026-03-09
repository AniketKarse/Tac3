import { Server } from 'socket.io'
import { defineEventHandler } from 'h3'

interface Player {
  id: string
  name: string
  roomId?: string 
}

let io: Server | null = null
let waitingPlayer: Player | null = null

const activePlayers = new Map<string, Player>() 

export default defineEventHandler((event) => {
  // @ts-ignore
  const req = event.node?.req || event.req
  // @ts-ignore
  const res = event.node?.res || event.res

  if (!io) {
    const httpServer = (req.socket as any)?.server

    io = new Server(httpServer, {
      path: '/socket.io/',
      cors: { origin: '*' },
      transports: ['polling', 'websocket'] 
    })

    io.on('connection', (socket) => {
      activePlayers.set(socket.id, { id: socket.id, name: 'Unknown' })

      socket.on('join', (name: string) => {
        const player = activePlayers.get(socket.id)
        if (player) player.name = name

        if (waitingPlayer && waitingPlayer.id !== socket.id) {
          const roomId = `room-${waitingPlayer.id}-${socket.id}`
          socket.join(roomId)
          
          const waitingSocket = io!.sockets.sockets.get(waitingPlayer.id)
          if (waitingSocket) {
            waitingSocket.join(roomId)
            
            waitingPlayer.roomId = roomId
            if (player) player.roomId = roomId

            io!.to(roomId).emit('game.start', {
              roomId,
              players: [waitingPlayer, player],
              turn: waitingPlayer.id,
            })
          }
          waitingPlayer = null
        } else {
          waitingPlayer = player!
          socket.emit('waiting', 'Waiting for opponent...')
        }
      })

      socket.on('move', ({ roomId, index }) => {
        io!.to(roomId).emit('move', { playerId: socket.id, index })
      })

      socket.on('disconnect', () => {
        const player = activePlayers.get(socket.id)

        if (waitingPlayer?.id === socket.id) {
          waitingPlayer = null 
        }

        if (player?.roomId) {
          io!.to(player.roomId).emit('opponent.left', 'Your opponent disconnected. You win by default!')
          io!.in(player.roomId).socketsLeave(player.roomId)
        }
        
        activePlayers.delete(socket.id)
      })
    })
  }

  io.engine.handleRequest(req as any, res)
  event._handled = true
})

<script setup lang="ts">
import { io } from 'socket.io-client'
import { ref, computed } from 'vue'

const socket = io();

const cells = ref(Array(9).fill(''))


const players = ref<{ id: string; name: string }[]>([])
const currentTurn = ref<string>('')


// Help taken
const currentTurnName = computed(() => {
  if (!currentTurn.value || players.value.length === 0) return 'Shhhh'
  const p = players.value.find(p => p.id === currentTurn.value)
  return p ? p.name : 'Shhhh'
})

const Player1 = ref('')
const Player2 = ref('')


const name = ref('')
const playerName = ref('')

const toBeRemoved = ref<number[]>([])

function joinGame() {
  if (!playerName.value) return
  name.value = playerName.value
  socket.emit('join', name.value)
}

function makeMove(index: number) {
  if (!roomId || cells.value[index]) return
  socket.emit('move', { roomId, index })
}

function resetBoard() {
    const index = -1
    socket.emit('move', { roomId, index })

}
let roomId: string | null = null
const waiting = ref(false)

socket.on('waiting', () => {
  waiting.value = true
})

socket.on('game.start', (data: { roomId: string; players: { id: string; name: string }[]; turn: string }) => {
  waiting.value = false
  roomId = data.roomId
  players.value = data.players
  currentTurn.value = data.turn
  cells.value = Array(9).fill('')
})

socket.on('move', ({ playerId, index }: { playerId: string; index: number }) => {

    if(index == -1){
        cells.value = Array(9).fill('')
        currentTurn.value = players.value[0] ? players.value[0].id : ''
        finalWin.value = ''
        finalWinner.value = ''
        disableWinner.value = false
        toBeRemoved.value = []
    }
    else {
    const firstPlayerId = players.value[0]?.id
    const symbol = ref()

    if(playerId === firstPlayerId) symbol.value = 'X'
    else symbol.value = 'O'

    cells.value[index] = symbol
    const nextPlayer = players.value.find(p => p.id !== playerId) // 2 hi log hai isliye can do
    currentTurn.value = nextPlayer ? nextPlayer.id : ''

    const remove = ref()
    toBeRemoved.value.push(index)
    if(toBeRemoved.value.length > 6) 
    {
        remove.value = toBeRemoved.value[0]
        cells.value[remove.value] = ''
        toBeRemoved.value.shift()
    }


    }

  
})

// my Game logic
const turn = ref('X')
const disableWinner = ref(false)

const finalWin = ref()
const finalWinner = ref()

const updateWin = (cells : any) => {

if(Player1.value == '') Player1.value = currentTurnName.value
else if(Player2.value == '') Player2.value = currentTurnName.value

  const winningPos: [number, number, number][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

    for (const [a, b, c] of winningPos) {
    if (cells[a].value && cells[a].value === cells[b].value && cells[b].value === cells[c].value) {
      disableWinner.value = true
      finalWin.value = cells[a].value
    }
  }
  if(finalWin.value == 'X') finalWinner.value = Player1.value
  else if(finalWin.value == 'O')finalWinner.value = Player2.value

}


watch(cells, updateWin, { deep: true });

</script>

<template>
  <NuxtLayout>
  <div>
    <div class="center" v-if="!name">
      <h1 >Player Name</h1>
      <input v-model="playerName" placeholder="Player Name" />
      <br>
      <UButton class="rounded-full px-15" @click="joinGame">Join</UButton>
    </div>

<div v-else-if="waiting">Waiting for a worthy opponent (honorable mentions - NoobMaster69 , Knowy , XDXD)</div>

<div v-else>
  <h2 >Hello: {{ name }}</h2>

  <div class="center">
    <div v-if="!finalWin">
      <h3>{{ currentTurnName }}'s Turn</h3>
    </div>


    <div v-if="finalWin">
      <h3>{{ finalWinner }} is the Winner!!</h3>
    </div>

    <div class="row">
      <button class="containerX" @click.stop="makeMove(0)" :disabled="!!cells[0]  || currentTurn !== socket.id || disableWinner">
        {{ cells[0] }}
      </button>
      <button class="containerX" @click.stop="makeMove(1)" :disabled="!!cells[1]  || currentTurn !== socket.id || disableWinner">
        {{ cells[1] }}
      </button>
      <button class="containerX" @click.stop="makeMove(2)" :disabled="!!cells[2]  || currentTurn !== socket.id || disableWinner">
        {{ cells[2] }}
      </button>
    </div>
    <div class="row">
      <button class="containerX" @click.stop="makeMove(3)" :disabled="!!cells[3]  || currentTurn !== socket.id || disableWinner">
        {{ cells[3] }}
      </button>
      <button class="containerX" @click.stop="makeMove(4)" :disabled="!!cells[4]  || currentTurn !== socket.id || disableWinner">
        {{ cells[4] }}
      </button>
      <button class="containerX" @click.stop="makeMove(5)" :disabled="!!cells[5]  || currentTurn !== socket.id || disableWinner">
        {{ cells[5] }}
      </button>
    </div>
    <div class="row">
      <button class="containerX" @click.stop="makeMove(6)" :disabled="!!cells[6]  || currentTurn !== socket.id || disableWinner">
        {{ cells[6] }}
      </button>
      <button class="containerX" @click.stop="makeMove(7)" :disabled="!!cells[7]  || currentTurn !== socket.id || disableWinner">
        {{ cells[7] }}
      </button>
      <button class="containerX" @click.stop="makeMove(8)" :disabled="!!cells[8]  || currentTurn !== socket.id || disableWinner">
        {{ cells[8] }}
      </button>
    </div>

    <div class="resetBtn">
      <button class="audioWide" @click.stop="resetBoard()">Reset</button>
    </div>
  </div>


</div>
  </div>
  </NuxtLayout>
</template>


<style>
input:focus {
  border-color: #007bff; /* Change border color */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Add a subtle glow */
  outline: none; /* Remove default outline for cleaner styling */
}
input {
  width: 50%;
  padding: 12px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 3px solid #ccc;
  transition: 0.5s;
  outline: none;
}
.row {
  display: flex;
  position: relative;
  margin: auto;
  width: 50%;
  justify-content: center;
}
.containerX {
  width: 60px;
  height: 60px;
  border: 1px solid;
  font-family: 'Audiowide', sans-serif;
  font-size: 30px;
  text-shadow: 3px 3px 3px #ababab;
  text-align: center;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-items: center;
}
h1 {
  font-family: monospace;
}
.center {
  margin: auto;
  width: 50%;
  text-align: center;
}
.resetBtn {
  margin-top: 10px;
}
.audioWide {
  font-family: monospace;
}

</style>
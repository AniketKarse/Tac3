<template>
  <NuxtLayout>
  <div class="center">
    <div class="center" v-if="!name">
      <!-- <h1 >Tic Tac Toe</h1> -->
      <h1>Player 1</h1>
      <input v-model="p1Name" placeholder="Player Name 1" />
      <br><br>
      
      <h1>Worthy Opponent</h1>
      <input v-model="p2Name" placeholder="Player Name 2" />
      <br><br>
        
      <UButton class="rounded-full px-15" @click="joinGame">Join</UButton>
    </div>

<!-- <div v-else-if="waiting">Waiting for a worthy opponent (honorable mentions - NoobMaster69 , Knowy , XDXD)</div> -->

<div v-else>
  <div class="center">
    <div v-if="!finalWin">
      <h3>{{ currentPlayer }}'s Turn</h3>
    </div>


    <div v-if="finalWin">
      <h3>{{ finalWinner }} is the Winner!!</h3>
    </div>

    <div class="row">
      <button class="containerX" @click.stop="play(0)" :disabled="disableWinner">
        {{ cells[0] }}
      </button>
      <button class="containerX" @click.stop="play(1)" :disabled="disableWinner">
        {{ cells[1] }}
      </button>
      <button class="containerX" @click.stop="play(2)" :disabled="disableWinner">
        {{ cells[2] }}
      </button>
    </div>
    <div class="row">
      <button class="containerX" @click.stop="play(3)" :disabled="disableWinner">
        {{ cells[3] }}
      </button>
      <button class="containerX" @click.stop="play(4)" :disabled="disableWinner">
        {{ cells[4] }}
      </button>
      <button class="containerX" @click.stop="play(5)" :disabled="disableWinner">
        {{ cells[5] }}
      </button>
    </div>
    <div class="row">
      <button class="containerX" @click.stop="play(6)" :disabled="disableWinner">
        {{ cells[6] }}
      </button>
      <button class="containerX" @click.stop="play(7)" :disabled="disableWinner">
        {{ cells[7] }}
      </button>
      <button class="containerX" @click.stop="play(8)" :disabled="disableWinner">
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

<script setup lang="ts">

import { ref, computed } from 'vue'

const cells = ref(['', '', '', '', '', '', '', '', ''])

const turn = ref('X')
const disableWinner = ref(false)

// Player name 
// const currentPlayer = ref(p1Name);
const p1Name = ref('');
const p2Name = ref('');
const currentPlayer = ref('');
console.log(p1Name.value);
console.log(p2Name.value);
const name = ref('')

const joinGame = () => {
    if(!p1Name.value || !p2Name.value) return
    name.value = p1Name.value
    currentPlayer.value =  p1Name.value
}

// const playerNameVisible = () => {
//   if(p1Name.value !="" && p2Name.value !="")
//   {
    
//   }
//   else {
//     navigateTo("/");
//   }
// }

// const wow = ref(false);
const indx = ref()
const toBeRemoved = ref([])

const play = (x) => {
  if (cells.value[x] == '') {
    cells.value[x] = turn.value
    if (turn.value === 'X'){
     turn.value = 'O'
    }
    else if (turn.value === 'O'){
      turn.value = 'X';
    } 

    if ((currentPlayer.value === p1Name.value)){
      currentPlayer.value = p2Name.value;
     }
     else if ((currentPlayer.value === p2Name.value)){
      currentPlayer.value = p1Name.value;
     }


    //toBeRemoved queue
    toBeRemoved.value.push(x)
    if (toBeRemoved.value.length > 6) {
      indx.value = toBeRemoved.value[0]
      cells.value[indx.value] = ''
      toBeRemoved.value.shift()
    }
  }
}

const resetBoard = () => {
  cells.value = ['', '', '', '', '', '', '', '', ''];
  toBeRemoved.value = [];
  turn.value = 'X';
  currentPlayer.value = p1Name.value;
  disableWinner.value = false;
  finalWin.value = null;
}

const finalWin = ref()
const finalWinner = ref()

//  computed(() => calculateWin(cells.value))

const updateWin = (cells) => {
  const winningPos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < winningPos.length; i++) {
    const [a, b, c] = winningPos[i]
    if (cells[a] && cells[a] == cells[b] && cells[c] == cells[b]) {
      disableWinner.value = true
      finalWin.value = cells[a]
    }
    if (finalWin.value === 'X') finalWinner.value = p1Name.value;
    else finalWinner.value = p2Name.value;
      
    
  }
}
watch(cells, updateWin, { deep: true });
// watchEffect(playerNameVisible);

</script>

<style>
input:focus {
  border-color: #007bff; /* Change border color */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Add a subtle glow */
  outline: none; /* Remove default outline for cleaner styling */
}
input {
  width: 70%;
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
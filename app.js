const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')
const resetDisplay = document.querySelector('.reset-container')

let wordle

const getWordle = () => {
  fetch('http://localhost:3000/word')
    .then(response => response.json())
    .then(json => {
      wordle = json.toUpperCase()
      console.log(wordle)
    })
    .catch(err => console.log(err))
}

getWordle()

const keys = [
  'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<<'
]

const guessRows = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
]

let currentRow, currentTile, isGameOver

const initalizeBoard = () => {
  guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
    guessRow.forEach((guess, guessIndex) => {
      const tileElement = document.createElement('div')
      tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
      tileElement.classList.add('tile')
      rowElement.append(tileElement)
    })
    tileDisplay.append(rowElement)
  })

  keys.forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonElement)
  })
}

const clearBoard = () => {
  tileDisplay.innerHTML = ''
  keyboard.innerHTML = ''
  resetDisplay.innerHTML = ''
}

const initalizeGameState = () => {
  currentRow = 0;
  currentTile = 0;
  isGameOver = false;
  initalizeBoard()
}

const resetGame = () => {
  getWordle()
  clearBoard()
  initalizeGameState()
}

initalizeGameState()

const handleClick = (letter) => {
  if (isGameOver) return
  if (letter == '<<') {
    deleteLetter()
    return
  }
  if (letter == 'ENTER') {
    checkRow()
    return
  }
  addLetter(letter)
}

const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(`guessRow-${currentRow}-tile-${currentTile}`)
    tile.textContent = letter
    guessRows[currentRow][currentTile] = letter
    tile.setAttribute('data', letter)
    currentTile++
  }
}

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--
    const tile = document.getElementById(`guessRow-${currentRow}-tile-${currentTile}`)
    tile.textContent = ''
    guessRows[currentRow][currentTile] = ''
    tile.removeAttribute('data')
  }
}

const checkRow = () => {
  const guess = guessRows[currentRow].join('')
  console.log('Guess: ' + guess)
  if (currentTile > 4) {
    fetch(`http://localhost:3000/check/?word=${guess}`)
      .then((response) => response.json())
      .then(json => {
        if (json == '462') {
          showMessage("That's not a real word, idiot.")
          return
        } else {
          flipTile()
          if (wordle === guess) {
            showMessage('Magnificent!')
            isGameOver = true
            showReset()
            return
          }
          checkTile()
        }
        console.log(json)
      })
      .catch((error) => console.log(error))
  }
}

const checkTile = () => {
  if (currentRow >= 5) {
    isGameOver = true
    showMessage('Game Over, the word was ' + wordle)
    showReset()
    return
  }
  currentRow++
  currentTile = 0
}

const showMessage = (message) => {
  const messageElement = document.createElement('p')
  messageElement.textContent = message
  messageDisplay.append(messageElement)
  setTimeout(() => messageDisplay.removeChild(messageElement), 2000)
}

const showReset = () => {
  const resetButton = document.createElement('button')
  resetButton.classList.add('reset')
  resetButton.textContent = 'Play Again?'
  resetButton.onclick = () => resetGame()
  resetDisplay.append(resetButton)
}

const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter)
  key.classList.add(color)
}

const flipTile = () => {
  const rowTiles = document.querySelector(`#guessRow-${currentRow}`).childNodes
  let checkWordle = wordle
  const guess = []

  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' })
  })

  guess.forEach((guess, index) => {
    if (guess.letter == wordle[index]) {
      guess.color = 'green-overlay'
      checkWordle = checkWordle.replace(guess.letter, '')
    }
  })

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = 'yellow-overlay'
      checkWordle = checkWordle.replace(guess.letter, '')
    }
  })

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add('flip')
      tile.classList.add(guess[index].color)
      addColorToKey(guess[index].letter, guess[index].color)
    }, 500 * index)
  })
}


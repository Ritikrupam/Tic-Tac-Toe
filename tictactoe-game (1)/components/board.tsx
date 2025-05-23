import Square from "./square"

interface BoardProps {
  squares: (string | null)[]
  onPlay: (squares: (string | null)[]) => void
  xIsNext: boolean
  winningLine: number[] | null
  disabled?: boolean
}

export default function Board({ squares, onPlay, xIsNext, winningLine, disabled = false }: BoardProps) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i] || disabled) {
      return
    }

    const nextSquares = squares.slice()
    nextSquares[i] = xIsNext ? "X" : "O"
    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares)
  let status

  if (winner) {
    status = `Winner: ${winner}`
  } else if (squares.every((square) => square !== null)) {
    status = "Draw!"
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`
  }

  // Create board using nested loops
  const renderBoard = () => {
    const board = []
    for (let row = 0; row < 3; row++) {
      const boardRow = []
      for (let col = 0; col < 3; col++) {
        const index = row * 3 + col
        boardRow.push(
          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            isWinningSquare={winningLine?.includes(index) || false}
            disabled={disabled}
          />,
        )
      }
      board.push(
        <div key={row} className="flex">
          {boardRow}
        </div>,
      )
    }
    return board
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow-md">
      <div className="mb-8">{renderBoard()}</div>
    </div>
  )
}

export function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}

export function getWinningLine(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (const line of lines) {
    const [a, b, c] = line
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line
    }
  }

  return null
}

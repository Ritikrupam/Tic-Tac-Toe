// AI logic for tic-tac-toe
import { calculateWinner } from "@/components/board"

type Board = (string | null)[]
type Move = number

// Easy AI: Makes random valid moves
export function easyAIMove(squares: Board): Move {
  const emptySquares = getEmptySquares(squares)
  if (emptySquares.length === 0) return -1

  // Pick a random empty square
  const randomIndex = Math.floor(Math.random() * emptySquares.length)
  return emptySquares[randomIndex]
}

// Medium AI: Prioritizes winning moves and blocking opponent wins, otherwise random
export function mediumAIMove(squares: Board, aiPlayer: string): Move {
  const emptySquares = getEmptySquares(squares)
  if (emptySquares.length === 0) return -1

  const humanPlayer = aiPlayer === "X" ? "O" : "X"

  // Check if AI can win in the next move
  for (const square of emptySquares) {
    const boardCopy = [...squares]
    boardCopy[square] = aiPlayer
    if (calculateWinner(boardCopy) === aiPlayer) {
      return square
    }
  }

  // Check if human can win in the next move and block
  for (const square of emptySquares) {
    const boardCopy = [...squares]
    boardCopy[square] = humanPlayer
    if (calculateWinner(boardCopy) === humanPlayer) {
      return square
    }
  }

  // Take center if available
  if (emptySquares.includes(4)) {
    return 4
  }

  // Take a random corner if available
  const corners = [0, 2, 6, 8].filter((corner) => emptySquares.includes(corner))
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)]
  }

  // Otherwise, take a random move
  return emptySquares[Math.floor(Math.random() * emptySquares.length)]
}

// Hard AI: Uses minimax algorithm for optimal play
export function hardAIMove(squares: Board, aiPlayer: string): Move {
  const emptySquares = getEmptySquares(squares)
  if (emptySquares.length === 0) return -1

  const humanPlayer = aiPlayer === "X" ? "O" : "X"

  // If board is empty or nearly empty, use a predefined opening for performance
  if (emptySquares.length >= 8) {
    // Take center or a corner for best opening
    if (emptySquares.includes(4)) return 4
    return [0, 2, 6, 8][Math.floor(Math.random() * 4)]
  }

  // For small board sizes like tic-tac-toe, we can optimize by pre-calculating
  // the best move for common board states

  // If AI is second player and human took center, take a corner
  if (emptySquares.length === 8 && squares[4] !== null) {
    const corners = [0, 2, 6, 8]
    return corners[Math.floor(Math.random() * corners.length)]
  }

  let bestScore = Number.NEGATIVE_INFINITY
  let bestMove = -1

  // Try each empty square
  for (const square of emptySquares) {
    const boardCopy = [...squares]
    boardCopy[square] = aiPlayer

    // Get score from minimax
    const score = minimax(
      boardCopy,
      0,
      false,
      aiPlayer,
      humanPlayer,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
    )

    // Update best move if this is better
    if (score > bestScore) {
      bestScore = score
      bestMove = square
    }
  }

  return bestMove
}

// Minimax algorithm with alpha-beta pruning
function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: string,
  humanPlayer: string,
  alpha: number,
  beta: number,
): number {
  // Check terminal states
  const winner = calculateWinner(board)
  if (winner === aiPlayer) return 10 - depth
  if (winner === humanPlayer) return depth - 10
  if (getEmptySquares(board).length === 0) return 0

  // Limit depth for performance in larger games
  // For tic-tac-toe this isn't necessary, but it's good practice
  if (depth > 9) return 0

  if (isMaximizing) {
    let bestScore = Number.NEGATIVE_INFINITY
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = aiPlayer
        const score = minimax(board, depth + 1, false, aiPlayer, humanPlayer, alpha, beta)
        board[i] = null
        bestScore = Math.max(score, bestScore)
        alpha = Math.max(alpha, bestScore)
        if (beta <= alpha) break
      }
    }
    return bestScore
  } else {
    let bestScore = Number.POSITIVE_INFINITY
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = humanPlayer
        const score = minimax(board, depth + 1, true, aiPlayer, humanPlayer, alpha, beta)
        board[i] = null
        bestScore = Math.min(score, bestScore)
        beta = Math.min(beta, bestScore)
        if (beta <= alpha) break
      }
    }
    return bestScore
  }
}

// Helper function to get empty squares
function getEmptySquares(squares: Board): number[] {
  return squares.map((square, index) => (square === null ? index : -1)).filter((index) => index !== -1)
}

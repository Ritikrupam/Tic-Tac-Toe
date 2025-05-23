"use client"

import { useState, useEffect } from "react"
import Board, { getWinningLine, calculateWinner } from "./board"
import GameModeSelector from "./game-mode-selector"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { GameMode, Difficulty } from "@/types/game-types"
import { easyAIMove, mediumAIMove, hardAIMove } from "@/lib/ai"

export default function Game() {
  const [history, setHistory] = useState<Array<Array<string | null>>>([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const [isAscending, setIsAscending] = useState(true)
  const [gameMode, setGameMode] = useState<GameMode>("two-player")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")

  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]
  const winningLine = getWinningLine(currentSquares)
  const winner = calculateWinner(currentSquares)
  const isDraw = !winner && currentSquares.every((square) => square !== null)
  const gameOver = !!winner || isDraw

  // Handle AI moves - completely removed the delay mechanism
  useEffect(() => {
    // Only make AI move if:
    // 1. Game mode is AI
    // 2. It's O's turn (AI is always O)
    // 3. We're at the latest move in history
    // 4. Game is not over
    if (gameMode === "ai" && !xIsNext && currentMove === history.length - 1 && !gameOver) {
      // Make AI move immediately without any delay
      makeAIMove()
    }
  }, [currentMove, xIsNext, gameMode, difficulty, history, gameOver])

  function makeAIMove() {
    const aiPlayer = "O" // AI is always O
    let moveIndex: number

    // Choose AI move based on difficulty
    switch (difficulty) {
      case "easy":
        moveIndex = easyAIMove(currentSquares)
        break
      case "medium":
        moveIndex = mediumAIMove(currentSquares, aiPlayer)
        break
      case "hard":
        moveIndex = hardAIMove(currentSquares, aiPlayer)
        break
      default:
        moveIndex = easyAIMove(currentSquares)
    }

    if (moveIndex !== -1) {
      const nextSquares = currentSquares.slice()
      nextSquares[moveIndex] = aiPlayer
      handlePlay(nextSquares)
    }
  }

  function handlePlay(nextSquares: Array<string | null>) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(move: number) {
    setCurrentMove(move)
  }

  function handleSortToggle() {
    setIsAscending(!isAscending)
  }

  function resetGame() {
    setHistory([Array(9).fill(null)])
    setCurrentMove(0)
  }

  function handleGameModeChange(mode: GameMode) {
    setGameMode(mode)
    resetGame()
  }

  function handleDifficultyChange(newDifficulty: Difficulty) {
    setDifficulty(newDifficulty)
    resetGame()
  }

  // Get difficulty color
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return "text-green-600"
      case "medium":
        return "text-amber-600"
      case "hard":
        return "text-red-600"
      default:
        return ""
    }
  }

  // Build the list of moves
  const moves = history.map((squares, move) => {
    // Find the move location (for moves after the first one)
    let locationText = ""
    if (move > 0) {
      // Find the difference between current and previous board
      const prevSquares = history[move - 1]
      let changedIndex = -1

      for (let i = 0; i < squares.length; i++) {
        if (squares[i] !== prevSquares[i]) {
          changedIndex = i
          break
        }
      }

      if (changedIndex !== -1) {
        const row = Math.floor(changedIndex / 3) + 1
        const col = (changedIndex % 3) + 1
        locationText = ` (${row}, ${col})`
      }
    }

    // For current move, show a special indicator
    if (move === currentMove) {
      return (
        <li key={move} className="py-1">
          <div className="px-3 py-1 bg-purple-100 rounded text-purple-800 font-medium border border-purple-200">
            You are at move #{move} {move === 0 ? "(game start)" : locationText}
          </div>
        </li>
      )
    }

    // For other moves, show a button
    const description = move ? `Go to move #${move}${locationText}` : "Go to game start"

    return (
      <li key={move} className="py-1">
        <Button variant="outline" size="sm" onClick={() => jumpTo(move)} className="hover:bg-blue-50 border-blue-200">
          {description}
        </Button>
      </li>
    )
  })

  // Sort the moves based on the toggle
  const sortedMoves = isAscending ? moves : [...moves].reverse()

  // Game status message with colors
  let status
  let statusClass = "text-lg font-medium mb-4 px-4 py-2 rounded-md"

  if (winner) {
    status = `Winner: ${winner}`
    statusClass += " bg-green-100 text-green-800 border border-green-200"
  } else if (isDraw) {
    status = "Game ended in a draw!"
    statusClass += " bg-amber-100 text-amber-800 border border-amber-200"
  } else {
    if (gameMode === "ai" && !xIsNext) {
      status = "AI's turn (O)"
      statusClass += ` bg-blue-100 text-blue-800 border border-blue-200 ${getDifficultyColor()}`
    } else {
      status = `Next player: ${xIsNext ? "X" : "O"}`
      statusClass += xIsNext
        ? " bg-purple-100 text-purple-800 border border-purple-200"
        : " bg-teal-100 text-teal-800 border border-teal-200"
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
      <div className="flex-1">
        <GameModeSelector
          gameMode={gameMode}
          difficulty={difficulty}
          onGameModeChange={handleGameModeChange}
          onDifficultyChange={handleDifficultyChange}
        />

        <div className="flex flex-col items-center">
          <div className={statusClass}>{status}</div>
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            winningLine={winningLine}
            disabled={gameMode === "ai" && !xIsNext && currentMove === history.length - 1}
          />
          <Button
            variant="outline"
            onClick={resetGame}
            className="mt-4 bg-gradient-to-r from-pink-50 to-red-50 hover:from-pink-100 hover:to-red-100 border-pink-200"
          >
            Reset Game
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-lg shadow-md border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-purple-800">Game History</h2>
            <div className="flex items-center space-x-2">
              <Switch id="sort-order" checked={isAscending} onCheckedChange={handleSortToggle} />
              <Label htmlFor="sort-order" className="text-purple-700">
                {isAscending ? "Ascending" : "Descending"}
              </Label>
            </div>
          </div>
          <ol className="space-y-1">{sortedMoves}</ol>
        </div>
      </div>
    </div>
  )
}

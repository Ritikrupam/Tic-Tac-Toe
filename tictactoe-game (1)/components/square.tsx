"use client"

interface SquareProps {
  value: string | null
  onSquareClick: () => void
  isWinningSquare?: boolean
  disabled?: boolean
}

export default function Square({ value, onSquareClick, isWinningSquare = false, disabled = false }: SquareProps) {
  // Different colors for X and O
  const getValueColor = () => {
    if (!value) return ""
    return value === "X" ? "text-purple-600" : "text-teal-600"
  }

  return (
    <button
      className={`w-16 h-16 border border-gray-300 text-3xl font-bold flex items-center justify-center
        ${isWinningSquare ? "bg-amber-200" : "bg-white"} 
        ${disabled ? "cursor-not-allowed opacity-80" : "hover:bg-gray-100"} 
        ${getValueColor()}
        transition-all duration-200 shadow-sm`}
      onClick={onSquareClick}
      disabled={disabled}
    >
      {value}
    </button>
  )
}

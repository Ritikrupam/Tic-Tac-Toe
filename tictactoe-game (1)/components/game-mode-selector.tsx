"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { GameMode, Difficulty } from "@/types/game-types"

interface GameModeSelectorProps {
  gameMode: GameMode
  difficulty: Difficulty
  onGameModeChange: (mode: GameMode) => void
  onDifficultyChange: (difficulty: Difficulty) => void
}

export default function GameModeSelector({
  gameMode,
  difficulty,
  onGameModeChange,
  onDifficultyChange,
}: GameModeSelectorProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg shadow-md border border-blue-100 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Game Mode</h2>

      <RadioGroup value={gameMode} onValueChange={(value) => onGameModeChange(value as GameMode)} className="mb-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="two-player" id="two-player" />
          <Label htmlFor="two-player" className="text-blue-700">
            Two Player
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ai" id="ai" />
          <Label htmlFor="ai" className="text-blue-700">
            Play Against AI
          </Label>
        </div>
      </RadioGroup>

      {gameMode === "ai" && (
        <div>
          <h3 className="text-md font-medium mb-2 text-blue-800">AI Difficulty</h3>
          <RadioGroup
            value={difficulty}
            onValueChange={(value) => onDifficultyChange(value as Difficulty)}
            className="space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="easy" id="easy" />
              <Label htmlFor="easy" className="text-green-600 font-medium">
                Easy
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="text-amber-600 font-medium">
                Medium
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hard" id="hard" />
              <Label htmlFor="hard" className="text-red-600 font-medium">
                Hard
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  )
}

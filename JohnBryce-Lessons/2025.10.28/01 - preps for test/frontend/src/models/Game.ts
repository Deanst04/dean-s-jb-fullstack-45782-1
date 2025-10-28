import type { GameDraft } from "./Game-draft";

export interface Game extends GameDraft {
    id: string
    createdAt: string
    updatedAt: string
}
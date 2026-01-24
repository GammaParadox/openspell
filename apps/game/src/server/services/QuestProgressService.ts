/**
 * Quest Progress Service
 * 
 * Manages player quest progress including checkpoints and completion status.
 * Integrates with PlayerPersistenceManager for saving/loading quest data.
 */

/**
 * Quest progress entry for a single quest
 */
export interface QuestProgress {
  questId: number;
  checkpoint: number;
  completed: boolean;
}

/**
 * Service for managing player quest progress
 */
export class QuestProgressService {
  /**
   * Gets the current checkpoint for a quest
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID to check
   * @returns The current checkpoint (0 if not started)
   */
  getQuestCheckpoint(questProgress: Map<number, QuestProgress>, questId: number): number {
    return questProgress.get(questId)?.checkpoint ?? 0;
  }

  /**
   * Gets the quest progress entry for a quest
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID to check
   * @returns The quest progress entry or null if not started
   */
  getQuestProgress(questProgress: Map<number, QuestProgress>, questId: number): QuestProgress | null {
    return questProgress.get(questId) ?? null;
  }

  /**
   * Checks if a player has started a quest
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID to check
   * @returns True if the quest has been started
   */
  hasStartedQuest(questProgress: Map<number, QuestProgress>, questId: number): boolean {
    const progress = questProgress.get(questId);
    return progress !== undefined && progress.checkpoint > 0;
  }

  /**
   * Checks if a quest is completed
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID to check
   * @returns True if the quest is marked as completed
   */
  isQuestCompleted(questProgress: Map<number, QuestProgress>, questId: number): boolean {
    return questProgress.get(questId)?.completed ?? false;
  }

  /**
   * Sets the checkpoint for a quest and marks the quest progress as dirty
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID
   * @param checkpoint The new checkpoint value
   * @param completed Whether the quest is completed (optional)
   * @returns The updated quest progress entry
   */
  setQuestCheckpoint(
    questProgress: Map<number, QuestProgress>,
    questId: number,
    checkpoint: number,
    completed?: boolean
  ): QuestProgress {
    const existing = questProgress.get(questId);
    const updatedProgress: QuestProgress = {
      questId,
      checkpoint,
      completed: completed ?? existing?.completed ?? false
    };
    
    questProgress.set(questId, updatedProgress);
    return updatedProgress;
  }

  /**
   * Advances a quest to the next checkpoint
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID
   * @param markCompleted Whether to mark the quest as completed when advancing
   * @returns The updated quest progress entry
   */
  advanceQuestCheckpoint(
    questProgress: Map<number, QuestProgress>,
    questId: number,
    markCompleted: boolean = false
  ): QuestProgress {
    const current = this.getQuestCheckpoint(questProgress, questId);
    return this.setQuestCheckpoint(questProgress, questId, current + 1, markCompleted);
  }

  /**
   * Marks a quest as completed
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID
   * @param finalCheckpoint The final checkpoint value (optional, keeps current if not provided)
   * @returns The updated quest progress entry
   */
  completeQuest(
    questProgress: Map<number, QuestProgress>,
    questId: number,
    finalCheckpoint?: number
  ): QuestProgress {
    const current = questProgress.get(questId);
    const checkpoint = finalCheckpoint ?? current?.checkpoint ?? 0;
    
    const updatedProgress: QuestProgress = {
      questId,
      checkpoint,
      completed: true
    };
    
    questProgress.set(questId, updatedProgress);
    return updatedProgress;
  }

  /**
   * Resets a quest to the beginning (checkpoint 0, not completed)
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID
   */
  resetQuest(questProgress: Map<number, QuestProgress>, questId: number): void {
    questProgress.delete(questId);
  }

  /**
   * Gets all quest IDs that the player has started
   * 
   * @param questProgress Map of quest progress
   * @returns Array of quest IDs
   */
  getStartedQuestIds(questProgress: Map<number, QuestProgress>): number[] {
    return Array.from(questProgress.keys()).filter(questId => {
      const progress = questProgress.get(questId);
      return progress && progress.checkpoint > 0;
    });
  }

  /**
   * Gets all completed quest IDs
   * 
   * @param questProgress Map of quest progress
   * @returns Array of completed quest IDs
   */
  getCompletedQuestIds(questProgress: Map<number, QuestProgress>): number[] {
    return Array.from(questProgress.entries())
      .filter(([_, progress]) => progress.completed)
      .map(([questId, _]) => questId);
  }

  /**
   * Converts a Map of quest progress to an array for database storage
   * 
   * @param questProgress Map of quest progress
   * @returns Array of quest progress entries
   */
  serializeQuestProgress(questProgress: Map<number, QuestProgress>): QuestProgress[] {
    return Array.from(questProgress.values());
  }

  /**
   * Converts an array of quest progress from database to a Map
   * 
   * @param questProgressArray Array of quest progress entries
   * @returns Map of quest progress
   */
  deserializeQuestProgress(questProgressArray: QuestProgress[]): Map<number, QuestProgress> {
    const map = new Map<number, QuestProgress>();
    for (const progress of questProgressArray) {
      map.set(progress.questId, progress);
    }
    return map;
  }

  /**
   * Creates an empty quest progress map
   * 
   * @returns Empty Map
   */
  createEmptyQuestProgress(): Map<number, QuestProgress> {
    return new Map<number, QuestProgress>();
  }
}

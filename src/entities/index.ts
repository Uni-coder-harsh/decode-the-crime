/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: codingevents
 * Interface for CodingEvents
 */
export interface CodingEvents {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  eventName?: string;
  /** @wixFieldType text */
  eventDescription?: string;
  /** @wixFieldType text */
  eventRules?: string;
  /** @wixFieldType datetime */
  startTime?: Date | string;
  /** @wixFieldType datetime */
  endTime?: Date | string;
  /** @wixFieldType text */
  registeredParticipants?: string;
  /** @wixFieldType number */
  maxParticipants?: number;
  /** @wixFieldType text */
  eventStatus?: string;
}


/**
 * Collection ID: detectivepuzzles
 * Interface for DetectivePuzzles
 */
export interface DetectivePuzzles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  puzzleTitle?: string;
  /** @wixFieldType text */
  question?: string;
  /** @wixFieldType text */
  correctAnswer?: string;
  /** @wixFieldType text */
  difficulty?: string;
  /** @wixFieldType text */
  hint1?: string;
  /** @wixFieldType text */
  hint2?: string;
  /** @wixFieldType text */
  adminNotes?: string;
}


/**
 * Collection ID: gamerecords
 * Interface for GameRecords
 */
export interface GameRecords {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  sessionId?: string;
  /** @wixFieldType datetime */
  startTime?: Date | string;
  /** @wixFieldType datetime */
  endTime?: Date | string;
  /** @wixFieldType number */
  durationSeconds?: number;
  /** @wixFieldType number */
  playerScore?: number;
  /** @wixFieldType text */
  outcome?: string;
  /** @wixFieldType text */
  puzzleId?: string;
}


/**
 * Collection ID: gamerooms
 * Interface for GameRooms
 */
export interface GameRooms {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  roomName?: string;
  /** @wixFieldType text */
  roomStatus?: string;
  /** @wixFieldType number */
  maxPlayers?: number;
  /** @wixFieldType number */
  currentPlayers?: number;
  /** @wixFieldType text */
  joinCode?: string;
  /** @wixFieldType boolean */
  isPrivate?: boolean;
  /** @wixFieldType datetime */
  creationTime?: Date | string;
}


/**
 * Collection ID: hackertasks
 * Interface for HackerTasks
 */
export interface HackerTasks {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  taskName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  problemStatement?: string;
  /** @wixFieldType text */
  boilerplateCode?: string;
  /** @wixFieldType text */
  testCasesJson?: string;
  /** @wixFieldType text */
  allowedLanguages?: string;
  /** @wixFieldType number */
  difficultyLevel?: number;
}


/**
 * Collection ID: playerprofiles
 * Interface for PlayerProfiles
 */
export interface PlayerProfiles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  username?: string;
  /** @wixFieldType image */
  avatarImage?: string;
  /** @wixFieldType number */
  currentRank?: number;
  /** @wixFieldType number */
  totalWins?: number;
  /** @wixFieldType number */
  totalLosses?: number;
  /** @wixFieldType number */
  gamesPlayed?: number;
  /** @wixFieldType text */
  achievementsUnlocked?: string;
}

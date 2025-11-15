/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

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

/**
 * Utility functions for university student ID formatting and batch identification.
 * For 22 Batch, student IDs follow the format: 080262010....... (16 digits).
 */

export function extractBatchNumber(batch: string | number | undefined): number {
  if (typeof batch === 'number') return batch;
  if (!batch) return 22;
  const match = String(batch).match(/\d+/);
  return match ? parseInt(match[0], 10) : 22;
}

export function getBatchStudentIdPrefix(batch: string | number | undefined): string {
  const batchNum = extractBatchNumber(batch);
  switch (batchNum) {
    case 22:
      return '080262010';
    case 21:
      return '080252020';
    case 20:
      return '080252010';
    case 19:
      return '080242020';
    default:
      return '080262010';
  }
}

export function generateStudentIdForBatch(batch: string | number | undefined, customRoll?: number): string {
  const prefix = getBatchStudentIdPrefix(batch);
  if (customRoll !== undefined) {
    return `${prefix}${String(customRoll).padStart(7, '0')}`;
  }
  // Generates 7-digit random suffix to complete standard 16-digit student ID
  const randomSuffix = Math.floor(1000000 + Math.random() * 9000000);
  return `${prefix}${randomSuffix}`;
}

export function isBatch22(batch: string | number | undefined): boolean {
  return extractBatchNumber(batch) === 22;
}

/**
 * Returns standard University Level / Term mapping by batch:
 * - 19 batch -> Level 3 / Term I
 * - 20 batch -> Level 2 / Term II
 * - 21 batch -> Level 2 / Term I
 * - 22 batch -> Level 1 / Term II
 */
export function getDefaultLevelTermForBatch(batch: string | number | undefined): string {
  const batchNum = extractBatchNumber(batch);
  switch (batchNum) {
    case 19:
      return 'Level 3 / Term I';
    case 20:
      return 'Level 2 / Term II';
    case 21:
      return 'Level 2 / Term I';
    case 22:
      return 'Level 1 / Term II';
    default:
      return 'Level 1 / Term II';
  }
}

/**
 * Returns BAUST institutional email for a given student ID:
 * Format: id@baust.edu.bd (e.g. 0802420205101034@baust.edu.bd)
 */
export function getEduEmailForStudentId(id: string): string {
  const clean = id.trim();
  if (!clean) return '';
  if (clean.includes('@')) return clean.toLowerCase();
  return `${clean}@baust.edu.bd`.toLowerCase();
}

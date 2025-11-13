export enum EvaluationStatus {
  FULFILLED = 'FULFILLED',
  PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
  NOT_FULFILLED = 'NOT_FULFILLED',
}

export interface CriterionEvaluation {
  criterion: string;
  status: EvaluationStatus;
  score: number;
  justification: string;
  suggestion: string;
}

export interface EvaluationResult {
  evaluation: CriterionEvaluation[];
  overallScore: number;
  overallFeedback: string;
}

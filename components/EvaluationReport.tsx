import React from 'react';
import { EvaluationResult, EvaluationStatus, CriterionEvaluation } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { WarningIcon } from './icons/WarningIcon';
import { XCircleIcon } from './icons/XCircleIcon';


interface EvaluationReportProps {
  result: EvaluationResult;
}

const statusConfig = {
  [EvaluationStatus.FULFILLED]: {
    label: "Fulfilled",
    icon: <CheckIcon className="w-6 h-6" />,
    iconBgColor: "bg-green-100 dark:bg-green-900",
    textColor: "text-green-600 dark:text-green-300",
    borderColor: "border-green-200 dark:border-green-700",
  },
  [EvaluationStatus.PARTIALLY_FULFILLED]: {
    label: "Partially Fulfilled",
    icon: <WarningIcon className="w-6 h-6" />,
    iconBgColor: "bg-yellow-100 dark:bg-yellow-900",
    textColor: "text-yellow-600 dark:text-yellow-300",
    borderColor: "border-yellow-200 dark:border-yellow-700",
  },
  [EvaluationStatus.NOT_FULFILLED]: {
    label: "Not Fulfilled",
    icon: <XCircleIcon className="w-6 h-6" />,
    iconBgColor: "bg-red-100 dark:bg-red-900",
    textColor: "text-red-600 dark:text-red-300",
    borderColor: "border-red-200 dark:border-red-700",
  },
};

const getScoreColor = (score: number): string => {
    if (score < 50) return 'text-red-500 dark:text-red-400';
    if (score < 75) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-green-500 dark:text-green-400';
};


const CriterionCard: React.FC<{ item: CriterionEvaluation }> = ({ item }) => {
  const config = statusConfig[item.status];
  
  return (
    <div className={`p-4 border-l-4 rounded-r-lg bg-slate-50 dark:bg-slate-800/50 ${config.borderColor}`}>
      <div className="flex items-start sm:items-center gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${config.iconBgColor} ${config.textColor}`}>
          {config.icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-baseline gap-2">
            <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{item.criterion}</h4>
            <span className={`font-bold text-lg whitespace-nowrap ${getScoreColor(item.score)}`}>{item.score}/100</span>
          </div>
          <p className={`text-sm font-medium ${config.textColor}`}>{config.label}</p>
        </div>
      </div>
      
      <div className="mt-4 space-y-4 sm:pl-14">
        <div>
          <h5 className="font-semibold text-sm text-slate-600 dark:text-slate-400 mb-1">Justification</h5>
          <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 text-slate-700 dark:text-slate-300 italic">
            {item.justification}
          </blockquote>
        </div>
        <div>
          <h5 className="font-semibold text-sm text-slate-600 dark:text-slate-400 mb-1">Suggestion for Improvement</h5>
          <p className="text-slate-700 dark:text-slate-300">{item.suggestion}</p>
        </div>
      </div>
    </div>
  );
};


const EvaluationReport: React.FC<EvaluationReportProps> = ({ result }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Overall Score</h3>
            <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)}`}>
                {Math.round(result.overallScore)}%
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Based on rubric average
            </p>
        </div>
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Overall Feedback</h3>
          <div className="prose prose-slate dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-800/50 p-4 rounded-md">
            <p>{result.overallFeedback}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Criteria Breakdown</h3>
        <div className="space-y-6">
          {result.evaluation.map((item, index) => (
            <CriterionCard key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationReport;

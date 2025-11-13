
import React, { useState, useCallback } from 'react';
import { EvaluationResult, EvaluationStatus } from './types';
import { evaluateDocuments } from './services/geminiService';
import { extractTextFromPdf } from './services/pdfParser';
import FileUploader from './components/FileUploader';
import EvaluationReport from './components/EvaluationReport';
import Spinner from './components/Spinner';
import { DocumentTextIcon } from './components/icons/DocumentTextIcon';

export default function App(): React.ReactElement {
  const [studentActivity, setStudentActivity] = useState<File | null>(null);
  const [rubric, setRubric] = useState<File | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = useCallback(async () => {
    if (!studentActivity || !rubric) {
      setError("Please upload both the student activity and the rubric files.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEvaluationResult(null);

    try {
      const studentActivityText = await extractTextFromPdf(studentActivity);
      const rubricText = await extractTextFromPdf(rubric);

      if (!studentActivityText.trim() || !rubricText.trim()) {
        throw new Error("Could not extract text from one or both PDFs. Please ensure they are not image-based or empty.");
      }

      const result = await evaluateDocuments(studentActivityText, rubricText);
      setEvaluationResult(result);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during evaluation.";
      setError(`Evaluation failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [studentActivity, rubric]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            AI-Powered PDF Grader
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            Upload a student's work and a rubric to receive an instant, detailed evaluation.
          </p>
        </header>

        <main className="space-y-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <DocumentTextIcon className="w-7 h-7 text-indigo-500" />
              Upload Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploader
                id="student-activity"
                label="Student Activity PDF"
                file={studentActivity}
                onFileChange={setStudentActivity}
                onFileRemove={() => setStudentActivity(null)}
              />
              <FileUploader
                id="rubric"
                label="Grading Rubric PDF"
                file={rubric}
                onFileChange={setRubric}
                onFileRemove={() => setRubric(null)}
              />
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleEvaluate}
                disabled={!studentActivity || !rubric || isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Analyzing...
                  </>
                ) : (
                  'Evaluate Documents'
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {evaluationResult && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
                Evaluation Report
              </h2>
              <EvaluationReport result={evaluationResult} />
            </div>
          )}
        </main>
        
        <footer className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} AI Grader. Powered by Google Gemini.</p>
        </footer>
      </div>
    </div>
  );
}

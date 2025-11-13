import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationResult } from '../types';

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    evaluation: {
      type: Type.ARRAY,
      description: "An array of evaluations for each criterion.",
      items: {
        type: Type.OBJECT,
        properties: {
          criterion: {
            type: Type.STRING,
            description: "The name or description of the evaluation criterion from the rubric."
          },
          status: {
            type: Type.STRING,
            description: "Evaluation status. Must be one of: 'FULFILLED', 'PARTIALLY_FULFILLED', 'NOT_FULFILLED'."
          },
          score: {
            type: Type.NUMBER,
            description: "A numerical score from 0 to 100 representing how well the criterion was met."
          },
          justification: {
            type: Type.STRING,
            description: "A direct quote from the student's activity that supports the evaluation status. If no specific text applies, explain why."
          },
          suggestion: {
            type: Type.STRING,
            description: "A constructive comment for improvement related to this criterion."
          }
        },
        required: ["criterion", "status", "score", "justification", "suggestion"]
      }
    },
    overallScore: {
        type: Type.NUMBER,
        description: "A final, overall numerical score from 0 to 100 for the entire submission, calculated as an average of the individual criterion scores."
    },
    overallFeedback: {
        type: Type.STRING,
        description: "A summary of overall feedback and general suggestions for improving the entire activity."
    }
  },
  required: ["evaluation", "overallScore", "overallFeedback"]
};

const createPrompt = (studentActivityText: string, rubricText: string): string => `
You are an expert academic assistant specializing in evaluating student work against provided rubrics. Your goal is to provide a detailed, objective, and constructive analysis. You MUST respond ONLY with the JSON object that adheres to the provided schema.

Here is the grading rubric:
---
${rubricText}
---

Here is the student's activity submission:
---
${studentActivityText}
---

Please perform the following tasks:
1.  Carefully read the student's submission.
2.  Analyze the submission against each criterion listed in the rubric.
3.  For each criterion, determine if it is 'FULFILLED', 'PARTIALLY_FULFILLED', or 'NOT_FULFILLED'.
4.  Assign a numerical score from 0 to 100 for each criterion based on the level of fulfillment.
5.  Provide a specific quote from the student's text as a 'justification' for your evaluation. If a criterion is not met and no text applies, briefly explain the omission.
6.  Offer a concise and actionable 'suggestion' for improvement for each criterion.
7.  Write a brief 'overallFeedback' paragraph summarizing the work's strengths and key areas for improvement.
8.  Calculate an 'overallScore' which should be the average of all individual criterion scores.
9.  Generate a JSON object containing the full evaluation, including scores.
`;

export async function evaluateDocuments(studentActivityText: string, rubricText: string): Promise<EvaluationResult> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = createPrompt(studentActivityText, rubricText);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as EvaluationResult;
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The AI model failed to generate an evaluation. This could be due to network issues or API limits.");
  }
}

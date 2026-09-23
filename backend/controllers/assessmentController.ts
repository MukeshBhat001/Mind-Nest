/**
 * Self-Assessment & Quiz Controller
 * Evaluates stress and mood dynamically, provides tailored recommendations,
 * and maintains quiz history.
 */
import { Response } from 'express';
import { dbAssessments } from '../models/dbAdapter';
import { AuthRequest } from '../middleware/authMiddleware';

export const assessmentController = {
  // GET /api/assessment/quizzes
  async getQuizzes(req: AuthRequest, res: Response): Promise<void> {
    try {
      const isGuest = !req.user;
      const quizzes = await dbAssessments.getQuizzes(isGuest);
      res.status(200).json({ success: true, quizzes });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Could not fetch assessments.' });
    }
  },

  // GET /api/assessment/quizzes/:id
  async getQuizById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const quiz = await dbAssessments.getQuizById(id);
      if (!quiz) {
        res.status(404).json({ success: false, message: 'Assessment template not found.' });
        return;
      }

      if (!req.user && !quiz.isPreview) {
        res.status(403).json({
          success: false,
          message: 'This comprehensive clinical assessment is reserved for registered members. Sign in or register to take it.',
        });
        return;
      }

      res.status(200).json({ success: true, quiz });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Error retrieving assessment.' });
    }
  },

  // POST /api/assessment/submit
  async submitQuiz(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { quizId, answers } = req.body as {
        quizId: string;
        answers: Record<string, number>; // questionId -> points
      };

      if (!quizId || !answers) {
        res.status(400).json({ success: false, message: 'Invalid submission data: quizId and answers required.' });
        return;
      }

      const quiz = await dbAssessments.getQuizById(quizId);
      if (!quiz) {
        res.status(404).json({ success: false, message: 'Assessment not found.' });
        return;
      }

      // Calculate total score dynamically
      let totalScore = 0;
      let maxScore = 0;

      for (const q of quiz.questions) {
        const points = typeof answers[q.id] === 'number' ? answers[q.id] : 0;
        totalScore += points;

        const maxQuestionPoints = Math.max(...q.options.map((opt) => opt.points));
        maxScore += maxQuestionPoints;
      }

      // Match interpretation level
      let matched = quiz.interpretations.find(
        (interp) => totalScore >= interp.minScore && totalScore <= interp.maxScore
      );

      if (!matched && quiz.interpretations.length > 0) {
        matched = quiz.interpretations[quiz.interpretations.length - 1];
      }

      const stressLevel = matched ? matched.level : 'Evaluation Complete';
      const description = matched ? matched.description : 'Your scores have been dynamically computed.';
      const recommendedCategory = matched ? matched.recommendedCategory : 'Mindfulness';

      // Specific recommendations based on stress level
      const recommendations: string[] = [
        `Focus primarily on ${recommendedCategory} exercises in your Mind Nest library.`,
        'Engage in 5 minutes of guided rhythmic breathing (Box Breathing or 4-7-8) twice daily.',
        'Review the psychoeducation article on nervous system regulation and vagal tone.',
      ];

      let savedResult = null;
      if (req.user) {
        // Save to member history
        savedResult = await dbAssessments.saveQuizResult({
          userId: req.user._id,
          userEmail: req.user.email,
          quizId: quiz._id,
          quizTitle: quiz.title,
          totalScore,
          maxScore,
          stressLevel,
          recommendations,
          recommendedCategory,
        });
      }

      res.status(200).json({
        success: true,
        message: 'Assessment scored successfully.',
        evaluation: {
          quizTitle: quiz.title,
          totalScore,
          maxScore,
          percentage: Math.round((totalScore / (maxScore || 1)) * 100),
          stressLevel,
          description,
          recommendedCategory,
          recommendations,
          saved: !!savedResult,
          disclaimer:
            'MEDICAL & PSYCHOLOGICAL DISCLAIMER: This self-assessment tool is provided strictly for educational and personal reflection purposes as part of a university project. It is not a diagnostic instrument, medical advice, or psychiatric treatment. If you are experiencing acute psychological distress or suicidal ideation, please consult a qualified mental health clinician or call emergency services (988 in the US/Canada or your local emergency line).',
        },
      });
    } catch (err: any) {
      console.error('Quiz submission error:', err);
      res.status(500).json({ success: false, message: 'Failed to process assessment submission.' });
    }
  },

  // GET /api/assessment/history (Registered Member)
  async getMyHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Login required.' });
        return;
      }
      const history = await dbAssessments.getUserResults(req.user._id);
      res.status(200).json({ success: true, history });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to retrieve assessment history.' });
    }
  },

  // GET /api/assessment/admin/results (Admin only)
  async getAllResultsAdmin(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const results = await dbAssessments.getAllResults();
      res.status(200).json({ success: true, count: results.length, results });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to retrieve aggregate quiz results.' });
    }
  },
};

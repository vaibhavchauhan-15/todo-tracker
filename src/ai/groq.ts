import { Priority, Category } from '../components/workspace/types';

export interface AITask {
  title: string;
  description: string;
  priority: Priority;
}

export interface AITasksResult {
  daily: AITask[];
  weekly: AITask[];
  monthly: AITask[];
  yearly: AITask[];
}

export type GoalType = 'study' | 'fitness' | 'productivity' | 'work' | 'personal' | 'custom';
export type TimeCommitment = 'light' | 'moderate' | 'intense';
export type CategoryFilter = Category | 'all';

function buildSystemPrompt(categoryFilter: CategoryFilter): string {
  if (categoryFilter === 'all') {
    return `You are an AI productivity assistant for a todo application called TaskMaster.

Your job is to convert a user's goal into structured tasks.

You must generate tasks in four categories: daily, weekly, monthly, yearly.

Rules:
1. Return ONLY valid JSON — no markdown, no code fences, no explanations
2. Each task must contain: title (short), description (clear), priority (low | medium | high)
3. Generate 3-6 daily tasks
4. Generate 2-4 weekly tasks
5. Generate 1-3 monthly tasks
6. Generate exactly 1 yearly task
7. Tasks must be realistic and actionable

Return JSON in exactly this format:
{"daily":[],"weekly":[],"monthly":[],"yearly":[]}`;
  }
  const countMap: Record<Category, string> = {
    daily:   'Generate 4-7 daily tasks',
    weekly:  'Generate 4-7 weekly tasks',
    monthly: 'Generate 3-5 monthly tasks',
    yearly:  'Generate 2-4 yearly tasks',
  };
  return `You are an AI productivity assistant for a todo application called TaskMaster.

Your job is to convert a user's goal into structured ${categoryFilter} tasks ONLY.

Rules:
1. Return ONLY valid JSON — no markdown, no code fences, no explanations
2. Each task must contain: title (short), description (clear), priority (low | medium | high)
3. ${countMap[categoryFilter]}
4. Tasks must be realistic and actionable
5. Leave all other category arrays empty

Return JSON in exactly this format:
{"daily":[],"weekly":[],"monthly":[],"yearly":[]}`;
}

let lastCallTime = 0;
const MIN_INTERVAL_MS = 3000; // simple client-side rate limiter

function buildUserPrompt(
  prompt: string,
  goalType: GoalType,
  timeCommitment: TimeCommitment,
  categoryFilter: CategoryFilter,
): string {
  const goalLabel = goalType === 'custom' ? 'general goal' : goalType;
  const intensityMap: Record<TimeCommitment, string> = {
    light: 'light (1-2 hours/day)',
    moderate: 'moderate (2-4 hours/day)',
    intense: 'intense (4+ hours/day)',
  };
  const categoryNote = categoryFilter === 'all'
    ? ''
    : `\nFocus category: ${categoryFilter} tasks only`;
  return `Goal: ${prompt}\nGoal type: ${goalLabel}\nTime commitment: ${intensityMap[timeCommitment]}${categoryNote}\nGenerate structured tasks for this goal.`;
}

export async function generateAITasks(
  prompt: string,
  goalType: GoalType = 'custom',
  timeCommitment: TimeCommitment = 'moderate',
  categoryFilter: CategoryFilter = 'all',
): Promise<AITasksResult> {
  const now = Date.now();
  if (now - lastCallTime < MIN_INTERVAL_MS) {
    throw new Error('Please wait a moment before generating again.');
  }
  lastCallTime = now;

  const apiKey = process.env.REACT_APP_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('REACT_APP_GROQ_API_KEY is not set. Add it to your .env file.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: buildSystemPrompt(categoryFilter) },
        { role: 'user', content: buildUserPrompt(prompt, goalType, timeCommitment, categoryFilter) },
      ],
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`Groq API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const text: string = data?.choices?.[0]?.message?.content ?? '';

  // Strip markdown code fences if model wraps in ```json ... ```
  const cleaned = text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();

  let parsed: AITasksResult;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('AI returned invalid JSON. Please try again.');
  }

  // Validate & normalise priorities
  const normPriority = (p: string): Priority => {
    if (p === 'high' || p === 'medium' || p === 'low') return p;
    return 'medium';
  };

  const normList = (arr: AITask[]): AITask[] =>
    (Array.isArray(arr) ? arr : []).map(t => ({
      title: String(t.title ?? '').slice(0, 120),
      description: String(t.description ?? '').slice(0, 300),
      priority: normPriority(t.priority as string),
    }));

  const allResult: AITasksResult = {
    daily: normList(parsed.daily),
    weekly: normList(parsed.weekly),
    monthly: normList(parsed.monthly),
    yearly: normList(parsed.yearly),
  };

  // If a specific category was selected, zero out the others
  if (categoryFilter !== 'all') {
    (['daily', 'weekly', 'monthly', 'yearly'] as const).forEach(cat => {
      if (cat !== categoryFilter) allResult[cat] = [];
    });
  }

  return allResult;
}

import { supabase } from '../lib/supabaseClient';
import { Task } from '../components/workspace/types';

// Map a raw Supabase row → app Task shape
const toTask = (row: Record<string, unknown>): Task => ({
  id:                  row.id as string,
  userId:              row.user_id as string,
  title:               row.title as string,
  description:         (row.description as string) ?? '',
  priority:            (row.priority as Task['priority']) ?? 'medium',
  category:            (row.category as string) ?? 'daily',
  dueDate:             (row.due_date as string) ?? '',
  dueTime:             (row.due_time as string) ?? '',
  status:              (row.status as Task['status']) ?? (row.completed ? 'completed' : 'pending'),
  completed:           (row.completed as boolean) ?? false,
  streak:              (row.streak as number) ?? 0,
  lastCompletedDate:   (row.last_completed_date as string) ?? '',
  createdAt:           row.created_at as string,
  updatedAt:           row.updated_at as string,
});

export const getTodos = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toTask);
};

export const createTodo = async (
  task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Task> => {
  const { data, error } = await supabase
    .from('todos')
    .insert({
      user_id:             task.userId,
      title:               task.title,
      description:         task.description ?? '',
      priority:            task.priority,
      category:            task.category,
      completed:           task.completed,
      status:              task.status,
      due_date:            task.dueDate || null,
      due_time:            task.dueTime || null,
      streak:              task.streak ?? 0,
      last_completed_date: task.lastCompletedDate ?? '',
    })
    .select()
    .single();

  if (error) throw error;
  return toTask(data);
};

export const updateTodo = async (
  id: string,
  updates: Partial<Task>,
): Promise<void> => {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (updates.title              !== undefined) patch.title               = updates.title;
  if (updates.description        !== undefined) patch.description         = updates.description;
  if (updates.priority           !== undefined) patch.priority            = updates.priority;
  if (updates.category           !== undefined) patch.category            = updates.category;
  if (updates.completed          !== undefined) patch.completed           = updates.completed;
  if (updates.status             !== undefined) patch.status              = updates.status;
  if (updates.dueDate            !== undefined) patch.due_date            = updates.dueDate || null;
  if (updates.dueTime            !== undefined) patch.due_time            = updates.dueTime || null;
  if (updates.streak             !== undefined) patch.streak              = updates.streak;
  if (updates.lastCompletedDate  !== undefined) patch.last_completed_date = updates.lastCompletedDate;

  const { error } = await supabase
    .from('todos')
    .update(patch)
    .eq('id', id);

  if (error) throw error;
};

export const deleteTodo = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

import { supabase } from './supabaseClient';

const LOCAL_API = '/api';

// Helper: detect if we're in Supabase mode
const isSupabase = !!supabase;

// =====================================================
// KIDS
// =====================================================
export async function fetchKids() {
  if (isSupabase) {
    const { data, error } = await supabase
      .from('kids').select('*').order('points', { ascending: false }).order('name', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  }
  const res = await fetch(`${LOCAL_API}/kids`);
  if (!res.ok) throw new Error('Failed to fetch kids');
  return res.json();
}

export async function addKid(name, avatar) {
  if (isSupabase) {
    const { data, error } = await supabase
      .from('kids').insert({ name, avatar, points: 0 }).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
  const res = await fetch(`${LOCAL_API}/kids`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, avatar })
  });
  if (!res.ok) throw new Error('Failed to add kid');
  return res.json();
}

export async function deleteKid(id) {
  if (isSupabase) {
    const { error } = await supabase.from('kids').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  }
  const res = await fetch(`${LOCAL_API}/kids/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete kid');
  return res.json();
}

// =====================================================
// TASKS
// =====================================================
export async function fetchTasks() {
  if (isSupabase) {
    const { data, error } = await supabase
      .from('tasks').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }
  const res = await fetch(`${LOCAL_API}/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function addTask(title, points) {
  if (isSupabase) {
    const { data, error } = await supabase
      .from('tasks').insert({ title, points }).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
  const res = await fetch(`${LOCAL_API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, points })
  });
  if (!res.ok) throw new Error('Failed to add task');
  return res.json();
}

export async function deleteTask(id) {
  if (isSupabase) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  }
  const res = await fetch(`${LOCAL_API}/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
}

// =====================================================
// TASK ASSIGNMENTS
// =====================================================
export async function fetchAssignments() {
  if (isSupabase) {
    try {
      const { data, error } = await supabase
        .from('task_assignments')
        .select('*')
        .order('created_at', { ascending: false });
      
      // If table doesn't exist, return empty array
      if (error || !data) return [];
      return data;
    } catch (err) {
      return [];
    }
  }
  const res = await fetch(`${LOCAL_API}/assignments`);
  if (!res.ok) throw new Error('Failed to fetch assignments');
  return res.json();
}

export async function fetchTasksForKid(kidId) {
  if (isSupabase) {
    try {
      const { data: assignments, error } = await supabase
        .from('task_assignments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error || !assignments) {
        return [];
      }

      const matchingAssignments = assignments.filter(a => {
        return a.kid_id === null || a.kid_id === kidId;
      });

      if (matchingAssignments.length === 0) {
        return [];
      }

      const taskIds = [...new Set(matchingAssignments.map(a => a.task_id))];
      
      if (taskIds.length === 0) {
        return [];
      }

      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .in('id', taskIds);
      
      if (!tasks) return [];

      return tasks.map(task => {
        const assignment = matchingAssignments.find(a => a.task_id === task.id);
        return { 
          ...task, 
          assignment_id: assignment?.id, 
          assigned_kid_id: assignment?.kid_id, 
          assigned_date: assignment?.assigned_date 
        };
      });
    } catch (err) {
      return [];
    }
  }
  const res = await fetch(`${LOCAL_API}/tasks?kidId=${kidId}`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function addAssignment(taskId, kidId, assignedDate) {
  if (isSupabase) {
    const { data, error } = await supabase
      .from('task_assignments')
      .insert({ 
        task_id: taskId, 
        kid_id: kidId || null, // null means all kids
        assigned_date: assignedDate || null // null means all dates (recurring)
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
  const res = await fetch(`${LOCAL_API}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId, kidId, assignedDate })
  });
  if (!res.ok) throw new Error('Failed to add assignment');
  return res.json();
}

export async function deleteAssignment(id) {
  if (isSupabase) {
    const { error } = await supabase.from('task_assignments').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  }
  const res = await fetch(`${LOCAL_API}/assignments/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete assignment');
  return res.json();
}

// =====================================================
// TASK COMPLETIONS
// =====================================================
export async function fetchCompletions(kidId, date) {
  if (isSupabase) {
    const { data, error } = await supabase
      .from('task_completions')
      .select('*')
      .eq('kid_id', kidId)
      .eq('completed_date', date);
    if (error) throw new Error(error.message);
    return data;
  }
  const res = await fetch(`${LOCAL_API}/completions?kidId=${kidId}&date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch completions');
  return res.json();
}

export async function toggleCompletion(kidId, taskId, date) {
  if (isSupabase) {
    // Check if already completed
    const { data: existing } = await supabase
      .from('task_completions')
      .select('id')
      .eq('kid_id', kidId)
      .eq('task_id', taskId)
      .eq('completed_date', date)
      .maybeSingle();

    // Get task points
    const { data: task } = await supabase
      .from('tasks').select('points').eq('id', taskId).single();

    if (!task) throw new Error('Task not found');

    if (existing) {
      // Uncomplete: delete record + deduct points
      await supabase.from('task_completions').delete().eq('id', existing.id);
      const { data: kid } = await supabase
        .from('kids').select('points').eq('id', kidId).single();
      const newPoints = Math.max(0, (kid?.points || 0) - task.points);
      await supabase.from('kids').update({ points: newPoints }).eq('id', kidId);
      return { completed: false, points: newPoints, pointsChanged: -task.points };
    } else {
      // Complete: insert record + add points
      await supabase.from('task_completions').insert({
        kid_id: kidId, task_id: taskId, completed_date: date, points_earned: task.points
      });
      const { data: kid } = await supabase
        .from('kids').select('points').eq('id', kidId).single();
      const newPoints = (kid?.points || 0) + task.points;
      await supabase.from('kids').update({ points: newPoints }).eq('id', kidId);
      return { completed: true, points: newPoints, pointsChanged: task.points };
    }
  }

  // Local fallback
  const res = await fetch(`${LOCAL_API}/completions/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kidId, taskId, date })
  });
  if (!res.ok) throw new Error('Failed to toggle completion');
  return res.json();
}

// =====================================================
// CHAMPIONS / HALL OF FAME
// =====================================================
export async function fetchChampions() {
  if (isSupabase) {
    const { data, error } = await supabase
      .from('champions').select('*').order('declared_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }
  const res = await fetch(`${LOCAL_API}/champions`);
  if (!res.ok) throw new Error('Failed to fetch champions');
  return res.json();
}

export async function declareChampion(month) {
  if (isSupabase) {
    // Get kids sorted by points
    const { data: kids, error } = await supabase
      .from('kids').select('*').order('points', { ascending: false });
    if (error) throw new Error(error.message);
    if (!kids || kids.length === 0) throw new Error('No kids found. Add kids first!');

    const champion = kids[0];
    const runnerUp = kids.length > 1 ? kids[1] : null;

    // Insert into champions archive
    const { error: insertError } = await supabase.from('champions').insert({
      month,
      champion_name: champion.name,
      champion_avatar: champion.avatar,
      champion_points: champion.points,
      runner_up_name: runnerUp ? runnerUp.name : 'No Runner-Up',
      runner_up_avatar: runnerUp ? runnerUp.avatar : 'starry-crown',
      runner_up_points: runnerUp ? runnerUp.points : 0
    });
    if (insertError) throw new Error(insertError.message);

    // Reset all kids' points to 0
    await supabase.from('kids').update({ points: 0 }).neq('id', 0);

    // Clear all task completions
    await supabase.from('task_completions').delete().neq('id', 0);

    return {
      success: true,
      message: `Monthly reset successful! Champion: ${champion.name}`,
      data: { month, champion, runnerUp }
    };
  }

  // Local fallback
  const res = await fetch(`${LOCAL_API}/champions/declare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ month })
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to declare champion');
  }
  return res.json();
}

import express from 'express';
import cors from 'cors';
import { getDbConnection, initDatabase } from './database.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize database
try {
  await initDatabase();
} catch (error) {
  console.error('Failed to initialize database:', error);
}

// ------------------- KIDS ENDPOINTS -------------------

// Get all kids (sorted by points descending for leaderboard)
app.get('/api/kids', async (req, res) => {
  let db;
  try {
    db = await getDbConnection();
    const kids = await db.all('SELECT * FROM kids ORDER BY points DESC, name ASC');
    res.json(kids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (db) await db.close();
  }
});

// Add a new kid
app.post('/api/kids', async (req, res) => {
  const { name, avatar } = req.body;
  if (!name || !avatar) {
    return res.status(400).json({ error: 'Name and avatar are required' });
  }

  let db;
  try {
    db = await getDbConnection();
    const result = await db.run(
      'INSERT INTO kids (name, avatar, points) VALUES (?, ?, 0)',
      [name, avatar]
    );
    const newKid = await db.get('SELECT * FROM kids WHERE id = ?', [result.lastID]);
    res.status(201).json(newKid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (db) await db.close();
  }
});

// Delete a kid
app.delete('/api/kids/:id', async (req, res) => {
  const { id } = req.params;
  let db;
  try {
    db = await getDbConnection();
    await db.run('DELETE FROM kids WHERE id = ?', [id]);
    await db.run('DELETE FROM task_completions WHERE kid_id = ?', [id]);
    res.json({ success: true, message: 'Kid and their data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (db) await db.close();
  }
});


// ------------------- TASKS ENDPOINTS -------------------

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  let db;
  try {
    db = await getDbConnection();
    const tasks = await db.all('SELECT * FROM tasks ORDER BY created_at ASC');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (db) await db.close();
  }
});

// Add a custom task
app.post('/api/tasks', async (req, res) => {
  const { title, points } = req.body;
  if (!title || !points) {
    return res.status(400).json({ error: 'Title and points are required' });
  }

  let db;
  try {
    db = await getDbConnection();
    const result = await db.run(
      'INSERT INTO tasks (title, points) VALUES (?, ?)',
      [title, parseInt(points, 10)]
    );
    const newTask = await db.get('SELECT * FROM tasks WHERE id = ?', [result.lastID]);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (db) await db.close();
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  let db;
  try {
    db = await getDbConnection();
    await db.run('DELETE FROM tasks WHERE id = ?', [id]);
    await db.run('DELETE FROM task_completions WHERE task_id = ?', [id]);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (db) await db.close();
  }
});


// ------------------- TASK COMPLETIONS ENDPOINTS -------------------

// Get all completions for a specific date (e.g., 'YYYY-MM-DD')
app.get('/api/completions', async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Date query parameter is required' });
  }

  let db;
  try {
    db = await getDbConnection();
    const completions = await db.all(
      'SELECT * FROM task_completions WHERE completed_date = ?',
      [date]
    );
    res.json(completions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (db) await db.close();
  }
});

// Toggle a task completion for a specific kid and date
app.post('/api/completions/toggle', async (req, res) => {
  const { kidId, taskId, date } = req.body;
  if (!kidId || !taskId || !date) {
    return res.status(400).json({ error: 'kidId, taskId, and date are required' });
  }

  let db;
  try {
    db = await getDbConnection();

    // 1. Check if this task is already completed for this kid on this date
    const existing = await db.get(
      'SELECT * FROM task_completions WHERE kid_id = ? AND task_id = ? AND completed_date = ?',
      [kidId, taskId, date]
    );

    // 2. Fetch the task to know how many points it's worth
    const task = await db.get('SELECT points FROM tasks WHERE id = ?', [taskId]);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (existing) {
      // Already completed -> Toggle Off (Uncomplete)
      await db.run('DELETE FROM task_completions WHERE id = ?', [existing.id]);
      
      // Deduct points from kid's total (don't go below 0 points)
      await db.run(
        'UPDATE kids SET points = MAX(0, points - ?) WHERE id = ?',
        [task.points, kidId]
      );

      const updatedKid = await db.get('SELECT * FROM kids WHERE id = ?', [kidId]);
      res.json({ completed: false, points: updatedKid.points, pointsChanged: -task.points });
    } else {
      // Not completed -> Toggle On (Complete!)
      await db.run(
        'INSERT INTO task_completions (kid_id, task_id, completed_date, points_earned) VALUES (?, ?, ?, ?)',
        [kidId, taskId, date, task.points]
      );

      // Add points to kid's total
      await db.run(
        'UPDATE kids SET points = points + ? WHERE id = ?',
        [task.points, kidId]
      );

      const updatedKid = await db.get('SELECT * FROM kids WHERE id = ?', [kidId]);
      res.json({ completed: true, points: updatedKid.points, pointsChanged: task.points });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (db) await db.close();
  }
});


// ------------------- CHAMPIONS / LEADERBOARD ENDPOINTS -------------------

// Get Hall of Fame (Previous Champions history)
app.get('/api/champions', async (req, res) => {
  let db;
  try {
    db = await getDbConnection();
    const history = await db.all('SELECT * FROM champions ORDER BY declared_at DESC');
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (db) await db.close();
  }
});

// Declare the current month's champion & runner up, and reset points for the new month!
app.post('/api/champions/declare', async (req, res) => {
  const { month } = req.body; // e.g., "July 2026"
  if (!month) {
    return res.status(400).json({ error: 'Month name is required' });
  }

  let db;
  try {
    db = await getDbConnection();

    // 1. Get kids ordered by points descending
    const kids = await db.all('SELECT * FROM kids ORDER BY points DESC, name ASC');
    if (kids.length === 0) {
      return res.status(400).json({ error: 'No kids found in database. Add kids first!' });
    }

    const champion = kids[0];
    const runnerUp = kids.length > 1 ? kids[1] : null;

    // 2. Insert into the champions archive table
    await db.run(
      `INSERT INTO champions (
        month, 
        champion_name, champion_avatar, champion_points, 
        runner_up_name, runner_up_avatar, runner_up_points
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        month,
        champion.name,
        champion.avatar,
        champion.points,
        runnerUp ? runnerUp.name : 'No Runner-Up',
        runnerUp ? runnerUp.avatar : 'starry-crown',
        runnerUp ? runnerUp.points : 0
      ]
    );

    // 3. Reset all kids' monthly points to 0!
    await db.run('UPDATE kids SET points = 0');

    // 4. Clean up old task completions (keeps db lightweight, and kids start afresh)
    await db.run('DELETE FROM task_completions');

    res.status(201).json({
      success: true,
      message: `Monthly reset successful! Champion declared: ${champion.name}`,
      data: {
        month,
        champion,
        runnerUp
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (db) await db.close();
  }
});

app.listen(PORT, () => {
  console.log(`Dream of Jannah server is flying high on http://localhost:${PORT} 🌟`);
});

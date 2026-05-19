import express from 'express';
import cors from 'cors';
import { connection } from './connectDB.js';

const app = express();
const Port = 3002;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Сервер работает!', time: new Date() });
});

app.post('/api/register', (req, res) => {
  const { login, password, full_name, phone } = req.body;
  
  const checkSql = 'SELECT * FROM user WHERE login = ?';
  connection.query(checkSql, [login], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length > 0) {
      return res.status(400).json({ error: 'Логин уже существует' });
    }
    
    const insertSql = `INSERT INTO user (id_role, login, password, full_name, phone) 
                       VALUES (1, ?, ?, ?, ?)`;
    connection.query(insertSql, [login, password, full_name, phone], (err2, result2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ success: true, message: 'Регистрация успешна' });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { login, password } = req.body;
  const sql = `SELECT u.*, r.code as role_code 
               FROM user u 
               JOIN role r ON u.id_role = r.id 
               WHERE u.login = ? AND u.password = ?`;
  
  connection.query(sql, [login, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }
    const user = result[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        login: user.login,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role_code
      }
    });
  });
});

app.get('/api/masters', (req, res) => {
  const sql = 'SELECT * FROM master';
  connection.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get('/api/statuses', (req, res) => {
  const sql = 'SELECT * FROM status';
  connection.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.post('/api/requests', (req, res) => {
  const { id_user, id_master, booking_datetime } = req.body;
  
  const checkSql = `SELECT * FROM request 
                    WHERE id_master = ? AND booking_datetime = ? 
                    AND id_status != 3`;
  
  connection.query(checkSql, [id_master, booking_datetime], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length > 0) {
      return res.status(400).json({ error: 'Это время уже занято. Выберите другое время' });
    }
    
    const insertSql = `INSERT INTO request (id_user, id_master, id_status, booking_datetime) 
                       VALUES (?, ?, 1, ?)`; // status 1 = 'Новое'
    connection.query(insertSql, [id_user, id_master, booking_datetime], (err2, result2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ success: true, message: 'Заявка успешно создана', id: result2.insertId });
    });
  });
});

app.get('/api/requests/user/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = `SELECT r.*, 
                      m.name as master_name, 
                      s.name as status_name, 
                      s.code as status_code
               FROM request r
               JOIN master m ON r.id_master = m.id
               JOIN status s ON r.id_status = s.id
               WHERE r.id_user = ?
               ORDER BY r.booking_datetime DESC`;
  
  connection.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get('/api/admin/requests', (req, res) => {
  const sql = `SELECT r.*, 
                      u.login, u.full_name, u.phone,
                      m.name as master_name, 
                      s.name as status_name, 
                      s.code as status_code
               FROM request r
               JOIN user u ON r.id_user = u.id
               JOIN master m ON r.id_master = m.id
               JOIN status s ON r.id_status = s.id
               ORDER BY r.booking_datetime DESC`;
  
  connection.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.put('/api/admin/requests/:id/status', (req, res) => {
  const { id } = req.params;
  const { status_id } = req.body;
  const sql = 'UPDATE request SET id_status = ? WHERE id = ?';
  connection.query(sql, [status_id, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Статус обновлен' });
  });
});

app.delete('/api/requests/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM request WHERE id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Заявка удалена' });
  });
});

app.listen(Port, () => {
  console.log(`Сервер запущен на http://localhost:${Port}`);
  console.log(`Test: http://localhost:${Port}/api/test`);
  console.log(`Masters: http://localhost:${Port}/api/masters`);
});
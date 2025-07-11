import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout, Input, Button, List, Typography, Checkbox, Space, message, Segmented } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import "./App.css"
const { Header, Content } = Layout;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    if (!taskInput.trim()) return;

    try {
      const res = await axios.post(`${BACKEND_URL}/tasks`, { text: taskInput });
      setTasks([res.data, ...tasks]);
      setTaskInput('');
    } catch (err) {
      message.error('Failed to add task');
    }
  };

  const handleToggle = async (id, current) => {
    try {
      const res = await axios.put(`${BACKEND_URL}/tasks/${id}`, {
        completed: !current,
      });
      setTasks(tasks.map(t => (t._id === id ? res.data : t)));
    } catch (err) {
      message.error('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      message.error('Failed to delete task');
    }
  };

  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleEditSave = async (id) => {
    try {
      const res = await axios.put(`${BACKEND_URL}/tasks/${id}`, {
        text: editingText,
      });
      setTasks(tasks.map(t => (t._id === id ? res.data : t)));
      setEditingId(null);
      setEditingText('');
    } catch (err) {
      message.error('Failed to edit task');
    }
  };

  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter(t => t.completed);
    for (let task of completedTasks) {
      await handleDelete(task._id);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Completed') return t.completed;
    if (filter === 'Incomplete') return !t.completed;
    return true;
  });

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header style={{ color: '#fff', fontSize: '24px', textAlign: 'center' }}>
        TaskCraft - ToDo App ddd
      </Header>

      <Content className="todo-container">
        <div className="todo-card">
          <Space.Compact style={{ width: '100%', marginBottom: 20 }}>
            <Input
              placeholder="Add a new task"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onPressEnter={handleAdd}
            />
            <Button type="primary" onClick={handleAdd}>
              Add
            </Button>
          </Space.Compact>

          <Segmented
            options={['All', 'Completed', 'Incomplete']}
            value={filter}
            onChange={setFilter}
            style={{ marginBottom: 20 }}
          />

          <List
            bordered
            dataSource={filteredTasks}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <DeleteOutlined
                    key="delete"
                    onClick={() => handleDelete(item._id)}
                    style={{ color: 'red' }}
                  />,
                ]}
              >
                <Checkbox
                  checked={item.completed}
                  onChange={() => handleToggle(item._id, item.completed)}
                />
                {editingId === item._id ? (
                  <Input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onPressEnter={() => handleEditSave(item._id)}
                    onBlur={() => handleEditSave(item._id)}
                    style={{ marginLeft: 10, width: '80%' }}
                  />
                ) : (
                  <Typography.Text
                    delete={item.completed}
                    onDoubleClick={() => handleEdit(item._id, item.text)}
                    style={{ marginLeft: 10, cursor: 'pointer' }}
                  >
                    {item.text}
                  </Typography.Text>
                )}
              </List.Item>
            )}
          />

          <Button
            danger
            type="dashed"
            style={{ marginTop: 20, width: '100%' }}
            onClick={handleClearCompleted}
          >
            Clear Completed Tasks
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default App;

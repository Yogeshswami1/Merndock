import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout, Input, Button, List, Typography, Checkbox, Space, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  // 🔄 Fetch tasks on load
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

  // ➕ Add task
  const handleAdd = async () => {
    if (!taskInput.trim()) return;

    try {
      const res = await axios.post(`${BACKEND_URL}/tasks`, {
        text: taskInput,
      });
      setTasks([res.data, ...tasks]);
      setTaskInput('');
    } catch (err) {
      console.error(err);
      message.error('Failed to add task');
    }
  };

  // ✅ Toggle complete
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

  // ❌ Delete task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      message.error('Failed to delete task');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header style={{ color: '#fff', fontSize: '24px', textAlign: 'center' }}>
        TaskCraft - ToDo App
      </Header>

      <Content style={{ padding: '30px' }}>
        <Space.Compact style={{ width: '100%' }}>
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

        <List
          style={{ marginTop: 20 }}
          bordered
          dataSource={tasks}
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
              <Typography.Text
                delete={item.completed}
                style={{ marginLeft: 10 }}
              >
                {item.text}
              </Typography.Text>
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  );
};

export default App;

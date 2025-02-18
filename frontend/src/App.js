// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import './App.css'; // Import the custom CSS file

function App() {
    const [tasks, setTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
    };

    const addTask = async () => {
        if (!taskTitle) return;
        const response = await axios.post('http://localhost:5000/tasks', { title: taskTitle });
        setTasks([...tasks, response.data]);
        setTaskTitle('');
        setShowModal(false);
    };

    const updateTask = async (id, completed) => {
        const response = await axios.put(`http://localhost:5000/tasks/${id}`, { completed: !completed });
        setTasks(tasks.map(task => (task._id === id ? response.data : task)));
    };

    const deleteTask = async (id) => {
        await axios.delete(`http://localhost:5000/tasks/${id}`);
        setTasks(tasks.filter(task => task._id !== id));
    };

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    return (
        <div className="container mt-5 bg-light p-4 rounded">
            <h1 className="task-manager-heading">
                Task Manager
            </h1>
            <Button variant="primary" onClick={handleShow}>
                Add Task
            </Button>

            <ul className="list-group mt-3">
                {tasks.map(task => (
                    <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                            {task.title}
                        </span>
                        <div>
                            <button className="btn btn-sm btn-success mr-2" onClick={() => updateTask(task._id, task.completed)}>
                                {task.completed ? 'Undo' : 'Complete'}
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteTask(task._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        className="form-control"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Task Title"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addTask}>
                        Add Task
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default App;
'use client';

import {useEffect, useState} from 'react';
import { Task } from '@/models/task';
import { db } from '@/lib/firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
} from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function TodoApp() {
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);

    const tasksCollection = collection(db, 'tasks');

    useEffect(() => {
        const q = query(collection(db, 'tasks'), orderBy('title'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedTasks = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Task[];
            setTasks(updatedTasks);
        });

        return () => unsubscribe();
    }, []);

    const addTask = async () => {
        if (!newTask.trim()) return;

        const docRef = await addDoc(tasksCollection, {
            title: newTask.trim(),
            completed: false,
        });

        setTasks((prev) => [...prev, { id: docRef.id, title: newTask.trim(), completed: false }]);
        setNewTask('');
    };

    const toggleComplete = async (task: Task) => {
        if (!task.id) return;
        const docRef = doc(db, 'tasks', task.id);
        await updateDoc(docRef, { completed: !task.completed });
    };

    const deleteTask = async (id?: string) => {
        if (!id) return;
        const docRef = doc(db, 'tasks', id);
        await deleteDoc(docRef);
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <>
            <nav className="navbar bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand">Next.js To Do</a>
                    <div className="d-flex">
                        <input
                            type="text"
                            className="form-control me-1"
                            placeholder="Add a new task"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={addTask}>Create</button>
                    </div>
                </div>
            </nav>

            <div className="container-fluid mt-2">
                <ul className="list-group">
                    {tasks.map((task, i) => (
                        <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <input
                                    className="form-check-input me-2"
                                    id={`checkbox-${i}`}
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleComplete(task)}
                                />
                                <label
                                    className={`form-check-label ${task.completed ? 'completed' : ''}`}
                                    htmlFor={`checkbox-${i}`}
                                >
                                    {task.title}
                                </label>
                            </div>
                            <button className="btn" onClick={() => deleteTask(task.id)}>
                                <i className="bi bi-trash"></i>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

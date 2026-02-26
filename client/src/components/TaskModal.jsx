import React, { useState, useEffect } from 'react';
import { X, Loader2, ChevronDown } from 'lucide-react';
import api from '../api/client';

const TaskModal = ({ task, isOpen, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setStatus(task.status);
        } else {
            setTitle('');
            setDescription('');
            setStatus('pending');
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (task) {
                await api.put(`/tasks/${task._id}`, { title, description, status });
            } else {
                await api.post('/tasks', { title, description, status });
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        setLoading(true);
        try {
            await api.delete(`/tasks/${task._id}`);
            onSuccess();
            onClose();
        } catch (err) {
            setError('Failed to delete task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="bg-surface border border-border w-full max-w-lg relative rounded-2xl p-8 shadow-2xl animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-text-muted hover:text-text transition-colors p-1 hover:bg-white/5 rounded-lg"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold text-text mb-8 tracking-tight font-outfit">{task ? 'Edit Task' : 'New Task'}</h2>

                {error && (
                    <div className="bg-danger/10 border border-danger/50 text-danger p-4 rounded-xl mb-8 text-sm flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-danger" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-text-muted ml-1">Title</label>
                        <input
                            type="text"
                            placeholder="What needs to be done?"
                            className="input-field"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-text-muted ml-1">Description</label>
                        <textarea
                            rows="4"
                            placeholder="Add some context or details..."
                            className="input-field resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-text-muted ml-1">Status</label>
                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="input-field appearance-none cursor-pointer"
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        {task && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-6 py-3 rounded-xl font-bold text-danger hover:text-danger/80 hover:bg-danger/10 transition-all border border-transparent hover:border-danger/20"
                            >
                                Delete
                            </button>
                        )}
                        <button
                            type="submit"
                            className="btn-primary flex-1 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (task ? 'Save Changes' : 'Create Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;

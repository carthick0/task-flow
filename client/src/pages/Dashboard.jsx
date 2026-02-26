import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Plus, Search, Filter, ArrowLeft, ArrowRight, Clock, CheckCircle2, Circle } from 'lucide-react';
import TaskModal from '../components/TaskModal';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 6,
                search: search || undefined,
                status: status || undefined
            };
            const res = await api.get('/tasks', { params });
            setTasks(res.data.data);
            setTotalPages(Math.ceil(res.data.total / 6));
        } catch (err) {
            console.error('Failed to fetch tasks', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [page, status]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchTasks();
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleCreateTask = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="text-emerald-500" size={18} />;
            case 'in-progress': return <Clock className="text-amber-500" size={18} />;
            default: return <Circle className="text-slate-500" size={18} />;
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-outfit">My Tasks</h1>
                    <p className="text-text-muted">Manage your daily workflow effectively</p>
                </div>
                <button
                    onClick={handleCreateTask}
                    className="btn-primary flex items-center gap-2 self-start"
                >
                    <Plus size={20} />
                    New Task
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="input-field pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
                <div className="flex gap-4">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <select
                            className="input-field pl-10 min-w-[150px]"
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="glass-card h-48 animate-pulse bg-surface/50"></div>
                    ))}
                </div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-20 bg-surface/30 rounded-2xl border border-dashed border-border">
                    <p className="text-text-muted">No tasks found. Create one to get started!</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map(task => (
                            <div
                                key={task._id}
                                onClick={() => handleEditTask(task)}
                                className="glass-card hover:border-primary/50 transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${task.status === 'completed' ? 'bg-success/10 text-success' :
                                        task.status === 'in-progress' ? 'bg-pending/10 text-pending' :
                                            'bg-text-muted/10 text-text-muted'
                                        }`}>
                                        {task.status}
                                    </span>
                                    {getStatusIcon(task.status)}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors font-outfit">{task.title}</h3>
                                <p className="text-text-muted text-sm line-clamp-2 mb-4">{task.description}</p>
                                <div className="pt-4 border-t border-border text-[11px] text-text-muted flex justify-between">
                                    <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-12">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 border border-border rounded-lg disabled:opacity-30 hover:bg-surface transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <span className="text-sm font-medium">Page {page} of {totalPages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 border border-border rounded-lg disabled:opacity-30 hover:bg-surface transition-colors"
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}

            <TaskModal
                task={selectedTask}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchTasks}
            />
        </div>
    );
};

export default Dashboard;

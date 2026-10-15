import React, { useState } from 'react';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const suggestions = [
    { label: '🐈 Feline Health App', text: '🐈 Feline Health Web App with FastAPI' },
    { label: '📐 Vector Calculus Prep', text: '📐 Vector Calculus & Linear Algebra Study Prep' },
    { label: '🚀 SIH Hackathon Project', text: '🚀 SIH Hackathon Question Paper Generator' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return alert('Please enter a goal or select a suggestion chip!');

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error('Failed to generate plan from server');
      const data = await response.json();
      setPlan(data);
    } catch (err) {
      alert('Error connecting to backend API: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (taskId) => {
    if (!plan) return;
    const updatedPhases = plan.phases.map(phase => ({
      ...phase,
      tasks: phase.tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
    setPlan({ ...plan, phases: updatedPhases });
  };

  const calculateProgress = () => {
    if (!plan || !plan.phases) return 0;
    let total = 0, completed = 0;
    plan.phases.forEach(phase => {
      phase.tasks.forEach(task => {
        total++;
        if (task.completed) completed++;
      });
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const progressPercent = calculateProgress();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans antialiased">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">⛰️</span>
            <div>
              <h1 className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Zenith</h1>
              <p className="text-xs text-slate-400 font-medium">AI Student Co-Pilot & Master Planner</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🟢 Agents Ready</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Input Zone */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-semibold text-slate-200">What are we building or studying today?</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Build a Feline Health FastAPI app, Prepare for Vector Calculus..." 
              className="flex-1 bg-slate-950 border border-slate-700 focus:border-indigo-500 text-slate-100 placeholder-slate-500 px-4 py-3 rounded-xl outline-none transition"
            />
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <span>Generate Plan</span>
              {loading && <span className="animate-spin">⏳</span>}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Quick Try:</span>
            {suggestions.map((chip, idx) => (
              <button 
                key={idx}
                onClick={() => setPrompt(chip.text)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </section>

        {/* Dashboard Output */}
        {plan && (
          <section className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 rounded-2xl p-6 shadow-lg space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Active Plan</span>
                  <h3 className="text-2xl font-bold text-white mt-1">{plan.project_title}</h3>
                </div>
                <div className="flex items-center space-x-4 bg-slate-950/60 border border-slate-800 px-4 py-2 rounded-xl w-fit">
                  <span className="text-xs text-slate-400 font-medium">Est. Time:</span>
                  <span className="text-sm font-bold text-indigo-300">{plan.total_time_estimate}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Overall Completion</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plan.phases.map((phase) => (
                <div key={phase.phase_number} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-start">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <h4 className="font-bold text-slate-200 text-sm tracking-wide">Phase {phase.phase_number}: {phase.title}</h4>
                    <span className="text-xs text-slate-500 font-mono">{phase.tasks.length} tasks</span>
                  </div>

                  <div className="space-y-3">
                    {phase.tasks.map((task) => (
                      <div key={task.id} className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 p-4 rounded-xl space-y-3 transition">
                        <div className="flex items-start justify-between gap-2">
                          <label className="flex items-start space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={task.completed}
                              onChange={() => toggleTask(task.id)}
                              className="mt-1 w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span className={`font-semibold text-sm text-slate-100 ${task.completed ? 'line-through text-slate-500' : ''}`}>{task.title}</span>
                          </label>
                          <span className="text-[10px] font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 px-2 py-0.5 rounded-md whitespace-nowrap">⏳ {task.time_estimate}</span>
                        </div>
                        <p className="text-xs text-slate-400 pl-7 leading-relaxed">{task.description}</p>
                        <div className="pl-7">
                          <span className="inline-block text-[10px] font-mono bg-slate-900 text-emerald-400 border border-emerald-900/60 px-2 py-1 rounded-md">
                            📦 {task.deliverable}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
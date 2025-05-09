import { useState, useEffect } from 'react';
import { Check, Clock, Trash2, Edit2, Calendar, Filter, X } from 'lucide-react';

// Todo tipi
type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
};

// Ana bileşen
const TaskManager = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    return [
      {
        id: '1',
        text: 'Ödev',
        completed: false,
        createdAt: '2025-05-09T14:02:00',
        priority: 'medium'
      }
    ];
  });
  
  const [newTodoText, setNewTodoText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [dueDateInput, setDueDateInput] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Todos değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Yeni görev ekleme
  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: newTodoText,
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: dueDateInput || undefined,
        priority
      };
      setTodos([...todos, newTodo]);
      setNewTodoText('');
      setDueDateInput('');
      setPriority('medium');
    }
  };

  // Görev tamamlama/tamamlamama
  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Görev silme
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Görev düzenlemeye başlama
  const startEditing = (todo: Todo) => {
    setEditingTodo(todo.id);
    setEditText(todo.text);
    setDueDateInput(todo.dueDate || '');
    setPriority(todo.priority || 'medium');
  };

  // Görev düzenlemeyi kaydetme
  const saveEdit = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { 
          ...todo, 
          text: editText,
          dueDate: dueDateInput || undefined,
          priority 
        } : todo
      )
    );
    setEditingTodo(null);
  };

  // Filtreleme
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // İstatistikler
  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  // Tarih formatlama
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('tr-TR', { month: 'short' })} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Öncelik renk sınıfı
  const getPriorityColorClass = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-4 text-white flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center">
          <Check className="mr-2" size={24} />
          Task Manager
        </h1>
        <div className="relative">
          <button 
            className="flex items-center text-white bg-white bg-opacity-20 px-2 py-1 rounded-md"
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
          >
            <Filter size={16} className="mr-1" />
            {filter === 'all' ? 'Tümü' : filter === 'active' ? 'Aktif' : 'Tamamlanan'}
          </button>
          
          {isFilterMenuOpen && (
            <div className="absolute right-0 mt-1 bg-white text-gray-800 rounded-md shadow-lg z-10">
              <button 
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => { setFilter('all'); setIsFilterMenuOpen(false); }}
              >
                Tümü
              </button>
              <button 
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => { setFilter('active'); setIsFilterMenuOpen(false); }}
              >
                Aktif
              </button>
              <button 
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => { setFilter('completed'); setIsFilterMenuOpen(false); }}
              >
                Tamamlanan
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-1 border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Yeni görev ekle..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-r-md"
            onClick={addTodo}
          >
            Ekle
          </button>
        </div>

        <div className="flex space-x-2 mb-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Son Tarih</label>
            <input
              type="date"
              className="w-full border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              value={dueDateInput}
              onChange={(e) => setDueDateInput(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Öncelik</label>
            <select
              className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
            >
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
            </select>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 flex justify-between mb-2">
          <span>{todos.length} görev</span>
          <span>{completedCount} tamamlandı, {activeCount} kaldı</span>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredTodos.map(todo => (
            <div 
              key={todo.id} 
              className={`border rounded-md p-3 ${todo.completed ? 'bg-gray-50' : 'bg-white'}`}
            >
              {editingTodo === todo.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      className="flex-1 border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={dueDateInput}
                      onChange={(e) => setDueDateInput(e.target.value)}
                    />
                    <select
                      className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                    >
                      <option value="low">Düşük</option>
                      <option value="medium">Orta</option>
                      <option value="high">Yüksek</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setEditingTodo(null)}
                    >
                      <X size={16} />
                    </button>
                    <button
                      className="text-teal-500 hover:text-teal-700"
                      onClick={() => saveEdit(todo.id)}
                    >
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="h-5 w-5 text-teal-500 rounded focus:ring-teal-400"
                    />
                    <span className={`ml-2 flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                      {todo.text}
                    </span>
                    <span className={`text-xs mr-2 ${getPriorityColorClass(todo.priority)}`}>
                      {todo.priority === 'high' ? 'Yüksek' : todo.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                    <button
                      className="text-gray-400 hover:text-blue-500 mr-1"
                      onClick={() => startEditing(todo)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex space-x-4">
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {formatDate(todo.createdAt)}
                    </span>
                    {todo.dueDate && (
                      <span className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {new Date(todo.dueDate).toLocaleDateString('tr-TR')}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {filteredTodos.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              Görev bulunamadı
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 text-center text-xs text-gray-500">
        © 2025 Task Manager Uygulaması
      </div>
    </div>
  );
};

export default TaskManager;
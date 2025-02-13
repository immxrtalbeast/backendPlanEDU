import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../compnents/Header';
import Message from '../compnents/Message';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { topic } = location.state || {};
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
  
    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]); // Добавляем сообщение пользователя
    setInputMessage('');
    setIsLoading(true);
  
    const eventSource = new EventSource(`http://localhost:8000/chat-stream/?message=${encodeURIComponent(inputMessage)}`);
  
    // Создаем переменную для накопления ответа
    let accumulatedResponse = '';
  
    eventSource.onmessage = (event) => {
      accumulatedResponse += event.data;  // Добавляем каждый чанк к накопленному ответу
      setIsLoading(false);
      setMessages(prev => {
        // Проверяем, есть ли последнее сообщение от ассистента
        const lastMessage = prev[prev.length - 1];
        
        // Если последнее сообщение — от ассистента, обновляем его
        if (lastMessage.role === 'assistant') {
          return [
            ...prev.slice(0, -1),  // Убираем последнее сообщение
            { ...lastMessage, content: accumulatedResponse },  // Обновляем контент
          ];
        } else {
          // Если последнее сообщение от пользователя, добавляем новое сообщение от ассистента
          return [
            ...prev,
            { role: 'assistant', content: accumulatedResponse },
          ];
        }
      });
  
      scrollToBottom();  // Скроллим в конец чата
    };
  
    eventSource.onerror = (error) => {
      console.error('Error:', error);
      setIsLoading(false);
      eventSource.close();  // Закрытие соединения при ошибке
    };
  
    eventSource.onopen = () => {
      setIsLoading(true);
    };

    // Закрытие соединения при завершении
    eventSource.onclose = () => {
      console.log('Соединение закрыто.');
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Чат по теме: {topic}
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                  }`}
                >
                  <Message content={message.content} />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-gray-800 dark:text-white">
                  Печатает...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="border-t dark:border-gray-700 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Введите сообщение..."
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Отправить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

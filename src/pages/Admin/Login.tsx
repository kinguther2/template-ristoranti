import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const { login } = useAdmin();
  const { t } = useLanguage();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Login component mounted');
    // Verificare che l'ambiente sia corretto
    const apiUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000/api' 
      : 'https://template-ristoranti.onrender.com/api';
    console.log('Current API URL:', apiUrl);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Small delay to simulate loading
    setTimeout(() => {
      const success = login(username, password);
      setIsLoading(false);
      
      if (success) {
        toast.success('Login effettuato con successo!');
      } else {
        toast.error('Credenziali non valide. Riprova.');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-primary px-6 py-8 text-center">
          <h1 className="text-2xl font-serif font-bold text-primary-foreground">
            {t('admin.title')}
          </h1>
        </div>
        
        <div className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.username')}
              </label>
              <input
                id="username"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.password')}
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div>
              <button
                type="submit"
                className={`w-full btn btn-primary py-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : t('admin.login')}
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>Demo credentials:</p>
              <p>Username: admin</p>
              <p>Password: password123</p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

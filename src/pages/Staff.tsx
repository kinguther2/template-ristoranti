import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';

const Staff: React.FC = () => {
  const { language } = useLanguage();
  const { siteContent } = useAdmin();
  const { title, subtitle, team } = siteContent.pages.staff;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {language === 'it' ? title.it : title.en}
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {language === 'it' ? subtitle.it : subtitle.en}
        </motion.p>
      </div>
      
      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((member, index) => (
          <motion.div
            key={member.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="h-64 overflow-hidden">
              <img 
                src={member.image || "/placeholder.svg"} 
                alt={member.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl font-medium">{member.name}</h3>
              <p className="text-primary font-medium mb-3">
                {language === 'it' ? member.role.it : member.role.en}
              </p>
              <p className="text-gray-600">
                {language === 'it' ? member.bio.it : member.bio.en}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Staff;

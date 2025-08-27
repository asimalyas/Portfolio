
import React from 'react';
import { motion } from 'framer-motion';
import GlowCard from './GlowCard';
import { Award, LineChart } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CompetitiveStats: React.FC = () => {
  // Dummy data for charts
  const leetcodeData = [
    { month: 'Jan', rating: 1400 },
    { month: 'Feb', rating: 1450 },
    { month: 'Mar', rating: 1500 },
    { month: 'Apr', rating: 1480 },
    { month: 'May', rating: 1550 },
    { month: 'Jun', rating: 1600 },
    { month: 'Jul', rating: 1650 },
    { month: 'Aug', rating: 1700 },
  ];
  
  const codeforcesData = [
    { month: 'Jan', rating: 1700 },
    { month: 'Feb', rating: 1750 },
    { month: 'Mar', rating: 1800 },
    { month: 'Apr', rating: 1850 },
    { month: 'May', rating: 1900 },
    { month: 'Jun', rating: 1870 },
    { month: 'Jul', rating: 1950 },
    { month: 'Aug', rating: 2000 },
  ];
  
  const codechefData = [
    { month: 'Jan', rating: 1600 },
    { month: 'Feb', rating: 1650 },
    { month: 'Mar', rating: 1680 },
    { month: 'Apr', rating: 1750 },
    { month: 'May', rating: 1800 },
    { month: 'Jun', rating: 1850 },
    { month: 'Jul', rating: 1840 },
    { month: 'Aug', rating: 1900 },
  ];

  const platformsWithInfo = [
    {
      name: "LeetCode",
      icon: <Award className="w-6 h-6 text-[#FFA116]" />,
      color: '#FFA116',
      username: 'johndoe',
      url: 'https://leetcode.com/johndoe/',
      rating: "1700",
      data: leetcodeData,
      problems: "350 problems solved"
    },
    {
      name: "Codeforces",
      icon: <LineChart className="w-6 h-6 text-[#318CE7]" />,
      color: '#318CE7',
      username: 'johndoe',
      url: 'https://codeforces.com/profile/johndoe',
      rating: "2000",
      data: codeforcesData,
      problems: "Highest: 2000"
    },
    {
      name: "CodeChef",
      icon: <Award className="w-6 h-6 text-[#9C7A2E]" />,
      color: '#9C7A2E',
      username: 'johndoe',
      url: 'https://www.codechef.com/users/johndoe',
      rating: "1900",
      data: codechefData,
      problems: "Best Rank: 150"
    }
  ];

  const renderChart = (data: typeof leetcodeData, color: string) => {
    return (
      <ResponsiveContainer width="100%" height={150}>
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
          <XAxis dataKey="month" stroke="#666666" tick={{ fill: '#666666', fontSize: 10 }} />
          <YAxis stroke="#666666" tick={{ fill: '#666666', fontSize: 10 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333333', borderRadius: '4px', boxShadow: '0 0 20px rgba(255, 255, 255, 0.15)' }} 
            labelStyle={{ color: 'white' }} 
          />
          <Line 
            type="monotone" 
            dataKey="rating" 
            stroke={color} 
            strokeWidth={3} 
            dot={{ r: 3, fill: color, strokeWidth: 2, stroke: "#ffffff" }} 
            activeDot={{ r: 6, fill: color, stroke: 'white', strokeWidth: 2 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <section className="py-20 px-4 relative">
      {/* Premium lighting effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-corner-light-premium opacity-30 z-0"></div>
      
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="section-heading-premium"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Competitive Programming Stats
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platformsWithInfo.map((platform, index) => (
            <GlowCard 
              key={platform.name} 
              delayIndex={index} 
              intensity="high"
              className="comp-card"
            >
              <div className="p-6">
                <div className="flex items-center mb-3">
                  {platform.icon}
                  <h3 className="text-xl font-bold italic ml-2">{platform.name}</h3>
                </div>
                <div className="flex justify-between items-baseline mb-4">
                  <p className="text-white/80">
                    <a href={platform.url} target="_blank" rel="noopener noreferrer" className="underline-link">
                      @{platform.username}
                    </a>
                  </p>
                  <p className="text-lg font-semibold" style={{color: platform.color}}>{platform.rating}</p>
                </div>
                <div className="mb-3 h-[150px]">
                  {renderChart(platform.data, platform.color)}
                </div>
                <p className="text-sm text-white/60 text-center mt-4">{platform.problems}</p>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompetitiveStats;

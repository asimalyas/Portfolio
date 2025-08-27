import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  url: string;
  date: string;
}

const BlogSection: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "How I solved 300+ LeetCode problems in 3 months",
      url: "#",
      date: "March 15, 2023"
    },
    {
      id: 2,
      title: "10 SaaS UI Patterns You Should Steal Today",
      url: "#",
      date: "February 22, 2023"
    },
    {
      id: 3,
      title: "My journey from a 2⭐ to 5⭐ coder on CodeChef",
      url: "#",
      date: "January 10, 2023"
    },
    {
      id: 4,
      title: "Building a real-time collaborative editor with WebSockets",
      url: "#",
      date: "December 5, 2022"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Sharing stories & threads from my coding journey.
        </motion.h2>
        
        <div className="space-y-6">
          {blogPosts.map((post, index) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <a 
                href={post.url}
                className="block glow-card p-6 hover:border-white/40 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <h3 className="text-lg font-medium group-hover:underline decoration-white/30 underline-offset-4">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-white/60">{post.date}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

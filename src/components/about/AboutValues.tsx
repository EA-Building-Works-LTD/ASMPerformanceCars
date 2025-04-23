"use client";

import React from 'react';
import { Heart, Award, Shield, CheckCircle, Users, Star, Zap, Briefcase, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Value {
  title: string;
  description: string;
  icon?: string;
}

interface AboutValuesProps {
  title: string;
  subtitle?: string;
  values: Value[];
  backgroundColor?: string;
}

export default function AboutValues({
  title,
  subtitle,
  values,
  backgroundColor = 'bg-gray-100',
}: AboutValuesProps) {
  // Function to render the appropriate icon
  const renderIcon = (iconName: string = '') => {
    switch (iconName.toLowerCase()) {
      case 'heart':
        return <Heart className="h-8 w-8 text-red-600" />;
      case 'award':
        return <Award className="h-8 w-8 text-red-600" />;
      case 'shield':
        return <Shield className="h-8 w-8 text-red-600" />;
      case 'check-circle':
        return <CheckCircle className="h-8 w-8 text-red-600" />;
      case 'users':
        return <Users className="h-8 w-8 text-red-600" />;
      case 'star':
        return <Star className="h-8 w-8 text-red-600" />;
      case 'zap':
        return <Zap className="h-8 w-8 text-red-600" />;
      case 'briefcase':
        return <Briefcase className="h-8 w-8 text-red-600" />;
      case 'eye':
        return <Eye className="h-8 w-8 text-red-600" />;
      default:
        return <Star className="h-8 w-8 text-red-600" />;
    }
  };

  return (
    <section className={cn('py-16 dark:bg-zinc-900', backgroundColor)}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-zinc-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-zinc-600 dark:text-zinc-300">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md"
            >
              <div className="mb-4">
                {renderIcon(value.icon)}
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">{value.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 
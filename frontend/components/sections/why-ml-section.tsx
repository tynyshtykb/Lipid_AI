'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Brain, GitBranch, Database, Zap } from 'lucide-react';

const features = [
  {
    icon: GitBranch,
    title: 'Beyond Fixed Assumptions',
    description: 'Classical formulas rely on fixed mathematical assumptions that may not hold across all patient profiles.',
  },
  {
    icon: Brain,
    title: 'Nonlinear Pattern Recognition',
    description: 'Lipid relationships can become nonlinear in complex or high-TG cases. ML captures these patterns from data.',
  },
  {
    icon: Database,
    title: 'Data-Driven Learning',
    description: 'LipidAI learns from real lipid profiles, adapting its behavior based on patterns observed in clinical data.',
  },
  {
    icon: Zap,
    title: 'Adaptive Estimation',
    description: 'The model adjusts its corrections dynamically, providing more adaptive estimates in difficult cases.',
  },
];

export function WhyMLSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - explanation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Brain className="w-4 h-4" />
                The ML Advantage
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Machine Learning Matters
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Understanding the fundamental difference between formula-based estimation 
                and machine learning approaches in lipid analysis.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="p-6 rounded-2xl bg-card border-l-4 border-l-chart-2">
                <h4 className="font-semibold text-foreground mb-2">Traditional Formulas</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Friedewald, Martin, and Sampson formulas use fixed mathematical relationships 
                  derived from population studies. While effective in normal ranges, they may 
                  struggle with atypical lipid profiles.
                </p>
              </Card>

              <Card className="p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-l-primary">
                <h4 className="font-semibold text-primary mb-2">LipidAI Approach</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Machine learning models learn complex, nonlinear relationships directly from 
                  data. LipidAI can capture patterns that fixed formulas cannot express, 
                  providing more adaptive estimates across diverse patient profiles.
                </p>
              </Card>
            </div>
          </motion.div>

          {/* Right side - feature cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card className="h-full p-6 rounded-2xl bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

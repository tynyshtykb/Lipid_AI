'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, FlaskConical, Brain } from 'lucide-react';

const methods = [
  {
    name: 'Friedewald',
    icon: Calculator,
    description: 'Simple, widely used formula',
    limitation: 'Assumes fixed TG/VLDL relationship',
    type: 'formula',
  },
  {
    name: 'Martin',
    icon: TrendingUp,
    description: 'Improved adaptiveness with adjustable factors',
    limitation: 'Still relies on formula-based assumptions',
    type: 'formula',
  },
  {
    name: 'Sampson',
    icon: FlaskConical,
    description: 'More advanced mathematical formulation',
    limitation: 'Limited by handcrafted parameters',
    type: 'formula',
  },
  {
    name: 'LipidAI',
    icon: Brain,
    description: 'Machine learning model trained on real lipid data',
    limitation: 'Learns nonlinear patterns adaptively',
    type: 'ml',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function ProblemSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Problem with Traditional Formulas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding why LDL estimation becomes challenging at elevated triglyceride levels
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {methods.map((method) => (
            <motion.div key={method.name} variants={itemVariants}>
              <Card 
                className={`h-full p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  method.type === 'ml' 
                    ? 'bg-gradient-to-br from-primary/10 via-card to-card border-primary/30 shadow-lg shadow-primary/10' 
                    : 'bg-card hover:shadow-md'
                }`}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    method.type === 'ml' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    <method.icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold mb-2 ${
                      method.type === 'ml' ? 'text-primary' : 'text-foreground'
                    }`}>
                      {method.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {method.description}
                    </p>
                  </div>

                  <div className={`pt-4 border-t ${method.type === 'ml' ? 'border-primary/20' : 'border-border'}`}>
                    <p className={`text-sm ${
                      method.type === 'ml' 
                        ? 'text-primary font-medium' 
                        : 'text-muted-foreground'
                    }`}>
                      {method.type === 'ml' ? '✓ ' : '• '}
                      {method.limitation}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quote highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Card className="inline-block px-8 py-6 bg-card border-l-4 border-l-primary rounded-xl shadow-md">
            <p className="text-lg md:text-xl text-foreground italic">
              {"\"Formula-based estimation becomes more fragile as triglyceride concentration rises.\""}
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

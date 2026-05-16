'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Heart, Shield, Activity, Stethoscope } from 'lucide-react';

const clinicalPoints = [
  {
    icon: Heart,
    title: 'Cardiovascular Risk Assessment',
    description: 'Accurate LDL estimation is crucial for evaluating cardiovascular disease risk and determining appropriate intervention strategies.',
  },
  {
    icon: Shield,
    title: 'Treatment Decisions',
    description: 'LDL levels guide statin therapy initiation and dosing decisions, making accurate estimation clinically important.',
  },
  {
    icon: Activity,
    title: 'Prevention Strategies',
    description: 'Reliable LDL monitoring supports primary and secondary prevention efforts in at-risk patient populations.',
  },
  {
    icon: Stethoscope,
    title: 'Lipid Disorder Management',
    description: 'Patients with dyslipidemia require accurate LDL assessment for optimal therapeutic management.',
  },
];

export function ClinicalSection() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            Clinical Relevance
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Accurate LDL Matters
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding the practical importance of reliable LDL cholesterol estimation in clinical practice
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {clinicalPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full p-6 rounded-2xl bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <point.icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-3 text-lg">{point.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <Card className="p-8 rounded-3xl bg-gradient-to-r from-primary/5 via-card to-primary/5 border-primary/10">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                The Challenge of High Triglycerides
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Patients with elevated triglycerides, including those with metabolic syndrome, 
                diabetes, or obesity, often present the greatest challenge for accurate LDL estimation. 
                Traditional formulas may underestimate or overestimate LDL in these populations, 
                potentially affecting clinical decision-making. LipidAI aims to provide more 
                reliable estimates in these challenging cases.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

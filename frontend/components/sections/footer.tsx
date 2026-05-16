'use client';

import { motion } from 'framer-motion';
import { Brain, AlertTriangle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-16 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Logo and description */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">
                Lipid<span className="text-primary">AI</span>
              </span>
            </div>
            
            <p className="text-background/60 text-sm max-w-md">
              Machine learning approach for LDL cholesterol estimation, designed to better model 
              nonlinear lipid relationships at elevated triglyceride levels.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-background/10" />

          {/* Disclaimer */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-background/5 border border-background/10">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-background/70 leading-relaxed">
              <p className="font-medium text-background/90 mb-1">Educational & Research Prototype</p>
              <p>
                This tool is intended for educational and research purposes only. It is not a medical device 
                and should not be used for clinical diagnosis or treatment decisions. Always consult with 
                qualified healthcare professionals for medical advice.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
            <p className="text-sm text-background/50">
              © {new Date().getFullYear()} LipidAI Project. Scientific prototype.
            </p>
            
            <div className="flex items-center gap-6 text-sm text-background/50">
              <span>Research Team</span>
              <span className="hidden sm:inline">•</span>
              <span>Contact</span>
              <span className="hidden sm:inline">•</span>
              <span>Documentation</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Activity, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToExplorer = () => {
    document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                           linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Machine Learning Powered
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
                Lipid<span className="text-primary">AI</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
                Machine learning approach for LDL cholesterol estimation
              </p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Traditional LDL estimation formulas may become less reliable at elevated triglyceride levels. 
              LipidAI is designed to better model nonlinear lipid relationships, providing more adaptive 
              estimates across complex lipid profiles.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                onClick={scrollToCalculator}
                className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Try the Calculator
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={scrollToExplorer}
                className="px-8 py-6 text-lg rounded-xl border-2 hover:bg-secondary transition-all"
              >
                Explore TG Sensitivity
              </Button>
            </div>
          </motion.div>

          {/* Right content - Mini chart preview card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl rounded-3xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Formula Divergence Preview</h3>
                  <Activity className="w-5 h-5 text-primary" />
                </div>

                {/* Mini chart visualization */}
                <div className="relative h-48 bg-secondary/30 rounded-2xl p-4 overflow-hidden">
                  {/* Axes */}
                  <div className="absolute bottom-4 left-4 right-4 h-px bg-border" />
                  <div className="absolute bottom-4 left-4 top-4 w-px bg-border" />
                  
                  {/* Chart lines */}
                  <svg className="absolute inset-4" viewBox="0 0 200 120" preserveAspectRatio="none">
                    {/* Friedewald - diverges most */}
                    <path
                      d="M 0 80 Q 50 75 100 50 T 200 10"
                      fill="none"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="opacity-60"
                    />
                    {/* Martin */}
                    <path
                      d="M 0 80 Q 50 72 100 55 T 200 25"
                      fill="none"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="opacity-60"
                    />
                    {/* Sampson */}
                    <path
                      d="M 0 80 Q 50 70 100 58 T 200 35"
                      fill="none"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="opacity-60"
                    />
                    {/* LipidAI - most stable */}
                    <path
                      d="M 0 80 Q 50 68 100 60 T 200 50"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      className="drop-shadow-sm"
                    />
                  </svg>

                  {/* Labels */}
                  <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[10px] text-muted-foreground">
                    <span>Low TG</span>
                    <span>High TG</span>
                  </div>
                  <div className="absolute top-4 left-1 text-[10px] text-muted-foreground -rotate-90 origin-left translate-y-12">
                    LDL
                  </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="font-medium text-foreground">LipidAI</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-3 h-0.5 bg-chart-2" />
                    <span>Traditional</span>
                  </div>
                </div>

                {/* Key insight */}
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    As triglyceride levels increase, traditional formulas diverge while LipidAI 
                    maintains adaptive estimation.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

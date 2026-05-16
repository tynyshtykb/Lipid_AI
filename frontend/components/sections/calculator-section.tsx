'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, RotateCcw, Sparkles, Activity, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { presetProfiles, calculateLDLEstimates, getTGStatus, getLDLCategory } from '@/lib/lipid-data';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

interface LipidResults {
  friedewald: number;
  martin: number;
  sampson: number;
  lipidai: number;
  tgStatus: { status: string; color: string; description: string };
  ldlCategory: { category: string; color: string };
  tg: number;
  tc: number;
  hdl: number;
  age: number;
}

export function CalculatorSection() {
  const [formData, setFormData] = useState({
    tc: '',
    hdl: '',
    tg: '',
    age: '',
  });
  const [results, setResults] = useState<LipidResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreset = (preset: typeof presetProfiles[0]) => {
    setFormData({
      tc: preset.tc.toString(),
      hdl: preset.hdl.toString(),
      tg: preset.tg.toString(),
      age: preset.age.toString(),
    });
  };

  const handleReset = () => {
    setFormData({ tc: '', hdl: '', tg: '', age: '' });
    setResults(null);
  };

  const handleCalculate = async () => {
    const tc = parseFloat(formData.tc);
    const hdl = parseFloat(formData.hdl);
    const tg = parseFloat(formData.tg);
    const age = parseFloat(formData.age);

    if (isNaN(tc) || isNaN(hdl) || isNaN(tg) || isNaN(age)) {
      return;
    }

    setIsCalculating(true);
    
    try {
      const response = await fetch('https://Tynyshtyk-Lipid_AI.hf.space/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TC: tc,
          HDL_C: hdl,
          TG: tg,
          Age: age,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const estimates = {
        friedewald: data.friedewald,
        martin: data.martin,
        sampson: data.sampson,
        lipidai: data.lipidai,
      };
      const tgStatus = getTGStatus(tg);
      const ldlCategory = getLDLCategory(data.lipidai);

      setResults({
        ...estimates,
        tgStatus,
        ldlCategory,
        tg,
        tc,
        hdl,
        age,
      });
    } catch (error) {
      console.error('Backend error, falling back to local calculation:', error);
      // Fallback to local calculation
      const estimates = calculateLDLEstimates(tc, hdl, tg, age);
      const tgStatus = getTGStatus(tg);
      const ldlCategory = getLDLCategory(estimates.lipidai);

      setResults({
        ...estimates,
        tgStatus,
        ldlCategory,
        tg,
        tc,
        hdl,
        age,
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const isFormValid = formData.tc && formData.hdl && formData.tg && formData.age;

  return (
    <section id="calculator" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            Interactive Calculator
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            LDL Cholesterol Estimator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your lipid values to compare estimates across different methods
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 rounded-3xl shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Enter Lipid Values</h3>
                    <p className="text-sm text-muted-foreground">All values in mg/dL</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tc" className="text-foreground font-medium">
                      Total Cholesterol (TC)
                    </Label>
                    <Input
                      id="tc"
                      type="number"
                      placeholder="e.g., 200"
                      value={formData.tc}
                      onChange={(e) => handleInputChange('tc', e.target.value)}
                      className="h-12 rounded-xl bg-secondary/50 border-border focus:border-primary transition-colors"
                    />
                    <p className="text-xs text-muted-foreground">Normal: 125-200 mg/dL</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hdl" className="text-foreground font-medium">
                      HDL Cholesterol
                    </Label>
                    <Input
                      id="hdl"
                      type="number"
                      placeholder="e.g., 50"
                      value={formData.hdl}
                      onChange={(e) => handleInputChange('hdl', e.target.value)}
                      className="h-12 rounded-xl bg-secondary/50 border-border focus:border-primary transition-colors"
                    />
                    <p className="text-xs text-muted-foreground">Optimal: {'>'}60 mg/dL</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tg" className="text-foreground font-medium">
                      Triglycerides (TG)
                    </Label>
                    <Input
                      id="tg"
                      type="number"
                      placeholder="e.g., 150"
                      value={formData.tg}
                      onChange={(e) => handleInputChange('tg', e.target.value)}
                      className="h-12 rounded-xl bg-secondary/50 border-border focus:border-primary transition-colors"
                    />
                    <p className="text-xs text-muted-foreground">Normal: {'<'}150 mg/dL</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-foreground font-medium">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="e.g., 45"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="h-12 rounded-xl bg-secondary/50 border-border focus:border-primary transition-colors"
                    />
                    <p className="text-xs text-muted-foreground">Years</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <Button
                    onClick={handleCalculate}
                    disabled={!isFormValid || isCalculating}
                    className="flex-1 sm:flex-none h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                  >
                    {isCalculating ? (
                      <>
                        <span className="animate-spin mr-2">
                          <Sparkles className="w-5 h-5" />
                        </span>
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Predict LDL
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="h-12 px-6 rounded-xl border-2"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* Preset buttons */}
                <div className="pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">Quick presets:</p>
                  <div className="flex flex-wrap gap-2">
                    {presetProfiles.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="secondary"
                        size="sm"
                        onClick={() => handlePreset(preset)}
                        className="rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Results Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {results ? (
                <ResultsDashboard results={results} />
              ) : (
                <Card className="p-8 rounded-3xl shadow-lg bg-secondary/20 border-dashed border-2 border-border">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                      <Calculator className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Results will appear here</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                      Enter your lipid values and click Predict LDL to see comparisons across all methods
                    </p>
                  </div>
                </Card>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ResultsDashboard({ results }: { results: LipidResults }) {
  const methods = [
    { name: 'Friedewald', value: results.friedewald, featured: false },
    { name: 'Martin', value: results.martin, featured: false },
    { name: 'Sampson', value: results.sampson, featured: false },
    { name: 'LipidAI', value: results.lipidai, featured: true },
  ];

  const getInterpretation = (tg: number) => {
    if (tg < 150) {
      return {
        icon: CheckCircle2,
        text: 'At this TG level, traditional formulas remain relatively close to each other.',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
      };
    } else if (tg < 200) {
      return {
        icon: AlertCircle,
        text: 'Formula estimates begin to diverge slightly as TG enters the borderline range.',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
      };
    } else {
      return {
        icon: AlertCircle,
        text: 'At elevated TG levels, LipidAI may provide a more adaptive estimate than fixed formulas.',
        color: 'text-primary',
        bg: 'bg-primary/5',
        border: 'border-primary/20',
      };
    }
  };

  const interpretation = getInterpretation(results.tg);

  const handleDownloadReport = async () => {
    try {
      const doc = new Document({
        creator: "LipidAI",
        title: "LipidAI LDL Cholesterol Report",
        description: "Advanced estimation of LDL-C using machine learning",
        sections: [
          {
            properties: {},
            children: [
              // Header
              new Paragraph({
                children: [
                  new TextRun({ text: "LIPIDAI CLINICAL REPORT", bold: true, size: 36, color: "0F172A" }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
              }),
              new Paragraph({
                text: `Date Generated: ${new Date().toLocaleString()}`,
                alignment: AlignmentType.CENTER,
                spacing: { after: 600 },
              }),
              
              // Introduction
              new Paragraph({
                text: "Overview",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 },
              }),
              new Paragraph({
                text: "This document contains an advanced estimation of Low-Density Lipoprotein Cholesterol (LDL-C) using the LipidAI machine learning model, compared against traditional clinical formulas including Friedewald, Martin/Hopkins, and Sampson algorithms.",
                spacing: { after: 400 },
              }),

              // 1. Inputs
              new Paragraph({
                text: "1. Patient Lipid Panel (Input Values)",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({ children: [new TextRun({ text: "• Age: ", bold: true }), new TextRun(`${results.age} years`)] }),
              new Paragraph({ children: [new TextRun({ text: "• Total Cholesterol (TC): ", bold: true }), new TextRun(`${results.tc} mg/dL`)] }),
              new Paragraph({ children: [new TextRun({ text: "• High-Density Lipoprotein (HDL-C): ", bold: true }), new TextRun(`${results.hdl} mg/dL`)] }),
              new Paragraph({ children: [new TextRun({ text: "• Triglycerides (TG): ", bold: true }), new TextRun(`${results.tg} mg/dL`)], spacing: { after: 400 } }),

              // 2. Results
              new Paragraph({
                text: "2. LDL-C Estimations",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "LipidAI Model: ", bold: true, size: 28 }),
                  new TextRun({ text: `${results.lipidai.toFixed(2)} mg/dL`, bold: true, size: 28, color: "0055A4" }) // Blue highlight
                ],
                spacing: { after: 200 }
              }),
              new Paragraph({ children: [new TextRun({ text: "Friedewald Formula: ", bold: true }), new TextRun(`${results.friedewald.toFixed(2)} mg/dL`)] }),
              new Paragraph({ children: [new TextRun({ text: "Martin/Hopkins Formula: ", bold: true }), new TextRun(`${results.martin.toFixed(2)} mg/dL`)] }),
              new Paragraph({ children: [new TextRun({ text: "Sampson Formula: ", bold: true }), new TextRun(`${results.sampson.toFixed(2)} mg/dL`)], spacing: { after: 400 } }),

              // 3. Clinical Interpretation
              new Paragraph({
                text: "3. Clinical Status",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({ children: [new TextRun({ text: "LDL-C Category (Based on LipidAI): ", bold: true }), new TextRun(`${results.ldlCategory.category}`)] }),
              new Paragraph({ children: [new TextRun({ text: "Triglycerides Range Status: ", bold: true }), new TextRun(`${results.tgStatus.status}`)] }),
              new Paragraph({
                children: [
                  new TextRun({ text: "\nClinical Note: ", bold: true }),
                  new TextRun(interpretation.text)
                ],
                spacing: { after: 600 }
              }),

              // Divider
              new Paragraph({
                text: "____________________________________________________________________________________",
                alignment: AlignmentType.CENTER,
                spacing: { before: 800, after: 400 },
              }),

              // 4. Disclaimer Footer
              new Paragraph({
                children: [
                  new TextRun({ text: "DISCLAIMER: ", bold: true, size: 16 }),
                  new TextRun({ text: "This report is generated by the LipidAI application for informational and educational purposes only. The estimations provided are not a substitute for standard direct laboratory measurement, professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider regarding medical conditions and before making clinical decisions.", size: 16 })
                ],
                alignment: AlignmentType.JUSTIFIED,
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LipidAI_Clinical_Report_${new Date().toISOString().split('T')[0]}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Result cards */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h3 className="text-xl font-semibold text-foreground">Results Summary</h3>
        <Button onClick={handleDownloadReport} variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/5">
          <Download className="w-4 h-4" />
          Download Report (Docx)
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {methods.map((method, index) => (
          <motion.div
            key={method.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={`p-5 rounded-2xl transition-all ${
                method.featured
                  ? 'bg-gradient-to-br from-primary/10 via-card to-primary/5 border-primary/40 shadow-xl shadow-primary/10 animate-pulse-glow'
                  : 'bg-card hover:shadow-md'
              }`}
            >
              <p className={`text-sm font-medium mb-2 ${method.featured ? 'text-primary' : 'text-muted-foreground'}`}>
                {method.name}
              </p>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-bold ${method.featured ? 'text-primary' : 'text-foreground'}`}>
                  {method.value}
                </span>
                <span className="text-sm text-muted-foreground">mg/dL</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Status badges */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 rounded-xl bg-secondary/30">
          <p className="text-xs text-muted-foreground mb-1">TG Status</p>
          <p className={`font-semibold ${results.tgStatus.color}`}>
            {results.tgStatus.status}
          </p>
        </Card>
        <Card className="p-4 rounded-xl bg-secondary/30">
          <p className="text-xs text-muted-foreground mb-1">LDL Category</p>
          <p className={`font-semibold ${results.ldlCategory.color}`}>
            {results.ldlCategory.category}
          </p>
        </Card>
      </div>

      {/* Interpretation box */}
      <Card className={`p-5 rounded-xl ${interpretation.bg} border ${interpretation.border}`}>
        <div className="flex items-start gap-3">
          <interpretation.icon className={`w-5 h-5 mt-0.5 shrink-0 ${interpretation.color}`} />
          <p className={`text-sm leading-relaxed ${interpretation.color}`}>
            {interpretation.text}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

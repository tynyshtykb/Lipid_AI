'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { Beaker, TrendingUp, Lightbulb } from 'lucide-react';
import { tgPresets, getTGStatus, getInsightText } from '@/lib/lipid-data';
import tgSimulationData from '@/lib/tg-simulation.json';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';

// Chart colors matching the theme
const CHART_COLORS = {
  primary: '#0891b2', // cyan-600 - LipidAI
  realData: '#ef4444', // red-500 - Real LDL from dataset
  friedewald: '#7c3aed', // violet-600
  martin: '#f59e0b', // amber-500
  sampson: '#22c55e', // green-500
  grid: '#e5e7eb', // gray-200
  muted: '#6b7280', // gray-500
};

export function TGExplorerSection() {
  const [currentTG, setCurrentTG] = useState(150);

  const tgStatus = getTGStatus(currentTG);
  const insight = getInsightText(currentTG);

  // Find the current point in tg_simulation data
  const currentPoint = useMemo(() => {
    const closest = tgSimulationData.reduce((prev, curr) =>
      Math.abs(curr.tg - currentTG) < Math.abs(prev.tg - currentTG) ? curr : prev
    );
    return closest;
  }, [currentTG]);

  const handleSliderChange = (value: number[]) => {
    setCurrentTG(value[0]);
  };

  const handlePreset = (value: number) => {
    setCurrentTG(value);
  };

  return (
    <section id="explorer" className="py-24 bg-gradient-to-b from-background via-primary/[0.02] to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Beaker className="w-4 h-4" />
            Interactive Visualization
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            TG Sensitivity Explorer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore how LDL estimates change as triglyceride levels rise
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Card className="p-8 rounded-3xl shadow-lg bg-card sticky top-8">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Triglyceride Level</h3>
                      <p className="text-xs text-muted-foreground">Adjust to see formula divergence</p>
                    </div>
                  </div>

                  {/* Large TG display */}
                  <div className="text-center py-6 bg-secondary/30 rounded-2xl mb-6">
                    <motion.span 
                      key={currentTG}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl font-bold text-foreground"
                    >
                      {currentTG}
                    </motion.span>
                    <span className="text-lg text-muted-foreground ml-2">mg/dL</span>
                    
                    <div className="mt-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        tgStatus.status === 'Normal' ? 'bg-emerald-100 text-emerald-700' :
                        tgStatus.status === 'Borderline' ? 'bg-amber-100 text-amber-700' :
                        tgStatus.status === 'High' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {tgStatus.status}
                      </span>
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="px-2">
                    <Slider
                      value={[currentTG]}
                      onValueChange={handleSliderChange}
                      min={50}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>50</span>
                      <span>500 mg/dL</span>
                    </div>
                  </div>
                </div>

                {/* Preset buttons */}
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Quick presets:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {tgPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant={currentTG === preset.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePreset(preset.value)}
                        className={`rounded-lg transition-all ${
                          currentTG === preset.value
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-primary/10 hover:text-primary hover:border-primary/30'
                        }`}
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Current values */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-foreground">Current Estimates:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Friedewald', value: currentPoint.friedewald, color: CHART_COLORS.friedewald },
                      { name: 'Martin', value: currentPoint.martin, color: CHART_COLORS.martin },
                      { name: 'Sampson', value: currentPoint.sampson, color: CHART_COLORS.sampson },
                      { name: 'LipidAI', value: currentPoint.lipidai, color: CHART_COLORS.primary },
                      { name: 'Real Data', value: currentPoint.real_ldl, color: CHART_COLORS.realData },
                    ].map((method) => (
                      <div key={method.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: method.color }} />
                        <span className="text-xs text-muted-foreground">{method.name}:</span>
                        <span className="text-xs font-medium text-foreground ml-auto">{method.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Chart Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="p-6 md:p-8 rounded-3xl shadow-lg bg-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">LDL Estimates vs Triglyceride Level</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">X: TG (mg/dL)</span>
                  <span className="text-muted-foreground">Y: LDL (mg/dL)</span>
                </div>
              </div>

              <div className="h-[400px] md:h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={tgSimulationData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} opacity={0.5} />
                    <XAxis
                      dataKey="tg"
                      stroke={CHART_COLORS.muted}
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: CHART_COLORS.grid }}
                      label={{ value: 'Triglycerides (mg/dL)', position: 'bottom', offset: 0, fill: CHART_COLORS.muted, fontSize: 12 }}
                    />
                    <YAxis
                      stroke={CHART_COLORS.muted}
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: CHART_COLORS.grid }}
                      domain={[50, 180]}
                      label={{ value: 'LDL (mg/dL)', angle: -90, position: 'insideLeft', fill: CHART_COLORS.muted, fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      }}
                      labelStyle={{ color: '#111827', fontWeight: 600 }}
                      labelFormatter={(value) => `TG: ${value} mg/dL`}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="circle"
                      iconSize={8}
                    />
                    
                    {/* Reference line for current TG */}
                    <ReferenceLine
                      x={currentTG}
                      stroke={CHART_COLORS.primary}
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      label={{ value: `TG: ${currentTG}`, position: 'top', fill: CHART_COLORS.primary, fontSize: 12 }}
                    />

                    <Line
                      type="monotone"
                      dataKey="friedewald"
                      name="Friedewald"
                      stroke={CHART_COLORS.friedewald}
                      strokeWidth={2}
                      strokeOpacity={0.45}
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="martin"
                      name="Martin"
                      stroke={CHART_COLORS.martin}
                      strokeWidth={2}
                      strokeOpacity={0.45}
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sampson"
                      name="Sampson"
                      stroke={CHART_COLORS.sampson}
                      strokeWidth={2}
                      strokeOpacity={0.45}
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="lipidai"
                      name="LipidAI"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={5}
                      strokeOpacity={1}
                      dot={false}
                      activeDot={{ r: 10, strokeWidth: 3, fill: CHART_COLORS.primary, stroke: '#ffffff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="real_ldl"
                      name="Real Data"
                      stroke={CHART_COLORS.realData}
                      strokeWidth={3}
                      strokeOpacity={0.95}
                      strokeDasharray="3 3"
                      dot={false}
                      activeDot={{ r: 8, strokeWidth: 2, fill: CHART_COLORS.realData, stroke: '#ffffff' }}
                    />

                    {/* Current point markers */}
                    <ReferenceDot x={currentTG} y={currentPoint.friedewald} r={5} fill={CHART_COLORS.friedewald} fillOpacity={0.55} stroke="white" strokeWidth={2} />
                    <ReferenceDot x={currentTG} y={currentPoint.martin} r={5} fill={CHART_COLORS.martin} fillOpacity={0.55} stroke="white" strokeWidth={2} />
                    <ReferenceDot x={currentTG} y={currentPoint.sampson} r={5} fill={CHART_COLORS.sampson} fillOpacity={0.55} stroke="white" strokeWidth={2} />
                    <ReferenceDot x={currentTG} y={currentPoint.lipidai} r={10} fill={CHART_COLORS.primary} stroke="white" strokeWidth={3} />
                    <ReferenceDot x={currentTG} y={currentPoint.real_ldl} r={7} fill={CHART_COLORS.realData} stroke="white" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Insight card */}
            <motion.div
              key={tgStatus.status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Insight</h4>
                    <p className="text-muted-foreground leading-relaxed">{insight}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

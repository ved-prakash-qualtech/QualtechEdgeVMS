import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, AlertTriangle, ShieldAlert, Award, FileText, ChevronLeft, Upload, Download, Zap } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, PieChart, Pie, Cell
} from 'recharts';
import { Card } from '../../components/Card/Card';
import { Badge } from '../../components/Badge/Badge';
import styles from './AIInsights.module.css';
import reportData from '../../../server/data/reports/reports-mis.json';

const insights = reportData.aiInsights;

const priorityVariant = (p: string): 'danger' | 'warning' | 'default' =>
  p === 'High' ? 'danger' : p === 'Medium' ? 'warning' : 'default';

const typeIcon = (t: string) => {
  switch (t) {
    case 'savings':    return <Award size={18} className={styles.iconGreen} />;
    case 'warning':    return <AlertTriangle size={18} className={styles.iconAmber} />;
    case 'compliance': return <ShieldAlert size={18} className={styles.iconRed} />;
    case 'opportunity':return <Sparkles size={18} className={styles.iconBlue} />;
    default:           return <Zap size={18} className={styles.iconBlue} />;
  }
};

export const AIInsights: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; date: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
  };

  const processFiles = (files: File[]) => {
    const newFiles = files.map(f => ({
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/reports/dashboard')}>
            <ChevronLeft size={16} /> Back to MIS
          </button>
          <h1 className={styles.title}>AI Insights</h1>
          <p className={styles.subtitle}>Spend forecasting, predictive risk intelligence, and AI-driven sourcing recommendations</p>
        </div>
      </header>

      {/* Prediction KPI Cards */}
      <div className={styles.predGrid}>
        <Card className={styles.predCard}>
          <div className={styles.predHeader}>
            <Sparkles size={18} className={styles.iconBlue} />
            <span className={styles.predLabel}>Spend Projection (FY26)</span>
          </div>
          <div className={styles.predValue}>{insights.spendProjection}</div>
          <p className={styles.predDesc}>AI models predict an 8% increase in IT/Soft licensing expenditures next quarter.</p>
        </Card>
        <Card className={styles.predCard}>
          <div className={styles.predHeader}>
            <AlertTriangle size={18} className={styles.iconAmber} />
            <span className={styles.predLabel}>SLA Failure Warnings</span>
          </div>
          <div className={styles.predValue}>{insights.slaFailureWarnings} Vendors</div>
          <p className={styles.predDesc}>Fincons Milestones flagged at high-risk (84% probability of delay).</p>
        </Card>
        <Card className={styles.predCard}>
          <div className={styles.predHeader}>
            <ShieldAlert size={18} className={styles.iconRed} />
            <span className={styles.predLabel}>Contract Churn Warnings</span>
          </div>
          <div className={styles.predValue}>{insights.contractChurnWarnings} Contracts</div>
          <p className={styles.predDesc}>Facility contracts expiring in 30 days without renegotiation terms.</p>
        </Card>
      </div>

      {/* Charts */}
      <div className={styles.chartGrid}>
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>Spend Forecast: Actual vs Projected (₹ Cr)</h3>
          <div className={styles.chartArea}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={insights.spendForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="actual"    stroke="#1d4ed8" strokeWidth={3} dot={{ r: 4, fill: '#1d4ed8' }} connectNulls name="Actual" />
                <Line type="monotone" dataKey="projected" stroke="#3b82f6" strokeDasharray="5 5" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} connectNulls name="Projected" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>Vendor Compliance Risk Grouping</h3>
          <div className={styles.pieWrapper}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={reportData.riskDistribution} innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {reportData.riskDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.pieLegend}>
              {reportData.riskDistribution.map(item => (
                <div key={item.name} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: item.color }} />
                  <span className={styles.legendName}>{item.name}</span>
                  <span className={styles.legendVal}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className={styles.recCard}>
        <h3 className={styles.sectionTitle}>AI Actionable Insights</h3>
        <div className={styles.recList}>
          {insights.recommendations.map(rec => (
            <div key={rec.id} className={styles.recItem}>
              <div className={styles.recIcon}>{typeIcon(rec.type)}</div>
              <div className={styles.recBody}>
                <div className={styles.recTopRow}>
                  <span className={styles.recTitle}>{rec.title}</span>
                  <Badge variant={priorityVariant(rec.priority)}>{rec.priority} Priority</Badge>
                </div>
                <p className={styles.recDesc}>{rec.description}</p>
                <div className={styles.recFooter}>
                  <span className={styles.recImpact}><Zap size={12} /> {rec.impact}</span>
                  <button className={styles.recLink}>{rec.action} →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Report Upload Section */}
      <Card className={styles.uploadCard}>
        <div className={styles.uploadHeader}>
          <div>
            <h3 className={styles.sectionTitle}>Upload Reports & Documents</h3>
            <p className={styles.uploadSubtitle}>Upload reports for AI analysis. Uploaded files are preserved for future reference.</p>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.xlsx,.xls,.csv,.docx"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
          <Upload size={28} className={styles.uploadIcon} />
          <p className={styles.dropText}>Drag & drop files here, or <span className={styles.browseLink}>browse</span></p>
          <p className={styles.dropSub}>Supports: PDF, Excel, CSV, Word documents</p>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className={styles.fileList}>
            {uploadedFiles.map((f, i) => (
              <div key={i} className={styles.fileItem}>
                <FileText size={16} className={styles.fileIcon} />
                <div className={styles.fileMeta}>
                  <span className={styles.fileName}>{f.name}</span>
                  <span className={styles.fileInfo}>{f.size} · Uploaded {f.date}</span>
                </div>
                <button className={styles.downloadBtn} title="Download">
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {uploadedFiles.length === 0 && (
          <p className={styles.emptyUpload}>No files uploaded yet. Upload reports to enable AI analysis.</p>
        )}
      </Card>
    </div>
  );
};

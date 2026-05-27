import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, GitBranch, ArrowRight, Plus, HelpCircle, Save } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import styles from './ApprovalWorkflowSettings.module.css';

interface Node {
  id: number;
  role: string;
  sla: string;
  condition: string;
}

export const ApprovalWorkflowSettings: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWorkflow, setSelectedWorkflow] = useState('Invoice Matching Route');
  const [nodes, setNodes] = useState<Node[]>([
    { id: 1, role: 'Procurement Officer', sla: '24 Hours', condition: 'All invoices intake' },
    { id: 2, role: 'Finance Manager', sla: '12 Hours', condition: 'Gross amount > ₹10 Lakhs' },
    { id: 3, role: 'VP Sourcing Checker', sla: '48 Hours', condition: 'Gross amount > ₹50 Lakhs' }
  ]);

  const handleAddNode = () => {
    setNodes(prev => [
      ...prev,
      { id: prev.length + 1, role: 'Compliance Officer', sla: '24 Hours', condition: 'Always' }
    ]);
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/settings/dashboard')}>
            <ChevronLeft size={16} /> Back to Settings
          </button>
          <h1 className={styles.title}>Approval Workflow Orchestrator</h1>
          <p className={styles.subtitle}>Construct maker-checker gates, map conditional parallel routing nodes, and track SLA escalation timers</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" icon={<Plus size={16} />} onClick={handleAddNode}>Add Node</Button>
          <Button icon={<Save size={16} />}>Save Workflow</Button>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Left Side: Select Workflow */}
        <Card className={styles.controlCard}>
          <h3 className={styles.panelTitle}>Active Workflows</h3>
          <div className={styles.workflowSelector}>
            {['Vendor Onboarding Gate', 'PO Approval Route', 'Invoice Matching Route', 'Treasury Payout Release', 'Contract SLA Approval'].map(w => (
              <button 
                key={w} 
                className={`${styles.workflowBtn} ${selectedWorkflow === w ? styles.workflowBtnActive : ''}`}
                onClick={() => setSelectedWorkflow(w)}
              >
                <GitBranch size={16} />
                <span>{w}</span>
              </button>
            ))}
          </div>

          <h3 className={styles.panelTitle} style={{ marginTop: '24px' }}>Workflow Rules</h3>
          <div className={styles.rulesList}>
            <div className={styles.ruleItem}>
              <span className={styles.ruleLabel}>Escalation Policy</span>
              <span className={styles.ruleVal}>Notify Manager after SLA breach</span>
            </div>
            <div className={styles.ruleItem}>
              <span className={styles.ruleLabel}>Segregation of Duties</span>
              <span className={styles.ruleVal}>Maker cannot act as Checker</span>
            </div>
            <div className={styles.ruleItem}>
              <span className={styles.ruleLabel}>Parallel Routing</span>
              <span className={styles.ruleVal}>Allowed for dual tax matching</span>
            </div>
          </div>
        </Card>

        {/* Right Side: Visual Workflow Builder Canvas */}
        <Card className={styles.canvasCard}>
          <div className={styles.canvasHeader}>
            <h3>Visual Routing Flowchart Editor</h3>
            <span className={styles.statusBadge}>Active (Draft changes)</span>
          </div>

          <div className={styles.canvasArea}>
            <div className={styles.startNode}>
              <span>Start</span>
              <p>Triggers on Submission</p>
            </div>

            <ArrowRight size={20} className={styles.flowArrow} />

            {nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                <div className={styles.flowNode}>
                  <div className={styles.nodeHeader}>
                    <span>Step {index + 1}: {node.role}</span>
                    <HelpCircle size={14} className={styles.infoIcon} />
                  </div>
                  <div className={styles.nodeBody}>
                    <p>SLA limit: <strong>{node.sla}</strong></p>
                    <p>Condition: <span>{node.condition}</span></p>
                  </div>
                </div>
                {index < nodes.length - 1 && (
                  <ArrowRight size={20} className={styles.flowArrow} />
                )}
              </React.Fragment>
            ))}

            <ArrowRight size={20} className={styles.flowArrow} />

            <div className={styles.endNode}>
              <span>Publish</span>
              <p>Reconciled & Released</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

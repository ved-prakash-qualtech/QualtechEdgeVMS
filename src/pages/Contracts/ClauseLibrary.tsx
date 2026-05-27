import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Plus, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import { getClauses, type Clause } from '../../services/contractService';
import styles from './ClauseLibrary.module.css';

export const ClauseLibrary: React.FC = () => {
  const navigate = useNavigate();

  const [clauses, setClauses] = useState<Clause[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClauses() {
      try {
        const list = await getClauses();
        setClauses(list);
        if (list.length > 0) {
          setSelectedClauseId(list[0].id);
        }
      } catch (err) {
        console.error('Failed to load clause library:', err);
      } finally {
        setLoading(false);
      }
    }
    loadClauses();
  }, []);

  const selectedClause = clauses.find(c => c.id === selectedClauseId) || null;

  const filteredClauses = clauses.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.text.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Clause Library</h1>
          <p className={styles.breadcrumbs}>Home / Contracts / Clause Library</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => alert('New Clause Creation wizard is under construction.')}>Create Clause</Button>
      </header>

      <div className={styles.splitLayout}>
        {/* Left Pane - List of Clauses */}
        <Card className={styles.listCard}>
          <div className={styles.listHeader}>
            <h3>Standard Clauses</h3>
            <Badge variant="info">{clauses.length}</Badge>
          </div>
          
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search clauses..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.listContainer}>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                Loading standard clauses...
              </div>
            ) : filteredClauses.length > 0 ? (
              filteredClauses.map(clause => (
                <div 
                  key={clause.id} 
                  className={`${styles.listItem} ${clause.id === selectedClauseId ? styles.listActive : ''}`}
                  onClick={() => setSelectedClauseId(clause.id)}
                >
                  <div className={styles.itemContent}>
                    <span className={styles.itemName}>{clause.name}</span>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemCategory}>{clause.category}</span>
                      {clause.mandatory && <Badge variant="danger">Mandatory</Badge>}
                    </div>
                  </div>
                  {clause.id === selectedClauseId && <ChevronRight size={18} color="#1d4ed8" />}
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                No matching clauses found.
              </div>
            )}
          </div>
        </Card>

        {/* Right Pane - Clause Details */}
        <div className={styles.detailPane}>
          {selectedClause ? (
            <Card className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <div>
                  <h3 className={styles.detailTitle}>{selectedClause.name}</h3>
                  <span className={styles.detailCategory}>ID: {selectedClause.id} • {selectedClause.category}</span>
                </div>
                {selectedClause.mandatory ? (
                  <Badge variant="danger">Required Clause</Badge>
                ) : (
                  <Badge variant="default">Optional Clause</Badge>
                )}
              </div>

              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Clause Draft Text
                </h4>
                <div className={styles.clauseBodyText}>
                  {selectedClause.text}
                </div>
              </div>

              <div className={styles.metaGrid}>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Governance Status</span>
                  <span className={styles.metaValue} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: '500' }}>
                    <ShieldCheck size={16} /> Approved Template
                  </span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Last Reviewed</span>
                  <span className={styles.metaValue}>May 2026</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', gap: '12px' }}>
                <Button variant="outline" onClick={() => alert('Editing clause template requires Legal Admin privileges.')}>Edit Clause Text</Button>
                <Button variant="ghost" onClick={() => navigate('/contracts/create')}>Use in New Contract</Button>
              </div>
            </Card>
          ) : (
            <Card className={styles.detailCard}>
              <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                Please select a clause from the left list to view draft text and details.
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

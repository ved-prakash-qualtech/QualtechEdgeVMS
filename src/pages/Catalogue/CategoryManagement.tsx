import React, { useState } from 'react';
import { 
  Folder, 
  FolderPlus, 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  User, 
  DollarSign, 
  ShieldAlert,
  Edit2
} from 'lucide-react';
import { CatalogueHeader } from './CatalogueHeader';
import { Button } from '../../components/Button/Button';
import styles from './CategoryManagement.module.css';

interface CategoryNode {
  name: string;
  manager: string;
  itemsCount: number;
  subcategories: string[];
  expanded?: boolean;
}

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Record<string, CategoryNode>>({
    'IT Hardware': {
      name: 'IT Hardware',
      manager: 'Rohan Sen (Sourcing Lead - IT)',
      itemsCount: 428,
      subcategories: ['Laptops', 'Desktops', 'Printers', 'Network Swtiches'],
      expanded: true
    },
    'Office Supplies': {
      name: 'Office Supplies',
      manager: 'Anjali Gupta (Facilities Admin)',
      itemsCount: 1205,
      subcategories: ['Stationery', 'Furniture', 'Pantry Supplies'],
      expanded: false
    },
    'Facility Management': {
      name: 'Facility Management',
      manager: 'Suresh Kumar (VP Operations)',
      itemsCount: 88,
      subcategories: ['Housekeeping', 'Security Guard Services', 'HVAC Maintenance'],
      expanded: false
    }
  });

  const toggleExpand = (key: string) => {
    setCategories(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        expanded: !prev[key].expanded
      }
    }));
  };

  const handleAddCategory = () => {
    const name = prompt("Enter new Main Category Name:");
    if (!name) return;
    setCategories(prev => ({
      ...prev,
      [name]: {
        name: name,
        manager: 'Neha Sharma (Procurement Manager)',
        itemsCount: 0,
        subcategories: [],
        expanded: true
      }
    }));
  };

  return (
    <div className={styles.container}>
      <CatalogueHeader 
        title="CATEGORY MANAGEMENT" 
        subtitle="Organize product folders, assign category managers, and configure item-level sourcing limits"
      />

      <div className={styles.categoryGrid}>
        {/* Left Side: Category Tree Structure */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <span>Procurement Category Folder Tree</span>
            <Button size="sm" icon={<FolderPlus size={14} />} onClick={handleAddCategory}>
              Add Category
            </Button>
          </div>

          <div className={styles.treeContainer}>
            {Object.values(categories).map(cat => (
              <div key={cat.name} className={styles.treeNode}>
                <div className={styles.nodeHeader} onClick={() => toggleExpand(cat.name)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {cat.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <Folder size={18} style={{ color: 'var(--color-primary)' }} />
                    <span>{cat.name}</span>
                  </div>
                  <span className={styles.badge}>{cat.itemsCount} Items</span>
                </div>

                {cat.expanded && (
                  <div className={styles.nodeChildren}>
                    {cat.subcategories.map(sub => (
                      <div key={sub} className={styles.childNode}>
                        <span>{sub}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Code: {sub.substring(0,3).toUpperCase()}</span>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '6px' }}>
                      <Button size="sm" variant="ghost" icon={<Plus size={12} />} onClick={() => {
                        const name = prompt(`Enter subcategory for ${cat.name}:`);
                        if (!name) return;
                        setCategories(prev => ({
                          ...prev,
                          [cat.name]: {
                            ...prev[cat.name],
                            subcategories: [...prev[cat.name].subcategories, name]
                          }
                        }));
                      }}>
                        Add Subfolder
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Category Sourcing Rules & Management Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Sourcing Policies & Governance Defaults</h3>

            <div className={styles.policyCard}>
              <div className={styles.policyTitle}>Sole Source Restriction Limit</div>
              <div className={styles.policyDesc}>Transactions exceeding <strong>₹5,00,000</strong> in IT Hardware require L1/L2/L3 vendor comparison logs.</div>
            </div>

            <div className={styles.policyCard} style={{ borderLeftColor: 'var(--color-warning)' }}>
              <div className={styles.policyTitle}>Lead Time Escalation Alert</div>
              <div className={styles.policyDesc}>Flag items where standard vendor delivery lead time exceeds <strong>14 working days</strong>.</div>
            </div>

            <div className={styles.policyCard} style={{ borderLeftColor: 'var(--color-danger)' }}>
              <div className={styles.policyTitle}>Regulatory Outsourcing Cap</div>
              <div className={styles.policyDesc}>Security & Cloud infrastructure mappings require quarterly audit trail validation reports.</div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Selected Folder Operations</span>
              <Button size="sm" variant="outline" icon={<Edit2 size={12} />}>Edit Policies</Button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} style={{ color: 'var(--color-text-secondary)' }} />
                <span><strong>Category Lead:</strong> Rohan Sen (Sourcing Lead - IT)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={16} style={{ color: 'var(--color-text-secondary)' }} />
                <span><strong>Quarterly Budget Cap:</strong> ₹4.5 Crore</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={16} style={{ color: 'var(--color-text-secondary)' }} />
                <span><strong>Outsourcing Classification:</strong> Core Compliance (High Audit Impact)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

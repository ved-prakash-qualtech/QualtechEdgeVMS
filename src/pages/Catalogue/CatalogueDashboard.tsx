import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package,
  TrendingUp,
  Users,
  Layers,
  CheckSquare,
  Plus,
  TrendingDown,
  Search,
  Filter,
  X,
  LayoutGrid,
  List,
  Upload,
  Download,
  ChevronDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { CatalogueHeader } from './CatalogueHeader';
import styles from './CatalogueDashboard.module.css';
import { 
  getAllItems, 
  getItemDashboardStats,
  importCatalogue
} from '../../services/itemMasterService';
import type { 
  CatalogueItem
} from '../../services/itemMasterService';

export const CatalogueDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [kpiFilter, setKpiFilter] = useState<string | null>(null);
  const [isGrid, setIsGrid] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Import / Export State
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [importType, setImportType] = useState<'Items' | 'Services' | 'Both'>('Both');
  const [validationSummary, setValidationSummary] = useState<{
    total: number;
    valid: number;
    invalid: number;
    duplicate: number;
  } | null>(null);
  const [parsedRecords, setParsedRecords] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setExportDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadXLSX = (): Promise<any> => {
    return new Promise((resolve) => {
      if ((window as any).XLSX) {
        resolve((window as any).XLSX);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      script.onload = () => resolve((window as any).XLSX);
      document.body.appendChild(script);
    });
  };

  const processParsedRecords = (records: any[]) => {
    let validCount = 0;
    let invalidCount = 0;
    let duplicateCount = 0;

    const existingNames = new Set(items.map(i => (i.itemName || '').toLowerCase()));
    const existingIds = new Set(items.map(i => (i.itemId || i.itemCode || '').toLowerCase()));

    const processed = records.map(rec => {
      const name = rec.itemName || rec.serviceName || rec.name || '';
      const code = rec.itemCode || rec.serviceCode || rec.itemId || rec.serviceId || '';

      const isValid = name.trim().length > 0;
      const isDuplicate = existingNames.has(name.toLowerCase()) || (code && existingIds.has(code.toLowerCase()));

      if (isValid) {
        validCount++;
        if (isDuplicate) duplicateCount++;
      } else {
        invalidCount++;
      }

      return {
        ...rec,
        isValid,
        isDuplicate
      };
    });

    setParsedRecords(processed);
    setValidationSummary({
      total: records.length,
      valid: validCount,
      invalid: invalidCount,
      duplicate: duplicateCount
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setImportMessage(null);

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          const records = Array.isArray(json) ? json : [json];
          processParsedRecords(records);
        } catch (err) {
          setImportMessage({ text: 'Invalid JSON file structure.', isError: true });
        }
      };
      reader.readAsText(file);
    } else if (ext === 'csv') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split(/\r?\n/).filter(l => l.trim());
          if (lines.length === 0) {
            setImportMessage({ text: 'CSV file is empty.', isError: true });
            return;
          }
          const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
          const records = lines.slice(1).map(line => {
            const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
            const obj: any = {};
            headers.forEach((h, idx) => {
              obj[h] = cols[idx] || '';
            });
            return obj;
          });
          processParsedRecords(records);
        } catch (err) {
          setImportMessage({ text: 'Error parsing CSV file.', isError: true });
        }
      };
      reader.readAsText(file);
    } else if (ext === 'xlsx' || ext === 'xls') {
      try {
        const XLSX = await loadXLSX();
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            processParsedRecords(json);
          } catch (err) {
            setImportMessage({ text: 'Error parsing Excel sheet.', isError: true });
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (err) {
        setImportMessage({ text: 'Failed to load Excel parsing engine.', isError: true });
      }
    } else {
      setImportMessage({ text: 'Unsupported file type. Please upload .csv, .xlsx, or .json.', isError: true });
    }
  };

  const handleImportSubmit = async () => {
    if (parsedRecords.length === 0 || !validationSummary || validationSummary.valid === 0) {
      setImportMessage({ text: 'No valid records to import.', isError: true });
      return;
    }

    setImporting(true);
    setImportMessage(null);
    try {
      const validRecords = parsedRecords.filter(r => r.isValid);
      const result = await importCatalogue(importType, validRecords);
      if (result.success) {
        setImportMessage({ text: `${result.message} Total: ${result.totalImported} (Items: ${result.itemsImported}, Services: ${result.servicesImported})`, isError: false });
        await fetchDashboardData();
        setTimeout(() => {
          setImportModalOpen(false);
          setValidationSummary(null);
          setParsedRecords([]);
          setFileName('');
          setImportMessage(null);
        }, 3000);
      } else {
        setImportMessage({ text: result.message || 'Import failed.', isError: true });
      }
    } catch (err: any) {
      setImportMessage({ text: err.response?.data?.message || 'Error occurred during import.', isError: true });
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async (format: 'json' | 'csv' | 'xlsx') => {
    setExportDropdownOpen(false);
    if (filteredItems.length === 0) {
      alert("No data available to export.");
      return;
    }

    const dateStr = new Date().toISOString().split('T')[0];

    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredItems, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `catalogue_export_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else if (format === 'csv') {
      const headers = ['Code', 'Name', 'Type', 'Category', 'Preferred Vendor', 'Ref Rate', 'Status'];
      const rows = filteredItems.map(item => {
        const isSvc = item.type === 'Service' || (item as any).isService || item.category === 'Professional Services' || item.category === 'Logistics';
        const rate = (item as any).refRate ? (item as any).refRate : ((item as any).rate || (item.minimumOrderQuantity * 1500));
        return [
          item.itemId || item.itemCode || '',
          `"${(item.itemName || '').replace(/"/g, '""')}"`,
          isSvc ? 'Service' : 'Item',
          `"${(item.category || '').replace(/"/g, '""')}"`,
          `"${(item.preferredVendor?.vendorName || item.preferredVendor || 'N/A').replace(/"/g, '""')}"`,
          rate,
          item.status || 'Draft'
        ];
      });
      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `catalogue_export_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else if (format === 'xlsx') {
      try {
        const XLSX = await loadXLSX();
        const rows = filteredItems.map(item => {
          const isSvc = item.type === 'Service' || (item as any).isService || item.category === 'Professional Services' || item.category === 'Logistics';
          const rate = (item as any).refRate ? (item as any).refRate : ((item as any).rate || (item.minimumOrderQuantity * 1500));
          return {
            'Code': item.itemId || item.itemCode || '',
            'Name': item.itemName || '',
            'Type': isSvc ? 'Service' : 'Item',
            'Category': item.category || '',
            'Preferred Vendor': item.preferredVendor?.vendorName || item.preferredVendor || 'N/A',
            'Ref Rate': rate,
            'Status': item.status || 'Draft'
          };
        });
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Catalogue");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `catalogue_export_${dateStr}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (err) {
        alert("Failed to export as Excel.");
      }
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [itemsList] = await Promise.all([
        getAllItems(),
        getItemDashboardStats()
      ]);
      setItems(itemsList);
    } catch (err) {
      console.error('Error fetching catalogue dashboard details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate dynamic counts from items array
  const totalItemsCount = items.filter(item => !((item as any).isService || item.category === 'Professional Services' || item.category === 'Logistics')).length;
  const totalServicesCount = items.filter(item => (item as any).isService || item.category === 'Professional Services' || item.category === 'Logistics').length;
  const activeVendorsCount = new Set(items.map(item => item.preferredVendor?.vendorName).filter(name => name && name !== 'N/A')).size;
  const publishedRecordsCount = totalItemsCount + totalServicesCount;
  const publishedCount = items.filter(item => item.status === 'Published').length;
  const draftCount = items.filter(item => item.status === 'Draft' || !item.status).length;

  const kpis = [
    { name: 'Total Items', val: totalItemsCount.toLocaleString('en-IN'), icon: Package, color: '#1D4ED8', bg: '#EAF2FF', trend: '+12.5%', isUp: true },
    { name: 'Total Services', val: totalServicesCount.toLocaleString('en-IN'), icon: Layers, color: '#7C3AED', bg: '#F3E8FF', trend: '+5.2%', isUp: true },
    { name: 'Active Sourced Vendors', val: activeVendorsCount.toString(), icon: Users, color: '#16A34A', bg: '#DCFCE7', trend: '+8.4%', isUp: true },
    { name: 'Published Records', val: publishedRecordsCount.toLocaleString('en-IN'), icon: CheckCircle2, color: '#16A34A', bg: '#DCFCE7', trend: '+10.0%', isUp: true }
  ];

  const filteredItems = items.filter(item => {
    const isService = (item as any).isService || item.category === 'Professional Services' || item.category === 'Logistics';

    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.itemId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hsnCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.preferredVendor?.vendorName?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    
    let matchesKpi = true;
    if (kpiFilter === 'Total Items') {
      matchesKpi = !isService;
    } else if (kpiFilter === 'Total Services') {
      matchesKpi = isService;
    } else if (kpiFilter === 'Active Sourced Vendors') {
      matchesKpi = !!(item.preferredVendor?.vendorName && item.preferredVendor.vendorName !== 'N/A');
    } else if (kpiFilter === 'Published Records') {
      matchesKpi = item.status === 'Published' || item.status === 'Approved' || item.status === 'Active';
    } else if (kpiFilter === 'Published Catalogue') {
      matchesKpi = item.status === 'Published';
    } else if (kpiFilter === 'Draft Catalogue') {
      matchesKpi = item.status === 'Draft' || !item.status;
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesKpi;
  });

  return (
    <div className={styles.container}>
      <CatalogueHeader 
        title="ITEM & SERVICE CATALOGUE" 
        subtitle="End-to-End Procurement Catalogue Lifecycle Sourcing & Sizing Dashboard"
        actions={
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Button variant="outline" icon={<Upload size={16} />} onClick={() => setImportModalOpen(true)}>Import</Button>
            <div className={styles.exportDropdownContainer} ref={exportDropdownRef}>
              <Button icon={<Download size={16} />} onClick={() => setExportDropdownOpen(!exportDropdownOpen)}>
                Export <ChevronDown size={14} style={{ marginLeft: '4px' }} />
              </Button>
              {exportDropdownOpen && (
                <div className={styles.exportDropdownMenu}>
                  <button className={styles.exportItem} onClick={() => handleExport('xlsx')}>
                    Export as Excel
                  </button>
                  <button className={styles.exportItem} onClick={() => handleExport('csv')}>
                    Export as CSV
                  </button>
                  <button className={styles.exportItem} onClick={() => handleExport('json')}>
                    Export as JSON
                  </button>
                </div>
              )}
            </div>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className={styles.kpiGrid}>
        {kpis.map((kpi, idx) => {
          const IconComponent = kpi.icon;
          const isActive = kpiFilter === kpi.name;
          return (
            <Card 
              key={idx} 
              className={`${styles.kpiCard} ${isActive ? styles.kpiCardActive : ''}`}
              onClick={() => setKpiFilter(kpiFilter === kpi.name ? null : kpi.name)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.kpiHeader}>
                <span className={styles.kpiLabel}>{kpi.name}</span>
                <div className={styles.kpiIconWrapper} style={{ backgroundColor: kpi.bg, color: kpi.color }}>
                  <IconComponent size={18} />
                </div>
              </div>
              <div className={styles.kpiValue}>{kpi.val}</div>
              <div className={styles.kpiFooter}>
                <div>
                  <span className={kpi.isUp ? styles.trendUp : styles.trendDown}>
                    {kpi.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {kpi.trend}
                  </span>
                  <span style={{ marginLeft: '4px' }}>vs last month</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Catalogue Items List Section */}
      <Card className={styles.recentTableCard}>
        <div className={styles.tableFilters}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0b1f5f', whiteSpace: 'nowrap' }}>Item & Service Master View</h3>
            <div className={styles.searchBar} style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search items, services, codes, or vendors..."
                className={styles.selectInput}
                style={{ width: '100%', paddingLeft: '32px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--color-text-secondary)' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {(() => {
              const activeFilterCount = [categoryFilter !== 'All', statusFilter !== 'All'].filter(Boolean).length;
              return (
                <button className={styles.filterBtn} onClick={() => setFiltersOpen(v => !v)}>
                  <Filter size={14} /> Filters
                  {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
                </button>
              );
            })()}
            <Button variant="outline" size="sm" onClick={() => setIsGrid(!isGrid)} icon={isGrid ? <List size={16} /> : <LayoutGrid size={16} />}>
              {isGrid ? "List View" : "Grid View"}
            </Button>
          </div>
        </div>

        {filtersOpen && (
          <div className={styles.filterPanel}>
            <div className={styles.filterPanelRow}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Category</label>
                <select className={styles.filterSelect} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="All">All Categories</option>
                  <option value="IT Hardware">IT Hardware</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Facility Management">Facility Management</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Logistics">Logistics</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Status</label>
                <select className={styles.filterSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              {[categoryFilter !== 'All', statusFilter !== 'All'].some(Boolean) && (
                <button className={styles.clearFiltersBtn} onClick={() => { setCategoryFilter('All'); setStatusFilter('All'); setKpiFilter(null); }}>
                  <X size={12} /> Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Master Data Grid or Table */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Loading Catalogue Master Database...
          </div>
        ) : (
          !isGrid ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: '#0b1f5f' }}>Code</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: '#0b1f5f' }}>Name</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: '#0b1f5f' }}>Type</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: '#0b1f5f' }}>Category</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: '#0b1f5f' }}>Preferred Vendor</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: '#0b1f5f' }}>Ref Rate</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: '#0b1f5f' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                        No items or services found in the catalogue. Click "Import" to upload records.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map(item => {
                      const isService = item.type === 'Service' || (item as any).isService || item.category === 'Professional Services' || item.category === 'Logistics';
                      return (
                        <tr key={item.itemId} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '12px 16px', fontWeight: '500', color: 'var(--color-primary)' }}>{item.itemId || item.itemCode}</td>
                          <td style={{ padding: '12px 16px', fontWeight: '500' }}>{item.itemName}</td>
                          <td style={{ padding: '12px 16px' }}>{isService ? 'Service' : 'Item'}</td>
                          <td style={{ padding: '12px 16px' }}>{item.category}</td>
                          <td style={{ padding: '12px 16px' }}>{item.preferredVendor?.vendorName || item.preferredVendor || 'N/A'}</td>
                          <td style={{ padding: '12px 16px', fontWeight: '600' }}>{(item as any).refRate ? '₹' + (item as any).refRate.toLocaleString('en-IN') : ((item as any).rate || '₹' + (item.minimumOrderQuantity * 1500).toLocaleString('en-IN'))}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span className={item.status === 'Published' || item.status === 'Approved' ? styles.badgeSuccess : item.status === 'Draft' ? styles.badgeWarning : styles.badgeDanger}>
                              {item.status || 'Draft'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {filteredItems.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                  No items or services found in the catalogue. Click "Import" to upload records.
                </div>
              ) : (
                filteredItems.map(item => {
                  const isService = item.type === 'Service' || (item as any).isService || item.category === 'Professional Services' || item.category === 'Logistics';
                  return (
                    <div key={item.itemId} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'var(--color-surface)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{item.itemId || item.itemCode}</span>
                        <span className={item.status === 'Published' || item.status === 'Approved' ? styles.badgeSuccess : item.status === 'Draft' ? styles.badgeWarning : styles.badgeDanger}>
                          {item.status || 'Draft'}
                        </span>
                      </div>
                      <h4 style={{ fontWeight: '600', color: '#0b1f5f' }}>{item.itemName}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{isService ? 'Service' : 'Item'} • {item.category}</p>
                      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '12px' }}>
                          <div style={{ color: 'var(--color-text-secondary)' }}>Vendor</div>
                          <div style={{ fontWeight: '500' }}>{item.preferredVendor?.vendorName || item.preferredVendor || 'N/A'}</div>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#0b1f5f' }}>{(item as any).refRate ? '₹' + (item as any).refRate.toLocaleString('en-IN') : ((item as any).rate || '₹' + (item.minimumOrderQuantity * 1500).toLocaleString('en-IN'))}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )
        )}
      </Card>

      {/* Import Modal */}
      {importModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setImportModalOpen(false)}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Import Item & Service Catalogue</h3>
              <button className={styles.closeBtn} onClick={() => setImportModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Import Type</label>
                <select 
                  className={styles.selectInput} 
                  value={importType} 
                  onChange={(e) => setImportType(e.target.value as any)}
                >
                  <option value="Both">Both</option>
                  <option value="Items">Items</option>
                  <option value="Services">Services</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Upload File</label>
                <div 
                  className={styles.dragDropArea}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={28} />
                  <p>{fileName ? fileName : 'Drag & drop file here or click to browse'}</p>
                  <span>Supported formats: CSV, Excel (.xlsx, .xls), JSON</span>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".csv,.xlsx,.xls,.json"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {validationSummary && (
                <div className={styles.formGroup}>
                  <label>Validation Summary</label>
                  <div className={styles.validationSummaryGrid}>
                    <div className={styles.summaryCard}>
                      <span className={styles.summaryCardVal}>{validationSummary.total}</span>
                      <span className={styles.summaryCardLabel}>Total Records</span>
                    </div>
                    <div className={styles.summaryCard} style={{ borderLeft: '3px solid #16a34a' }}>
                      <span className={styles.summaryCardVal} style={{ color: '#16a34a' }}>{validationSummary.valid}</span>
                      <span className={styles.summaryCardLabel}>Valid Records</span>
                    </div>
                    <div className={styles.summaryCard} style={{ borderLeft: '3px solid #dc2626' }}>
                      <span className={styles.summaryCardVal} style={{ color: '#dc2626' }}>{validationSummary.invalid}</span>
                      <span className={styles.summaryCardLabel}>Invalid Records</span>
                    </div>
                    <div className={styles.summaryCard} style={{ borderLeft: '3px solid #eab308' }}>
                      <span className={styles.summaryCardVal} style={{ color: '#eab308' }}>{validationSummary.duplicate}</span>
                      <span className={styles.summaryCardLabel}>Duplicate Records</span>
                    </div>
                  </div>
                </div>
              )}

              {importMessage && (
                <div className={importMessage.isError ? styles.errorMsg : styles.successMsg}>
                  {importMessage.isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                  <span>{importMessage.text}</span>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <Button variant="outline" onClick={() => setImportModalOpen(false)} disabled={importing}>
                Cancel
              </Button>
              <Button 
                onClick={handleImportSubmit} 
                disabled={importing || !validationSummary || validationSummary.valid === 0}
              >
                {importing ? 'Importing...' : 'Import Records'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

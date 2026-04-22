import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Activity, MapPin, AlertTriangle, ArrowRight, Bell, RefreshCw,
  CheckCircle, Package, Truck, Brain, TrendingUp, Users, Shield,
  Sun, Moon, Search, ChevronLeft, ChevronRight, Clock, Wifi,
  Heart, Pill, X, ExternalLink, Phone, Mail, Send
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const PHC_DATA = [
  { id: 1, name: 'Aluva', x: 25, y: 18, status: 'critical', officer: 'Dr. Sarah Joseph', phone: '+91 9447000001', lastUpdated: '2 min ago', medicines: [{ name: 'Paracetamol', stock: 45, status: 'low' }, { name: 'ORS Packets', stock: 12, status: 'critical' }, { name: 'Chloroquine', stock: 0, status: 'critical' }] },
  { id: 2, name: 'Angamaly', x: 35, y: 32, status: 'critical', officer: 'Dr. Rahul Varma', phone: '+91 9447000002', lastUpdated: '5 min ago', medicines: [{ name: 'Amoxicillin', stock: 8, status: 'critical' }, { name: 'Metformin', stock: 150, status: 'good' }, { name: 'Amlodipine', stock: 22, status: 'low' }] },
  { id: 3, name: 'Paravur', x: 50, y: 25, status: 'warning', officer: 'Dr. Lekshmi Nair', phone: '+91 9447000003', lastUpdated: '8 min ago', medicines: [{ name: 'Iron Folic Acid', stock: 30, status: 'low' }, { name: 'Paracetamol', stock: 200, status: 'good' }, { name: 'Salbutamol', stock: 15, status: 'low' }] },
  { id: 4, name: 'Kochi (Town)', x: 42, y: 55, status: 'good', officer: 'Dr. Thomas Kurian', phone: '+91 9447000004', lastUpdated: '1 min ago', medicines: [{ name: 'ORS Packets', stock: 500, status: 'good' }, { name: 'Paracetamol', stock: 300, status: 'good' }, { name: 'Amoxicillin', stock: 180, status: 'good' }] },
  { id: 5, name: 'Perumbavoor', x: 55, y: 68, status: 'critical', officer: 'Dr. Bindu S.', phone: '+91 9447000005', lastUpdated: '3 min ago', medicines: [{ name: 'ORS Packets', stock: 5, status: 'critical' }, { name: 'Cotrimoxazole', stock: 10, status: 'critical' }, { name: 'Atenolol', stock: 45, status: 'low' }] },
  { id: 6, name: 'Muvattupuzha', x: 70, y: 40, status: 'good', officer: 'Dr. Manoj Peter', phone: '+91 9447000006', lastUpdated: '4 min ago', medicines: [{ name: 'Chloroquine', stock: 400, status: 'good' }, { name: 'Metformin', stock: 250, status: 'good' }, { name: 'Paracetamol', stock: 180, status: 'good' }] },
  { id: 7, name: 'Kothamangalam', x: 78, y: 22, status: 'warning', officer: 'Dr. Anjali Das', phone: '+91 9447000007', lastUpdated: '6 min ago', medicines: [{ name: 'Amlodipine', stock: 18, status: 'low' }, { name: 'Chloroquine', stock: 25, status: 'low' }, { name: 'Iron Folic Acid', stock: 60, status: 'good' }] },
  { id: 8, name: 'Tripunithura', x: 88, y: 50, status: 'good', officer: 'Dr. Vivek R.', phone: '+91 9447000008', lastUpdated: '2 min ago', medicines: [{ name: 'Amoxicillin', stock: 350, status: 'good' }, { name: 'Paracetamol', stock: 400, status: 'good' }, { name: 'ORS Packets', stock: 200, status: 'good' }] },
];

const SWAP_ROUTES = [
  { from: 6, to: 7, medicine: 'Chloroquine' },
  { from: 4, to: 5, medicine: 'ORS Packets' },
  { from: 8, to: 2, medicine: 'Amoxicillin' },
  { from: 1, to: 3, medicine: 'Paracetamol' },
];

const MEDICINE_TABLE_DATA = [
  { medicine: 'Paracetamol', category: 'Analgesic', phc: 'Aluva', stock: 45, daysRemaining: 4, seasonalRisk: 'High', predictedNeed: 200, status: 'critical' },
  { medicine: 'ORS Packets', category: 'Rehydration', phc: 'Perumbavoor', stock: 5, daysRemaining: 1, seasonalRisk: 'Very High', predictedNeed: 500, status: 'critical' },
  { medicine: 'Metformin', category: 'Anti-diabetic', phc: 'Angamaly', stock: 150, daysRemaining: 30, seasonalRisk: 'Low', predictedNeed: 120, status: 'good' },
  { medicine: 'Amlodipine', category: 'Antihypertensive', phc: 'Paravur', stock: 22, daysRemaining: 8, seasonalRisk: 'Medium', predictedNeed: 80, status: 'warning' },
  { medicine: 'Amoxicillin', category: 'Antibiotic', phc: 'Angamaly', stock: 8, daysRemaining: 2, seasonalRisk: 'High', predictedNeed: 300, status: 'critical' },
  { medicine: 'Chloroquine', category: 'Antimalarial', phc: 'Aluva', stock: 0, daysRemaining: 0, seasonalRisk: 'Very High', predictedNeed: 500, status: 'critical' },
  { medicine: 'Iron Folic Acid', category: 'Supplement', phc: 'Paravur', stock: 30, daysRemaining: 12, seasonalRisk: 'Medium', predictedNeed: 150, status: 'warning' },
  { medicine: 'Cotrimoxazole', category: 'Antibiotic', phc: 'Perumbavoor', stock: 10, daysRemaining: 3, seasonalRisk: 'Medium', predictedNeed: 100, status: 'critical' },
  { medicine: 'Atenolol', category: 'Beta-blocker', phc: 'Perumbavoor', stock: 45, daysRemaining: 18, seasonalRisk: 'Low', predictedNeed: 60, status: 'good' },
  { medicine: 'Salbutamol Inhaler', category: 'Bronchodilator', phc: 'Paravur', stock: 15, daysRemaining: 10, seasonalRisk: 'Medium', predictedNeed: 40, status: 'warning' },
];

const FORECAST_DATA = {
  monsoon: [
    { day: 'Day 1', Chloroquine: 40, ORS: 80, Paracetamol: 30, Amoxicillin: 25, IronFolicAcid: 20 },
    { day: 'Day 5', Chloroquine: 90, ORS: 120, Paracetamol: 35, Amoxicillin: 40, IronFolicAcid: 22 },
    { day: 'Day 10', Chloroquine: 180, ORS: 200, Paracetamol: 45, Amoxicillin: 55, IronFolicAcid: 25 },
    { day: 'Day 15', Chloroquine: 340, ORS: 350, Paracetamol: 50, Amoxicillin: 60, IronFolicAcid: 28 },
    { day: 'Day 20', Chloroquine: 420, ORS: 400, Paracetamol: 55, Amoxicillin: 50, IronFolicAcid: 30 },
    { day: 'Day 25', Chloroquine: 380, ORS: 320, Paracetamol: 48, Amoxicillin: 45, IronFolicAcid: 26 },
    { day: 'Day 30', Chloroquine: 300, ORS: 280, Paracetamol: 42, Amoxicillin: 38, IronFolicAcid: 24 },
  ],
  winter: [
    { day: 'Day 1', Chloroquine: 15, ORS: 20, Paracetamol: 80, Amoxicillin: 90, IronFolicAcid: 30 },
    { day: 'Day 5', Chloroquine: 18, ORS: 25, Paracetamol: 150, Amoxicillin: 160, IronFolicAcid: 35 },
    { day: 'Day 10', Chloroquine: 20, ORS: 30, Paracetamol: 280, Amoxicillin: 250, IronFolicAcid: 38 },
    { day: 'Day 15', Chloroquine: 22, ORS: 28, Paracetamol: 350, Amoxicillin: 320, IronFolicAcid: 40 },
    { day: 'Day 20', Chloroquine: 19, ORS: 25, Paracetamol: 400, Amoxicillin: 380, IronFolicAcid: 42 },
    { day: 'Day 25', Chloroquine: 16, ORS: 22, Paracetamol: 340, Amoxicillin: 300, IronFolicAcid: 38 },
    { day: 'Day 30', Chloroquine: 14, ORS: 20, Paracetamol: 280, Amoxicillin: 260, IronFolicAcid: 35 },
  ],
  summer: [
    { day: 'Day 1', Chloroquine: 20, ORS: 100, Paracetamol: 40, Amoxicillin: 30, IronFolicAcid: 80 },
    { day: 'Day 5', Chloroquine: 25, ORS: 180, Paracetamol: 50, Amoxicillin: 35, IronFolicAcid: 140 },
    { day: 'Day 10', Chloroquine: 28, ORS: 300, Paracetamol: 55, Amoxicillin: 40, IronFolicAcid: 220 },
    { day: 'Day 15', Chloroquine: 30, ORS: 420, Paracetamol: 60, Amoxicillin: 42, IronFolicAcid: 280 },
    { day: 'Day 20', Chloroquine: 27, ORS: 380, Paracetamol: 55, Amoxicillin: 38, IronFolicAcid: 250 },
    { day: 'Day 25', Chloroquine: 24, ORS: 320, Paracetamol: 48, Amoxicillin: 35, IronFolicAcid: 200 },
    { day: 'Day 30', Chloroquine: 22, ORS: 260, Paracetamol: 42, Amoxicillin: 32, IronFolicAcid: 160 },
  ],
};

const SEASON_INSIGHTS = {
  monsoon: '⚡ Monsoon Alert: Chloroquine demand expected to spike 340% in next 2 weeks. Recommend pre-positioning 500 units at Aluva PHC.',
  winter: '🌡️ Winter Alert: Paracetamol & Amoxicillin demand surging due to flu season. Recommend stocking 400+ units across Ernakulam PHCs.',
  summer: '☀️ Summer Alert: ORS and Iron Folic Acid demand rising sharply. Pre-position 600 ORS packets at high-risk Kochi PHCs.',
};

const SWAP_SUGGESTIONS = [
  { id: 1, medicine: 'Paracetamol', quantity: 200, from: 'Aluva', to: 'Angamaly', distance: '12 km', eta: '~45 min by road', urgency: 'CRITICAL' },
  { id: 2, medicine: 'ORS Packets', quantity: 150, from: 'Kochi (Town)', to: 'Perumbavoor', distance: '18 km', eta: '~40 min by road', urgency: 'HIGH' },
  { id: 3, medicine: 'Chloroquine', quantity: 80, from: 'Muvattupuzha', to: 'Kothamangalam', distance: '15 km', eta: '~35 min by road', urgency: 'HIGH' },
  { id: 4, medicine: 'Amoxicillin', quantity: 300, from: 'Tripunithura', to: 'Paravur', distance: '22 km', eta: '~1 hr by road', urgency: 'MEDIUM' },
];

const PROCUREMENT_ALERTS = [
  { id: 1, medicine: 'ORS Packets', affectedPHCs: 5, currentStock: 220, minRequired: 1500, shortageGap: 1280, orderQty: 1500, cost: '₹18,750', severity: 'CRITICAL' },
  { id: 2, medicine: 'Iron Folic Acid', affectedPHCs: 3, currentStock: 110, minRequired: 600, shortageGap: 490, orderQty: 600, cost: '₹4,200', severity: 'HIGH' },
  { id: 3, medicine: 'Salbutamol Inhaler', affectedPHCs: 2, currentStock: 55, minRequired: 200, shortageGap: 145, orderQty: 200, cost: '₹14,000', severity: 'MEDIUM' },
];

const MONTHLY_IMPACT = [
  { month: 'Nov', swaps: 18, prevented: 14 },
  { month: 'Dec', swaps: 24, prevented: 20 },
  { month: 'Jan', swaps: 30, prevented: 26 },
  { month: 'Feb', swaps: 28, prevented: 24 },
  { month: 'Mar', swaps: 35, prevented: 31 },
  { month: 'Apr', swaps: 42, prevented: 38 },
];

const SHORTAGE_DISTRIBUTION = [
  { name: 'Antimalarial', value: 28, color: '#EF4444' },
  { name: 'Rehydration', value: 24, color: '#F59E0B' },
  { name: 'Antibiotic', value: 20, color: '#0D9488' },
  { name: 'Analgesic', value: 15, color: '#8B5CF6' },
  { name: 'Supplement', value: 13, color: '#10B981' },
];

const ACTIVITY_TEMPLATES = [
  { type: 'swap', text: '✅ Swap completed: 200 Paracetamol | Aluva → Angamaly', color: 'border-emerald-500' },
  { type: 'alert', text: '⚠️ Low stock alert: ORS at Perumbavoor PHC (3 days left)', color: 'border-amber-500' },
  { type: 'ai', text: '🤖 Gemini intelligence synced for Ernakulam Monsoon season', color: 'border-purple-500' },
  { type: 'procure', text: '📦 Procurement request sent for Chloroquine at Kochi', color: 'border-blue-500' },
  { type: 'route', text: '🗺️ Route optimized: Aluva → Muvattupuzha via NH544', color: 'border-teal-500' },
  { type: 'swap', text: '✅ Swap initiated: 150 ORS | Kochi → Perumbavoor', color: 'border-emerald-500' },
  { type: 'alert', text: '⚠️ Critical stockout: Chloroquine at Aluva PHC', color: 'border-red-500' },
  { type: 'ai', text: '🤖 Prediction: Amoxicillin demand ↑ 180% in Angamaly', color: 'border-purple-500' },
  { type: 'procure', text: '📦 DMO approved emergency order for Muvattupuzha', color: 'border-blue-500' },
  { type: 'route', text: '🗺️ Driver en route: Paravur → Kochi (ETA 25min)', color: 'border-teal-500' },
  { type: 'swap', text: '✅ Transfer verified: 80 Chloroquine delivered to Tripunithura', color: 'border-emerald-500' },
  { type: 'alert', text: '⚠️ Insulin stock declining at Kalamassery — 5 days left', color: 'border-amber-500' },
];

// ─── ANIMATED COUNTER COMPONENT ─────────────────────────────────────────────

function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !hasStarted) setHasStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [hasStarted, end, duration]);

  return <span ref={ref}>{prefix}{typeof end === 'number' && end % 1 !== 0 ? count.toFixed(1) : count.toLocaleString()}{suffix}</span>;
}

// ─── MAIN APP COMPONENT ─────────────────────────────────────────────────────

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPHC, setSelectedPHC] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tablePage, setTablePage] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState('monsoon');
  const [swapStates, setSwapStates] = useState({});
  const [alertStates, setAlertStates] = useState({});
  const [activityFeed, setActivityFeed] = useState(ACTIVITY_TEMPLATES.slice(0, 4));
  const [notifications, setNotifications] = useState(7);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showChat, setShowChat] = useState(false);
  const [activeRoute, setActiveRoute] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Dynamic State for PHCs and Inventory
  const [phcs, setPhcs] = useState(PHC_DATA);
  const [inventory, setInventory] = useState(MEDICINE_TABLE_DATA);

  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your Gemini-powered MediFlow Assistant. I've analyzed the Ernakulam network and noticed that Chloroquine stock is at zero in Aluva. Would you like me to coordinate an emergency swap from Muvattupuzha?" }
  ]);
  const chatEndRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scrolling activity feed
  useEffect(() => {
    let idx = 4;
    const timer = setInterval(() => {
      const newActivity = {
        ...ACTIVITY_TEMPLATES[idx % ACTIVITY_TEMPLATES.length],
        id: Date.now(),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setActivityFeed(prev => [newActivity, ...prev].slice(0, 15));
      idx++;
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSwap = useCallback((id, action) => {
    setSwapStates(prev => ({ ...prev, [id]: action }));
    
    if (action === 'accepted') {
      const suggestion = SWAP_SUGGESTIONS.find(s => s.id === id);
      if (suggestion) {
        // Update Inventory Table State
        setInventory(prev => prev.map(m => {
          if (m.medicine === suggestion.medicine && m.phc === suggestion.from) {
            return { ...m, stock: Math.max(0, m.stock - suggestion.quantity), daysRemaining: Math.floor(Math.max(0, m.stock - suggestion.quantity) / (m.predictedNeed / 30)) };
          }
          if (m.medicine === suggestion.medicine && m.phc === suggestion.to) {
            return { ...m, stock: m.stock + suggestion.quantity, daysRemaining: Math.floor((m.stock + suggestion.quantity) / (m.predictedNeed / 30)) };
          }
          return m;
        }));

        // Update PHC Map State
        setPhcs(prev => prev.map(p => {
          if (p.name === suggestion.from || p.name === suggestion.to) {
            return {
              ...p,
              medicines: p.medicines.map(med => {
                if (med.name === suggestion.medicine) {
                  const change = p.name === suggestion.from ? -suggestion.quantity : suggestion.quantity;
                  return { ...med, stock: Math.max(0, med.stock + change) };
                }
                return med;
              })
            };
          }
          return p;
        }));

        setToast({ message: `📦 Resource Rebalancing Successful: ${suggestion.quantity} units of ${suggestion.medicine} moved to ${suggestion.to}.`, type: 'success' });
        setTimeout(() => setToast(null), 5000);
        setNotifications(prev => prev + 1);
      }
    }
  }, []);

  const handleAlert = useCallback((id) => {
    setAlertStates(prev => ({ ...prev, [id]: true }));
    const alert = PROCUREMENT_ALERTS.find(a => a.id === id);
    setToast({ message: `🚨 Emergency Procurement Initiated for ${alert.medicine}. DMO notified.`, type: 'alert' });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const handleChatSubmit = useCallback((text) => {
    if (!text.trim()) return;
    
    // Add user message
    const newMessages = [...chatMessages, { role: 'user', content: text }];
    setChatMessages(newMessages);

    // Simulate AI thinking and variety
    setTimeout(() => {
      let reply = "I'm analyzing the clinical logistics data for Ernakulam. Is there a specific PHC or medicine category you'd like me to audit?";
      const input = text.toLowerCase();

      if (input.includes('stock') || input.includes('medicine') || input.includes('inventory')) {
        reply = "My current audit shows that while most essential medicines are stable, there's a localized shortage of ORS in Perumbavoor. I recommend a cross-network swap from Kochi Town.";
      } else if (input.includes('aluva')) {
        reply = "Aluva PHC is currently flagged as a HIGH-SURVEILLANCE zone due to zero Chloroquine stock. I have already drafted a swap route from Muvattupuzha via NH544.";
      } else if (input.includes('swap') || input.includes('route') || input.includes('move')) {
        reply = "I've optimized 4 logistics routes for today's re-balancing. The most critical is Aluva ↔ Muvattupuzha. You can approve these in the 'Smart Swap' section below.";
      } else if (input.includes('hi') || input.includes('hello')) {
        reply = "Hello! I am your Gemini-powered MediFlow assistant. I'm currently monitoring 8 PHCs in Ernakulam. How can I assist with network intelligence today?";
      } else if (input.includes('status') || input.includes('report')) {
        reply = "Network status is 88% SYNCED. 3 zones require immediate attention; Aluva and Angamaly are currently top priority for stock injection.";
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    }, 800);
  }, [chatMessages]);

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Dynamic Intelligence Table Logic
  const processedMedicines = inventory.map(m => {
    let seasonalMulti = 1;
    if (selectedSeason === 'monsoon' && (m.medicine === 'Chloroquine' || m.medicine === 'ORS Packets')) seasonalMulti = 2.5;
    if (selectedSeason === 'summer' && m.medicine === 'ORS Packets') seasonalMulti = 3;
    if (selectedSeason === 'winter' && (m.medicine === 'Paracetamol' || m.medicine === 'Amoxicillin')) seasonalMulti = 2;

    const dynamicNeed = Math.round(m.predictedNeed * seasonalMulti);
    const dynamicRisk = dynamicNeed > 400 ? 'Very High' : dynamicNeed > 250 ? 'High' : 'Medium';
    const dynamicStatus = m.stock === 0 ? 'critical' : (m.stock / dynamicNeed < 0.15) ? 'critical' : (m.stock / dynamicNeed < 0.4) ? 'warning' : 'good';

    return { ...m, predictedNeed: dynamicNeed, seasonalRisk: dynamicRisk, status: dynamicStatus };
  });

  // Reset page when search changes or total results change
  useEffect(() => {
    setTablePage(0);
  }, [searchTerm, processedMedicines.length]);

  // Filter and sort medicine table
  const filteredMedicines = processedMedicines
    .filter(m => m.medicine.toLowerCase().includes(searchTerm.toLowerCase()) || m.phc.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === 'string') return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const totalPages = Math.ceil(filteredMedicines.length / 5);
  const pagedMedicines = filteredMedicines.slice(tablePage * 5, (tablePage + 1) * 5);

  const statusColor = (s) => s === 'critical' ? 'text-red-500' : s === 'warning' ? 'text-amber-500' : 'text-emerald-500';
  const statusBg = (s) => s === 'critical' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : s === 'warning' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  const urgencyBg = (u) => u === 'CRITICAL' ? 'bg-red-500 text-white' : u === 'HIGH' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white';
  const rowBg = (d) => d <= 5 ? 'bg-red-50 dark:bg-red-950/30' : d <= 14 ? 'bg-amber-50 dark:bg-amber-950/30' : '';

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-colors duration-500">
        
        {/* Real-time Status Toast */}
        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border ${
              toast.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-red-600 border-red-500 text-white'
            }`}>
              {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              <span className="text-sm font-black uppercase tracking-tight">{toast.message}</span>
              <button onClick={() => setToast(null)} className="ml-2 hover:opacity-75"><X className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {/* ═══════════════ TOP NAVBAR ═══════════════ */}
        <nav className="sticky top-0 z-50 glass-card-strong shadow-lg shadow-black/5 dark:shadow-black/20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-500/30">
                    <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-800 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-teal-600 to-teal-800 dark:from-teal-400 dark:to-teal-200 bg-clip-text text-transparent">
                    MediFlow
                  </h1>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5 hidden sm:block">Rural PHC Intelligence</p>
                </div>
              </div>

              {/* Center items */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-teal-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Ernakulam District, Kerala</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-sm">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-slate-600 dark:text-slate-400">
                    {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Right items */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">AI Engine: Active</span>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative p-2 rounded-xl transition-colors ${showNotifications ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    {notifications > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/30">
                        {notifications}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute top-full right-0 mt-2 w-80 glass-card-strong rounded-2xl shadow-2xl z-[100] border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up">
                      <div className="p-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white flex items-center justify-between">
                        <h3 className="font-bold">Live Notifications</h3>
                        <button className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-md hover:bg-white/30 transition-colors">Mark all read</button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {activityFeed.slice(0, 5).map((notif, i) => (
                           <div key={i} className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{notif.text}</p>
                              <p className="text-[9px] text-slate-400 mt-1 font-bold">{notif.time || 'JUST NOW'}</p>
                           </div>
                        ))}
                      </div>
                      <div className="p-3 text-center bg-slate-50 dark:bg-slate-800/50">
                        <button className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline" onClick={() => {
                          document.getElementById('activity-feed')?.scrollIntoView({ behavior: 'smooth' });
                          setShowNotifications(false);
                        }}>View all activity</button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                </button>

                {/* SDG + Google badges */}
                <div className="hidden lg:flex items-center gap-2">
                  <div className="px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    SDG 3
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tagline bar */}
          <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 py-1.5">
            <p className="text-center text-[11px] sm:text-xs text-white/90 font-medium tracking-wide">
              Bridging Medicine Gaps Across Rural India — Powered by AI + Google Maps
            </p>
          </div>
        </nav>

        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

          {/* ═══════════════ HERO STATS BAR ═══════════════ */}
          <section id="hero-stats" className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Network Snapshot</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total PHCs Monitored', value: 47, icon: <Shield className="w-5 h-5" />, color: 'from-teal-500 to-teal-600', suffix: '' },
                { label: 'Active Stockouts', value: 12, icon: <AlertTriangle className="w-5 h-5" />, color: 'from-red-500 to-red-600', suffix: '' },
                { label: 'Swaps Completed Today', value: 8, icon: <RefreshCw className="w-5 h-5" />, color: 'from-blue-500 to-blue-600', suffix: '' },
                { label: 'Lives Potentially Impacted', value: 2400, icon: <Users className="w-5 h-5" />, color: 'from-purple-500 to-purple-600', suffix: '' },
                { label: 'AI Accuracy', value: 94.2, icon: <Brain className="w-5 h-5" />, color: 'from-emerald-500 to-emerald-600', suffix: '%' },
              ].map((stat, i) => (
                <div key={i} className="glass-card rounded-2xl p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default animate-fade-in-up" 
                     style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300 shadow-shadow-500/20`}>
                    {stat.icon}
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>


          <section className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl" id="phc-map">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-teal-500/20">
                  <MapPin className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div>
                   <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">Live Network State</span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">PHC Network Map — Ernakulam</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time supply tracking and AI-logistics visualizer</p>
                </div>
              </div>

              <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="px-4 py-2 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase text-slate-500">3 Critical Zones</span>
                </div>
                <button 
                  onClick={() => {
                    const icon = document.getElementById('map-refresh-icon-final');
                    icon?.classList.add('animate-spin');
                    setTimeout(() => icon?.classList.remove('animate-spin'), 1000);
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-[10px] font-black uppercase flex items-center gap-2 transition-all active:scale-95">
                  <RefreshCw id="map-refresh-icon-final" className="w-3 h-3" />
                  Recalibrate
                </button>
              </div>
            </div>

            <div className="relative bg-white dark:bg-slate-950 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden group">
              <div className="relative aspect-[16/9] w-full max-w-4xl mx-auto">
                <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-2xl overflow-visible">
                  <path d="M 10 10 Q 30 5, 55 10 Q 75 5, 95 20 Q 98 40, 92 60 Q 80 80, 50 78 Q 20 82, 10 70 Q 5 50, 8 30 Q 6 15, 10 10 Z"
                    className="fill-slate-50/50 dark:fill-slate-900/50 stroke-slate-200 dark:stroke-slate-800" strokeWidth="0.8" />

                  {/* Swap Routes */}
                  {SWAP_ROUTES.map((route, i) => {
                    const from = phcs.find(p => p.id === route.from);
                    const to = phcs.find(p => p.id === route.to);
                    if (!from || !to) return null;
                    return (
                      <g key={i}>
                        <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                          className="stroke-teal-500/20 dark:stroke-teal-400/10" strokeWidth="1" strokeDasharray="4,4" />
                        <circle r="1" className="fill-teal-500">
                          <animateMotion dur="3.5s" repeatCount="indefinite" path={`M${from.x},${from.y} L${to.x},${to.y}`} />
                        </circle>
                      </g>
                    );
                  })}

                  {/* PHC Nodes */}
                  {phcs.map(phc => {
                    const color = phc.status === 'critical' ? '#EF4444' : phc.status === 'warning' ? '#F59E0B' : '#10B981';
                    const isSelected = selectedPHC?.id === phc.id;
                    return (
                      <g key={phc.id} className="cursor-pointer group/node" onClick={() => setSelectedPHC(isSelected ? null : phc)}>
                        {phc.status === 'critical' && (
                          <circle cx={phc.x} cy={phc.y} r="5" fill="none" stroke={color} strokeWidth="0.5" className="animate-ping opacity-40" />
                        )}
                        <circle cx={phc.x} cy={phc.y} r={isSelected ? 4 : 2.5} fill={color} className="transition-all duration-300 drop-shadow-xl" stroke="white" strokeWidth="0.8" />
                        <text x={phc.x} y={phc.y + 6} textAnchor="middle" className="text-[3.2px] font-black fill-slate-700 dark:fill-slate-300 uppercase tracking-tighter pointer-events-none">{phc.name}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {selectedPHC && (
                <div className="absolute top-10 right-10 w-80 glass-card-strong rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-fade-in-up z-20">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{selectedPHC.name}</h3>
                      <p className="text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-[0.2em] mt-1.5">{selectedPHC.officer}</p>
                    </div>
                    <button onClick={() => setSelectedPHC(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    {selectedPHC.medicines.map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:scale-[1.02]">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{m.name}</span>
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${m.status === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                           <span className="text-[10px] font-black tracking-tighter">{m.stock} Units</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      setSearchTerm(selectedPHC.name);
                      setTablePage(0);
                      document.getElementById('inventory-table')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full mt-4 py-2 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-teal-600/20 active:scale-95">
                    Open Full Inventory
                  </button>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-slate-600 dark:text-slate-400">Critical Stockout</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-slate-600 dark:text-slate-400">Low Stock</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-slate-600 dark:text-slate-400">Surplus Stock</span></div>
              <div className="flex items-center gap-2"><span className="w-6 border-t-2 border-dashed border-teal-500" /><span className="text-slate-600 dark:text-slate-400">Active Swap Route</span></div>
            </div>
          </section>

          {/* ═══════════════ SECTION 2: MEDICINE INTELLIGENCE TABLE ═══════════════ */}
          <section className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800" id="inventory-table">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                  <Pill className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div>
                   <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Inventory Hub</span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">Medicine Intelligence Hub</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cross-network stock analysis and AI-shortage tracking</p>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search medicine or PHC..."
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setTablePage(0); }}
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all w-full sm:w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    {['medicine', 'category', 'phc', 'stock', 'daysRemaining', 'seasonalRisk', 'predictedNeed', 'status', 'action'].map(col => (
                      <th key={col} onClick={() => col !== 'action' && handleSort(col)}
                        className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${col !== 'action' ? 'cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors' : ''}`}>
                        {col === 'daysRemaining' ? 'Days Left' : col === 'predictedNeed' ? 'Predicted' : col === 'seasonalRisk' ? 'Season Risk' : col.charAt(0).toUpperCase() + col.slice(1)}
                        {sortConfig.key === col && <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pagedMedicines.map((m, i) => (
                    <tr key={i} className={`${rowBg(m.daysRemaining)} hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-colors group`}>
                      <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${m.status === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-transparent'}`} />
                          {m.medicine}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-500 dark:text-slate-400 font-medium text-xs">{m.category}</td>
                      <td className="px-4 py-4"><span className="flex items-center gap-1 font-bold"><MapPin className="w-3.5 h-3.5 text-teal-500" />{m.phc}</span></td>
                      <td className="px-4 py-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-black">
                            <span className="text-slate-700 dark:text-slate-300">{m.stock}</span>
                            <span className="text-slate-400">/ {m.predictedNeed}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ${m.status === 'critical' ? 'bg-red-500' : m.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min((m.stock / m.predictedNeed) * 100, 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4"><span className={`font-black tracking-tighter ${m.daysRemaining <= 5 ? 'text-red-600 animate-pulse' : m.daysRemaining <= 14 ? 'text-amber-600' : 'text-emerald-600'}`}>{m.daysRemaining} days</span></td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          m.seasonalRisk === 'Very High' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 
                          m.seasonalRisk === 'High' ? 'bg-amber-500 text-white' : 
                          'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {m.seasonalRisk}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                             <TrendingUp className="w-3 h-3 text-purple-500" />{m.predictedNeed}
                           </span>
                           <span className="text-[9px] text-slate-400 font-bold uppercase">Simulation Result</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border-2 ${
                          m.status === 'critical' ? 'border-red-500 text-red-600 bg-red-50 dark:bg-red-950/20' : 
                          m.status === 'warning' ? 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/20' : 
                          'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20'
                        }`}>
                          {m.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {m.status === 'critical' ? (
                          <button 
                            onClick={() => {
                              document.getElementById('swap-engine')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">Coordinate Swap</button>
                        ) : m.status === 'warning' ? (
                          <button 
                            onClick={() => {
                              document.getElementById('procurement-alerts')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-4 py-2 rounded-xl border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all active:scale-95">Procure</button>
                        ) : (
                          <div className="flex items-center gap-1 text-emerald-600">
                             <CheckCircle className="w-4 h-4" />
                             <span className="text-[10px] font-black uppercase">Stable</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="text-slate-500 dark:text-slate-400">Showing {tablePage * 5 + 1}-{Math.min((tablePage + 1) * 5, filteredMedicines.length)} of {filteredMedicines.length}</span>
              <div className="flex items-center gap-2">
                <button disabled={tablePage === 0} onClick={() => setTablePage(p => p - 1)}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setTablePage(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${tablePage === i ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    {i + 1}
                  </button>
                ))}
                <button disabled={tablePage === totalPages - 1} onClick={() => setTablePage(p => p + 1)}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* ═══════════════ SECTION 3: AI DEMAND FORECAST ═══════════════ */}
          <section className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl" id="ai-forecast">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
                  <Brain className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div>
                   <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">Predictive Modeling</span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">AI Demand Forecasting</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">30-day predictive analytics simulated via Gemini</p>
                </div>
              </div>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                {[
                  { key: 'monsoon', label: 'Monsoon', sub: 'Jun-Sep' },
                  { key: 'winter', label: 'Winter', sub: 'Nov-Feb' },
                  { key: 'summer', label: 'Summer', sub: 'Mar-May' },
                ].map(s => (
                  <button key={s.key} onClick={() => setSelectedSeason(s.key)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${selectedSeason === s.key ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                    {s.label}<br /><span className="text-[10px] opacity-60">{s.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={FORECAST_DATA[selectedSeason]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradChloroquine" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} /></linearGradient>
                    <linearGradient id="gradORS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} /><stop offset="95%" stopColor="#F59E0B" stopOpacity={0} /></linearGradient>
                    <linearGradient id="gradParacetamol" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} /><stop offset="95%" stopColor="#0D9488" stopOpacity={0} /></linearGradient>
                    <linearGradient id="gradAmoxicillin" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} /><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} /></linearGradient>
                    <linearGradient id="gradIFA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" dataKey="Chloroquine" stroke="#EF4444" fill="url(#gradChloroquine)" strokeWidth={2} dot={false} animationDuration={800} />
                  <Area type="monotone" dataKey="ORS" stroke="#F59E0B" fill="url(#gradORS)" strokeWidth={2} dot={false} animationDuration={800} />
                  <Area type="monotone" dataKey="Paracetamol" stroke="#0D9488" fill="url(#gradParacetamol)" strokeWidth={2} dot={false} animationDuration={800} />
                  <Area type="monotone" dataKey="Amoxicillin" stroke="#8B5CF6" fill="url(#gradAmoxicillin)" strokeWidth={2} dot={false} animationDuration={800} />
                  <Area type="monotone" dataKey="IronFolicAcid" stroke="#10B981" fill="url(#gradIFA)" strokeWidth={2} dot={false} animationDuration={800} name="Iron Folic Acid" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* AI Insight Card */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-200/50 dark:border-purple-800/30">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium text-purple-800 dark:text-purple-300 leading-relaxed">
                  {SEASON_INSIGHTS[selectedSeason]}
                </p>
              </div>
            </div>
          </section>

          {/* ═══════════════ SECTION 4: SMART SWAP SUGGESTIONS ═══════════════ */}
          <section className="space-y-6" id="swap-engine">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-xl shadow-teal-500/20">
                <RefreshCw className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                 <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">Logistics Optimization</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">Smart Swap Suggestions</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AI-driven redistribution with Google Maps route tracking</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SWAP_SUGGESTIONS.map(swap => {
                const state = swapStates[swap.id];
                return (
                  <div key={swap.id}
                    className={`relative rounded-2xl p-5 border transition-all duration-500 ${
                      state === 'accepted' ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' :
                      state === 'declined' ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60' :
                      'glass-card hover:shadow-lg hover:-translate-y-0.5'
                    }`}>
                    {state === 'declined' && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <span className="text-2xl font-black text-red-400/40 -rotate-12">DECLINED</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-teal-500" />
                        <span className="font-bold text-slate-900 dark:text-white">{swap.quantity} units {swap.medicine}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${urgencyBg(swap.urgency)}`}>
                        {swap.urgency}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3 text-sm">
                      <span className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 font-semibold text-xs">{swap.from}</span>
                      <ArrowRight className="w-4 h-4 text-teal-500" />
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">{swap.to}</span>
                    </div>

                    <div className="flex items-center gap-3 mb-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800"><MapPin className="w-3 h-3" />{swap.distance}</span>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800"><Truck className="w-3 h-3" />{swap.eta}</span>
                    </div>

                    {state === 'accepted' ? (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">✅ Transfer Initiated — Driver notified via SMS</span>
                      </div>
                    ) : state === 'declined' ? null : (
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleSwap(swap.id, 'accepted')}
                          className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95">
                          Accept
                        </button>
                        <button onClick={() => handleSwap(swap.id, 'declined')}
                          className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 active:scale-95">
                          Decline
                        </button>
                        <button 
                          onClick={() => setActiveRoute(swap)}
                          className="py-2 px-3 rounded-xl border-2 border-teal-500 text-teal-600 dark:text-teal-400 text-sm font-semibold hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ═══════════════ SECTION 5: PROCUREMENT ALERT CENTER ═══════════════ */}
          <section className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800" id="procurement-alerts">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white shadow-xl shadow-red-500/20">
                <AlertTriangle className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                 <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Priority Response</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">Critical Procurement Alerts</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Supply chain escalations requiring District Office approval</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {PROCUREMENT_ALERTS.map(alert => (
                <div key={alert.id}
                  className={`rounded-2xl p-5 border-l-4 glass-card transition-all duration-300 hover:shadow-lg ${
                    alert.severity === 'CRITICAL' ? 'border-l-red-500' : alert.severity === 'HIGH' ? 'border-l-amber-500' : 'border-l-blue-500'
                  }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900 dark:text-white">{alert.medicine}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${urgencyBg(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Affected PHCs</span><span className="font-semibold text-slate-900 dark:text-white">{alert.affectedPHCs}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Current Stock</span><span className="font-semibold text-red-600 dark:text-red-400">{alert.currentStock}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Min Required</span><span className="font-semibold text-slate-900 dark:text-white">{alert.minRequired}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Shortage Gap</span><span className="font-bold text-red-600 dark:text-red-400">-{alert.shortageGap}</span></div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-red-500 to-amber-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((alert.currentStock / alert.minRequired) * 100, 100)}%` }} />
                    </div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Order Qty</span><span className="font-semibold text-teal-600 dark:text-teal-400">{alert.orderQty}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Estimated Cost</span><span className="font-bold text-slate-900 dark:text-white">{alert.cost}</span></div>
                  </div>

                  {alertStates[alert.id] ? (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Alert sent to DMO Dr. Rajesh Kumar via email + WhatsApp</span>
                    </div>
                  ) : (
                    <button onClick={() => handleAlert(alert.id)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm font-semibold transition-all shadow-md shadow-teal-500/20 hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Send to District Medical Officer
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════════ SECTION 6: IMPACT ANALYTICS ═══════════════ */}
          <section className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800" id="impact-analytics">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                <TrendingUp className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                 <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Network Performance</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">System Impact Analytics</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Measuring healthcare delivery improvements network-wide</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Monthly Swaps vs Stockouts Prevented</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MONTHLY_IMPACT}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="swaps" name="Swaps Completed" fill="#0D9488" radius={[6, 6, 0, 0]} animationDuration={800} />
                      <Bar dataKey="prevented" name="Stockouts Prevented" fill="#8B5CF6" radius={[6, 6, 0, 0]} animationDuration={800} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Medicine Category Shortage Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={SHORTAGE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={50} outerRadius={90}
                        paddingAngle={5} dataKey="value" animationDuration={800} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {SHORTAGE_DISTRIBUTION.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[
                { icon: '🏆', text: '2,400 patients served without interruption this month', color: 'from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800' },
                { icon: '💊', text: '47 stockout incidents prevented via AI alerts', color: 'from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 border-teal-200 dark:border-teal-800' },
                { icon: '🌍', text: 'Contributes to SDG 3: Good Health & Well-being', color: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800' },
              ].map((badge, i) => (
                <div key={i} className={`p-4 rounded-xl bg-gradient-to-br ${badge.color} border flex items-start gap-3 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}>
                  <span className="text-2xl">{badge.icon}</span>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{badge.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════════ SECTION 7: LIVE ACTIVITY FEED ═══════════════ */}
          <section className="glass-card rounded-2xl p-6" id="activity-feed">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">⚡ Live Network Activity</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Real-time feed from across the PHC network</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">LIVE</span>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {activityFeed.map((entry, i) => (
                <div key={entry.id || i}
                  className={`flex items-start gap-3 p-3 rounded-xl border-l-4 ${entry.color} bg-white dark:bg-slate-800/50 transition-all duration-500`}
                  style={{ animation: i === 0 ? 'fade-in-up 0.5s ease-out' : 'none' }}>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{entry.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono whitespace-nowrap mt-0.5">
                    {entry.time || currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </section>

        </main>

        {/* ═══════════════ FOOTER ═══════════════ */}
        <footer className="border-t border-slate-200 dark:border-slate-800 mt-12">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">MediFlow — Rural PHC Intelligence Network</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Bridging Medicine Gaps Across Rural India</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-lg">🌍</span>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">SDG 3</p>
                    <p className="text-[9px] text-emerald-600 dark:text-emerald-500">Good Health & Well-being</p>
                  </div>
                </div>
              </div>

              <div className="text-center md:text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Powered by Google Maps API • Gemini AI • Firebase
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Team MediFlow • GDSC Kerala
                </p>
              </div>
            </div>
          </div>
        </footer>

        {/* ═══════════════ MODALS & FLOATING UI ═══════════════ */}

        {/* Floating AI FAB */}
        <button 
          onClick={() => setShowChat(!showChat)}
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 z-[100] ${showChat ? 'bg-slate-800 rotate-90' : 'bg-gradient-to-br from-purple-600 to-blue-600 hover:scale-110'}`}>
          {showChat ? <X className="w-6 h-6 text-white" /> : <Brain className="w-6 h-6 text-white" />}
          {!showChat && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce" />}
        </button>

        {/* Gemini Chat Sidebar */}
        <div className={`fixed top-0 right-0 h-full w-full sm:w-96 glass-card-strong border-l border-slate-200 dark:border-slate-800 shadow-2xl z-[90] transition-transform duration-500 transform ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-600 to-blue-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Gemini Intelligence</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider">Analyzing Live Data</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-teal-500 text-white shadow-lg' : 'glass-card text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Query Frames */}
            <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900">
               <p className="text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest px-1">Suggested Audit Queries</p>
               <div className="flex flex-wrap gap-2">
                 {[
                   "Audit Aluva stock",
                   "Network status report",
                   "Analyze Monsoon risks",
                   "Show pending swaps"
                 ].map((query, i) => (
                   <button 
                     key={i}
                     onClick={() => handleChatSubmit(query)}
                     className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all active:scale-95 shadow-sm">
                     {query}
                   </button>
                 ))}
               </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-card-dark">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask Gemini about stock..." 
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      handleChatSubmit(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Route Modal */}
        {activeRoute && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
            <div className="w-full max-w-2xl glass-card-strong rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Supply Route Optimization</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-none mt-0.5">Powered by Google Maps Platform</p>
                  </div>
                </div>
                <button onClick={() => setActiveRoute(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="aspect-video relative bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/10 to-transparent pointer-events-none" />
                
                {/* Enhanced Mock Map Background */}
                <svg viewBox="0 0 100 50" className="w-full h-full">
                   {/* Grid lines */}
                   <path d="M0,10 L100,10 M0,20 L100,20 M0,30 L100,30 M0,40 L100,40" stroke="#E2E8F0" dark-stroke="#1E293B" strokeWidth="0.2" />
                   <path d="M10,0 L10,50 M20,0 L20,50 M30,0 L30,50 M40,0 L40,50 M50,0 L50,50 M60,0 L60,50 M70,0 L70,50 M80,0 L80,50 M90,0 L90,50" stroke="#E2E8F0" dark-stroke="#1E293B" strokeWidth="0.2" />

                   <path d="M0,25 Q25,5 50,25 T100,25" fill="none" stroke="#CBD5E1" strokeWidth="0.8" />
                   <path d="M10,0 Q10,25 90,50" fill="none" stroke="#CBD5E1" strokeWidth="0.8" />
                   <path d="M20,50 L80,0" fill="none" stroke="#CBD5E1" strokeWidth="0.8" />
                   
                   {/* Highlighted Route - High Contrast */}
                   <path d="M20,15 L40,30 L70,25 L85,40" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeDasharray="3,4">
                      <animate attributeName="stroke-dashoffset" from="14" to="0" dur="2s" repeatCount="indefinite" />
                   </path>
                   
                   {/* Truck Icon on Route */}
                   <g>
                      <circle r="1.8" fill="#0D9488" stroke="white" strokeWidth="0.5" className="filter drop-shadow-md">
                         <animateMotion dur="5s" repeatCount="indefinite" path="M20,15 L40,30 L70,25 L85,40" />
                      </circle>
                   </g>

                   <circle cx="20" cy="15" r="2.5" fill="#EF4444" stroke="white" strokeWidth="0.8" />
                   <circle cx="85" cy="40" r="2.5" fill="#10B981" stroke="white" strokeWidth="0.8" />
                   
                   <text x="23" y="15" fontSize="2.5" fontWeight="bold" className="fill-slate-700 dark:fill-slate-300">Origin</text>
                   <text x="75" y="40" fontSize="2.5" fontWeight="bold" className="fill-slate-700 dark:fill-slate-300">Dest</text>
                </svg>

                {/* Overlays */}
                <div className="absolute bottom-4 left-4 p-4 glass-card-strong rounded-2xl border border-teal-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Truck className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-[10px] font-bold text-teal-600 uppercase">Live Tracker</p>
                      <p className="text-xs font-bold">{activeRoute.quantity} units {activeRoute.medicine}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-8 text-[10px] font-medium text-slate-500 uppercase tracking-tighter mt-4">
                     <div>
                        <p>ETA</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">14 mins</p>
                     </div>
                     <div>
                        <p>TRAFFIC</p>
                        <p className="text-sm font-bold text-emerald-500 leading-none">LIGHT</p>
                     </div>
                  </div>
                </div>
              </div>

              <div className="p-4 grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50">
                 <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">FROM</p>
                    <p className="font-bold text-sm text-slate-800 dark:text-white">{activeRoute.from} PHC</p>
                 </div>
                 <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">TO</p>
                    <p className="font-bold text-sm text-center text-slate-800 dark:text-white">{activeRoute.to} PHC</p>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

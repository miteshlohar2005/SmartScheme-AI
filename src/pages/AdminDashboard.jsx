import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, FileText, Activity, ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';

const AdminDashboard = () => {
    const stats = [
        { label: 'Total Users', value: '1,24,592', change: '+12.5%', trend: 'up', icon: Users, color: 'var(--blue)' },
        { label: 'Active Schemes', value: '845', change: '+5.2%', trend: 'up', icon: FileText, color: 'var(--saffron)' },
        { label: 'Claims Processed', value: '52,430', change: '+18.4%', trend: 'up', icon: Activity, color: 'var(--success)' },
        { label: 'Funds Disbursed', value: '₹420Cr', change: '-2.4%', trend: 'down', icon: IndianRupee, color: 'var(--danger)' }
    ];

    const recentActivity = [
        { user: 'Rakesh K...', action: 'Matched with PM Kisan', time: '2 mins ago', status: 'Success' },
        { user: 'Priya S...', action: 'Scheme Check (Health)', time: '15 mins ago', status: 'In Progress' },
        { user: 'Amit P...', action: 'Claimed PMJDY', time: '1 hour ago', status: 'Success' },
        { user: 'Sunita D...', action: 'Query to AI Assistant', time: '2 hours ago', status: 'Resolved' }
    ];

    const topSchemes = [
        { name: 'Pradhan Mantri Jan Dhan Yojana', applications: '45,210', increase: '+15%' },
        { name: 'PM Kisan Samman Nidhi', applications: '34,900', increase: '+8%' },
        { name: 'Ayushman Bharat', applications: '29,450', increase: '+22%' }
    ];

    const handleGenerateReport = () => {
        // Generating CSV content for Excel compatibility
        let csvContent = "PLATFORM STATISTICS\n";
        csvContent += "Metric,Value,Change,Trend\n";
        stats.forEach(stat => {
            csvContent += `"${stat.label}","${stat.value}","${stat.change}","${stat.trend}"\n`;
        });

        csvContent += "\nRECENT ACTIVITY\n";
        csvContent += "User,Action,Time,Status\n";
        recentActivity.forEach(act => {
            csvContent += `"${act.user}","${act.action}","${act.time}","${act.status}"\n`;
        });

        csvContent += "\nTOP SCHEMES\n";
        csvContent += "Scheme Name,Applications,Growth\n";
        topSchemes.forEach(scheme => {
            csvContent += `"${scheme.name}","${scheme.applications}","${scheme.increase}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'SmartScheme_Report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('Report generated and downloaded as Excel (CSV) successfully!');
    };

    return (
        <div style={{ background: 'var(--slate-100)', minHeight: 'calc(100vh - 140px)', padding: '2rem 1.5rem' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Admin Dashboard</h1>
                        <p style={{ color: 'var(--slate-500)', margin: 0 }}>Overview of SmartScheme AI platform usage & metrics.</p>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }} onClick={handleGenerateReport}>
                        <BarChart3 size={18} /> Generate Report
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6" style={{ marginBottom: '2rem' }}>
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="card"
                            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: `4px solid ${stat.color}` }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ background: `${stat.color}15`, padding: '0.75rem', borderRadius: '50%', color: stat.color }}>
                                    <stat.icon size={24} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: '600', color: stat.trend === 'up' ? 'var(--success)' : 'var(--danger)', background: stat.trend === 'up' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '0.25rem 0.5rem', borderRadius: '50px' }}>
                                    {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.change}
                                </div>
                            </div>

                            <div>
                                <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>{stat.label}</p>
                                <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: 0, fontWeight: '800' }}>{stat.value}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="grid md:grid-cols-3 gap-6">

                    {/* Top Schemes */}
                    <div className="card md:col-span-2" style={{ padding: '0' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Most Applied Schemes</h2>
                            <button style={{ color: 'var(--blue)', fontWeight: '600', fontSize: '0.875rem' }}>View All</button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'var(--slate-50)', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Scheme Name</th>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Applications</th>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Growth</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topSchemes.map((scheme, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--slate-100)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--slate-50)'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500', color: 'var(--blue)' }}>{scheme.name}</td>
                                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>{scheme.applications}</td>
                                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--success)', fontWeight: '600' }}>{scheme.increase}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Real-time Activity */}
                    <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--slate-200)' }}>
                            <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }}></span>
                                Live Activity
                            </h2>
                        </div>

                        <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {recentActivity.map((act, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                                    {i !== recentActivity.length - 1 && (
                                        <div style={{ position: 'absolute', top: '24px', left: '11px', bottom: '-24px', width: '2px', background: 'var(--slate-200)' }}></div>
                                    )}
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: act.status === 'Success' ? 'var(--success)' : act.status === 'Resolved' ? 'var(--blue)' : 'var(--saffron)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid white', zIndex: 1 }}>
                                        <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }}></div>
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: 'var(--text-primary)' }}><span style={{ fontWeight: '600' }}>{act.user}</span> {act.action}</h4>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{act.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: '1rem', borderTop: '1px solid var(--slate-100)', textAlign: 'center' }}>
                            <button style={{ color: 'var(--blue)', fontWeight: '600', fontSize: '0.875rem' }}>View Full Logs</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

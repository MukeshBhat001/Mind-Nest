/**
 * Administrator Dashboard Page Component
 * Mind Nest - University Web Applications Assignment
 * Demonstrates:
 * - Full CRUD control over lessons, videos, and psychoeducation articles
 * - User management & RBAC role promotion
 * - Student self-assessment submission reports
 * - Aggregate system statistics
 * - Form validation and error prevention
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  X,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import { validateContentForm } from '../utils/validation';
import '../styles/AdminDashboard.css';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'content' | 'users' | 'quizzes' | 'stats'>('content');
  const [loading, setLoading] = useState(true);

  // Content Data
  const [contents, setContents] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);

  // Content Modal (Add / Edit)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('Anxiety Relief');
  const [formType, setFormType] = useState('audio');
  const [formMediaUrl, setFormMediaUrl] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('');
  const [formDuration, setFormDuration] = useState('5');
  const [formReadTime, setFormReadTime] = useState('4 min read');
  const [formIsPreview, setFormIsPreview] = useState(false);
  const [formContentBody, setFormContentBody] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [cRes, uRes, qRes, sRes] = await Promise.all([
        api.getContent(),
        api.getAdminUsers(),
        api.getAdminQuizResults(),
        api.getStats(),
      ]);

      if (cRes.success) setContents(cRes.contents);
      if (uRes.success) setUsersList(uRes.users);
      if (qRes.success) setQuizResults(qRes.results);
      if (sRes.success) setStats(sRes.stats);
    } catch (err) {
      console.error('Error fetching admin datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setFormTitle('');
    setFormDesc('');
    setFormCategory('Anxiety Relief');
    setFormType('audio');
    setFormMediaUrl('https://actions.google.com/sounds/v1/water/waves_crashing_on_rocks_loop.ogg');
    setFormThumbnail('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80');
    setFormDuration('5');
    setFormReadTime('4 min read');
    setFormIsPreview(false);
    setFormContentBody('');
    setFormErrors({});
  };

  const handleOpenEditModal = (item: any) => {
    setModalMode('edit');
    setEditingId(item._id);
    setFormTitle(item.title);
    setFormDesc(item.description);
    setFormCategory(item.category);
    setFormType(item.type);
    setFormMediaUrl(item.mediaUrl || '');
    setFormThumbnail(item.thumbnail || '');
    setFormDuration(String(item.duration || 5));
    setFormReadTime(item.readTime || '4 min read');
    setFormIsPreview(Boolean(item.isPreview));
    setFormContentBody(item.contentBody || '');
    setFormErrors({});
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContentForm({
      title: formTitle,
      description: formDesc,
      category: formCategory,
      type: formType,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const payload = {
      title: formTitle.trim(),
      description: formDesc.trim(),
      category: formCategory,
      type: formType,
      mediaUrl: formMediaUrl.trim(),
      thumbnail: formThumbnail.trim() || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      duration: Number(formDuration) || 5,
      readTime: formReadTime.trim(),
      isPreview: formIsPreview,
      contentBody: formContentBody,
    };

    try {
      if (modalMode === 'add') {
        const res = await api.createContent(payload);
        if (res.success) {
          showNotice('New mindfulness lesson successfully added to library.');
          setModalMode(null);
          loadAllAdminData();
        }
      } else if (modalMode === 'edit' && editingId) {
        const res = await api.updateContent(editingId, payload);
        if (res.success) {
          showNotice('Content resource updated successfully.');
          setModalMode(null);
          loadAllAdminData();
        }
      }
    } catch (err) {
      console.error('Failed to save content:', err);
    }
  };

  const handleDeleteContent = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      const res = await api.deleteContent(id);
      if (res.success) {
        showNotice(`Deleted "${title}" from catalogue.`);
        loadAllAdminData();
      }
    } catch (err) {
      console.error('Failed to delete content:', err);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await api.updateUserRole(userId, newRole);
      if (res.success) {
        showNotice('User access role updated.');
        loadAllAdminData();
      }
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Remove user account for ${userName}?`)) return;
    try {
      const res = await api.deleteUser(userId);
      if (res.success) {
        showNotice(`Account for ${userName} removed.`);
        loadAllAdminData();
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="container">
        {/* Admin Header */}
        <div className="admin-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge admin-badge">
                <Shield size={14} style={{ marginRight: '4px' }} />
                Administrative Access Layer
              </span>
              <span className="badge badge-sage">University Assignment Full CRUD</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', color: 'var(--sage-900)' }}>
              Mind Nest Administrator Control Hub
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Manage multimedia library curriculum, registered members, self-assessment submissions, and metrics.
            </p>
          </div>

          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <Plus size={18} />
            <span>Create New Resource</span>
          </button>
        </div>

        {/* Global Feedback Notice */}
        {actionNotice && (
          <div
            style={{
              backgroundColor: 'var(--sage-100)',
              color: 'var(--sage-800)',
              border: '1px solid var(--sage-300)',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
            }}
          >
            <CheckCircle2 size={18} color="var(--sage-600)" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="dashboard-tabs" style={{ marginBottom: '28px' }}>
          <button
            className={`dashboard-tab-btn ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <BookOpen size={16} />
            <span>Content Library CRUD ({contents.length})</span>
          </button>

          <button
            className={`dashboard-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} />
            <span>User Management ({usersList.length})</span>
          </button>

          <button
            className={`dashboard-tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            <ClipboardList size={16} />
            <span>Student Assessments ({quizResults.length})</span>
          </button>

          <button
            className={`dashboard-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 size={16} />
            <span>System KPIs & Analytics</span>
          </button>
        </div>

        {/* TAB 1: CONTENT CRUD */}
        {activeTab === 'content' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--sage-900)' }}>
                Mindfulness Lessons, Audios & Articles
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Showing all {contents.length} published resources
              </span>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Format</th>
                    <th>Access</th>
                    <th>Duration</th>
                    <th>Author</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contents.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={item.thumbnail}
                            alt=""
                            style={{ width: '48px', height: '36px', borderRadius: '4px', objectFit: 'cover' }}
                          />
                          <div>
                            <strong style={{ display: 'block', color: 'var(--sage-900)' }}>
                              {item.title}
                            </strong>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              ID: {item._id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-sage">{item.category}</span>
                      </td>
                      <td>
                        <span style={{ textTransform: 'capitalize' }}>{item.type}</span>
                      </td>
                      <td>
                        {item.isPreview ? (
                          <span className="badge badge-preview">Free Sample</span>
                        ) : (
                          <span className="badge badge-member">Member Locked</span>
                        )}
                      </td>
                      <td>
                        {item.duration ? `${item.duration} min` : item.readTime}
                      </td>
                      <td>{item.author}</td>
                      <td>
                        <div className="action-btn-group">
                          <button
                            className="action-btn"
                            onClick={() => handleOpenEditModal(item)}
                            title="Edit Resource"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDeleteContent(item._id, item.title)}
                            title="Delete Resource"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--sage-900)' }}>
                Registered User Directory & Roles
              </h3>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Current Role</th>
                    <th>Role Action</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                            alt=""
                            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                          />
                          <strong>{u.name}</strong>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={u.role === 'admin' ? 'badge badge-admin' : 'badge badge-member'}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select"
                          style={{ padding: '4px 10px', fontSize: '0.82rem', width: 'auto' }}
                          value={u.role}
                          onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                        >
                          <option value="member">Member</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          title="Remove User"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: QUIZ SUBMISSIONS */}
        {activeTab === 'quizzes' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--sage-900)' }}>
                Student Self-Assessment Evaluations
              </h3>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student Email</th>
                    <th>Assessment Scale</th>
                    <th>Score</th>
                    <th>Assessed Level</th>
                    <th>Recommended Focus</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {quizResults.map((qr) => (
                    <tr key={qr._id}>
                      <td>{qr.userEmail}</td>
                      <td><strong>{qr.quizTitle}</strong></td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--sage-800)' }}>
                          {qr.totalScore}
                        </span>
                        /{qr.maxScore}
                      </td>
                      <td>
                        <span className="badge badge-sage">{qr.stressLevel}</span>
                      </td>
                      <td>{qr.recommendedCategory}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(qr.date).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM METRICS */}
        {activeTab === 'stats' && stats && (
          <div>
            <div className="grid-3" style={{ marginBottom: '24px' }}>
              <div className="stat-widget">
                <span className="stat-label">Total Registered Users</span>
                <div className="stat-value">{stats.totalUsers}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {stats.totalMembers} Members • {stats.totalAdmins} Admins
                </div>
              </div>

              <div className="stat-widget">
                <span className="stat-label">Published Curriculum Items</span>
                <div className="stat-value">{stats.totalContents}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {stats.audioCount} Audio • {stats.videoCount} Video • {stats.articleCount} Articles
                </div>
              </div>

              <div className="stat-widget">
                <span className="stat-label">Quiz Submissions Logged</span>
                <div className="stat-value">{stats.totalQuizSubmissions}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Evaluated stress & mental vitality records
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <h4 style={{ color: 'var(--sage-900)', marginBottom: '8px' }}>
                Coursework Compliance Verification
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                • <strong>MERN Architecture:</strong> MongoDB Mongoose Schemas (User, Content, QuizResult, Progress) with fallback persistence.
                <br />• <strong>REST API:</strong> Express routes for Auth, Content CRUD, Assessment, and User Progress.
                <br />• <strong>Access Control:</strong> Guest (Sample preview access), Member (Save favorites, log streaks), Admin (Full CRUD).
                <br />• <strong>Styling Requirements:</strong> Standard external CSS, internal CSS via &lt;style&gt;, and inline styles without Tailwind.
              </p>
            </div>
          </div>
        )}

        {/* CONTENT ADD / EDIT MODAL */}
        {modalMode && (
          <div className="modal-overlay" onClick={() => setModalMode(null)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '640px', padding: '32px' }}
            >
              <button
                className="close-modal-btn"
                onClick={() => setModalMode(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <h2 style={{ fontSize: '1.5rem', color: 'var(--sage-900)', marginBottom: '6px' }}>
                {modalMode === 'add' ? 'Publish New Mindfulness Resource' : 'Edit Mindfulness Resource'}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Manage lessons, videos, and articles for the Mind Nest curriculum.
              </p>

              <form onSubmit={handleSaveContent}>
                <div className="form-group">
                  <label className="form-label" htmlFor="content-title">Title</label>
                  <input
                    id="content-title"
                    type="text"
                    className={`form-input ${formErrors.title ? 'error' : ''}`}
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. 10-Minute Body Scan for Restful Sleep"
                  />
                  {formErrors.title && <span className="error-text">{formErrors.title}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="content-description">Description</label>
                  <textarea
                    id="content-description"
                    className={`form-textarea ${formErrors.description ? 'error' : ''}`}
                    rows={2}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Provide a concise clinical summary of the practice..."
                  />
                  {formErrors.description && <span className="error-text">{formErrors.description}</span>}
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="content-category">Category</label>
                    <select
                      id="content-category"
                      className="form-select"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                    >
                      <option value="Sleep">Sleep</option>
                      <option value="Focus">Focus</option>
                      <option value="Anxiety Relief">Anxiety Relief</option>
                      <option value="Mindfulness">Mindfulness</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="content-type">Format Type</label>
                    <select
                      id="content-type"
                      className="form-select"
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                    >
                      <option value="audio">Guided Audio</option>
                      <option value="video">Wellness Video</option>
                      <option value="article">Psychoeducation Article</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="content-duration">Duration (Minutes)</label>
                    <input
                      id="content-duration"
                      type="number"
                      min="1"
                      className="form-input"
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="content-read-time">Read Time (For Articles)</label>
                    <input
                      id="content-read-time"
                      type="text"
                      className="form-input"
                      value={formReadTime}
                      onChange={(e) => setFormReadTime(e.target.value)}
                      placeholder="e.g. 4 min read"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="content-media-url">Media Stream URL (Audio/Video)</label>
                  <input
                    id="content-media-url"
                    type="text"
                    className="form-input"
                    value={formMediaUrl}
                    onChange={(e) => setFormMediaUrl(e.target.value)}
                    placeholder="https://actions.google.com/... or mp4 link"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="content-thumbnail">Thumbnail Image URL</label>
                  <input
                    id="content-thumbnail"
                    type="text"
                    className="form-input"
                    value={formThumbnail}
                    onChange={(e) => setFormThumbnail(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id="content-preview-checkbox"
                    checked={formIsPreview}
                    onChange={(e) => setFormIsPreview(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <label htmlFor="content-preview-checkbox" style={{ fontSize: '0.9rem', color: 'var(--sage-900)', fontWeight: 600 }}>
                    Enable Free Sample Preview for Non-Registered Guests
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="content-body">Article Content or Guided Audio Script</label>
                  <textarea
                    id="content-body"
                    className="form-textarea"
                    rows={4}
                    value={formContentBody}
                    onChange={(e) => setFormContentBody(e.target.value)}
                    placeholder="Enter full guidance text or educational article body..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalMode(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {modalMode === 'add' ? 'Publish Resource' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

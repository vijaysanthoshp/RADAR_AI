'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  notificationService, 
  EmergencyContact, 
  NotificationChannel 
} from '@/lib/notifications/notificationService';
import { useNotifications } from '@/lib/notifications/useNotifications';

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { isConfigured, testAlert } = useNotifications();

  const [formData, setFormData] = useState<Omit<EmergencyContact, 'id'>>({
    name: '',
    role: '',
    phone: '',
    email: '',
    priority: 1,
    notificationPreferences: ['sms', 'email'],
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    const allContacts = notificationService.getEmergencyContacts();
    setContacts(allContacts);
  };

  const handleAdd = () => {
    const newContact: EmergencyContact = {
      ...formData,
      id: Date.now().toString(),
    };

    notificationService.addEmergencyContact(newContact);
    loadContacts();
    resetForm();
  };

  const handleEdit = (contact: EmergencyContact) => {
    setEditingId(contact.id);
    setFormData({
      name: contact.name,
      role: contact.role,
      phone: contact.phone,
      email: contact.email || '',
      priority: contact.priority,
      notificationPreferences: contact.notificationPreferences,
    });
    setIsAdding(true);
  };

  const handleUpdate = () => {
    if (!editingId) return;

    const updatedContact: EmergencyContact = {
      ...formData,
      id: editingId,
    };

    notificationService.updateEmergencyContact(editingId, updatedContact);
    loadContacts();
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this contact?')) {
      notificationService.removeEmergencyContact(id);
      loadContacts();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      phone: '',
      email: '',
      priority: 1,
      notificationPreferences: ['sms', 'email'],
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const toggleChannel = (channel: NotificationChannel) => {
    setFormData(prev => ({
      ...prev,
      notificationPreferences: prev.notificationPreferences.includes(channel)
        ? prev.notificationPreferences.filter(c => c !== channel)
        : [...prev.notificationPreferences, channel],
    }));
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Primary';
      case 2: return 'Secondary';
      case 3: return 'Tertiary';
      default: return `Level ${priority}`;
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Emergency Contacts</h1>
          <p className="text-muted-foreground">
            Manage who receives alerts when vital signs become critical
          </p>
        </div>
        <div className="flex gap-2">
          {isConfigured && (
            <Button
              variant="outline"
              onClick={() => testAlert('YELLOW')}
            >
              🧪 Test Alert
            </Button>
          )}
          <Button
            onClick={() => setIsAdding(!isAdding)}
            variant={isAdding ? 'outline' : 'default'}
          >
            {isAdding ? 'Cancel' : '➕ Add Contact'}
          </Button>
        </div>
      </div>

      {/* Configuration Status */}
      {!isConfigured && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="text-yellow-700 dark:text-yellow-400">
              ⚠️ Notification Services Not Configured
            </CardTitle>
            <CardDescription>
              Please configure Twilio, Resend, and VAPID keys in your .env.local file.
              See ALERT_SETUP_GUIDE.md for instructions.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Add/Edit Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Edit Contact' : 'Add New Emergency Contact'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Dr. Sarah Johnson"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role/Title *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Primary Physician"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+15551234567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="doctor@hospital.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level *</Label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                className="w-full border rounded-md p-2"
              >
                <option value={1}>1 - Primary (Contacted first)</option>
                <option value={2}>2 - Secondary (Backup)</option>
                <option value={3}>3 - Tertiary (Additional)</option>
                <option value={4}>4 - Low Priority</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Notification Channels *</Label>
              <div className="flex flex-wrap gap-2">
                {(['sms', 'email', 'call', 'push'] as NotificationChannel[]).map(channel => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => toggleChannel(channel)}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      formData.notificationPreferences.includes(channel)
                        ? 'bg-blue-500 text-white border-blue-600'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {channel === 'sms' && '📱 SMS'}
                    {channel === 'email' && '📧 Email'}
                    {channel === 'call' && '📞 Voice Call'}
                    {channel === 'push' && '🔔 Push'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={editingId ? handleUpdate : handleAdd}
                disabled={!formData.name || !formData.role || !formData.phone}
              >
                {editingId ? 'Update Contact' : 'Add Contact'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No emergency contacts configured yet.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Add contacts to receive alerts when patient vital signs become critical.
              </p>
            </CardContent>
          </Card>
        ) : (
          contacts.map(contact => (
            <Card key={contact.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{contact.name}</CardTitle>
                    <Badge className={getPriorityColor(contact.priority)}>
                      {getPriorityLabel(contact.priority)}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    {contact.role}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(contact)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(contact.id)}
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">📱 Phone:</span>
                    <span className="text-sm">{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">📧 Email:</span>
                      <span className="text-sm">{contact.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">🔔 Channels:</span>
                    <div className="flex gap-1">
                      {contact.notificationPreferences.map(channel => (
                        <Badge key={channel} variant="secondary">
                          {channel.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Alert Matrix Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Configuration Matrix</CardTitle>
          <CardDescription>
            Which channels are activated for each severity level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Severity</th>
                  <th className="text-center p-2">SMS</th>
                  <th className="text-center p-2">Email</th>
                  <th className="text-center p-2">Voice Call</th>
                  <th className="text-center p-2">Push</th>
                  <th className="text-center p-2">Webhook</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2"><Badge className="bg-green-500">GREEN</Badge></td>
                  <td className="text-center">❌</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">❌</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2"><Badge className="bg-yellow-500">YELLOW</Badge></td>
                  <td className="text-center">❌</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">❌</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2"><Badge className="bg-orange-500">ORANGE</Badge></td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅</td>
                </tr>
                <tr>
                  <td className="p-2"><Badge className="bg-red-500">RED</Badge></td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p><strong>Escalation Timeouts:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>YELLOW: 30 minutes cooldown before re-alerting</li>
              <li>ORANGE: 15 minutes cooldown</li>
              <li>RED: 5 minutes cooldown</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

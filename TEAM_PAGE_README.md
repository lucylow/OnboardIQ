# Team Page - OnboardIQ

## Overview
The Team Page (`/team`) is a comprehensive team management interface for OnboardIQ that allows administrators to manage team members, roles, permissions, and view analytics.

## Features

### 🏠 Team Members Management
- **Member List**: View all team members with their roles, departments, and status
- **Search & Filter**: Search by name/email and filter by role/status
- **Member Profiles**: Detailed member cards with performance metrics
- **Role Management**: Update member roles (Admin, Manager, Member, Viewer)
- **Status Tracking**: Monitor active, inactive, and pending members

### 📊 Analytics Dashboard
- **Team Performance**: Overall team metrics and KPIs
- **Role Distribution**: Visual breakdown of team roles
- **Performance Metrics**: Onboarding completion, document processing, session attendance
- **Average Ratings**: Team performance scores

### ⚙️ Settings & Permissions
- **Permission Settings**: Configure member invitations, document editing, analytics access
- **Security Settings**: Two-factor authentication, session timeout configuration
- **Team Policies**: Manage team-wide settings and policies

### 👥 Member Invitation
- **Invite Modal**: Send invitations to new team members
- **Role Assignment**: Assign appropriate roles during invitation
- **Department Assignment**: Organize members by department

## Access

### URL
```
http://localhost:8080/team
```

### Navigation
The team page is accessible through:
1. **Main Navigation**: Click the menu button and select "Team Management" under "Team & Management"
2. **Direct URL**: Navigate to `/team` in your browser

## Team Member Roles

### 👑 Admin
- Full system access
- Can manage all team members
- Can configure system settings
- Can invite new members

### 🛡️ Manager
- Can view analytics
- Can edit documents
- Can invite new members
- Limited administrative access

### ✅ Member
- Can view analytics
- Can edit documents
- Standard user permissions

### 👁️ Viewer
- Read-only access to analytics
- Limited document access
- No editing permissions

## Mock Data

The team page includes realistic mock data for demonstration:

### Sample Team Members
1. **Sarah Johnson** (Admin) - Engineering
2. **Michael Chen** (Manager) - Product
3. **Emily Rodriguez** (Member) - Marketing
4. **David Thompson** (Viewer) - Sales (Pending)
5. **Lisa Wang** (Member) - Customer Success

### Performance Metrics
- Onboarding completion rates
- Document processing counts
- Session attendance
- User ratings

## Technical Implementation

### Components Used
- **UI Components**: Cards, Buttons, Badges, Avatars, Tabs, Select dropdowns
- **Icons**: Lucide React icons for visual elements
- **State Management**: React hooks for local state
- **Toast Notifications**: User feedback for actions

### API Integration
- Simulated API calls to `/api/team/members` and `/api/team/stats`
- Fallback to mock data when API is unavailable
- Error handling for failed requests

### Responsive Design
- Mobile-friendly layout
- Adaptive grid system
- Touch-friendly interactions

## Future Enhancements

### Planned Features
- **Real-time Updates**: Live team member status
- **Advanced Analytics**: Detailed performance reports
- **Bulk Operations**: Mass member management
- **Integration**: Connect with external HR systems
- **Notifications**: Team activity alerts

### API Endpoints
```javascript
// Get team members
GET /api/team/members

// Get team statistics
GET /api/team/stats

// Update member role
PUT /api/team/members/:id/role

// Invite new member
POST /api/team/invite

// Track member activity
POST /api/team/activity
```

## Development

### Local Development
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:8080/team`
3. The page will load with mock data

### Building for Production
1. Run: `npm run build`
2. The team page will be included in the production build

## Troubleshooting

### Common Issues
- **Page not loading**: Check if the development server is running
- **Mock data not showing**: Check browser console for errors
- **Navigation issues**: Ensure the route is properly configured in App.tsx

### Debug Mode
Enable debug logging by setting `localStorage.setItem('debug', 'true')` in the browser console.

---

**Note**: This is a demonstration page with mock data. In a production environment, it would connect to real backend APIs and database systems.

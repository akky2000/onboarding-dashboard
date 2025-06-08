
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, FolderOpen, Bell, TrendingUp, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface OnboardingData {
  personalInfo: {
    name: string;
    email: string;
  };
  businessInfo: {
    companyName: string;
    industry: string;
    size: string;
  };
  preferences: {
    theme: string;
    dashboardLayout: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<OnboardingData | null>(null);

  // Sample data for the chart
  const weeklyProgressData = [
    { day: 'Mon', progress: 65 },
    { day: 'Tue', progress: 78 },
    { day: 'Wed', progress: 82 },
    { day: 'Thu', progress: 75 },
    { day: 'Fri', progress: 90 },
    { day: 'Sat', progress: 85 },
    { day: 'Sun', progress: 88 },
  ];

  // Sample stats data
  const [stats, setStats] = useState({
    teamMembers: 12,
    activeProjects: 8,
    notifications: 3
  });

  useEffect(() => {
    // Check if onboarding is completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (!onboardingCompleted) {
      navigate('/onboarding');
      return;
    }

    // Load user data From LocalStorage
    const savedData = localStorage.getItem('onboardingData');
    if (savedData) {
      setUserData(JSON.parse(savedData));
    }

    // Simulate loading stats
    setTimeout(() => {
      setStats({
        teamMembers: Math.floor(Math.random() * 20) + 5,
        activeProjects: Math.floor(Math.random() * 15) + 3,
        notifications: Math.floor(Math.random() * 10) + 1
      });
    }, 1000);
  }, [navigate]);

  const handleResetOnboarding = () => {
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('onboardingData');
    navigate('/onboarding');
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Loading your dashboard...</div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-600 text-white">
                {getInitials(userData.personalInfo.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome back, {userData.personalInfo.name}!
              </h1>
              <p className="text-sm text-gray-600">{userData.businessInfo.companyName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {userData.businessInfo.industry}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetOnboarding}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Reset Setup
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Team Members</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.teamMembers}</div>
              <p className="text-xs text-green-600 mt-1">
                +2 new this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.activeProjects}</div>
              <p className="text-xs text-blue-600 mt-1">
                3 due this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.notifications}</div>
              <p className="text-xs text-orange-600 mt-1">
                {stats.notifications} unread
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress Chart */}
        <Card className="bg-white shadow-sm border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    className="text-gray-600"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-gray-600"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Profile Summary */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-gray-900">Profile Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{userData.personalInfo.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Company Size</label>
                  <p className="text-gray-900">{userData.businessInfo.size} employees</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Preferred Theme</label>
                  <p className="text-gray-900 capitalize">{userData.preferences.theme}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Dashboard Layout</label>
                  <p className="text-gray-900 capitalize">{userData.preferences.dashboardLayout}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;

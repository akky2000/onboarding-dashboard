
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    personalInfo: { name: '', email: '' },
    businessInfo: { companyName: '', industry: '', size: '' },
    preferences: { theme: 'light', dashboardLayout: 'grid' }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!data.personalInfo.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!data.personalInfo.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(data.personalInfo.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    } else if (step === 2) {
      if (!data.businessInfo.companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      }
      if (!data.businessInfo.industry) {
        newErrors.industry = 'Please select an industry';
      }
      if (!data.businessInfo.size) {
        newErrors.size = 'Please select company size';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      // Save to localStorage
       console.log("Saving data:", data);
      localStorage.setItem('onboardingData', JSON.stringify(data));
      localStorage.setItem('onboardingCompleted', 'true');
      
      toast({
        title: "Welcome!🎉",
        description: "Your account has been set up successfully.",
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateBusinessInfo = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      businessInfo: { ...prev.businessInfo, [field]: value }
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updatePreferences = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl">
              {currentStep === 1 && "Let's get to know you"}
              {currentStep === 2 && "Tell us about your business"}
              {currentStep === 3 && "Customize your experience"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={data.personalInfo.name}
                    onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={data.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Business Info */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    value={data.businessInfo.companyName}
                    onChange={(e) => updateBusinessInfo('companyName', e.target.value)}
                    className={errors.companyName ? 'border-red-500' : ''}
                  />
                  {errors.companyName && <p className="text-sm text-red-600">{errors.companyName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select onValueChange={(value) => updateBusinessInfo('industry', value)}>
                    <SelectTrigger className={errors.industry ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.industry && <p className="text-sm text-red-600">{errors.industry}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Company Size</Label>
                  <RadioGroup
                    value={data.businessInfo.size}
                    onValueChange={(value) => updateBusinessInfo('size', value)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-10" id="size-1-10" />
                      <Label htmlFor="size-1-10">1-10 employees</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="11-50" id="size-11-50" />
                      <Label htmlFor="size-11-50">11-50 employees</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="51-200" id="size-51-200" />
                      <Label htmlFor="size-51-200">51-200 employees</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="200+" id="size-200+" />
                      <Label htmlFor="size-200+">200+ employees</Label>
                    </div>
                  </RadioGroup>
                  {errors.size && <p className="text-sm text-red-600">{errors.size}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Preferred Theme</Label>
                  <RadioGroup
                    value={data.preferences.theme}
                    onValueChange={(value) => updatePreferences('theme', value)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="theme-light" />
                      <Label htmlFor="theme-light">Light Theme</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <Label htmlFor="theme-dark">Dark Theme</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Dashboard Layout</Label>
                  <RadioGroup
                    value={data.preferences.dashboardLayout}
                    onValueChange={(value) => updatePreferences('dashboardLayout', value)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="grid" id="layout-grid" />
                      <Label htmlFor="layout-grid">Grid Layout</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="list" id="layout-list" />
                      <Label htmlFor="layout-list">List Layout</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  Complete Setup
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingWizard;

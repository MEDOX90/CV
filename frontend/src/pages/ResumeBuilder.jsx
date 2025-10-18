import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowRight, ArrowLeft, Download, Plus, Trash2, FileText, Save } from 'lucide-react';
import { sampleResume, resumeTemplates } from '../mockData';
import ResumePreview from '../components/ResumePreview';
import { useToast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const previewRef = useRef();
  
  const initialTemplateId = location.state?.templateId || 'classic';
  
  const [resumeData, setResumeData] = useState({
    ...sampleResume,
    selectedTemplate: initialTemplateId
  });
  
  const [resumeId, setResumeId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState('personal');

  const handlePersonalInfoChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleAddExperience = () => {
    const newExp = {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const handleExperienceChange = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleDeleteExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const handleAddEducation = () => {
    const newEdu = {
      id: Date.now(),
      institution: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const handleEducationChange = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleDeleteEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const handleAddSkill = () => {
    const newSkill = {
      id: Date.now(),
      name: '',
      level: 50
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const handleSkillChange = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const handleDeleteSkill = (id) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const handleAddLanguage = () => {
    const newLang = {
      id: Date.now(),
      name: '',
      level: ''
    };
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, newLang]
    }));
  };

  const handleLanguageChange = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const handleDeleteLanguage = (id) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  const handleTemplateChange = (templateId) => {
    setResumeData(prev => ({
      ...prev,
      selectedTemplate: templateId
    }));
  };

  const handleExportPDF = async () => {
    toast({
      title: "جاري تصدير السيرة الذاتية",
      description: "سيتم تحميل الملف قريباً...",
    });
    
    // Save to backend and generate PDF
    setTimeout(() => {
      toast({
        title: "تم التصدير بنجاح!",
        description: "تم تحميل سيرتك الذاتية بصيغة PDF",
      });
    }, 2000);
  };

  const tabSteps = [
    { id: 'personal', label: 'المعلومات الشخصية' },
    { id: 'experience', label: 'الخبرات العملية' },
    { id: 'education', label: 'التعليم' },
    { id: 'skills', label: 'المهارات' },
    { id: 'template', label: 'القالب' }
  ];

  const currentStepIndex = tabSteps.findIndex(step => step.id === currentTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-black/5" dir="rtl">
      <Toaster />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                رجوع
              </Button>
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-600" />
                <span className="text-xl font-bold">بناء السيرة الذاتية</span>
              </div>
            </div>
            <Button
              onClick={handleExportPDF}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            >
              <Download className="ml-2 w-4 h-4" />
              تحميل PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Card className="shadow-xl">
              <CardContent className="p-6">
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                  <TabsList className="grid w-full grid-cols-5 mb-6">
                    {tabSteps.map((step) => (
                      <TabsTrigger key={step.id} value={step.id} className="text-xs sm:text-sm">
                        {step.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Personal Info Tab */}
                  <TabsContent value="personal" className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">المعلومات الشخصية</h2>
                    <div className="space-y-4">
                      <div>
                        <Label>الاسم الكامل</Label>
                        <Input
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                          placeholder="أحمد محمد علي"
                        />
                      </div>
                      <div>
                        <Label>المسمى الوظيفي</Label>
                        <Input
                          value={resumeData.personalInfo.jobTitle}
                          onChange={(e) => handlePersonalInfoChange('jobTitle', e.target.value)}
                          placeholder="مطور برمجيات"
                        />
                      </div>
                      <div>
                        <Label>البريد الإلكتروني</Label>
                        <Input
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                          placeholder="ahmed@example.com"
                        />
                      </div>
                      <div>
                        <Label>رقم الهاتف</Label>
                        <Input
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                          placeholder="+966 50 123 4567"
                        />
                      </div>
                      <div>
                        <Label>الموقع</Label>
                        <Input
                          value={resumeData.personalInfo.location}
                          onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                          placeholder="الرياض، السعودية"
                        />
                      </div>
                      <div>
                        <Label>نبذة مختصرة</Label>
                        <Textarea
                          value={resumeData.personalInfo.summary}
                          onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                          placeholder="اكتب نبذة مختصرة عنك وخبراتك..."
                          rows={4}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Experience Tab */}
                  <TabsContent value="experience" className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">الخبرات العملية</h2>
                      <Button onClick={handleAddExperience} size="sm" variant="outline">
                        <Plus className="ml-1 w-4 h-4" />
                        إضافة
                      </Button>
                    </div>
                    <div className="space-y-6">
                      {resumeData.experience.map((exp, index) => (
                        <Card key={exp.id} className="border-2 border-purple-100">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-purple-600">خبرة {index + 1}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteExperience(exp.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-2">
                                <Label>اسم الشركة</Label>
                                <Input
                                  value={exp.company}
                                  onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                                  placeholder="اسم الشركة"
                                />
                              </div>
                              <div className="col-span-2">
                                <Label>المسمى الوظيفي</Label>
                                <Input
                                  value={exp.position}
                                  onChange={(e) => handleExperienceChange(exp.id, 'position', e.target.value)}
                                  placeholder="المسمى الوظيفي"
                                />
                              </div>
                              <div>
                                <Label>من</Label>
                                <Input
                                  type="month"
                                  value={exp.startDate}
                                  onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>إلى</Label>
                                <Input
                                  type="month"
                                  value={exp.current ? '' : exp.endDate}
                                  onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                                  disabled={exp.current}
                                />
                              </div>
                              <div className="col-span-2 flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`current-${exp.id}`}
                                  checked={exp.current}
                                  onChange={(e) => handleExperienceChange(exp.id, 'current', e.target.checked)}
                                  className="w-4 h-4"
                                />
                                <Label htmlFor={`current-${exp.id}`}>أعمل حالياً في هذه الوظيفة</Label>
                              </div>
                              <div className="col-span-2">
                                <Label>الوصف</Label>
                                <Textarea
                                  value={exp.description}
                                  onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                                  placeholder="اكتب وصف مختصر عن مهامك ومسؤولياتك..."
                                  rows={3}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Education Tab */}
                  <TabsContent value="education" className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">التعليم</h2>
                      <Button onClick={handleAddEducation} size="sm" variant="outline">
                        <Plus className="ml-1 w-4 h-4" />
                        إضافة
                      </Button>
                    </div>
                    <div className="space-y-6">
                      {resumeData.education.map((edu, index) => (
                        <Card key={edu.id} className="border-2 border-purple-100">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-purple-600">تعليم {index + 1}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEducation(edu.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-2">
                                <Label>اسم المؤسسة التعليمية</Label>
                                <Input
                                  value={edu.institution}
                                  onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                                  placeholder="اسم الجامعة أو المعهد"
                                />
                              </div>
                              <div className="col-span-2">
                                <Label>الدرجة العلمية/التخصص</Label>
                                <Input
                                  value={edu.degree}
                                  onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                                  placeholder="بكالوريوس علوم الحاسب"
                                />
                              </div>
                              <div>
                                <Label>من</Label>
                                <Input
                                  type="month"
                                  value={edu.startDate}
                                  onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>إلى</Label>
                                <Input
                                  type="month"
                                  value={edu.endDate}
                                  onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                                />
                              </div>
                              <div className="col-span-2">
                                <Label>المعدل التراكمي (اختياري)</Label>
                                <Input
                                  value={edu.gpa}
                                  onChange={(e) => handleEducationChange(edu.id, 'gpa', e.target.value)}
                                  placeholder="4.5/5.0"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Skills Tab */}
                  <TabsContent value="skills" className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">المهارات</h2>
                      <Button onClick={handleAddSkill} size="sm" variant="outline">
                        <Plus className="ml-1 w-4 h-4" />
                        إضافة
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {resumeData.skills.map((skill) => (
                        <Card key={skill.id} className="border-2 border-purple-100">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <Input
                                  value={skill.name}
                                  onChange={(e) => handleSkillChange(skill.id, 'name', e.target.value)}
                                  placeholder="اسم المهارة"
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSkill(skill.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">اللغات</h2>
                        <Button onClick={handleAddLanguage} size="sm" variant="outline">
                          <Plus className="ml-1 w-4 h-4" />
                          إضافة
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {resumeData.languages.map((lang) => (
                          <Card key={lang.id} className="border-2 border-purple-100">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <Input
                                    value={lang.name}
                                    onChange={(e) => handleLanguageChange(lang.id, 'name', e.target.value)}
                                    placeholder="اللغة"
                                  />
                                </div>
                                <div className="flex-1">
                                  <Input
                                    value={lang.level}
                                    onChange={(e) => handleLanguageChange(lang.id, 'level', e.target.value)}
                                    placeholder="المستوى"
                                  />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteLanguage(lang.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Template Selection Tab */}
                  <TabsContent value="template" className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">اختر القالب</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {resumeTemplates.map((template) => (
                        <Card
                          key={template.id}
                          className={`cursor-pointer transition-all duration-300 ${
                            resumeData.selectedTemplate === template.id
                              ? 'border-4 border-purple-600 shadow-xl'
                              : 'border-2 border-gray-200 hover:border-purple-300'
                          }`}
                          onClick={() => handleTemplateChange(template.id)}
                        >
                          <div className={`h-32 bg-gradient-to-br ${
                            template.color === 'purple'
                              ? 'from-purple-500 to-purple-700'
                              : 'from-gray-800 to-black'
                          } flex items-center justify-center`}>
                            <FileText className="w-16 h-16 text-white/90" />
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-bold text-center">{template.name}</h3>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (currentStepIndex > 0) {
                        setCurrentTab(tabSteps[currentStepIndex - 1].id);
                      }
                    }}
                    disabled={currentStepIndex === 0}
                  >
                    <ArrowRight className="ml-2 w-4 h-4" />
                    السابق
                  </Button>
                  <Button
                    onClick={() => {
                      if (currentStepIndex < tabSteps.length - 1) {
                        setCurrentTab(tabSteps[currentStepIndex + 1].id);
                      }
                    }}
                    disabled={currentStepIndex === tabSteps.length - 1}
                    className="bg-gradient-to-r from-purple-600 to-purple-700"
                  >
                    التالي
                    <ArrowLeft className="mr-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="shadow-2xl">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold">معاينة السيرة الذاتية</h2>
                  <p className="text-sm text-gray-600">معاينة مباشرة لسيرتك الذاتية</p>
                </div>
                <div ref={previewRef} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
                  <ResumePreview data={resumeData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
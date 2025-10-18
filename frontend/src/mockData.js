// Mock data for Resume Builder

export const resumeTemplates = [
  {
    id: 'classic',
    name: 'كلاسيكي',
    nameEn: 'Classic',
    description: 'تصميم تقليدي واحترافي',
    color: 'purple',
    popular: true
  },
  {
    id: 'modern',
    name: 'عصري',
    nameEn: 'Modern',
    description: 'تصميم حديث وجذاب',
    color: 'black',
    popular: true
  },
  {
    id: 'creative',
    name: 'إبداعي',
    nameEn: 'Creative',
    description: 'تصميم مميز للمبدعين',
    color: 'purple',
    popular: false
  },
  {
    id: 'professional',
    name: 'محترف',
    nameEn: 'Professional',
    description: 'تصميم رسمي للشركات الكبرى',
    color: 'black',
    popular: true
  },
  {
    id: 'minimal',
    name: 'بسيط',
    nameEn: 'Minimal',
    description: 'تصميم بسيط وأنيق',
    color: 'purple',
    popular: false
  },
  {
    id: 'elegant',
    name: 'أنيق',
    nameEn: 'Elegant',
    description: 'تصميم فاخر ومميز',
    color: 'black',
    popular: false
  }
];

export const sampleResume = {
  personalInfo: {
    fullName: 'أحمد محمد علي',
    jobTitle: 'مطور برمجيات',
    email: 'ahmed@example.com',
    phone: '+966 50 123 4567',
    location: 'الرياض، المملكة العربية السعودية',
    summary: 'مطور برمجيات متمرس مع خبرة 5 سنوات في تطوير تطبيقات الويب والموبايل. متخصص في React و Node.js مع شغف بإنشاء حلول تقنية مبتكرة.'
  },
  experience: [
    {
      id: 1,
      company: 'شركة التقنية المتقدمة',
      position: 'مطور Full Stack',
      location: 'الرياض',
      startDate: '2020-01',
      endDate: 'present',
      current: true,
      description: 'تطوير وصيانة تطبيقات ويب متقدمة باستخدام React و Node.js. قيادة فريق من 3 مطورين وتحسين أداء التطبيقات بنسبة 40%.'
    },
    {
      id: 2,
      company: 'مؤسسة البرمجيات الحديثة',
      position: 'مطور Front-end',
      location: 'جدة',
      startDate: '2018-06',
      endDate: '2020-01',
      current: false,
      description: 'بناء واجهات مستخدم تفاعلية باستخدام React و Vue.js. التعاون مع فريق التصميم لتحسين تجربة المستخدم.'
    }
  ],
  education: [
    {
      id: 1,
      institution: 'جامعة الملك سعود',
      degree: 'بكالوريوس علوم الحاسب',
      location: 'الرياض',
      startDate: '2014-09',
      endDate: '2018-06',
      gpa: '4.5/5.0'
    }
  ],
  skills: [
    { id: 1, name: 'React', level: 90 },
    { id: 2, name: 'Node.js', level: 85 },
    { id: 3, name: 'JavaScript', level: 95 },
    { id: 4, name: 'TypeScript', level: 80 },
    { id: 5, name: 'MongoDB', level: 75 },
    { id: 6, name: 'Git', level: 85 }
  ],
  languages: [
    { id: 1, name: 'العربية', level: 'اللغة الأم' },
    { id: 2, name: 'الإنجليزية', level: 'ممتاز' }
  ]
};

export const features = [
  {
    id: 1,
    title: 'بناء في دقائق',
    description: 'أنشئ سيرتك الذاتية في 10 دقائق فقط باستخدام أدواتنا الذكية',
    icon: 'Zap'
  },
  {
    id: 2,
    title: 'قوالب احترافية',
    description: 'اختر من بين العشرات من القوالب المصممة باحترافية',
    icon: 'Layout'
  },
  {
    id: 3,
    title: 'تصدير سهل',
    description: 'حمّل سيرتك الذاتية بصيغة PDF بنقرة واحدة',
    icon: 'Download'
  },
  {
    id: 4,
    title: 'متوافق مع ATS',
    description: 'جميع القوالب متوافقة 100% مع أنظمة تتبع المتقدمين',
    icon: 'CheckCircle'
  }
];
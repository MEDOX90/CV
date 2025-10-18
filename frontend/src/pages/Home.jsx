import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Zap, Layout, Download, CheckCircle, FileText, Star, ArrowRight } from 'lucide-react';
import { features, resumeTemplates } from '../mockData';

const Home = () => {
  const navigate = useNavigate();

  const iconMap = {
    Zap,
    Layout,
    Download,
    CheckCircle
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-black/5" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-black bg-clip-text text-transparent">
                بناء السيرة الذاتية
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">الميزات</a>
              <a href="#templates" className="text-gray-700 hover:text-purple-600 transition-colors">القوالب</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 transition-colors">كيف يعمل</a>
            </nav>
            <Button
              onClick={() => navigate('/builder')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              ابدأ الآن
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6 animate-pulse">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">أداة بناء السيرة الذاتية رقم 1 في المنطقة</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            أنشئ سيرتك الذاتية
            <span className="block bg-gradient-to-r from-purple-600 to-black bg-clip-text text-transparent">
              الاحترافية بدقائق
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            قوالب احترافية، أدوات ذكية، وتصدير فوري. كل ما تحتاجه لإنشاء سيرة ذاتية تجذب أصحاب العمل.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/builder')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg px-8 py-6 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
            >
              ابدأ مجاناً
              <ArrowRight className="mr-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('templates').scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8 py-6 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition-all duration-300"
            >
              عرض القوالب
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            ✨ بدون تسجيل • مجاني تماماً • تصدير فوري
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-gradient-to-b from-transparent to-purple-50/30">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">كل ما تحتاجه في مكان واحد</h2>
          <p className="text-xl text-gray-600">أدوات قوية لبناء سيرة ذاتية احترافية</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <Card
                key={feature.id}
                className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">قوالب سير ذاتية احترافية</h2>
          <p className="text-xl text-gray-600">اختر القالب المثالي الذي يناسب شخصيتك المهنية</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {resumeTemplates.slice(0, 6).map((template) => (
            <Card
              key={template.id}
              className="group hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 bg-white overflow-hidden"
              onClick={() => navigate('/builder', { state: { templateId: template.id } })}
            >
              <div className={`h-48 bg-gradient-to-br ${
                template.color === 'purple'
                  ? 'from-purple-500 to-purple-700'
                  : 'from-gray-800 to-black'
              } flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <FileText className="w-24 h-24 text-white/90 group-hover:scale-110 transition-transform duration-300" />
                {template.popular && (
                  <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    الأكثر شعبية
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">{template.name}</h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/builder', { state: { templateId: template.id } });
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-300"
                >
                  استخدم هذا القالب
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 bg-gradient-to-b from-purple-50/30 to-transparent">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">كيف يعمل؟</h2>
          <p className="text-xl text-gray-600">ثلاث خطوات بسيطة للحصول على سيرتك الذاتية</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { step: 1, title: 'اختر القالب', desc: 'اختر من بين قوالبنا الاحترافية' },
            { step: 2, title: 'أدخل بياناتك', desc: 'املأ المعلومات بسهولة وسرعة' },
            { step: 3, title: 'حمّل وأرسل', desc: 'صدّر سيرتك بصيغة PDF واستخدمها فوراً' }
          ].map((item, index) => (
            <div key={index} className="text-center relative">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                {item.step}
              </div>
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600 text-lg">{item.desc}</p>
              {index < 2 && (
                <ArrowRight className="hidden md:block absolute top-8 -left-12 w-8 h-8 text-purple-300 transform rotate-180" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-purple-600 to-black text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <CardContent className="p-12 md:p-16 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">جاهز لبناء سيرتك الذاتية؟</h2>
            <p className="text-xl mb-8 text-purple-100">ابدأ الآن وأنشئ سيرة ذاتية احترافية في دقائق</p>
            <Button
              onClick={() => navigate('/builder')}
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-10 py-6 shadow-2xl hover:shadow-white/30 transition-all duration-300 transform hover:scale-105"
            >
              ابدأ الآن مجاناً
              <ArrowRight className="mr-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold">بناء السيرة الذاتية</span>
          </div>
          <p className="text-gray-400 mb-4">أنشئ سيرتك الذاتية الاحترافية بسهولة وسرعة</p>
          <p className="text-sm text-gray-500">© 2025 جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
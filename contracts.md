# Resume Builder - API Contracts & Integration Plan

## Overview
النسخة العربية من resume.io مع ألوان بنفسجي وأسود. حالياً Frontend مع mock data فعال ويعمل بشكل ممتاز. يحتاج إلى Backend للحفظ وتصدير PDF.

## Current State
### Frontend (✅ Completed)
- صفحة الهبوط مع RTL و ألوان بنفسجي/أسود
- صفحة Resume Builder مع نماذج (Personal Info, Experience, Education, Skills, Languages)
- اختيار القوالب (6 قوالب مختلفة)
- معاينة مباشرة للسيرة الذاتية
- Mock data في `/app/frontend/src/mockData.js`

### Mock Data to Replace
Currently using:
- `sampleResume` - بيانات تجريبية للسيرة الذاتية
- `resumeTemplates` - قوالب السير الذاتية (ستبقى في frontend)
- `features` - ميزات التطبيق (ستبقى في frontend)

## Backend Requirements

### 1. MongoDB Models

#### Resume Model
```python
{
  "_id": ObjectId,
  "personalInfo": {
    "fullName": str,
    "jobTitle": str,
    "email": str,
    "phone": str,
    "location": str,
    "summary": str
  },
  "experience": [
    {
      "id": int,
      "company": str,
      "position": str,
      "location": str,
      "startDate": str,  # "YYYY-MM"
      "endDate": str,
      "current": bool,
      "description": str
    }
  ],
  "education": [
    {
      "id": int,
      "institution": str,
      "degree": str,
      "location": str,
      "startDate": str,
      "endDate": str,
      "gpa": str (optional)
    }
  ],
  "skills": [
    {
      "id": int,
      "name": str,
      "level": int (0-100)
    }
  ],
  "languages": [
    {
      "id": int,
      "name": str,
      "level": str
    }
  ],
  "selectedTemplate": str,  # template id
  "createdAt": datetime,
  "updatedAt": datetime
}
```

### 2. API Endpoints

#### POST /api/resume
- **Purpose**: حفظ سيرة ذاتية جديدة
- **Request Body**: Resume data (JSON)
- **Response**: `{ "id": resume_id, "message": "Resume saved successfully" }`

#### GET /api/resume/{resume_id}
- **Purpose**: استرجاع سيرة ذاتية
- **Response**: Resume data (JSON)

#### PUT /api/resume/{resume_id}
- **Purpose**: تحديث سيرة ذاتية
- **Request Body**: Updated resume data
- **Response**: `{ "message": "Resume updated successfully" }`

#### POST /api/resume/{resume_id}/export-pdf
- **Purpose**: تصدير السيرة الذاتية كملف PDF
- **Request Body**: `{ "templateId": str }`
- **Response**: PDF file download
- **Implementation**: استخدام مكتبة `reportlab` أو `weasyprint` لإنشاء PDF

#### GET /api/resumes
- **Purpose**: الحصول على قائمة بجميع السير الذاتية (للمستقبل)
- **Response**: Array of resume summaries

### 3. PDF Generation Strategy
استخدام `weasyprint` لتوليد PDF من HTML:
1. إنشاء HTML template مع CSS للسيرة الذاتية
2. ملء البيانات في الـ template
3. تحويل HTML إلى PDF باستخدام weasyprint
4. إرجاع الملف للتحميل

## Frontend Changes Needed

### 1. API Integration
إضافة axios calls في `/app/frontend/src/pages/ResumeBuilder.jsx`:

```javascript
// Save resume
const handleSave = async () => {
  const response = await axios.post(`${API}/resume`, resumeData);
  // Store resume ID in state
  setResumeId(response.data.id);
};

// Export PDF (update current handleExportPDF)
const handleExportPDF = async () => {
  if (!resumeId) {
    // Save first if not saved
    await handleSave();
  }
  const response = await axios.post(
    `${API}/resume/${resumeId}/export-pdf`,
    { templateId: resumeData.selectedTemplate },
    { responseType: 'blob' }
  );
  // Download file
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'resume.pdf');
  document.body.appendChild(link);
  link.click();
};
```

### 2. Auto-save Feature
إضافة useEffect لحفظ تلقائي:
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    if (resumeId) {
      axios.put(`${API}/resume/${resumeId}`, resumeData);
    }
  }, 2000); // Save after 2 seconds of no changes
  
  return () => clearTimeout(timer);
}, [resumeData]);
```

## Dependencies to Install

### Backend
```
pip install weasyprint
pip install reportlab
pip install python-bidi  # For RTL text support
pip install arabic-reshaper  # For Arabic text
```

### Frontend
- Already has axios installed

## Implementation Order
1. ✅ Frontend with mock data (DONE)
2. ⏭️ Backend models and CRUD endpoints
3. ⏭️ PDF generation endpoint
4. ⏭️ Frontend integration with backend
5. ⏭️ Testing

## Notes
- بدون نظام تسجيل دخول (كما طلب المستخدم)
- التركيز على البساطة والسرعة
- PDF يجب أن يدعم اللغة العربية و RTL

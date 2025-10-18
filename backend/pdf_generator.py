from weasyprint import HTML, CSS
from io import BytesIO
import arabic_reshaper
from bidi.algorithm import get_display

def reshape_arabic(text):
    """Reshape Arabic text for proper display in PDF"""
    if not text:
        return ""
    reshaped_text = arabic_reshaper.reshape(text)
    return get_display(reshaped_text)

def generate_classic_template_html(data):
    """Generate HTML for classic template"""
    personal = data["personalInfo"]
    
    html = f"""
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');
            
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            
            body {{
                font-family: 'Cairo', Arial, sans-serif;
                direction: rtl;
                text-align: right;
                padding: 40px;
                font-size: 12pt;
                line-height: 1.6;
            }}
            
            .header {{
                border-bottom: 4px solid #7c3aed;
                padding-bottom: 15px;
                margin-bottom: 25px;
            }}
            
            .name {{
                font-size: 28pt;
                font-weight: bold;
                color: #7c3aed;
                margin-bottom: 5px;
            }}
            
            .job-title {{
                font-size: 16pt;
                color: #666;
                margin-bottom: 10px;
            }}
            
            .contact-info {{
                font-size: 10pt;
                color: #555;
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
            }}
            
            .section-title {{
                font-size: 14pt;
                font-weight: bold;
                color: #7c3aed;
                border-bottom: 2px solid #e9d5ff;
                padding-bottom: 5px;
                margin-top: 20px;
                margin-bottom: 15px;
            }}
            
            .summary {{
                color: #444;
                text-align: justify;
                margin-bottom: 20px;
            }}
            
            .experience-item, .education-item {{
                margin-bottom: 15px;
                page-break-inside: avoid;
            }}
            
            .exp-header {{
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
            }}
            
            .position {{
                font-weight: bold;
                font-size: 12pt;
            }}
            
            .company {{
                color: #7c3aed;
                font-weight: 600;
            }}
            
            .date {{
                color: #666;
                font-size: 10pt;
            }}
            
            .description {{
                color: #555;
                text-align: justify;
                margin-top: 5px;
            }}
            
            .skills-container {{
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }}
            
            .skill-tag {{
                background-color: #f3e8ff;
                color: #7c3aed;
                padding: 5px 12px;
                border-radius: 15px;
                font-size: 10pt;
            }}
            
            .languages-container {{
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
            }}
            
            .language-item {{
                font-size: 10pt;
            }}
            
            .language-name {{
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <div class="name">{reshape_arabic(personal['fullName'])}</div>
            <div class="job-title">{reshape_arabic(personal['jobTitle'])}</div>
            <div class="contact-info">
                <span>{personal['email']}</span>
                <span>{personal['phone']}</span>
                <span>{reshape_arabic(personal['location'])}</span>
            </div>
        </div>
    """
    
    # Summary
    if personal.get('summary'):
        html += f"""
        <div class="section-title">نبذة مختصرة</div>
        <div class="summary">{reshape_arabic(personal['summary'])}</div>
        """
    
    # Experience
    if data.get('experience') and len(data['experience']) > 0:
        html += '<div class="section-title">الخبرات العملية</div>'
        for exp in data['experience']:
            end_date = 'الآن' if exp['current'] else exp['endDate']
            html += f"""
            <div class="experience-item">
                <div class="exp-header">
                    <div>
                        <div class="position">{reshape_arabic(exp['position'])}</div>
                        <div class="company">{reshape_arabic(exp['company'])}</div>
                    </div>
                    <div class="date">{exp['startDate']} - {end_date}</div>
                </div>
                <div class="description">{reshape_arabic(exp['description'])}</div>
            </div>
            """
    
    # Education
    if data.get('education') and len(data['education']) > 0:
        html += '<div class="section-title">التعليم</div>'
        for edu in data['education']:
            html += f"""
            <div class="education-item">
                <div class="exp-header">
                    <div>
                        <div class="position">{reshape_arabic(edu['degree'])}</div>
                        <div class="company">{reshape_arabic(edu['institution'])}</div>
                    </div>
                    <div class="date">{edu['startDate']} - {edu['endDate']}</div>
                </div>
            """
            if edu.get('gpa'):
                html += f'<div style="font-size: 10pt; color: #666; margin-top: 3px;">المعدل: {edu["gpa"]}</div>'
            html += '</div>'
    
    # Skills
    if data.get('skills') and len(data['skills']) > 0:
        html += '<div class="section-title">المهارات</div><div class="skills-container">'
        for skill in data['skills']:
            html += f'<div class="skill-tag">{reshape_arabic(skill["name"])}</div>'
        html += '</div>'
    
    # Languages
    if data.get('languages') and len(data['languages']) > 0:
        html += '<div class="section-title">اللغات</div><div class="languages-container">'
        for lang in data['languages']:
            html += f'<div class="language-item"><span class="language-name">{reshape_arabic(lang["name"])}:</span> {reshape_arabic(lang["level"])}</div>'
        html += '</div>'
    
    html += """
    </body>
    </html>
    """
    
    return html

def generate_modern_template_html(data):
    """Generate HTML for modern/black template"""
    personal = data["personalInfo"]
    
    html = f"""
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');
            
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            
            body {{
                font-family: 'Cairo', Arial, sans-serif;
                direction: rtl;
                text-align: right;
                font-size: 11pt;
                line-height: 1.5;
                display: flex;
            }}
            
            .sidebar {{
                width: 35%;
                background: linear-gradient(to bottom, #1a1a1a, #000);
                color: white;
                padding: 35px 25px;
            }}
            
            .main-content {{
                flex: 1;
                padding: 35px 30px;
                background: white;
            }}
            
            .name {{
                font-size: 20pt;
                font-weight: bold;
                margin-bottom: 3px;
            }}
            
            .job-title {{
                font-size: 14pt;
                color: #ccc;
                margin-bottom: 20px;
            }}
            
            .contact-item {{
                font-size: 9pt;
                margin-bottom: 8px;
                line-height: 1.4;
            }}
            
            .sidebar-section {{
                margin-top: 25px;
            }}
            
            .sidebar-title {{
                font-size: 12pt;
                font-weight: bold;
                border-bottom: 1px solid rgba(255,255,255,0.3);
                padding-bottom: 8px;
                margin-bottom: 12px;
            }}
            
            .skill-item, .lang-item {{
                font-size: 10pt;
                margin-bottom: 6px;
            }}
            
            .section-title {{
                font-size: 14pt;
                font-weight: bold;
                color: #1a1a1a;
                border-bottom: 3px solid #1a1a1a;
                padding-bottom: 5px;
                margin-bottom: 15px;
            }}
            
            .summary {{
                color: #444;
                text-align: justify;
                margin-bottom: 20px;
            }}
            
            .experience-item, .education-item {{
                margin-bottom: 15px;
                page-break-inside: avoid;
            }}
            
            .exp-header {{
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
            }}
            
            .position {{
                font-weight: bold;
                font-size: 12pt;
            }}
            
            .company {{
                color: #666;
                font-weight: 600;
            }}
            
            .date {{
                color: #666;
                font-size: 9pt;
            }}
            
            .description {{
                color: #555;
                text-align: justify;
                margin-top: 5px;
            }}
        </style>
    </head>
    <body>
        <div class="sidebar">
            <div class="name">{reshape_arabic(personal['fullName'])}</div>
            <div class="job-title">{reshape_arabic(personal['jobTitle'])}</div>
            
            <div style="margin-top: 25px;">
                <div class="contact-item">{personal['email']}</div>
                <div class="contact-item">{personal['phone']}</div>
                <div class="contact-item">{reshape_arabic(personal['location'])}</div>
            </div>
    """
    
    # Skills in sidebar
    if data.get('skills') and len(data['skills']) > 0:
        html += '<div class="sidebar-section"><div class="sidebar-title">المهارات</div>'
        for skill in data['skills']:
            html += f'<div class="skill-item">{reshape_arabic(skill["name"])}</div>'
        html += '</div>'
    
    # Languages in sidebar
    if data.get('languages') and len(data['languages']) > 0:
        html += '<div class="sidebar-section"><div class="sidebar-title">اللغات</div>'
        for lang in data['languages']:
            html += f'<div class="lang-item"><strong>{reshape_arabic(lang["name"])}</strong><br><span style="color: #ccc; font-size: 9pt;">{reshape_arabic(lang["level"])}</span></div>'
        html += '</div>'
    
    html += '</div><div class="main-content">'
    
    # Summary
    if personal.get('summary'):
        html += f"""
        <div class="section-title">نبذة مختصرة</div>
        <div class="summary">{reshape_arabic(personal['summary'])}</div>
        """
    
    # Experience
    if data.get('experience') and len(data['experience']) > 0:
        html += '<div class="section-title">الخبرات العملية</div>'
        for exp in data['experience']:
            end_date = 'الآن' if exp['current'] else exp['endDate']
            html += f"""
            <div class="experience-item">
                <div class="exp-header">
                    <div>
                        <div class="position">{reshape_arabic(exp['position'])}</div>
                        <div class="company">{reshape_arabic(exp['company'])}</div>
                    </div>
                    <div class="date">{exp['startDate']} - {end_date}</div>
                </div>
                <div class="description">{reshape_arabic(exp['description'])}</div>
            </div>
            """
    
    # Education
    if data.get('education') and len(data['education']) > 0:
        html += '<div class="section-title">التعليم</div>'
        for edu in data['education']:
            html += f"""
            <div class="education-item">
                <div class="exp-header">
                    <div>
                        <div class="position">{reshape_arabic(edu['degree'])}</div>
                        <div class="company">{reshape_arabic(edu['institution'])}</div>
                    </div>
                    <div class="date">{edu['startDate']} - {edu['endDate']}</div>
                </div>
            """
            if edu.get('gpa'):
                html += f'<div style="font-size: 9pt; color: #666; margin-top: 3px;">المعدل: {edu["gpa"]}</div>'
            html += '</div>'
    
    html += """
        </div>
    </body>
    </html>
    """
    
    return html

def generate_pdf(resume_data, template_id):
    """Generate PDF from resume data"""
    # Choose template
    if template_id in ['modern', 'professional', 'elegant']:
        html_content = generate_modern_template_html(resume_data)
    else:
        html_content = generate_classic_template_html(resume_data)
    
    # Generate PDF
    pdf_buffer = BytesIO()
    HTML(string=html_content).write_pdf(pdf_buffer)
    pdf_buffer.seek(0)
    
    return pdf_buffer
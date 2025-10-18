from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from io import BytesIO
import arabic_reshaper
from bidi.algorithm import get_display
import os

def reshape_arabic(text):
    """Reshape Arabic text for proper display in PDF"""
    if not text:
        return ""
    reshaped_text = arabic_reshaper.reshape(text)
    return get_display(reshaped_text)

def generate_pdf(resume_data, template_id):
    """Generate PDF from resume data using ReportLab"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=2*cm, leftMargin=2*cm,
                          topMargin=2*cm, bottomMargin=2*cm)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Custom styles for Arabic RTL
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#7c3aed'),
        spaceAfter=10,
        alignment=2  # RIGHT alignment for RTL
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#7c3aed'),
        spaceAfter=8,
        spaceBefore=12,
        alignment=2  # RIGHT alignment
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        alignment=2,  # RIGHT alignment
        leading=16
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=14,
        textColor=colors.grey,
        spaceAfter=6,
        alignment=2
    )
    
    # Extract data
    personal = resume_data.get("personalInfo", {})
    
    # Header - Name and Job Title
    name = reshape_arabic(personal.get('fullName', ''))
    elements.append(Paragraph(name, title_style))
    
    job_title = reshape_arabic(personal.get('jobTitle', ''))
    elements.append(Paragraph(job_title, subtitle_style))
    
    # Contact Info
    contact_parts = []
    if personal.get('email'):
        contact_parts.append(personal['email'])
    if personal.get('phone'):
        contact_parts.append(personal['phone'])
    if personal.get('location'):
        contact_parts.append(reshape_arabic(personal['location']))
    
    contact_text = ' | '.join(contact_parts)
    elements.append(Paragraph(contact_text, normal_style))
    elements.append(Spacer(1, 0.3*cm))
    
    # Add a line
    line_data = [['']]
    line_table = Table(line_data, colWidths=[17*cm])
    line_table.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, 0), 2, colors.HexColor('#7c3aed')),
    ]))
    elements.append(line_table)
    elements.append(Spacer(1, 0.3*cm))
    
    # Summary
    if personal.get('summary'):
        elements.append(Paragraph(reshape_arabic('نبذة مختصرة'), heading_style))
        summary = reshape_arabic(personal['summary'])
        elements.append(Paragraph(summary, normal_style))
        elements.append(Spacer(1, 0.3*cm))
    
    # Experience
    if resume_data.get('experience') and len(resume_data['experience']) > 0:
        elements.append(Paragraph(reshape_arabic('الخبرات العملية'), heading_style))
        
        for exp in resume_data['experience']:
            position = reshape_arabic(exp.get('position', ''))
            company = reshape_arabic(exp.get('company', ''))
            
            # Position and company
            exp_title_style = ParagraphStyle(
                'ExpTitle',
                parent=normal_style,
                fontSize=12,
                textColor=colors.black,
                fontName='Helvetica-Bold'
            )
            elements.append(Paragraph(f"{position} - {company}", exp_title_style))
            
            # Date
            start_date = exp.get('startDate', '')
            end_date = reshape_arabic('الآن') if exp.get('current') else exp.get('endDate', '')
            date_text = f"{start_date} - {end_date}"
            
            date_style = ParagraphStyle(
                'DateStyle',
                parent=normal_style,
                fontSize=10,
                textColor=colors.grey
            )
            elements.append(Paragraph(date_text, date_style))
            
            # Description
            if exp.get('description'):
                desc = reshape_arabic(exp['description'])
                elements.append(Paragraph(desc, normal_style))
            
            elements.append(Spacer(1, 0.2*cm))
    
    # Education
    if resume_data.get('education') and len(resume_data['education']) > 0:
        elements.append(Paragraph(reshape_arabic('التعليم'), heading_style))
        
        for edu in resume_data['education']:
            degree = reshape_arabic(edu.get('degree', ''))
            institution = reshape_arabic(edu.get('institution', ''))
            
            edu_title_style = ParagraphStyle(
                'EduTitle',
                parent=normal_style,
                fontSize=12,
                textColor=colors.black,
                fontName='Helvetica-Bold'
            )
            elements.append(Paragraph(f"{degree} - {institution}", edu_title_style))
            
            # Date
            start_date = edu.get('startDate', '')
            end_date = edu.get('endDate', '')
            date_text = f"{start_date} - {end_date}"
            
            date_style = ParagraphStyle(
                'DateStyle',
                parent=normal_style,
                fontSize=10,
                textColor=colors.grey
            )
            elements.append(Paragraph(date_text, date_style))
            
            if edu.get('gpa'):
                gpa_text = reshape_arabic(f"المعدل: {edu['gpa']}")
                elements.append(Paragraph(gpa_text, date_style))
            
            elements.append(Spacer(1, 0.2*cm))
    
    # Skills
    if resume_data.get('skills') and len(resume_data['skills']) > 0:
        elements.append(Paragraph(reshape_arabic('المهارات'), heading_style))
        
        skills_list = []
        for skill in resume_data['skills']:
            if skill.get('name'):
                skills_list.append(reshape_arabic(skill['name']))
        
        skills_text = ' • '.join(skills_list)
        elements.append(Paragraph(skills_text, normal_style))
        elements.append(Spacer(1, 0.2*cm))
    
    # Languages
    if resume_data.get('languages') and len(resume_data['languages']) > 0:
        elements.append(Paragraph(reshape_arabic('اللغات'), heading_style))
        
        for lang in resume_data['languages']:
            lang_name = reshape_arabic(lang.get('name', ''))
            lang_level = reshape_arabic(lang.get('level', ''))
            lang_text = f"{lang_name}: {lang_level}"
            elements.append(Paragraph(lang_text, normal_style))
        
        elements.append(Spacer(1, 0.2*cm))
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    
    return buffer
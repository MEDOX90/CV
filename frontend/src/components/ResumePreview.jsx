import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ResumePreview = ({ data }) => {
  const selectedTemplate = data.selectedTemplate || 'classic';

  const ClassicTemplate = () => (
    <div className="p-8 bg-white text-right" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
      {/* Header */}
      <div className="mb-6 pb-4 border-b-4 border-purple-600">
        <h1 className="text-3xl font-bold mb-2 text-purple-700">{data.personalInfo.fullName}</h1>
        <h2 className="text-xl text-gray-600 mb-3">{data.personalInfo.jobTitle}</h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <span>{data.personalInfo.email}</span>
              <Mail className="w-4 h-4" />
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <span>{data.personalInfo.phone}</span>
              <Phone className="w-4 h-4" />
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1">
              <span>{data.personalInfo.location}</span>
              <MapPin className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-purple-700 border-b border-purple-200 pb-1">نبذة مختصرة</h3>
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-purple-700 border-b border-purple-200 pb-1">الخبرات العملية</h3>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h4 className="font-bold text-base">{exp.position}</h4>
                  <p className="text-purple-600">{exp.company}</p>
                </div>
                <p className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? 'الآن' : exp.endDate}
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-purple-700 border-b border-purple-200 pb-1">التعليم</h3>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold">{edu.degree}</h4>
                  <p className="text-purple-600">{edu.institution}</p>
                </div>
                <p className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </p>
              </div>
              {edu.gpa && <p className="text-sm text-gray-600 mt-1">المعدل: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-purple-700 border-b border-purple-200 pb-1">المهارات</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span key={skill.id} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-3 text-purple-700 border-b border-purple-200 pb-1">اللغات</h3>
          <div className="flex flex-wrap gap-3">
            {data.languages.map((lang) => (
              <div key={lang.id} className="text-sm">
                <span className="font-bold">{lang.name}:</span> {lang.level}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const ModernTemplate = () => (
    <div className="flex text-right" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-gray-900 to-black text-white p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{data.personalInfo.fullName}</h1>
          <h2 className="text-lg text-gray-300">{data.personalInfo.jobTitle}</h2>
        </div>

        <div className="mb-6 space-y-3 text-sm">
          {data.personalInfo.email && (
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="break-all">{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base font-bold mb-3 pb-2 border-b border-white/30">المهارات</h3>
            <div className="space-y-2">
              {data.skills.map((skill) => (
                <div key={skill.id} className="text-sm">{skill.name}</div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div>
            <h3 className="text-base font-bold mb-3 pb-2 border-b border-white/30">اللغات</h3>
            <div className="space-y-2">
              {data.languages.map((lang) => (
                <div key={lang.id} className="text-sm">
                  <span className="font-bold">{lang.name}</span>
                  <p className="text-gray-300 text-xs">{lang.level}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 p-8 bg-white">
        {/* Summary */}
        {data.personalInfo.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2 text-gray-900">نبذة مختصرة</h3>
            <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 text-gray-900 border-b-2 border-gray-900 pb-1">الخبرات العملية</h3>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-bold text-base">{exp.position}</h4>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {exp.startDate} - {exp.current ? 'الآن' : exp.endDate}
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-3 text-gray-900 border-b-2 border-gray-900 pb-1">التعليم</h3>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{edu.degree}</h4>
                    <p className="text-gray-600">{edu.institution}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
                {edu.gpa && <p className="text-sm text-gray-600 mt-1">المعدل: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full aspect-[210/297] overflow-auto" style={{ maxHeight: '800px' }}>
      {selectedTemplate === 'modern' || selectedTemplate === 'professional' || selectedTemplate === 'elegant' ? (
        <ModernTemplate />
      ) : (
        <ClassicTemplate />
      )}
    </div>
  );
};

export default ResumePreview;
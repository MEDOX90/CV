#!/usr/bin/env python3
"""
Backend API Testing for Resume Builder Application
Tests all endpoints with Arabic data as specified in the review request
"""

import requests
import json
import sys
import time
from typing import Dict, Any

# Backend URL from environment
BACKEND_URL = "https://cv-arabic.preview.emergentagent.com/api"

# Test data with Arabic content as specified in the review request
TEST_RESUME_DATA = {
    "personalInfo": {
        "fullName": "أحمد محمد",
        "jobTitle": "مطور برمجيات",
        "email": "ahmed@test.com",
        "phone": "+966501234567",
        "location": "الرياض",
        "summary": "مطور برمجيات محترف"
    },
    "experience": [{
        "id": 1,
        "company": "شركة تقنية",
        "position": "مطور",
        "location": "الرياض",
        "startDate": "2020-01",
        "endDate": "2024-01",
        "current": False,
        "description": "تطوير تطبيقات ويب"
    }],
    "education": [{
        "id": 1,
        "institution": "جامعة الملك سعود",
        "degree": "بكالوريوس",
        "location": "الرياض",
        "startDate": "2016-09",
        "endDate": "2020-06",
        "gpa": "4.5"
    }],
    "skills": [{
        "id": 1,
        "name": "React",
        "level": 90
    }],
    "languages": [{
        "id": 1,
        "name": "العربية",
        "level": "اللغة الأم"
    }],
    "selectedTemplate": "classic"
}

# Updated test data for PUT request
UPDATED_RESUME_DATA = {
    "personalInfo": {
        "fullName": "أحمد محمد المحدث",
        "jobTitle": "مطور برمجيات أول",
        "email": "ahmed.updated@test.com",
        "phone": "+966501234567",
        "location": "الرياض",
        "summary": "مطور برمجيات محترف مع خبرة واسعة"
    },
    "experience": [{
        "id": 1,
        "company": "شركة تقنية متقدمة",
        "position": "مطور أول",
        "location": "الرياض",
        "startDate": "2020-01",
        "endDate": "2024-01",
        "current": False,
        "description": "تطوير تطبيقات ويب متقدمة"
    }],
    "education": [{
        "id": 1,
        "institution": "جامعة الملك سعود",
        "degree": "بكالوريوس علوم الحاسب",
        "location": "الرياض",
        "startDate": "2016-09",
        "endDate": "2020-06",
        "gpa": "4.8"
    }],
    "skills": [{
        "id": 1,
        "name": "React",
        "level": 95
    }, {
        "id": 2,
        "name": "Node.js",
        "level": 85
    }],
    "languages": [{
        "id": 1,
        "name": "العربية",
        "level": "اللغة الأم"
    }, {
        "id": 2,
        "name": "الإنجليزية",
        "level": "متقدم"
    }],
    "selectedTemplate": "modern"
}

class ResumeAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.created_resume_id = None
        self.test_results = []
        
    def log_result(self, test_name: str, success: bool, message: str, response_data: Any = None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data
        })
        
    def test_root_endpoint(self):
        """Test the root API endpoint"""
        try:
            response = requests.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_result("Root Endpoint", True, f"Root endpoint working: {data['message']}")
                    return True
                else:
                    self.log_result("Root Endpoint", False, "Root endpoint missing message field")
                    return False
            else:
                self.log_result("Root Endpoint", False, f"Root endpoint returned status {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Root Endpoint", False, f"Root endpoint error: {str(e)}")
            return False
    
    def test_create_resume(self):
        """Test POST /api/resume - Create new resume"""
        try:
            headers = {"Content-Type": "application/json"}
            response = requests.post(
                f"{self.base_url}/resume",
                json=TEST_RESUME_DATA,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "message" in data:
                    self.created_resume_id = data["id"]
                    self.log_result("Create Resume", True, f"Resume created successfully with ID: {data['id']}")
                    return True
                else:
                    self.log_result("Create Resume", False, "Response missing required fields (id, message)")
                    return False
            else:
                self.log_result("Create Resume", False, f"Create failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Create Resume", False, f"Create resume error: {str(e)}")
            return False
    
    def test_get_resume(self):
        """Test GET /api/resume/{resume_id} - Get resume by ID"""
        if not self.created_resume_id:
            self.log_result("Get Resume", False, "No resume ID available for testing")
            return False
            
        try:
            response = requests.get(f"{self.base_url}/resume/{self.created_resume_id}")
            
            if response.status_code == 200:
                data = response.json()
                # Verify essential fields are present
                required_fields = ["personalInfo", "experience", "education", "skills", "languages", "selectedTemplate"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    # Verify Arabic data is preserved
                    if data["personalInfo"]["fullName"] == "أحمد محمد":
                        self.log_result("Get Resume", True, "Resume retrieved successfully with correct Arabic data")
                        return True
                    else:
                        self.log_result("Get Resume", False, "Arabic data not preserved correctly")
                        return False
                else:
                    self.log_result("Get Resume", False, f"Response missing fields: {missing_fields}")
                    return False
            else:
                self.log_result("Get Resume", False, f"Get failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Get Resume", False, f"Get resume error: {str(e)}")
            return False
    
    def test_update_resume(self):
        """Test PUT /api/resume/{resume_id} - Update resume"""
        if not self.created_resume_id:
            self.log_result("Update Resume", False, "No resume ID available for testing")
            return False
            
        try:
            headers = {"Content-Type": "application/json"}
            response = requests.put(
                f"{self.base_url}/resume/{self.created_resume_id}",
                json=UPDATED_RESUME_DATA,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_result("Update Resume", True, f"Resume updated successfully: {data['message']}")
                    return True
                else:
                    self.log_result("Update Resume", False, "Update response missing message field")
                    return False
            else:
                self.log_result("Update Resume", False, f"Update failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Update Resume", False, f"Update resume error: {str(e)}")
            return False
    
    def test_verify_update(self):
        """Verify the update was applied correctly"""
        if not self.created_resume_id:
            self.log_result("Verify Update", False, "No resume ID available for testing")
            return False
            
        try:
            response = requests.get(f"{self.base_url}/resume/{self.created_resume_id}")
            
            if response.status_code == 200:
                data = response.json()
                # Check if updated data is present
                if data["personalInfo"]["fullName"] == "أحمد محمد المحدث":
                    self.log_result("Verify Update", True, "Update verification successful - Arabic data updated correctly")
                    return True
                else:
                    self.log_result("Verify Update", False, f"Update not applied correctly. Expected 'أحمد محمد المحدث', got '{data['personalInfo']['fullName']}'")
                    return False
            else:
                self.log_result("Verify Update", False, f"Verification failed with status {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Verify Update", False, f"Verify update error: {str(e)}")
            return False
    
    def test_list_resumes(self):
        """Test GET /api/resumes - List all resumes"""
        try:
            response = requests.get(f"{self.base_url}/resumes")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check if our created resume is in the list
                        found_resume = any(resume.get("id") == self.created_resume_id for resume in data)
                        if found_resume:
                            self.log_result("List Resumes", True, f"Resume list retrieved successfully with {len(data)} resumes")
                            return True
                        else:
                            self.log_result("List Resumes", True, f"Resume list retrieved ({len(data)} resumes) but created resume not found")
                            return True
                    else:
                        self.log_result("List Resumes", True, "Resume list retrieved successfully (empty list)")
                        return True
                else:
                    self.log_result("List Resumes", False, "Response is not an array")
                    return False
            else:
                self.log_result("List Resumes", False, f"List failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("List Resumes", False, f"List resumes error: {str(e)}")
            return False
    
    def test_export_pdf(self):
        """Test POST /api/resume/{resume_id}/export-pdf - Export PDF"""
        if not self.created_resume_id:
            self.log_result("Export PDF", False, "No resume ID available for testing")
            return False
            
        try:
            response = requests.post(f"{self.base_url}/resume/{self.created_resume_id}/export-pdf")
            
            if response.status_code == 200:
                # Check if response is PDF
                content_type = response.headers.get('content-type', '')
                if 'application/pdf' in content_type:
                    pdf_size = len(response.content)
                    if pdf_size > 1000:  # PDF should be at least 1KB
                        self.log_result("Export PDF", True, f"PDF exported successfully ({pdf_size} bytes)")
                        return True
                    else:
                        self.log_result("Export PDF", False, f"PDF too small ({pdf_size} bytes), might be corrupted")
                        return False
                else:
                    self.log_result("Export PDF", False, f"Response is not PDF format (content-type: {content_type})")
                    return False
            else:
                self.log_result("Export PDF", False, f"Export failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Export PDF", False, f"Export PDF error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all API tests in sequence"""
        print("🚀 Starting Backend API Tests for Resume Builder")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test sequence as specified in the review request
        tests = [
            ("Root Endpoint Check", self.test_root_endpoint),
            ("1. POST /api/resume", self.test_create_resume),
            ("2. GET /api/resume/{resume_id}", self.test_get_resume),
            ("3. PUT /api/resume/{resume_id}", self.test_update_resume),
            ("   Verify Update Applied", self.test_verify_update),
            ("4. GET /api/resumes", self.test_list_resumes),
            ("5. POST /api/resume/{resume_id}/export-pdf", self.test_export_pdf),
        ]
        
        for test_name, test_func in tests:
            print(f"\n🔍 Running: {test_name}")
            test_func()
            time.sleep(0.5)  # Small delay between tests
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"✅ Passed: {passed}/{total}")
        print(f"❌ Failed: {total - passed}/{total}")
        
        if total - passed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   ❌ {result['test']}: {result['message']}")
        
        print(f"\n🎯 Overall Status: {'✅ ALL TESTS PASSED' if passed == total else '❌ SOME TESTS FAILED'}")
        
        return passed == total

if __name__ == "__main__":
    tester = ResumeAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)
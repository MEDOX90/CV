from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
from datetime import datetime

from models import Resume, ResumeCreate, ResumeResponse
from pdf_generator import generate_pdf


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Resume Builder API - مرحبا"}

# Resume endpoints
@api_router.post("/resume", response_model=ResumeResponse)
async def create_resume(resume_data: ResumeCreate):
    """Create a new resume"""
    try:
        resume = Resume(**resume_data.dict())
        result = await db.resumes.insert_one(resume.dict())
        return ResumeResponse(id=resume.id, message="Resume saved successfully")
    except Exception as e:
        logging.error(f"Error creating resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/resume/{resume_id}")
async def get_resume(resume_id: str):
    """Get a resume by ID"""
    try:
        resume = await db.resumes.find_one({"id": resume_id})
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        # Remove MongoDB _id field
        resume.pop('_id', None)
        return resume
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/resume/{resume_id}")
async def update_resume(resume_id: str, resume_data: ResumeCreate):
    """Update an existing resume"""
    try:
        resume = await db.resumes.find_one({"id": resume_id})
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Update with new data
        update_data = resume_data.dict()
        update_data["updatedAt"] = datetime.utcnow()
        
        await db.resumes.update_one(
            {"id": resume_id},
            {"$set": update_data}
        )
        
        return {"message": "Resume updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/resumes")
async def list_resumes():
    """List all resumes"""
    try:
        resumes = await db.resumes.find().sort("updatedAt", -1).to_list(100)
        # Remove MongoDB _id field from all resumes
        for resume in resumes:
            resume.pop('_id', None)
        return resumes
    except Exception as e:
        logging.error(f"Error listing resumes: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/resume/{resume_id}/export-pdf")
async def export_resume_pdf(resume_id: str):
    """Export resume as PDF"""
    try:
        # Get resume from database
        resume = await db.resumes.find_one({"id": resume_id})
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Remove MongoDB _id field
        resume.pop('_id', None)
        
        # Generate PDF
        template_id = resume.get('selectedTemplate', 'classic')
        pdf_buffer = generate_pdf(resume, template_id)
        
        # Return PDF as streaming response
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=resume_{resume_id}.pdf"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error exporting PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
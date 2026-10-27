import { Router, Request, Response } from 'express';
import {
  enquiriesData,
  busRouteData,
  kitchenLabsData,
  hotelInternshipsData,
  chefKitData,
  AdmissionEnquiry,
} from '../dataStore.js';

export const publicRouter = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: System Health & Diagnostic Check
 *     description: Returns API online status, version, and branding.
 *     tags: [Authentication & Health]
 */
publicRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    version: '1.0.0',
    platform: 'Trust Education ERP API',
    brandColor: '#EA580C', // Vibrant Education Orange
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /api/enquiries:
 *   get:
 *     summary: View Public Admission Enquiries
 *     description: Retrieve submitted admission queries from the public website.
 *     tags: [Authentication & Health]
 */
publicRouter.get('/enquiries', (_req: Request, res: Response) => {
  res.json({ enquiries: enquiriesData });
});

/**
 * @swagger
 * /api/enquiries/{id}:
 *   get:
 *     summary: Get Single Admission Enquiry
 *     description: Retrieve enquiry details by unique identifier.
 *     tags: [Authentication & Health]
 */
publicRouter.get('/enquiries/:id', (req: Request, res: Response) => {
  const enquiry = enquiriesData.find((e) => e.id === req.params.id);
  if (!enquiry) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }
  res.json({ enquiry });
});

/**
 * @swagger
 * /api/enquiries:
 *   post:
 *     summary: Submit New Admission Enquiry
 *     description: Prospective students or parents submit admissions inquiry from website.
 *     tags: [Authentication & Health]
 */
publicRouter.post('/enquiries', (req: Request, res: Response) => {
  const {
    id,
    applicantName,
    parentName,
    parentRelation,
    phone,
    altPhone,
    email,
    targetBranch,
    targetClassOrCourse,
    gender,
    dob,
    previousSchool,
    city,
    address,
    needTransportOrHostel,
    preferredContactTime,
    notes,
    status,
    counselorNotes,
  } = req.body;

  const newEnquiry: AdmissionEnquiry = {
    id: id || `INQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    applicantName: applicantName || 'Prospective Student',
    parentName: parentName || 'Parent',
    parentRelation: parentRelation || 'Parent',
    phone: phone || '+91 99999 00000',
    altPhone: altPhone || undefined,
    email: email || undefined,
    targetBranch: targetBranch || 'COLLEGE',
    targetClassOrCourse: targetClassOrCourse || 'General Enquiry',
    gender: gender || undefined,
    dob: dob || undefined,
    previousSchool: previousSchool || undefined,
    city: city || undefined,
    address: address || undefined,
    needTransportOrHostel: Boolean(needTransportOrHostel),
    preferredContactTime: preferredContactTime || undefined,
    notes: notes || undefined,
    counselorNotes: counselorNotes || undefined,
    status: status || 'NEW',
    createdAt: new Date().toISOString().split('T')[0],
  };

  enquiriesData.unshift(newEnquiry);

  res.status(201).json({
    message: 'Admission enquiry received! Our counselor will call you within 24 hours.',
    enquiry: newEnquiry,
  });
});

/**
 * @swagger
 * /api/enquiries/{id}:
 *   patch:
 *     summary: Update Admission Enquiry Status / Notes
 *     description: Superadmin or Counselor updates lead status, callback remarks or contact details.
 *     tags: [Authentication & Health]
 */
publicRouter.patch('/enquiries/:id', (req: Request, res: Response) => {
  const index = enquiriesData.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }

  const existing = enquiriesData[index];
  const updated: AdmissionEnquiry = {
    ...existing,
    ...req.body,
    id: existing.id, // prevent overwriting id
    createdAt: existing.createdAt, // keep creation timestamp
  };

  enquiriesData[index] = updated;

  res.json({
    message: 'Enquiry updated successfully',
    enquiry: updated,
  });
});

/**
 * @swagger
 * /api/enquiries/{id}:
 *   delete:
 *     summary: Delete Admission Enquiry
 *     description: Remove enquiry from database.
 *     tags: [Authentication & Health]
 */
publicRouter.delete('/enquiries/:id', (req: Request, res: Response) => {
  const index = enquiriesData.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }

  const [removed] = enquiriesData.splice(index, 1);
  res.json({
    message: 'Enquiry deleted successfully',
    deletedId: removed.id,
  });
});

/**
 * @swagger
 * /api/bus/tracking:
 *   get:
 *     summary: General School Bus Route Tracking
 *     description: Public/Parent accessible bus tracking endpoint.
 *     tags: [Bus Driver]
 */
publicRouter.get('/bus/tracking', (_req: Request, res: Response) => {
  res.json({ route: busRouteData });
});

/**
 * @swagger
 * /api/bus/simulate-step:
 *   post:
 *     summary: Simulate Bus Motion Step
 *     description: Simulator step helper for demonstrations.
 *     tags: [Bus Driver]
 */
publicRouter.post('/bus/simulate-step', (_req: Request, res: Response) => {
  busRouteData.currentLat += 0.0015;
  busRouteData.currentLng += 0.0012;
  busRouteData.currentSpeed = Math.floor(30 + Math.random() * 20);

  res.json({
    message: 'Bus position simulated',
    route: busRouteData,
  });
});

/**
 * @swagger
 * /api/hotel-mgmt/overview:
 *   get:
 *     summary: Hotel Management Department Overview
 *     description: Retrieve culinary labs, internships, and chef toolkits.
 *     tags: [Students (College HM)]
 */
publicRouter.get('/hotel-mgmt/overview', (_req: Request, res: Response) => {
  res.json({
    kitchenLabs: kitchenLabsData,
    internships: hotelInternshipsData,
    chefKitInventory: chefKitData,
  });
});

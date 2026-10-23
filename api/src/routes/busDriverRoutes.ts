import { Router, Request, Response } from 'express';
import { busRouteData } from '../dataStore.js';

export const busDriverRouter = Router();

/**
 * @swagger
 * /api/driver/route/status:
 *   get:
 *     summary: Driver Active Route Status
 *     description: View active route details, schedule, passenger stops, and live GPS broadcast status.
 *     tags: [Bus Driver]
 */
busDriverRouter.get('/route/status', (_req: Request, res: Response) => {
  res.json({
    driverPortal: 'MOBILE_APP_DRIVER_CONSOLE',
    route: busRouteData,
  });
});

/**
 * @swagger
 * /api/driver/route/start:
 *   post:
 *     summary: Simple One-Tap Button - "Start Route"
 *     description: Driver presses Start Route button on mobile app to initiate GPS broadcast and student pickup notifications.
 *     tags: [Bus Driver]
 */
busDriverRouter.post('/route/start', (_req: Request, res: Response) => {
  busRouteData.activeTrip = true;
  busRouteData.currentSpeed = 25.0; // Start rolling speed

  // Reset stops for new trip run
  busRouteData.stops.forEach((s, idx) => {
    s.passed = idx === 0;
  });

  res.json({
    message: 'Route trip started! Background GPS broadcast is now ACTIVE.',
    activeTrip: true,
    startTime: new Date().toLocaleTimeString(),
    route: busRouteData,
  });
});

/**
 * @swagger
 * /api/driver/route/end:
 *   post:
 *     summary: Simple One-Tap Button - "End Route"
 *     description: Driver presses End Route button on mobile app when bus arrives safely at campus/destination.
 *     tags: [Bus Driver]
 */
busDriverRouter.post('/route/end', (_req: Request, res: Response) => {
  busRouteData.activeTrip = false;
  busRouteData.currentSpeed = 0.0;

  // Mark all stops as passed on completion
  busRouteData.stops.forEach((s) => {
    s.passed = true;
  });

  res.json({
    message: 'Route trip safely completed! Bus parked at Trust Main Campus.',
    activeTrip: false,
    endTime: new Date().toLocaleTimeString(),
    route: busRouteData,
  });
});

/**
 * @swagger
 * /api/driver/route/location:
 *   post:
 *     summary: Transmit Background GPS Coordinates
 *     description: Background location worker on driver mobile phone transmits periodic coordinates (every 5-10 seconds).
 *     tags: [Bus Driver]
 */
busDriverRouter.post('/route/location', (req: Request, res: Response) => {
  const { currentLat, currentLng, currentSpeed } = req.body;

  if (currentLat === undefined || currentLng === undefined) {
    return res.status(400).json({
      error: 'Missing mandatory coordinates: currentLat and currentLng are required.',
    });
  }

  busRouteData.currentLat = Number(currentLat);
  busRouteData.currentLng = Number(currentLng);
  if (currentSpeed !== undefined) {
    busRouteData.currentSpeed = Number(currentSpeed);
  }

  res.json({
    status: 'GPS_COORDINATES_SYNCED',
    timestamp: new Date().toISOString(),
    currentPosition: {
      lat: busRouteData.currentLat,
      lng: busRouteData.currentLng,
      speedKmH: busRouteData.currentSpeed,
      tripActive: busRouteData.activeTrip,
    },
  });
});

/**
 * @swagger
 * /api/driver/route/checkpoint:
 *   post:
 *     summary: Mark Stop Checkpoint Passed
 *     description: Marks a passenger pickup/drop-off stop as passed when bus departs from stop.
 *     tags: [Bus Driver]
 */
busDriverRouter.post('/route/checkpoint', (req: Request, res: Response) => {
  const { stopIndex } = req.body;

  if (stopIndex === undefined || Number(stopIndex) < 0 || Number(stopIndex) >= busRouteData.stops.length) {
    return res.status(400).json({ error: 'Valid stopIndex is required.' });
  }

  const idx = Number(stopIndex);
  busRouteData.stops[idx].passed = true;

  res.json({
    message: `Stop "${busRouteData.stops[idx].name}" marked as PASSED.`,
    stops: busRouteData.stops,
  });
});

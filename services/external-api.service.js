const axios = require("axios");
const ParkingSpotService = require("../services/parking-spot-service");
const db = require("../db-connection");
const parkingSpotService = new ParkingSpotService(db);
const NotificationService = require("../services/notification-service");
const notificationService = new NotificationService(db);
const { Base64 } = require('js-base64');

const { PPM_AUTH_USERNAME, PPM_AUTH_PASSWORD, PPM_URL } = process.env;

class ExternalApiService {
  constructor() {
    const base64Auth = Base64.encode(`${PPM_AUTH_USERNAME}:${PPM_AUTH_PASSWORD}`);
    this.apiClient = axios.create({
      baseURL: PPM_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${base64Auth}`
      },
    });
  }

  async fetchUpdatedParkingSpots() {
    try {
      const response = await this.apiClient.get("/get_parking_occupancy");
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch and update parking spots data - ${error.message}`
      );
      throw error;
    }
  }

  async updateParkingLotsWithNewData() {
    try {
      const newParkingSpotStates = await this.fetchUpdatedParkingSpots();

      for (const spots of Object.values(newParkingSpotStates)) {
        for (const spotData of spots) {
          const parkingSpot = await parkingSpotService.getParkingSpotByName(
            spotData.name
          );

          if (parkingSpot) {
            await parkingSpotService.updateParkingSpotOccupancy(
              parkingSpot.parkingSpotId,
              spotData.occupied
            );
          }
        }
      }
      notificationService.sendPushNotification();
    } catch (error) {
      console.error("Error while updating parking spots:", error.message);
    }
  }
}

module.exports = ExternalApiService;

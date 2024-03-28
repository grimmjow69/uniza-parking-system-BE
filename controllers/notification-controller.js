const NotificationService = require("../services/notification-service");
const db = require("../db-connection");

const notificationService = new NotificationService(db);

exports.registerPushToken = async (req, res) => {
  try {
    const userId = req.body.userId;
    const pushToken = req.body.token;
    await notificationService.savePushToken(userId, pushToken);
    console.log(
      `Successfully registered push token for user with ID: ${userId}`
    );
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(
      `Error while registering push token for user with ID ${userId}: ${error.message}`
    );
    res.status(500);
  }
};

exports.deletePushToken = async (req, res) => {
  try {
    const userId = req.body.userId;
    await notificationService.deletePushToken(userId);
    console.log(`Successfully deleted push token for user with ID: ${userId}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(
      `Error while deleting push token for user with ID ${userId}: ${error.message}`
    );
    res.status(500);
  }
};

exports.subscribeToNotification = async (req, res) => {
  try {
    const { parkingSpotId, userId } = req.body;
    await notificationService.subscribeNotification(parkingSpotId, userId);

    console.log(
      `User with ID ${userId} successfully subscribed for notification of parking spot with ID: ${parkingSpotId}`
    );
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(
      `Error subscribing user with ID ${userId} to notification for parking spot with ID ${parkingSpotId}: ${error.message}`
    );
    res.status(500);
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userNotifications = await notificationService.getAllUserNotifications(
      userId
    );
    res.status(200).json({ userNotifications });
  } catch (error) {
    console.error(`Error getting user notifications: ${error.message}`);
    res.status(500);
  }
};

exports.unsubscribeFromNotificationByNotificationId = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    await notificationService.unsubscribeNotification(notificationId);

    console.log(
      `Succesfuly unsubscribed from notification id: ${notificationId}`
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(`Error unsubscribing from notifications: ${error.message}`);
    res.status(500);
  }
};

exports.unsubscribeFromNotificationByUserAndParkingSpotId = async (
  req,
  res
) => {
  try {
    const { userId, parkingSpotId } = req.body;
    await notificationService.deleteNotificationByUserAndParkingSpot(
      userId,
      parkingSpotId
    );
    console.log(
      `User with ID ${userId} successfully unsubscribed from notification for parking spot with ID: ${parkingSpotId}`
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(
      `Error unsubscribing user with ID ${userId} from notifications for parking spot with ID ${parkingSpotId}: ${error.message}`
    );
    res.status(500);
  }
};

import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
  deleteDoc,
  orderBy,
  QuerySnapshot,
} from "firebase/firestore";
import { db, auth } from "../Config/firebaseConfig";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Container,
  Paper,
  Grid,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { red } from "@mui/material/colors";

// Define the TypeScript interface for notification objects
interface Notification {
  id: string;
  message: string;
  read: boolean;
  timestamp: any; // Adjust type according to Firestore timestamp type
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigate("/login");
      }
    });

    return () => authUnsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (querySnapshot: QuerySnapshot) => {
        const fetchedNotifications: Notification[] = [];
        querySnapshot.forEach((doc) => {
          fetchedNotifications.push({
            id: doc.id,
            ...(doc.data() as Omit<Notification, 'id'>),
          });
        });
        setNotifications(fetchedNotifications);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching notifications: ", error);
        setLoading(false);
        setSnackbarMessage("Error fetching notifications.");
        setSnackbarOpen(true);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const markAsRead = async (id: string) => {
    try {
      const notificationDoc = doc(db, "notifications", id);
      await updateDoc(notificationDoc, { read: true });
      setSnackbarMessage(`Marked as Read with ID: ${id}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error marking notification as read: ", error);
      setSnackbarMessage("Error marking notification as read.");
      setSnackbarOpen(true);
    }
  };

  const sendNotification = async (message: string) => {
    if (!userId) return;

    try {
      await addDoc(collection(db, "notifications"), {
        message,
        read: false,
        userId,
        timestamp: serverTimestamp(),
      });
      setSnackbarMessage(`Notification sent: ${message}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error sending notification: ", error);
      setSnackbarMessage("Error sending notification.");
      setSnackbarOpen(true);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const notificationDoc = doc(db, "notifications", id);
      await deleteDoc(notificationDoc);
      setSnackbarMessage(`Notification with ID: ${id} deleted`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting notification: ", error);
      setSnackbarMessage("Error deleting notification.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const notificationButtons = [
    "Notification 1",
    "Notification 2",
    "Notification 3",
  ];

  return (
    <Container sx={{ marginTop: 2 }}>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Notifications
        </Typography>
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          {notificationButtons.map((message, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => sendNotification(message)}
              >
                Send {message}
              </Button>
            </Grid>
          ))}
        </Grid>
        {loading ? (
          <div style={{ textAlign: "center", padding: 20 }}>
            <CircularProgress />
          </div>
        ) : notifications.length === 0 ? (
          <Typography>No notifications found.</Typography>
        ) : (
          <List>
            {notifications.map((notification) => (
              <ListItem key={notification.id} divider>
                <ListItemText
                  primary={notification.message}
                  secondary={notification.read ? "Read" : "Unread"}
                />
                {!notification.read && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ marginRight: 2 }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as Read
                  </Button>
                )}
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteNotification(notification.id)}
                >
                  <DeleteOutlinedIcon sx={{ color: red[500] }} />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Notifications;

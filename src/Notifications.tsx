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
} from "firebase/firestore";
import { db, auth } from "./Config/firebaseConfig";
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
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { red } from "@mui/material/colors";


interface Notification { // Define the interface for notification objects
  id: string;
  message: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const navigate = useNavigate();


  useEffect(() => {  // Monitor authentication state and navigate to login if user is not authenticated
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigate("/login");
      }
    });

    return () => authUnsubscribe();
  }, [navigate]);

  // Fetch notifications from Firestore based on the user ID
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedNotifications: Notification[] = [];
      querySnapshot.forEach((doc) => {
        fetchedNotifications.push({
          id: doc.id,
          ...doc.data(),
        } as Notification);
      });
      setNotifications(fetchedNotifications);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);


  const markAsRead = async (id: string) => {  // Mark a notification as read
    const notificationDoc = doc(db, "notifications", id);
    await updateDoc(notificationDoc, { read: true });
    setSnackbarMessage(`Marked As Read with ID: ${id}`);
    setSnackbarOpen(true);
  };

  
  const sendNotification = async (message: string) => { // Send a new notification to Firestore
    if (!userId) return;

    await addDoc(collection(db, "notifications"), {
      message,
      read: false,
      userId,
      timestamp: serverTimestamp(),
    });
  };

  // Delete a notification from Firestore
  const deleteNotification = async (id: string) => {
    const notificationDoc = doc(db, "notifications", id);
    await deleteDoc(notificationDoc);
    setSnackbarMessage(`Notification with ID: ${id} deleted`);
    setSnackbarOpen(true);
  };

  // Close the Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container sx={{ marginTop: 2 }}>
      <Paper style={{ padding: 16 }}>
        <Typography variant="h4" gutterBottom>
          Notifications
        </Typography>
        <div style={{ marginBottom: 16 }}>
          <Grid container spacing={2}>
            {/* Buttons to send test notifications */}
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => sendNotification("Notification 1")}
              >
                Send Notification 1
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => sendNotification("Notification 2")}
              >
                Send Notification 2
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => sendNotification("Notification 3")}
              >
                Send Notification 3
              </Button>
            </Grid>
          </Grid>
        </div>
        {/* Show a loading spinner or the list of notifications */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <CircularProgress />
          </div>
        ) : (notifications.length === 0 ? <Typography>No notifications found.</Typography> :
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
      {/* Snackbar for showing messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} 
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Notifications;

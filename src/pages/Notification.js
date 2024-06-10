/* eslint-disable no-unused-vars */
import "./Notification.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoNotifications } from "react-icons/io5";
import CircularProgress from "@mui/material/CircularProgress";
import {
  faEdit,
  faTrash,
  faPlus,
  faSave,
  faTimes,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Notification() {
  const [notificationList, setNotification] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const openmodal = () => {
    openmodal(true);
  };
  const closemodal = () => {
    closemodal(false);
  };
  async function fetchNotification() {
    try {
      // setIsLoading(true);
      const notificationResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}notification/11835?size=500`
      );

      const sitesResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}companySite?size=500`
      );

      const sites = sitesResponse.data.data.data;

      const modifiedNotifications = notificationResponse.data.data.map(
        (notification) => {
          const site = sites.find(
            (site) => site.costCenter === notification.actionLocationId
          );
          if (site) {
            notification.actionLocationId = site.name;
          }
          return notification;
        }
      );

      setNotification(modifiedNotifications);
    } catch (error) {
      console.error("Error fetching sites:", error.message);
    } finally {
      setIsLoading(false);
    }
  }
  const handleApprove = async (notificationId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}notification/${notificationId}/approve`
      );

      fetchNotification();
    } catch (error) {
      console.error("Error approving notification:", error.message);
    }
  };
  useEffect(() => {
    fetchNotification();
  }, []);

  return (
    <div>
      {isLoading && (
        <div className="text-center mt-4">
          <CircularProgress size={80} thickness={5} />
        </div>
      )}
      <div className="general">
        {notificationList.map((notification, index) => (
          <div key={index} className="notification-content">
            <i className="me-3 fs-5">
              <IoNotifications />
            </i>
            <span>{notification.information}</span>
            <div>
              <span>Localizaçao: {notification.actionLocationId}</span>
            </div>
            <label>
              Estado: {notification.state ? "Validado" : "Pendente"}
            </label>
            <button
              className="btn btn-primary btn-sm mr-2 mb-4"
              onClick={() => handleApprove(notification.id)}
            >
              <FontAwesomeIcon icon={faThumbsUp} /> Aprovar
            </button>
            <button className="btn btn-danger btn-sm mr-2 mb-4">
              <FontAwesomeIcon icon={faTimes} /> Pendente
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Notification;

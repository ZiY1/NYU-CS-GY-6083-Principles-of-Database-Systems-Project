// AlertBox.js

function AlertBox({ type, message, onClose }) {
  // Determine the alert box's style based on the type of alert
  const getAlertClass = (type) => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      case 'warning':
        return 'alert-warning';
      case 'info':
      default:
        return 'alert-info';
    }
  };

  return (
    <div className={`alert-box ${getAlertClass(type)}`}>
      <span>{message}</span>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default AlertBox;

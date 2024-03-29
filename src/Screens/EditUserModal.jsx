import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";


const EditUserModal = ({ user, onUpdate, onClose }) => {
  const [newEmail, setNewEmail] = useState(user.email);
  // const [password, setNewPassword] = useState("");
  const [phone, setNewPhone] = useState(user.phone);
  const [fullName, setNewFullName] = useState(user.fullName);

  const [isValidEmail, setIsValidEmail] = useState(true);
  // const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [isValidFullName, setIsValidFullName] = useState(true);

  useEffect(() => {
    const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    setIsValidEmail(emailPattern.test(newEmail));

    // Password format kontrolü
    // const passwordPattern = /^(?=.*[a-zA-ZığüşöçĞÜŞÖÇİ])(?=.*[0-9])(?=.*[(),.":{}_#+~^|<>=@$!%*?&])[A-Za-z0-9ığüşöçĞÜŞÖÇİ(),.":{}_#+~^|<>=@$!%*?&]{8,}$/;
    // setIsValidPassword(passwordPattern.test(password));

    const phonePattern = /^(\+\d+|\d+)$/;
    setIsValidPhone(phonePattern.test(phone));
    const fullNamePattern = /^[A-Za-zğüşöçĞÜŞÖÇİ\s]+$/;
    setIsValidFullName(fullNamePattern.test(fullName.trim()));
  }, [newEmail, phone, fullName]);
  

  const handleUpdate = () => {
    if (!isValidEmail || !isValidPhone || !isValidFullName) {
      return;
    }
    onUpdate({
      userId: user._id,
      newEmail,
      phone,
      fullName,
    });

    onClose();
    
  };

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="text"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            {!isValidEmail && (
              <div className="text-danger">Invalid email format</div>
            )}
          </Form.Group>
          {/* <Form.Group controlId="formPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {!isValidPassword && (
              <div className="text-danger">
                Password should be at least eight characters long and contain at
                least one letter, one digit, and one symbol
              </div>
            )}
          </Form.Group> */}
          <Form.Group controlId="formPhone">
            <Form.Label>Phone:</Form.Label>
            <Form.Control
              type="text"
              value={phone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
            {!isValidPhone && (
              <div className="text-danger">Invalid phone format</div>
            )}
          </Form.Group>
          <Form.Group controlId="formFullName">
            <Form.Label>Full Name:</Form.Label>
            <Form.Control
              type="text"
              value={fullName}
              onChange={(e) => setNewFullName(e.target.value)}
            />
            {!isValidFullName && (
              <div className="text-danger">
                Full Name cannot be empty and should only contain letters and spaces
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;

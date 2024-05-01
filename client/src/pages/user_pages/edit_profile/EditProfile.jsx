import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { useNavigate } from "react-router-dom";
import "./edit-profile.scss"; // Import SCSS file

const EditProfile = () => {
  const navigate = useNavigate(); // Corrected variable declaration
  const { isLoading, error, data } = useQuery({
    queryKey: ["user_profile"],
    queryFn: () => makeRequest.get("/users/get").then((res) => res.data),
    onError: (err) => {
      console.error("Query error");
    },
  });

  const [inputs, setInputs] = useState({
    first_name: "",
    last_name: "",
    state: "",
    city: "",
    street: "",
    zipcode: "",
  });

  useEffect(() => {
    if (data) {
      setInputs({
        first_name: data.user.first_name || "",
        last_name: data.user.last_name || "",
        state: data.user.state || "",
        city: data.user.city || "",
        street: data.user.street || "",
        zipcode: data.user.zipcode || "",
      });
    }
  }, [data]);

  const [errors, setErrors] = useState({});
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCancel = () => {
    // Navigate back to the profile page
    navigate("/profile");
  };

  const validateForm = () => {
    const newErrors = {};

    const maxLengths = {
      first_name: 30,
      last_name: 30,
      state: 30,
      city: 30,
      street: 30,
      zipcode: 30,
    };

    Object.keys(inputs).forEach((key) => {
      if (!inputs[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required.`;
      } else if (inputs[key].length > maxLengths[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} must be at most ${
          maxLengths[key]
        } characters.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateMutation = useMutation({
    mutationFn: (updateDetails) =>
      makeRequest.put(`/users/update`, updateDetails),
    onSuccess: () => {
      navigate("/profile"); // Changed navigate to navigation
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    updateMutation.mutate(inputs);
  };

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error fetching user details!</div>;

  return (
    <div className="edit-profile">
      <h1>Edit Profile</h1>
      <form>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={inputs.first_name}
            onChange={handleChange}
          />
          {errors.first_name && <p className="error">{errors.first_name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={inputs.last_name}
            onChange={handleChange}
          />
          {errors.last_name && <p className="error">{errors.last_name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={inputs.state}
            onChange={handleChange}
          />
          {errors.state && <p className="error">{errors.state}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={inputs.city}
            onChange={handleChange}
          />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="street">Street</label>
          <input
            type="text"
            id="street"
            name="street"
            value={inputs.street}
            onChange={handleChange}
          />
          {errors.street && <p className="error">{errors.street}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="zipcode">Zipcode</label>
          <input
            type="text"
            id="zipcode"
            name="zipcode"
            value={inputs.zipcode}
            onChange={handleChange}
          />
          {errors.zipcode && <p className="error">{errors.zipcode}</p>}
        </div>
        <button type="submit" onClick={handleSaveChanges}>
          Save Changes
        </button>
        <button type="button" className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProfile;

/* No CSS
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  navigation = useNavigate(); // Renamed navigate to navigation
  const { isLoading, error, data } = useQuery({
    queryKey: ["user_profile"],
    queryFn: () => makeRequest.get("/users/get").then((res) => res.data),
    onError: (err) => {
      console.error("Query error");
    },
  });

  const [inputs, setInputs] = useState({
    first_name: "",
    last_name: "",
    state: "",
    city: "",
    street: "",
    zipcode: "",
  });

  useEffect(() => {
    if (data) {
      setInputs({
        first_name: data.user.first_name || "",
        last_name: data.user.last_name || "",
        state: data.user.state || "",
        city: data.user.city || "",
        street: data.user.street || "",
        zipcode: data.user.zipcode || "",
      });
    }
  }, [data]);

  const [errors, setErrors] = useState({});
  navigation = useNavigate(); // Renamed navigate to navigation

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCancel = () => {
    // Navigate back to the profile page
    navigation("/profile");
  };

  const validateForm = () => {
    const newErrors = {};

    const maxLengths = {
      first_name: 30,
      last_name: 30,
      state: 30,
      city: 30,
      street: 30,
      zipcode: 30,
    };

    Object.keys(inputs).forEach((key) => {
      if (!inputs[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required.`;
      } else if (inputs[key].length > maxLengths[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} must be at most ${
          maxLengths[key]
        } characters.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateMutation = useMutation({
    mutationFn: (updateDetails) =>
      makeRequest.put(`/users/update`, updateDetails),
    onSuccess: () => {
      navigation("/profile"); // Changed navigate to navigation
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    updateMutation.mutate(inputs);
  };

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error fetching user details!</div>;

  return (
    <div className="edit-profile">
      <h1>Edit Profile</h1>
      <form>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={inputs.first_name}
            onChange={handleChange}
          />
          {errors.first_name && <p className="error">{errors.first_name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={inputs.last_name}
            onChange={handleChange}
          />
          {errors.last_name && <p className="error">{errors.last_name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={inputs.state}
            onChange={handleChange}
          />
          {errors.state && <p className="error">{errors.state}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={inputs.city}
            onChange={handleChange}
          />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="street">Street</label>
          <input
            type="text"
            id="street"
            name="street"
            value={inputs.street}
            onChange={handleChange}
          />
          {errors.street && <p className="error">{errors.street}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="zipcode">Zipcode</label>
          <input
            type="text"
            id="zipcode"
            name="zipcode"
            value={inputs.zipcode}
            onChange={handleChange}
          />
          {errors.zipcode && <p className="error">{errors.zipcode}</p>}
        </div>
        <button type="submit" onClick={handleSaveChanges}>
          Save Changes
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
*/

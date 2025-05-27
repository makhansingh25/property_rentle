import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../auth/Auth";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
const Message = ({ propertyId, ReceiverId }) => {
  const { AuthorizationToken, token } = useAuth();
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);

      const URL = process.env.REACT_APP_BACKEND_URL;

      if (token) {
        const response = await fetch(`${URL}/messsages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthorizationToken,
          },
          body: JSON.stringify({
            propertyId,
            ReceiverId,
            ...formData,
          }),
        });

        const datas = await response.json();
        if (response.status === 201) {
          toast.success(datas.message);
          console.log("this issuccess mesages",datas.message)
          setFormData({
            name: "",
            email: "",
            mobile: "",
            message: "",
          });
        } else {
          toast.error(datas.message || "Something went wrong");
           console.log("this error mesages",datas.message)
          setFormData({
            name: "",
            email: "",
            mobile: "",
            message: "",
          });
        }
      } else {
        toast.error("you need to signin first");
        navigate("/signin");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error sending message:", error);
    }
    finally{
      setLoader(false)
    }
  };
  if (loader) {
    return <Loading />;
  }

  return (
    <div className="contact-wrapper">
      <form className="contact-form" onSubmit={handleSubmit}>
        <h2>Contact Us</h2>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            minLength={"12"}
            maxLength={"25"}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="mobile"
            placeholder="123-456-7890"
            value={formData.mobile}
            onChange={handleChange}
            minLength={"10"}
            maxLength={"10"}
            mobile
            required
          />
        </div>

        <div className="form-group">
          <label>Message</label>
          <input
            type="text"
            name="message"
            placeholder="i want this property"
            value={formData.message}
            onChange={handleChange}
            maxLength={"100"}
            minLength={"10"}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Message;

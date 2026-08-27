import { useEffect, useState } from "react";
import { BookOpen, Link as LinkIcon, Plus, FileText } from "lucide-react";
import "./CourseResources.css";

const API_URL = "http://localhost:5000/api/course-resources";

function CourseResources() {
  const [resources, setResources] = useState([]);

  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    title: "",
    resourceType: "Lecture Note",
    resourceUrl: "",
    description: "",
  });


  const fetchResources = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setResources(data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleDelete = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    fetchResources();

  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    fetchResources();
  }, []);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });


    setFormData({
      courseCode: "",
      courseName: "",
      title: "",
      resourceType: "Lecture Note",
      resourceUrl: "",
      description: "",
    });


    fetchResources();
  };


  return (
    <div className="page-container">


      {/* Header */}

      <div className="page-header">

        <div>
          <h1>
            <BookOpen size={32}/>
            Course Resources
          </h1>

          <p>
            Organize and access your course notes, books, videos and learning materials.
          </p>
        </div>

      </div>



      {/* Add Resource */}

      <div className="resource-form-card">

        <h2>
          <Plus size={22}/>
          Add New Resource
        </h2>


        <form onSubmit={handleSubmit}>


          <div className="form-grid">

            <input
              name="courseCode"
              placeholder="Course Code"
              value={formData.courseCode}
              onChange={handleChange}
            />


            <input
              name="courseName"
              placeholder="Course Name"
              value={formData.courseName}
              onChange={handleChange}
            />


            <input
              name="title"
              placeholder="Resource Title"
              value={formData.title}
              onChange={handleChange}
            />


            <select
              name="resourceType"
              value={formData.resourceType}
              onChange={handleChange}
            >
              <option>Lecture Note</option>
              <option>Book</option>
              <option>Video</option>
              <option>Website</option>
            </select>


            <input
              name="resourceUrl"
              placeholder="Resource URL"
              value={formData.resourceUrl}
              onChange={handleChange}
            />


          </div>


          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />


          <button>
            Add Resource
          </button>


        </form>

      </div>



      {/* Resource List */}


      <h2 className="section-title">
        Available Resources
      </h2>


      <div className="resource-grid">

        {
          resources.map((resource)=>(
            
            <div className="resource-card" key={resource._id}>


              <div className="icon-box">
                <FileText size={26}/>
              </div>


              <h3>
                {resource.courseCode}
              </h3>


              <p className="course-name">
                {resource.courseName}
              </p>


              <h4>
                {resource.title}
              </h4>


              <span>
                {resource.resourceType}
              </span>


              <a href={resource.resourceUrl}>
                <LinkIcon size={16}/>
                Open Resource
              </a>

              <button
                onClick={() => handleDelete(resource._id)}
              >
                Delete
              </button>


            </div>

          ))
        }


      </div>


    </div>
  );
}

export default CourseResources;
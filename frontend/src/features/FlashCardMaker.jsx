import { useEffect, useState } from "react";
import "./FlashCardMaker.css";

const API_URL = "http://localhost:5000/api/flash-cards";

function FlashCardMaker() {

  const [cards, setCards] = useState([]);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    subject: "",
  });


  const fetchCards = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCards(data);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchCards();
  }, []);



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });


      setFormData({
        question: "",
        answer: "",
        subject: "",
      });


      fetchCards();

    } catch (error) {
      console.log(error);
    }
  };



  const handleDelete = async (id) => {

    try {

      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });


      fetchCards();

    } catch (error) {
      console.log(error);
    }

  };



  return (

    <div className="page-container">


      {/* Header */}

      <div className="page-header">

        <h1>
          🧠 Flash Card Maker
        </h1>

        <p>
          Create and practice your study flash cards.
        </p>

      </div>




      {/* Create Flash Card */}

      <div className="resource-form-card">


        <h2>
          Create New Flash Card
        </h2>



        <form onSubmit={handleSubmit}>


          <input
            name="question"
            placeholder="Question"
            value={formData.question}
            onChange={handleChange}
          />



          <textarea
            name="answer"
            placeholder="Answer"
            value={formData.answer}
            onChange={handleChange}
          />



          <input
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />



          <button>
            Create Flash Card
          </button>


        </form>


      </div>





      {/* Flash Cards */}

      <h2 className="section-title">
        My Flash Cards
      </h2>




      <div className="resource-grid">


        {
          cards.map((card)=>(


            <div
              className="flash-card"
              key={card._id}
            >


              <div className="flash-card-inner">



                {/* Question Side */}

                <div className="flash-card-front">


                  <h3>
                    {card.question}
                  </h3>


                  <span>
                    {card.subject}
                  </span>


                  <small>
                    Hover to reveal answer
                  </small>


                </div>





                {/* Answer Side */}

                <div className="flash-card-back">


                  <p>
                    {card.answer}
                  </p>



                  <button
                    onClick={() => handleDelete(card._id)}
                  >
                    Delete
                  </button>



                </div>



              </div>


            </div>


          ))
        }


      </div>


    </div>

  );
}


export default FlashCardMaker;
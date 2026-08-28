import { useEffect, useState } from "react";
import "./PollSurvey.css";
import { useAuth } from "../context/AuthContext";


const API_URL = "http://localhost:5000/api/polls";


function PollSurvey() {


  const { user } = useAuth();


  const [polls, setPolls] = useState([]);


  const [formData, setFormData] = useState({
    question: "",
    options: ["", ""],
  });





  const fetchPolls = async () => {

    try {

      const res = await fetch(API_URL);

      const data = await res.json();

      setPolls(data);


    } catch (error) {

      console.log(error);

    }

  };





  useEffect(() => {

    fetchPolls();

  }, []);





  const handleQuestionChange = (e) => {

    setFormData({
      ...formData,
      question: e.target.value,
    });

  };





  const handleOptionChange = (index, value) => {

    const updatedOptions = [...formData.options];

    updatedOptions[index] = value;


    setFormData({
      ...formData,
      options: updatedOptions,
    });

  };





  const addOption = () => {

    setFormData({
      ...formData,
      options: [
        ...formData.options,
        "",
      ],
    });

  };





  const handleSubmit = async (e) => {

    e.preventDefault();


    const pollData = {

      question: formData.question,

      options: formData.options
        .filter(option => option.trim() !== "")
        .map(option => ({
          text: option,
        }))

    };



    await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(pollData),

    });



    setFormData({

      question: "",

      options: ["", ""],

    });



    fetchPolls();

  };







  const handleVote = async (pollId, optionId) => {


    try {


      const res = await fetch(
        `${API_URL}/${pollId}/vote`,
        {

          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },


          body: JSON.stringify({

            optionId,

            userId: user._id,

          }),

        }
      );



      const data = await res.json();



      if (!res.ok) {

        alert(data.message);

        return;

      }



      fetchPolls();



    } catch (error) {

      console.log(error);

    }


  };







  const handleDelete = async (pollId) => {


    const confirmDelete = window.confirm(
      "Are you sure you want to delete this poll?"
    );


    if (!confirmDelete) {
      return;
    }



    try {


      const res = await fetch(
        `${API_URL}/${pollId}`,
        {
          method: "DELETE",
        }
      );



      const data = await res.json();



      if (!res.ok) {

        alert(data.message);

        return;

      }



      fetchPolls();



    } catch (error) {

      console.log(error);

    }


  };







  // Calculate percentage

  const getPercentage = (votes, options) => {


    const totalVotes = options.reduce(

      (sum, option) => sum + option.votes,

      0

    );



    if (totalVotes === 0) {

      return 0;

    }



    return Math.round(

      (votes / totalVotes) * 100

    );


  };







  return (

    <div className="page-container">


      <div className="page-header">

        <h1>
          📊 Poll & Quick Survey
        </h1>


        <p>
          Create polls and collect opinions.
        </p>


      </div>





      <div className="resource-form-card">


        <h2>
          Create New Poll
        </h2>



        <form onSubmit={handleSubmit}>


          <input

            placeholder="Poll Question"

            value={formData.question}

            onChange={handleQuestionChange}

          />





          {
            formData.options.map((option, index) => (

              <input

                key={index}

                placeholder={`Option ${index + 1}`}

                value={option}

                onChange={(e) =>
                  handleOptionChange(
                    index,
                    e.target.value
                  )
                }

              />

            ))
          }





          <button

            type="button"

            onClick={addOption}

          >

            Add Option

          </button>





          <button>

            Create Poll

          </button>



        </form>


      </div>







      <h2 className="section-title">

        Available Polls

      </h2>






      <div className="resource-grid">



        {
          polls.map((poll) => (


            <div

              className="resource-card"

              key={poll._id}

            >



              <h3>

                {poll.question}

              </h3>





              {
                poll.options.map((option) => (

                  <div key={option._id}>


                    <button

                      onClick={() =>
                        handleVote(
                          poll._id,
                          option._id
                        )
                      }

                    >

                      {option.text}

                      {" "}

                      ({option.votes})

                    </button>




                    <div className="percentage-container">


                      <div

                        className="percentage-bar"

                        style={{

                          width: `${getPercentage(
                            option.votes,
                            poll.options
                          )}%`

                        }}

                      >

                      </div>


                    </div>





                    <p className="percentage-text">

                      {
                        getPercentage(
                          option.votes,
                          poll.options
                        )
                      }%

                    </p>



                  </div>


                ))
              }





              <button

                onClick={() =>
                  handleDelete(poll._id)
                }

              >

                Delete Poll

              </button>




            </div>


          ))
        }



      </div>



    </div>

  );

}


export default PollSurvey;
import Poll from "../models/Poll.js";


// @desc Get all polls
// @route GET /api/polls
export const getPolls = async (req, res) => {

  try {

    const polls = await Poll.find()
      .populate("createdBy", "name email");


    res.status(200).json(polls);


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};





// @desc Get single poll
// @route GET /api/polls/:id
export const getPollById = async (req, res) => {

  try {

    const poll = await Poll.findById(req.params.id);



    if (!poll) {

      return res.status(404).json({
        message: "Poll not found",
      });

    }



    res.status(200).json(poll);



  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};






// @desc Create poll
// @route POST /api/polls
export const createPoll = async (req, res) => {

  try {


    const poll = await Poll.create(req.body);


    res.status(201).json(poll);



  } catch (error) {


    res.status(400).json({
      message: error.message,
    });


  }

};








// @desc Vote poll option
// @route PUT /api/polls/:id/vote
export const votePoll = async (req, res) => {

  try {


    const poll = await Poll.findById(req.params.id);



    if (!poll) {

      return res.status(404).json({
        message: "Poll not found",
      });

    }





    const {
      optionId,
      userId
    } = req.body;





    if (!userId) {

      return res.status(400).json({
        message: "User ID is required",
      });

    }





    // Check duplicate vote

    const alreadyVoted = poll.voters.some(
      (voter) =>
        voter.userId.toString() === userId
    );




    if (alreadyVoted) {

      return res.status(400).json({
        message: "You have already voted",
      });

    }







    // Find selected option

    const option = poll.options.id(optionId);




    if (!option) {

      return res.status(404).json({
        message: "Option not found",
      });

    }





    // Increase vote count

    option.votes += 1;





    // Store voter information

    poll.voters.push({

      userId: userId,

      optionId: optionId,

    });






    await poll.save();





    res.status(200).json({

      message: "Vote submitted successfully",

      poll,

    });





  } catch (error) {


    res.status(500).json({

      message: error.message,

    });


  }

};









// @desc Update poll
// @route PUT /api/polls/:id
export const updatePoll = async (req, res) => {

  try {


    const poll = await Poll.findByIdAndUpdate(

      req.params.id,

      req.body,

      {
        new: true,
      }

    );





    if (!poll) {

      return res.status(404).json({
        message: "Poll not found",
      });

    }





    res.status(200).json(poll);




  } catch (error) {


    res.status(400).json({

      message: error.message,

    });


  }

};









// @desc Delete poll
// @route DELETE /api/polls/:id
export const deletePoll = async (req, res) => {

  try {


    const poll = await Poll.findByIdAndDelete(
      req.params.id
    );





    if (!poll) {

      return res.status(404).json({

        message: "Poll not found",

      });

    }





    res.status(200).json({

      message: "Poll deleted successfully",

    });





  } catch (error) {


    res.status(500).json({

      message: error.message,

    });


  }

};
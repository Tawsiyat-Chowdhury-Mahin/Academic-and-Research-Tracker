import CourseResource from "../models/CourseResource.js";

// @desc    Get all course resources
// @route   GET /api/course-resources
export const getResources = async (req, res) => {
  try {
    const resources = await CourseResource.find()
      .populate("uploadedBy", "name email");

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc    Get single resource
// @route   GET /api/course-resources/:id
export const getResourceById = async (req, res) => {
  try {
    const resource = await CourseResource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(200).json(resource);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc    Create new course resource
// @route   POST /api/course-resources
export const createResource = async (req, res) => {
  try {
    const resource = await CourseResource.create(req.body);

    res.status(201).json(resource);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


// @desc    Update resource
// @route   PUT /api/course-resources/:id
export const updateResource = async (req, res) => {
  try {
    const resource = await CourseResource.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(200).json(resource);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


// @desc    Delete resource
// @route   DELETE /api/course-resources/:id
export const deleteResource = async (req, res) => {
  try {
    const resource = await CourseResource.findByIdAndDelete(
      req.params.id
    );

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(200).json({
      message: "Resource deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};